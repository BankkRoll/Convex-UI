import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Cleanup timeout in milliseconds (60 seconds)
const CLEANUP_TIMEOUT = 60000;

// Batch size to avoid hitting limits
const BATCH_SIZE = 100;

export const cleanupMessages = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const cutoff = Date.now() - CLEANUP_TIMEOUT;
    const oldMessages = await ctx.db
      .query("messages")
      .filter((q) => q.lt(q.field("_creationTime"), cutoff))
      .take(BATCH_SIZE);

    // Delete sequentially to avoid write conflicts
    for (const m of oldMessages) {
      await ctx.db.delete(m._id);
    }
    return oldMessages.length;
  },
});

export const cleanupFiles = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const cutoff = Date.now() - CLEANUP_TIMEOUT;
    const oldFiles = await ctx.db
      .query("files")
      .filter((q) => q.lt(q.field("_creationTime"), cutoff))
      .take(BATCH_SIZE);

    // Delete sequentially to avoid write conflicts
    for (const f of oldFiles) {
      await ctx.storage.delete(f.storageId);
      await ctx.db.delete(f._id);
    }
    return oldFiles.length;
  },
});

// Presence timeout is shorter (30 seconds) since it needs faster cleanup
const PRESENCE_TIMEOUT = 30000;

export const cleanupPresence = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const cutoff = Date.now() - PRESENCE_TIMEOUT;
    // Also catch records marked as stale (lastSeen: 0) by the leave function
    const stalePresence = await ctx.db
      .query("presence")
      .filter((q) => q.lt(q.field("lastSeen"), cutoff))
      .take(BATCH_SIZE);

    // Delete sequentially to avoid write conflicts
    for (const p of stalePresence) {
      await ctx.db.delete(p._id);
    }
    return stalePresence.length;
  },
});

export const cleanupAnonymousUsers = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const cutoff = Date.now() - CLEANUP_TIMEOUT;
    const oldAnonymousUsers = await ctx.db
      .query("users")
      .withIndex("by_anonymous", (q) => q.eq("isAnonymous", true))
      .filter((q) => q.lt(q.field("_creationTime"), cutoff))
      .take(BATCH_SIZE);

    // Delete related data first (sequential to avoid conflicts)
    for (const user of oldAnonymousUsers) {
      // Delete user's messages
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      for (const m of messages) {
        await ctx.db.delete(m._id);
      }

      // Delete user's files and storage
      const files = await ctx.db
        .query("files")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const f of files) {
        await ctx.storage.delete(f.storageId);
        await ctx.db.delete(f._id);
      }

      // Delete user's presence
      const presence = await ctx.db
        .query("presence")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      for (const p of presence) {
        await ctx.db.delete(p._id);
      }

      // Delete auth-related data (authAccounts, authSessions)
      const authAccounts = await ctx.db
        .query("authAccounts")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      for (const a of authAccounts) {
        await ctx.db.delete(a._id);
      }

      const authSessions = await ctx.db
        .query("authSessions")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      for (const s of authSessions) {
        // Delete refresh tokens for this session
        const refreshTokens = await ctx.db
          .query("authRefreshTokens")
          .filter((q) => q.eq(q.field("sessionId"), s._id))
          .collect();
        for (const t of refreshTokens) {
          await ctx.db.delete(t._id);
        }
        await ctx.db.delete(s._id);
      }

      // Finally delete the user
      await ctx.db.delete(user._id);
    }

    return oldAnonymousUsers.length;
  },
});

// Master cleanup function that runs all cleanups
export const cleanupAll = internalMutation({
  args: {},
  returns: v.object({
    messages: v.number(),
    files: v.number(),
    presence: v.number(),
    anonymousUsers: v.number(),
  }),
  handler: async (ctx) => {
    const cutoff = Date.now() - CLEANUP_TIMEOUT;
    const presenceCutoff = Date.now() - PRESENCE_TIMEOUT;
    let messagesDeleted = 0;
    let filesDeleted = 0;
    let presenceDeleted = 0;
    let usersDeleted = 0;

    // Cleanup messages (sequential to avoid conflicts)
    const oldMessages = await ctx.db
      .query("messages")
      .filter((q) => q.lt(q.field("_creationTime"), cutoff))
      .take(BATCH_SIZE);
    for (const m of oldMessages) {
      await ctx.db.delete(m._id);
    }
    messagesDeleted = oldMessages.length;

    // Cleanup files (sequential to avoid conflicts)
    const oldFiles = await ctx.db
      .query("files")
      .filter((q) => q.lt(q.field("_creationTime"), cutoff))
      .take(BATCH_SIZE);
    for (const f of oldFiles) {
      await ctx.storage.delete(f.storageId);
      await ctx.db.delete(f._id);
    }
    filesDeleted = oldFiles.length;

    // Cleanup presence (use shorter timeout, catches lastSeen: 0 from leave)
    const stalePresence = await ctx.db
      .query("presence")
      .filter((q) => q.lt(q.field("lastSeen"), presenceCutoff))
      .take(BATCH_SIZE);
    for (const p of stalePresence) {
      await ctx.db.delete(p._id);
    }
    presenceDeleted = stalePresence.length;

    // Cleanup anonymous users (with cascading deletes)
    const oldAnonymousUsers = await ctx.db
      .query("users")
      .withIndex("by_anonymous", (q) => q.eq("isAnonymous", true))
      .filter((q) => q.lt(q.field("_creationTime"), cutoff))
      .take(BATCH_SIZE);

    for (const user of oldAnonymousUsers) {
      // Delete user's remaining messages
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      for (const m of messages) {
        await ctx.db.delete(m._id);
      }

      // Delete user's remaining files and storage
      const files = await ctx.db
        .query("files")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const f of files) {
        await ctx.storage.delete(f.storageId);
        await ctx.db.delete(f._id);
      }

      // Delete user's remaining presence
      const presence = await ctx.db
        .query("presence")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      for (const p of presence) {
        await ctx.db.delete(p._id);
      }

      // Delete auth-related data
      const authAccounts = await ctx.db
        .query("authAccounts")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      for (const a of authAccounts) {
        await ctx.db.delete(a._id);
      }

      const authSessions = await ctx.db
        .query("authSessions")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      for (const s of authSessions) {
        // Delete refresh tokens for this session
        const refreshTokens = await ctx.db
          .query("authRefreshTokens")
          .filter((q) => q.eq(q.field("sessionId"), s._id))
          .collect();
        for (const t of refreshTokens) {
          await ctx.db.delete(t._id);
        }
        await ctx.db.delete(s._id);
      }

      await ctx.db.delete(user._id);
      usersDeleted++;
    }

    return {
      messages: messagesDeleted,
      files: filesDeleted,
      presence: presenceDeleted,
      anonymousUsers: usersDeleted,
    };
  },
});
