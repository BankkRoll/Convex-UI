import { query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * User validator for return types.
 */
const userValidator = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  image: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
});

/**
 * Get the current authenticated user's profile.
 *
 * This query is reactive - it automatically updates when user data changes.
 * Returns null if not authenticated.
 *
 * Security: Only returns data for the authenticated user themselves.
 * The user's own email is included since they are viewing their own profile.
 */
export const current = query({
  args: {},
  returns: v.union(userValidator, v.null()),
  handler: async (ctx: QueryCtx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

/**
 * Public profile validator - excludes sensitive fields like email.
 */
const publicProfileValidator = v.object({
  _id: v.id("users"),
  name: v.optional(v.string()),
  image: v.optional(v.string()),
});

/**
 * Get a user's public profile by ID.
 * Only returns safe, public fields (name, image).
 *
 * Security: Never exposes email or other sensitive data.
 */
export const get = query({
  args: { userId: v.id("users") },
  returns: v.union(publicProfileValidator, v.null()),
  handler: async (ctx: QueryCtx, args: { userId: Id<"users"> }) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }
    // Only return public fields
    return {
      _id: user._id,
      name: user.name,
      image: user.image,
    };
  },
});
