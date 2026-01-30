import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schema for realtime chat functionality.
 *
 * This schema supports both authenticated and demo modes:
 * - Authenticated: userId links messages to the user
 * - Demo mode: sessionId tracks messages without authentication
 *
 * Security considerations:
 * - Messages are scoped to rooms for isolation
 * - sessionId enables demo mode without requiring auth
 * - Index on roomId for efficient message retrieval
 */
export default defineSchema({
  // Chat messages table
  messages: defineTable({
    // Room identifier for message isolation
    roomId: v.string(),

    // User reference (optional for demo mode)
    userId: v.optional(v.id("users")),

    // Message content
    content: v.string(),

    // Display name (denormalized for performance)
    userName: v.string(),

    // Session identifier for demo mode tracking
    sessionId: v.optional(v.string()),
  }).index("by_room", ["roomId"]),

  // Optional: Users table if you want to track users
  // Uncomment if using with authentication
  // users: defineTable({
  //   name: v.optional(v.string()),
  //   email: v.optional(v.string()),
  //   image: v.optional(v.string()),
  // }),
});
