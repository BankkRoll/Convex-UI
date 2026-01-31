import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schema for file upload/storage functionality.
 *
 * This schema supports both authenticated and demo modes:
 * - Authenticated: userId links files to the user
 * - Demo mode: sessionId tracks files without authentication
 *
 * Security considerations:
 * - Files are scoped to users/sessions for isolation
 * - storageId references Convex's built-in storage system
 * - File metadata (name, type, size) is stored separately from content
 */
export default defineSchema({
  // File uploads tracking table
  files: defineTable({
    // Reference to Convex storage
    storageId: v.id("_storage"),

    // User reference (optional for demo mode)
    userId: v.optional(v.id("users")),

    // Session identifier for demo mode tracking
    sessionId: v.optional(v.string()),

    // File metadata
    name: v.string(),
    type: v.string(),
    size: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  // Optional: Users table if you want to track users
  // Uncomment if using with authentication
  // users: defineTable({
  //   name: v.optional(v.string()),
  //   email: v.optional(v.string()),
  //   image: v.optional(v.string()),
  // }),
});
