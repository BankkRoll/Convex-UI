import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Presence data validator - defines allowed fields for presence data
const presenceDataValidator = v.object({
  cursor: v.optional(v.object({ x: v.number(), y: v.number() })),
  position: v.optional(v.object({ x: v.number(), y: v.number() })), // Alias for cursor
  status: v.optional(v.string()),
  userName: v.optional(v.string()),
  userImage: v.optional(v.string()),
  color: v.optional(v.string()),
  name: v.optional(v.string()),
});

const presenceValidator = v.object({
  _id: v.id("presence"),
  _creationTime: v.number(),
  roomId: v.string(),
  userId: v.optional(v.id("users")),
  sessionId: v.optional(v.string()),
  data: presenceDataValidator,
  lastSeen: v.number(),
});

// Presence timeout in milliseconds (30 seconds)
const PRESENCE_TIMEOUT = 30000;

export const list = query({
  args: { roomId: v.string() },
  returns: v.array(presenceValidator),
  handler: async (ctx, args) => {
    const now = Date.now();
    const presenceList = await ctx.db
      .query("presence")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    // Filter out stale presence entries
    return presenceList.filter((p) => now - p.lastSeen < PRESENCE_TIMEOUT);
  },
});

export const update = mutation({
  args: {
    roomId: v.string(),
    data: presenceDataValidator,
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // For demo mode, require at least a sessionId if no auth
    if (!userId && !args.sessionId) {
      return null;
    }

    // IMPORTANT: Prioritize sessionId for lookups to support multiple cursors
    // from the same authenticated user (e.g., two browser tabs/iframes).
    // Only fall back to userId when sessionId is not provided.
    let existing = null;
    if (args.sessionId) {
      existing = await ctx.db
        .query("presence")
        .withIndex("by_session_and_room", (q) =>
          q.eq("sessionId", args.sessionId).eq("roomId", args.roomId),
        )
        .first();
    } else if (userId) {
      existing = await ctx.db
        .query("presence")
        .withIndex("by_user_and_room", (q) =>
          q.eq("userId", userId).eq("roomId", args.roomId),
        )
        .first();
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: args.data,
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert("presence", {
        roomId: args.roomId,
        userId: userId ?? undefined,
        sessionId: args.sessionId,
        data: args.data,
        lastSeen: Date.now(),
      });
    }
    return null;
  },
});

export const leave = mutation({
  args: {
    roomId: v.string(),
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Prioritize sessionId for lookups (same as update)
    let existing = null;
    if (args.sessionId) {
      existing = await ctx.db
        .query("presence")
        .withIndex("by_session_and_room", (q) =>
          q.eq("sessionId", args.sessionId).eq("roomId", args.roomId),
        )
        .first();
    } else if (userId) {
      existing = await ctx.db
        .query("presence")
        .withIndex("by_user_and_room", (q) =>
          q.eq("userId", userId).eq("roomId", args.roomId),
        )
        .first();
    }

    if (existing) {
      // Delete directly - more efficient and avoids OCC conflicts with update
      await ctx.db.delete(existing._id);
    }
    return null;
  },
});

// Cleanup stale presence entries (only callable from cron jobs or other internal functions)
export const cleanup = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    const cutoff = now - PRESENCE_TIMEOUT;
    const stalePresence = await ctx.db
      .query("presence")
      .withIndex("by_last_seen", (q) => q.lt("lastSeen", cutoff))
      .collect();

    // Delete sequentially to avoid write conflicts
    for (const p of stalePresence) {
      await ctx.db.delete(p._id);
    }
    return stalePresence.length;
  },
});
