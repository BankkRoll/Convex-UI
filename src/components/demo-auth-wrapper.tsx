"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";

interface DemoAuthWrapperProps {
  children: ReactNode;
  loadingMessage?: string;
  /** Timeout in ms before showing content anyway (default: 5000) */
  timeout?: number;
}

// Inner component that uses auth hooks - loaded dynamically to avoid SSR issues
const DemoAuthWrapperInner = dynamic(
  () =>
    import("./demo-auth-wrapper-inner").then((mod) => mod.DemoAuthWrapperInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    ),
  },
);

/**
 * Wrapper component that ensures the user is authenticated (anonymously if needed)
 * before rendering demo content. Use this to wrap interactive demos that require auth.
 *
 * Note: Anonymous users and their data are automatically cleaned up after 60 seconds.
 */
export function DemoAuthWrapper({
  children,
  loadingMessage = "Preparing demo...",
  timeout = 5000,
}: DemoAuthWrapperProps) {
  return (
    <DemoAuthWrapperInner loadingMessage={loadingMessage} timeout={timeout}>
      {children}
    </DemoAuthWrapperInner>
  );
}
