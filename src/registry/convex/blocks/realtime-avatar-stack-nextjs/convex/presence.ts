import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Presence data validator - defines allowed fields for presence data.
 */
const presenceDataValidator = v.object({
  cursor: v.optional(v.object({ x: v.number(), y: v.number() })),
  position: v.optional(v.object({ x: v.number(), y: v.number() })),
  status: v.optional(v.string()),
  userName: v.optional(v.string()),
  userImage: v.optional(v.string()),
  name: v.optional(v.string()),
  color: v.optional(v.string()),
});

/**
 * Full presence record validator.
 */
const presenceValidator = v.object({
  _id: v.id("presence"),
  _creationTime: v.number(),
  roomId: v.string(),
  userId: v.optional(v.id("users")),
  sessionId: v.optional(v.string()),
  data: presenceDataValidator,
  lastSeen: v.number(),
});

/**
 * Presence timeout in milliseconds.
 * Entries older than this are considered stale and filtered out.
 */
const PRESENCE_TIMEOUT = 30000; // 30 seconds

/**
 * Maximum room ID length.
 */
const MAX_ROOM_ID_LENGTH = 100;

/**
 * List all active presence entries in a room.
 *
 * This query is reactive - it automatically updates when presence changes.
 * Filters out stale entries (older than PRESENCE_TIMEOUT).
 */
export const list = query({
  args: { roomId: v.string() },
  returns: v.array(presenceValidator),
  handler: async (ctx: any, args: any) => {
    // Validate room ID
    if (!args.roomId || args.roomId.length > MAX_ROOM_ID_LENGTH) {
      return [];
    }

    const now = Date.now();
    const presenceList = await ctx.db
      .query("presence")
      .withIndex("by_room", (q: any) => q.eq("roomId", args.roomId))
      .collect();

    // Filter out stale presence entries
    return presenceList.filter((p: any) => now - p.lastSeen < PRESENCE_TIMEOUT);
  },
});

/**
 * Update presence (user info, status, etc.) in a room.
 *
 * Creates a new presence entry if one doesn't exist, otherwise updates existing.
 * Supports both authenticated and demo modes.
 *
 * Security:
 * - Requires either userId (from auth) or sessionId (demo mode)
 * - Data fields are validated
 */
export const update = mutation({
  args: {
    roomId: v.string(),
    data: presenceDataValidator,
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx: any, args: any) => {
    // Validate room ID
    if (!args.roomId || args.roomId.length > MAX_ROOM_ID_LENGTH) {
      return null;
    }

    // Try to get authenticated user ID
    let userId: any = null;
    try {
      const { getAuthUserId } = await import("@convex-dev/auth/server");
      userId = await getAuthUserId(ctx);
    } catch {
      // Auth not configured - demo mode only
    }

    // Require at least a sessionId if no auth
    if (!userId && !args.sessionId) {
      return null;
    }

    // IMPORTANT: Prioritize sessionId for lookups to support multiple presence
    // entries from the same authenticated user (e.g., two browser tabs/iframes).
    // Only fall back to userId when sessionId is not provided.
    let existing = null;
    if (args.sessionId) {
      existing = await ctx.db
        .query("presence")
        .withIndex("by_session_and_room", (q: any) =>
          q.eq("sessionId", args.sessionId).eq("roomId", args.roomId),
        )
        .first();
    } else if (userId) {
      existing = await ctx.db
        .query("presence")
        .withIndex("by_user_and_room", (q: any) =>
          q.eq("userId", userId).eq("roomId", args.roomId),
        )
        .first();
    }

    if (existing) {
      // Update existing presence
      await ctx.db.patch(existing._id, {
        data: args.data,
        lastSeen: Date.now(),
      });
    } else {
      // Create new presence entry
      await ctx.db.insert("presence", {
        roomId: args.roomId,
        userId: userId,
        sessionId: args.sessionId,
        data: args.data,
        lastSeen: Date.now(),
      });
    }

    return null;
  },
});

/**
 * Leave a room (mark presence as stale).
 *
 * Marks the presence entry with lastSeen: 0 so it's filtered out immediately.
 * The actual deletion is handled by the cleanup function.
 */
export const leave = mutation({
  args: {
    roomId: v.string(),
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx: any, args: any) => {
    // Try to get authenticated user ID
    let userId: any = null;
    try {
      const { getAuthUserId } = await import("@convex-dev/auth/server");
      userId = await getAuthUserId(ctx);
    } catch {
      // Auth not configured
    }

    // Prioritize sessionId for lookups (same as update)
    let existing = null;
    if (args.sessionId) {
      existing = await ctx.db
        .query("presence")
        .withIndex("by_session_and_room", (q: any) =>
          q.eq("sessionId", args.sessionId).eq("roomId", args.roomId),
        )
        .first();
    } else if (userId) {
      existing = await ctx.db
        .query("presence")
        .withIndex("by_user_and_room", (q: any) =>
          q.eq("userId", userId).eq("roomId", args.roomId),
        )
        .first();
    }

    if (existing) {
      // Mark as stale instead of deleting to avoid race conditions
      await ctx.db.patch(existing._id, { lastSeen: 0 });
    }

    return null;
  },
});

/**
 * Cleanup stale presence entries.
 *
 * This is an internal mutation meant to be called from a cron job.
 * Deletes all presence entries older than PRESENCE_TIMEOUT.
 */
export const cleanup = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx: any) => {
    const cutoff = Date.now() - PRESENCE_TIMEOUT;
    const stalePresence = await ctx.db
      .query("presence")
      .filter((q: any) => q.lt(q.field("lastSeen"), cutoff))
      .collect();

    // Delete sequentially to avoid write conflicts
    for (const p of stalePresence) {
      await ctx.db.delete(p._id);
    }

    return stalePresence.length;
  },
});
