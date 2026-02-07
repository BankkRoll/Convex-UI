import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

// Build providers list dynamically based on available env vars
const providers: Parameters<typeof convexAuth>[0]["providers"] = [
  Password,
  Anonymous,
];

// Only add GitHub if credentials are configured
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub);
}

// Only add Google if credentials are configured
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers,
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
