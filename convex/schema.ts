import { defineSchema, defineTable } from "convex/server";

import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Users table with profile info
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("by_email", ["email"])
    .index("by_anonymous", ["isAnonymous"]),

  // Chat messages for realtime chat (userId optional for demo mode)
  messages: defineTable({
    roomId: v.string(),
    userId: v.optional(v.id("users")),
    content: v.string(),
    userName: v.string(),
    sessionId: v.optional(v.string()), // For tracking demo sessions
  }).index("by_room", ["roomId"]),

  // Presence for realtime features (cursors, avatar stacks)
  // userId optional for demo mode - uses sessionId instead
  presence: defineTable({
    roomId: v.string(),
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()), // For tracking demo sessions
    data: v.object({
      cursor: v.optional(v.object({ x: v.number(), y: v.number() })),
      position: v.optional(v.object({ x: v.number(), y: v.number() })), // Alias for cursor
      status: v.optional(v.string()),
      userName: v.optional(v.string()),
      userImage: v.optional(v.string()),
      color: v.optional(v.string()),
      name: v.optional(v.string()),
    }),
    lastSeen: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user_and_room", ["userId", "roomId"])
    .index("by_session_and_room", ["sessionId", "roomId"])
    .index("by_last_seen", ["lastSeen"]),

  // File uploads tracking (userId optional for demo mode)
  files: defineTable({
    storageId: v.id("_storage"),
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()), // For tracking demo sessions
    name: v.string(),
    type: v.string(),
    size: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),
});
