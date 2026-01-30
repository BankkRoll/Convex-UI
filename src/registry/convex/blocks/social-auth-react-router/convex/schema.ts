import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Schema for social (OAuth) authentication.
 * Includes the users table and all required auth tables from @convex-dev/auth.
 *
 * Security considerations:
 * - Email is indexed for fast lookups but never exposed in public queries
 * - emailVerificationTime is set when OAuth provider verifies email
 * - Profile data (name, image) is populated from OAuth provider
 */
export default defineSchema({
  // Auth tables from @convex-dev/auth (authAccounts, authSessions, etc.)
  ...authTables,

  // Users table with profile information from OAuth providers
  users: defineTable({
    // Profile fields (populated from OAuth provider)
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
