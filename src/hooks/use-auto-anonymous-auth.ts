"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef, useState } from "react";

/**
 * Hook that automatically signs in anonymous users when they're not authenticated.
 * Use this in demo components that require authentication.
 *
 * Note: Anonymous users and their data are automatically cleaned up after 60 seconds.
 */
export function useAutoAnonymousAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const authActions = useAuthActions();
  const hasAttemptedRef = useRef(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // Only attempt once per session to avoid loops
    if (hasAttemptedRef.current) return;
    if (isLoading) return;
    if (isAuthenticated) return;
    if (!authActions?.signIn) return; // Auth provider not ready

    hasAttemptedRef.current = true;
    setIsSigningIn(true);

    // Sign in anonymously
    authActions
      .signIn("anonymous")
      .catch((error: Error) => {
        console.error("Failed to sign in anonymously:", error);
      })
      .finally(() => {
        setIsSigningIn(false);
      });
  }, [isAuthenticated, isLoading, authActions]);

  return {
    isAuthenticated,
    isLoading: isLoading || isSigningIn,
  };
}
