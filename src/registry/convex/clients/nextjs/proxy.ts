import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
} from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/protected(.*)"]);

// Named export for Next.js 16+ (proxy.ts)
export const proxy = convexAuthNextjsMiddleware((request, { convexAuth }) => {
  if (isProtectedRoute(request) && !convexAuth.isAuthenticated()) {
    return Response.redirect(new URL("/auth/login", request.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
