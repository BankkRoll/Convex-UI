import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schema for realtime cursor/presence tracking.
 *
 * This schema supports both authenticated and demo modes:
 * - Authenticated: userId links presence to the user
 * - Demo mode: sessionId tracks presence without authentication
 *
 * Security considerations:
 * - Presence is scoped to rooms for isolation
 * - lastSeen enables automatic cleanup of stale entries
 * - Multiple indexes for efficient lookups
 */
export default defineSchema({
  // Presence tracking table for cursors and user state
  presence: defineTable({
    // Room identifier for presence isolation
    roomId: v.string(),

    // User reference (optional for demo mode)
    userId: v.optional(v.id("users")),

    // Session identifier for demo mode tracking
    sessionId: v.optional(v.string()),

    // Presence data (cursor position, status, user info)
    data: v.object({
      // Cursor/pointer position
      cursor: v.optional(v.object({ x: v.number(), y: v.number() })),
      position: v.optional(v.object({ x: v.number(), y: v.number() })),

      // User status (online, away, etc.)
      status: v.optional(v.string()),

      // Display information
      userName: v.optional(v.string()),
      userImage: v.optional(v.string()),
      name: v.optional(v.string()),
      color: v.optional(v.string()),
    }),

    // Timestamp for staleness detection
    lastSeen: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user_and_room", ["userId", "roomId"])
    .index("by_session_and_room", ["sessionId", "roomId"]),

  // Optional: Users table if you want to track users
  // Uncomment if using with authentication
  // users: defineTable({
  //   name: v.optional(v.string()),
  //   email: v.optional(v.string()),
  //   image: v.optional(v.string()),
  // }),
});
