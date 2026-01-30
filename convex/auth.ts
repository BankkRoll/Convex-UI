import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password, GitHub, Google, Anonymous],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Check if this is an anonymous provider
      const isAnonymous = args.provider?.id === "anonymous";

      if (args.existingUserId) {
        // Existing user - update if needed
        return args.existingUserId;
      }

      // Generate a random name for anonymous users
      const name = isAnonymous
        ? `User-${Math.floor(Math.random() * 10000)}`
        : args.profile?.name;

      // Create new user with isAnonymous flag
      const userId = await ctx.db.insert("users", {
        name,
        email: args.profile?.email,
        image: args.profile?.image,
        isAnonymous,
      });

      return userId;
    },
  },
});
