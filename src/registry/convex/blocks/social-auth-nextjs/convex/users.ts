import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

/**
 * User validator for internal use.
 * Includes all fields - use publicProfileValidator for external queries.
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
 * Public profile validator - excludes sensitive fields like email.
 * Use this when returning user data to other users.
 */
const publicProfileValidator = v.object({
  _id: v.id("users"),
  name: v.optional(v.string()),
  image: v.optional(v.string()),
});

/**
 * Get the current authenticated user's full profile.
 * Returns null if not authenticated.
 *
 * Security: Only returns data for the authenticated user themselves.
 */
export const current = query({
  args: {},
  returns: v.union(userValidator, v.null()),
  handler: async (ctx: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
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
  handler: async (ctx: any, args: any) => {
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

/**
 * Update the current user's profile.
 * Only allows updating safe fields (name, image).
 *
 * Security:
 * - Requires authentication
 * - Only allows updating own profile
 * - Validates input types
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update your profile",
      });
    }

    // Build updates object with only provided fields
    const updates: any = {};
    if (args.name !== undefined) {
      // Sanitize name - trim whitespace, limit length
      const sanitizedName = args.name.trim().slice(0, 100);
      if (sanitizedName) {
        updates.name = sanitizedName;
      }
    }
    if (args.image !== undefined) {
      // Validate image URL format
      if (args.image && !isValidUrl(args.image)) {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "Invalid image URL",
        });
      }
      updates.image = args.image;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }

    return null;
  },
});

/**
 * Helper to validate URL format.
 */
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
