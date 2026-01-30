import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run cleanup every minute (minimum interval for Convex crons)
// This cleans up:
// - Messages older than 60 seconds
// - Files older than 60 seconds (and their storage)
// - Stale presence entries
// - Anonymous users older than 60 seconds (with cascading deletes)
crons.interval(
  "cleanup demo data",
  { minutes: 1 },
  internal.cleanup.cleanupAll,
);

export default crons;
