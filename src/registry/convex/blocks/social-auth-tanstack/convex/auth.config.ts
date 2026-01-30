/**
 * Auth configuration for Convex Auth with OAuth providers.
 *
 * The domain should match your Convex deployment URL.
 * This is automatically set via CONVEX_SITE_URL environment variable.
 *
 * For OAuth providers, you also need to set:
 * - GitHub: AUTH_GITHUB_ID, AUTH_GITHUB_SECRET
 * - Google: AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
 *
 * Configure the OAuth callback URLs in your provider's settings:
 * - GitHub: https://YOUR_CONVEX_URL/api/auth/callback/github
 * - Google: https://YOUR_CONVEX_URL/api/auth/callback/google
 */
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
