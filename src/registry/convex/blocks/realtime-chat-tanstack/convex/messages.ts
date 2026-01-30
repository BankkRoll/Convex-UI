import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/**
 * Message validator for return types.
 */
const messageValidator = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  roomId: v.string(),
  userId: v.optional(v.id("users")),
  content: v.string(),
  userName: v.string(),
  sessionId: v.optional(v.string()),
});

/**
 * Maximum message length to prevent abuse.
 */
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Maximum room ID length.
 */
const MAX_ROOM_ID_LENGTH = 100;

/**
 * List all messages in a room, ordered by creation time.
 *
 * This query is reactive - it automatically updates when messages change.
 * Uses index for efficient retrieval.
 */
export const list = query({
  args: { roomId: v.string() },
  returns: v.array(messageValidator),
  handler: async (ctx: any, args: { roomId: string }) => {
    // Validate room ID
    if (!args.roomId || args.roomId.length > MAX_ROOM_ID_LENGTH) {
      return [];
    }

    return await ctx.db
      .query("messages")
      .withIndex("by_room", (q: any) => q.eq("roomId", args.roomId))
      .order("asc")
      .collect();
  },
});

/**
 * Send a new message to a room.
 *
 * Supports both authenticated and demo modes:
 * - If authenticated, userId is set from the auth context
 * - If demo mode, sessionId should be provided for tracking
 *
 * Security:
 * - Content is validated and trimmed
 * - Room ID is validated
 * - User name is sanitized
 */
export const send = mutation({
  args: {
    roomId: v.string(),
    content: v.string(),
    userName: v.string(),
    sessionId: v.optional(v.string()),
  },
  returns: v.id("messages"),
  handler: async (
    ctx: any,
    args: {
      roomId: string;
      content: string;
      userName: string;
      sessionId?: string;
    },
  ) => {
    // Validate room ID
    if (!args.roomId || args.roomId.length > MAX_ROOM_ID_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid room ID",
      });
    }

    // Validate and sanitize content
    const content = args.content.trim();
    if (!content) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Message content cannot be empty",
      });
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    // Sanitize user name
    const userName = args.userName.trim().slice(0, 50) || "Anonymous";

    // Try to get authenticated user ID (optional - supports demo mode)
    let userId: any = undefined;
    try {
      // Dynamic import to make auth optional
      const { getAuthUserId } = await import("@convex-dev/auth/server");
      userId = (await getAuthUserId(ctx)) ?? undefined;
    } catch {
      // Auth not configured - demo mode only
      userId = undefined;
    }

    return await ctx.db.insert("messages", {
      roomId: args.roomId,
      userId,
      content,
      userName,
      sessionId: args.sessionId,
    });
  },
});

/**
 * Delete a message.
 *
 * Security:
 * - Only allows deletion if:
 *   1. User owns the message (userId matches), OR
 *   2. Session owns the message (sessionId matches), OR
 *   3. Message has no owner (demo message)
 * - Idempotent - returns success even if message doesn't exist
 */
export const remove = mutation({
  args: {
    messageId: v.id("messages"),
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx: any, args: { messageId: any; sessionId?: string }) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      return null; // Idempotent - already deleted
    }

    // Try to get authenticated user ID
    let userId: any = null;
    try {
      const { getAuthUserId } = await import("@convex-dev/auth/server");
      userId = await getAuthUserId(ctx);
    } catch {
      // Auth not configured
    }

    // Check ownership
    const canDelete =
      // No owner (demo message)
      !message.userId ||
      // User owns it
      message.userId === userId ||
      // Session owns it
      (message.sessionId && message.sessionId === args.sessionId);

    if (canDelete) {
      await ctx.db.delete(args.messageId);
    }

    return null;
  },
});
