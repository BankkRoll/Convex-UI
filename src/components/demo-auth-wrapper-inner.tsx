"use client";

import { useAutoAnonymousAuth } from "@/hooks/use-auto-anonymous-auth";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface DemoAuthWrapperInnerProps {
  children: ReactNode;
  loadingMessage?: string;
  timeout?: number;
}

export function DemoAuthWrapperInner({
  children,
  loadingMessage = "Preparing demo...",
  timeout = 5000,
}: DemoAuthWrapperInnerProps) {
  const { isAuthenticated, isLoading } = useAutoAnonymousAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  // Show content if authenticated, or after timeout (graceful degradation)
  if (isAuthenticated || timedOut) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{loadingMessage}</span>
      </div>
    );
  }

  return <>{children}</>;
}
