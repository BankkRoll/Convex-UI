import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const fileValidator = v.object({
  _id: v.id("files"),
  _creationTime: v.number(),
  storageId: v.id("_storage"),
  userId: v.optional(v.id("users")),
  sessionId: v.optional(v.string()),
  name: v.string(),
  type: v.string(),
  size: v.number(),
});

// Demo mode: allow uploads without auth
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    sessionId: v.optional(v.string()),
  },
  returns: v.id("files"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    return await ctx.db.insert("files", {
      storageId: args.storageId,
      userId: userId ?? undefined,
      sessionId: args.sessionId,
      name: args.name,
      type: args.type,
      size: args.size,
    });
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    // Demo mode: return URL for any file
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const list = query({
  args: { sessionId: v.optional(v.string()) },
  returns: v.array(
    v.object({
      ...fileValidator.fields,
      url: v.union(v.string(), v.null()),
    }),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    let files;
    if (userId) {
      // Authenticated: show user's files
      files = await ctx.db
        .query("files")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    } else if (args.sessionId) {
      // Demo mode: show session's files
      files = await ctx.db
        .query("files")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    } else {
      return [];
    }

    return await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      })),
    );
  },
});

export const remove = mutation({
  args: {
    fileId: v.id("files"),
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null; // Idempotent
    }

    // Allow deletion if user owns it OR session matches OR no ownership
    const canDelete =
      !file.userId ||
      file.userId === userId ||
      (file.sessionId && file.sessionId === args.sessionId);

    if (canDelete) {
      await ctx.storage.delete(file.storageId);
      await ctx.db.delete(args.fileId);
    }

    return null;
  },
});
