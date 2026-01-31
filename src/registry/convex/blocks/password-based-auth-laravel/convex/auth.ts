import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

/**
 * Convex Auth configuration for password-based authentication.
 *
 * Security features:
 * - Password provider with built-in hashing (bcrypt)
 * - Email verification support
 * - Password reset flow
 * - Secure session management
 *
 * To enable email verification, configure RESEND_API_KEY or another email provider.
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
  callbacks: {
    /**
     * Called when a user signs in or signs up.
     * Creates the user record if it doesn't exist.
     */
    async createOrUpdateUser(ctx: any, args: any) {
      if (args.existingUserId) {
        // Existing user - optionally update profile from provider
        const user = await ctx.db.get(args.existingUserId);
        if (user && args.profile) {
          // Update name/image if provided by OAuth (not applicable for Password)
          const updates: any = {};
          if (args.profile.name && !user.name) {
            updates.name = args.profile.name;
          }
          if (args.profile.image && !user.image) {
            updates.image = args.profile.image;
          }
          if (Object.keys(updates).length > 0) {
            await ctx.db.patch(args.existingUserId, updates);
          }
        }
        return args.existingUserId;
      }

      // Create new user
      const userId = await ctx.db.insert("users", {
        name: args.profile?.name,
        email: args.profile?.email,
        image: args.profile?.image,
        emailVerificationTime: args.profile?.emailVerified
          ? Date.now()
          : undefined,
        isAnonymous: false,
      });

      return userId;
    },
  },
});
