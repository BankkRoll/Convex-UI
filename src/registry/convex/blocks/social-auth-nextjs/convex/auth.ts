import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

// Build providers list dynamically based on available env vars
const providers: Parameters<typeof convexAuth>[0]["providers"] = [];

// Only add GitHub if credentials are configured
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub);
}

// Only add Google if credentials are configured
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

// Fallback: if no providers configured, add both (they will fail gracefully at runtime)
if (providers.length === 0) {
  providers.push(GitHub, Google);
}

/**
 * Convex Auth configuration for social (OAuth) authentication.
 *
 * Features:
 * - GitHub OAuth (if AUTH_GITHUB_ID/SECRET configured)
 * - Google OAuth (if AUTH_GOOGLE_ID/SECRET configured)
 * - OAuth 2.0 with PKCE
 * - Automatic email verification from trusted providers
 * - Secure session management
 *
 * Environment variables:
 * - AUTH_GITHUB_ID, AUTH_GITHUB_SECRET: GitHub OAuth credentials
 * - AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET: Google OAuth credentials
 *
 * Callback URLs (configure in provider dashboard):
 * - GitHub: https://YOUR_CONVEX_URL/api/auth/callback/github
 * - Google: https://YOUR_CONVEX_URL/api/auth/callback/google
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers,
});
