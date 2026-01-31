/**
 * Auth configuration for Convex Auth.
 *
 * The domain should match your Convex deployment URL.
 * This is automatically set via CONVEX_SITE_URL environment variable.
 */
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
