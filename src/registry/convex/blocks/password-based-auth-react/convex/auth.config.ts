import { AuthConfig } from "convex/server";

/**
 * Auth configuration for Convex Auth with password + OAuth providers.
 *
 * The domain should match your Convex deployment URL.
 * This is automatically set via CONVEX_SITE_URL environment variable.
 *
 * Required environment variables:
 * - CONVEX_SITE_URL: Your Convex deployment URL
 * - AUTH_RESEND_KEY: Resend API key for email verification/reset
 *
 * Optional environment variables (for social login):
 * - AUTH_GITHUB_ID, AUTH_GITHUB_SECRET: GitHub OAuth credentials
 * - AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET: Google OAuth credentials
 * - AUTH_EMAIL_FROM: Sender email address (defaults to onboarding@resend.dev)
 *
 * Configure the OAuth callback URLs in your provider's settings:
 * - GitHub: https://YOUR_CONVEX_URL/api/auth/callback/github
 * - Google: https://YOUR_CONVEX_URL/api/auth/callback/google
 */
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
