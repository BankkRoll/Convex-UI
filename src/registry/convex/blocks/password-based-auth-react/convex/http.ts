import { httpRouter } from "convex/server";
import { auth } from "./auth";

/**
 * HTTP router for Convex Auth.
 *
 * This sets up the required HTTP endpoints for authentication:
 * - POST /api/auth/signin - Sign in
 * - POST /api/auth/signout - Sign out
 * - GET /api/auth/signin/* - OAuth callbacks
 * - POST /api/auth/callback/* - OAuth callbacks
 *
 * These routes are automatically configured by auth.addHttpRoutes().
 */
const http = httpRouter();

// Add all auth HTTP routes
auth.addHttpRoutes(http);

export default http;
