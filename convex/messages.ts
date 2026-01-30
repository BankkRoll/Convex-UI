import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const messageValidator = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  roomId: v.string(),
  userId: v.optional(v.id("users")),
  content: v.string(),
  userName: v.string(),
  sessionId: v.optional(v.string()),
});

export const list = query({
  args: { roomId: v.string() },
  returns: v.array(messageValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    roomId: v.string(),
    content: v.string(),
    userName: v.string(),
    sessionId: v.optional(v.string()),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    // Use auth if available, otherwise allow demo mode
    const userId = await getAuthUserId(ctx);

    return await ctx.db.insert("messages", {
      roomId: args.roomId,
      userId: userId ?? undefined,
      content: args.content,
      userName: args.userName,
      sessionId: args.sessionId,
    });
  },
});

export const remove = mutation({
  args: {
    messageId: v.id("messages"),
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      return null; // Idempotent - already deleted
    }

    // Allow deletion if user owns it OR session matches OR no ownership
    const canDelete =
      !message.userId ||
      message.userId === userId ||
      (message.sessionId && message.sessionId === args.sessionId);

    if (canDelete) {
      await ctx.db.delete(args.messageId);
    }

    return null;
  },
});
