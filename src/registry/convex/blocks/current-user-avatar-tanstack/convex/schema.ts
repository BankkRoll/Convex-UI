import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Schema for user avatar functionality.
 *
 * This schema requires authentication - the current-user-avatar component
 * displays the authenticated user's profile image and name.
 *
 * Note: This schema includes authTables which requires @convex-dev/auth.
 * If you're using a different auth system, you can remove authTables
 * and create your own users table.
 */
export default defineSchema({
  // Auth tables from @convex-dev/auth
  ...authTables,

  // Users table with profile information
  users: defineTable({
    // Profile fields
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),

    // Auth metadata
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("by_email", ["email"])
    .index("by_anonymous", ["isAnonymous"]),
});
