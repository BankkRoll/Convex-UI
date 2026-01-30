import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Schema for password-based authentication.
 * Includes the users table and all required auth tables from @convex-dev/auth.
 *
 * Security considerations:
 * - Email is indexed for fast lookups but never exposed in public queries
 * - emailVerificationTime tracks when email was verified
 * - isAnonymous flag supports gradual account upgrades
 */
export default defineSchema({
  // Auth tables from @convex-dev/auth (authAccounts, authSessions, authVerificationCodes, etc.)
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
