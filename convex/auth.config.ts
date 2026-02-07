import { AuthConfig } from "convex/server";

/**
 * Auth configuration for Convex Auth.
 *
 * The domain should match your Convex deployment URL.
 * This is automatically set via CONVEX_SITE_URL environment variable.
 *
 * Environment variables:
 * - CONVEX_SITE_URL: Your Convex deployment URL
 * - AUTH_GITHUB_ID, AUTH_GITHUB_SECRET: GitHub OAuth credentials (optional)
 * - AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET: Google OAuth credentials (optional)
 */
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
