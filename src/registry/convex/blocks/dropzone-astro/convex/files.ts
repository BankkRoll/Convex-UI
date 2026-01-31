import { query, mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";

/**
 * File validator for return types.
 */
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

/**
 * Maximum file size (50MB).
 */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Maximum filename length.
 */
const MAX_FILENAME_LENGTH = 255;

/**
 * Generate a secure upload URL for file uploads.
 *
 * This URL can be used to upload a file directly to Convex storage.
 * The URL is temporary and expires after a short time.
 *
 * Note: This is a public mutation that allows uploads.
 * For production, consider adding rate limiting or authentication.
 */
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx: MutationCtx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save file metadata after successful upload.
 *
 * Call this after uploading a file to the URL from generateUploadUrl.
 * Associates the uploaded file with a user or session.
 *
 * Security:
 * - Validates file metadata
 * - Associates file with user (if authenticated) or session
 */
export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    sessionId: v.optional(v.string()),
  },
  returns: v.id("files"),
  handler: async (
    ctx: MutationCtx,
    args: {
      storageId: Id<"_storage">;
      name: string;
      type: string;
      size: number;
      sessionId?: string;
    },
  ) => {
    // Validate file size
    if (args.size > MAX_FILE_SIZE) {
      throw new ConvexError({
        code: "FILE_TOO_LARGE",
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
      });
    }

    // Validate and sanitize filename
    const name = args.name.trim().slice(0, MAX_FILENAME_LENGTH);
    if (!name) {
      throw new ConvexError({
        code: "INVALID_FILENAME",
        message: "Filename cannot be empty.",
      });
    }

    // Try to get authenticated user ID
    let userId: Id<"users"> | undefined;
    try {
      const { getAuthUserId } = await import("@convex-dev/auth/server");
      const authUserId = await getAuthUserId(ctx);
      userId = authUserId !== null ? (authUserId as Id<"users">) : undefined;
    } catch {
      // Auth not configured - demo mode only
    }

    return await ctx.db.insert("files", {
      storageId: args.storageId,
      userId,
      sessionId: args.sessionId,
      name,
      type: args.type,
      size: args.size,
    });
  },
});

/**
 * Get a download URL for a file.
 *
 * Returns a temporary URL that can be used to download the file.
 */
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx: QueryCtx, args: { storageId: Id<"_storage"> }) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/**
 * List files for the current user or session.
 *
 * Returns files with their download URLs.
 *
 * Security:
 * - Only returns files belonging to the authenticated user
 * - Or files belonging to the provided session (demo mode)
 */
export const list = query({
  args: { sessionId: v.optional(v.string()) },
  returns: v.array(
    v.object({
      ...fileValidator.fields,
      url: v.union(v.string(), v.null()),
    }),
  ),
  handler: async (ctx: QueryCtx, args: { sessionId?: string }) => {
    // Try to get authenticated user ID
    let userId: Id<"users"> | null = null;
    try {
      const { getAuthUserId } = await import("@convex-dev/auth/server");
      const authUserId = await getAuthUserId(ctx);
      userId = authUserId !== null ? (authUserId as Id<"users">) : null;
    } catch {
      // Auth not configured
    }

    let files;
    if (userId) {
      // Authenticated: show user's files
      files = await ctx.db
        .query("files")
        .withIndex("by_user", (q: (typeof ctx.db.query)["arguments"]) =>
          q.eq("userId", userId),
        )
        .collect();
    } else if (args.sessionId) {
      // Demo mode: show session's files
      files = await ctx.db
        .query("files")
        .withIndex("by_session", (q: (typeof ctx.db.query)["arguments"]) =>
          q.eq("sessionId", args.sessionId),
        )
        .collect();
    } else {
      return [];
    }

    // Add download URLs to each file
    return await Promise.all(
      files.map(async (file: (typeof files)[number]) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      })),
    );
  },
});

/**
 * Delete a file.
 *
 * Security:
 * - Only allows deletion if:
 *   1. User owns the file (userId matches), OR
 *   2. Session owns the file (sessionId matches), OR
 *   3. File has no owner (demo file)
 * - Also deletes the file from storage
 * - Idempotent - returns success even if file doesn't exist
 */
export const remove = mutation({
  args: {
    fileId: v.id("files"),
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (
    ctx: MutationCtx,
    args: { fileId: Id<"files">; sessionId?: string },
  ) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null; // Idempotent - already deleted
    }

    // Try to get authenticated user ID
    let userId: Id<"users"> | null = null;
    try {
      const { getAuthUserId } = await import("@convex-dev/auth/server");
      const authUserId = await getAuthUserId(ctx);
      userId = authUserId !== null ? (authUserId as Id<"users">) : null;
    } catch {
      // Auth not configured
    }

    // Check ownership
    const canDelete =
      // No owner (demo file)
      !file.userId ||
      // User owns it
      file.userId === userId ||
      // Session owns it
      (file.sessionId && file.sessionId === args.sessionId);

    if (canDelete) {
      // Delete from storage first
      await ctx.storage.delete(file.storageId);
      // Then delete metadata
      await ctx.db.delete(args.fileId);
    }

    return null;
  },
});
