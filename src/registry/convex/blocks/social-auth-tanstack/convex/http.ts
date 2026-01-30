import { httpRouter } from "convex/server";
import { auth } from "./auth";

/**
 * HTTP router for Convex Auth with OAuth providers.
 *
 * This sets up the required HTTP endpoints for authentication:
 * - GET /api/auth/signin/github - Initiate GitHub OAuth
 * - GET /api/auth/signin/google - Initiate Google OAuth
 * - GET /api/auth/callback/github - GitHub OAuth callback
 * - GET /api/auth/callback/google - Google OAuth callback
 * - POST /api/auth/signout - Sign out
 *
 * These routes are automatically configured by auth.addHttpRoutes().
 */
const http = httpRouter();

// Add all auth HTTP routes
auth.addHttpRoutes(http);

export default http;
