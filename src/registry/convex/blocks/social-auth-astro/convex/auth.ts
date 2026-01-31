import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

/**
 * Convex Auth configuration for social (OAuth) authentication.
 *
 * Supported providers:
 * - GitHub: Requires AUTH_GITHUB_ID and AUTH_GITHUB_SECRET
 * - Google: Requires AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET
 *
 * Security features:
 * - OAuth 2.0 with PKCE
 * - Automatic email verification from trusted providers
 * - Secure session management
 *
 * To add more providers, import them from @auth/core/providers and add to the array.
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Google],
  callbacks: {
    /**
     * Called when a user signs in via OAuth.
     * Creates the user record if it doesn't exist, or updates profile data.
     */
    async createOrUpdateUser(ctx: any, args: any) {
      if (args.existingUserId) {
        // Existing user - update profile from OAuth provider if needed
        const user = await ctx.db.get(args.existingUserId);
        if (user && args.profile) {
          const updates: any = {};

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
