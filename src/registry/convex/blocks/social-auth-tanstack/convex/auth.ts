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
  callbacks: {
    /**
     * Called when a user signs in via OAuth.
     * Creates the user record if it doesn't exist, or updates profile data.
     */
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        // Existing user - update profile from OAuth provider if needed
        const user = await ctx.db.get(args.existingUserId);
        if (user && args.profile) {
          const updates: {
            name?: string;
            image?: string;
            emailVerificationTime?: number;
          } = {};

          // Update profile fields if provider has newer data
          if (args.profile.name && args.profile.name !== user.name) {
            updates.name = args.profile.name;
          }
          if (args.profile.image && args.profile.image !== user.image) {
            updates.image = args.profile.image;
          }
          // Mark email as verified if provider verifies it
          if (args.profile.emailVerified && !user.emailVerificationTime) {
            updates.emailVerificationTime = Date.now();
          }

          if (Object.keys(updates).length > 0) {
            await ctx.db.patch(args.existingUserId, updates);
          }
        }
        return args.existingUserId;
      }

      // Create new user with profile from OAuth provider
      const userId = await ctx.db.insert("users", {
        name: args.profile?.name,
        email: args.profile?.email,
        image: args.profile?.image,
        // OAuth providers that verify email set emailVerified to true
        emailVerificationTime: args.profile?.emailVerified
          ? Date.now()
          : undefined,
        isAnonymous: false,
      });

      return userId;
    },
  },
});
