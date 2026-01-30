"use client";

import { ComponentType, ReactNode, useEffect, useRef, useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { FrameworkProvider } from "@/context/framework-context";
import { Provider as JotaiProvider } from "jotai";
import { MobileMenuProvider } from "@/context/mobile-menu-context";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// Singleton client instance - created lazily on first client-side render
let convexClient: ConvexReactClient | null = null;

function getConvexClient() {
  if (typeof window === "undefined") return null;
  if (!convexClient) {
    convexClient = new ConvexReactClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:8080",
    );
  }
  return convexClient;
}

function ClientOnlyConvexProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [AuthProvider, setAuthProvider] = useState<ComponentType<any> | null>(
    null,
  );
  const clientRef = useRef<ConvexReactClient | null>(null);

  useEffect(() => {
    clientRef.current = getConvexClient();
    // Dynamically import ConvexAuthProvider only on client side for demos
    import("@convex-dev/auth/react").then((mod) => {
      setAuthProvider(() => mod.ConvexAuthProvider);
      setMounted(true);
    });
  }, []);

  // Don't render children until we have the Convex client ready
  if (!mounted || !clientRef.current || !AuthProvider) {
    return null;
  }

  return <AuthProvider client={clientRef.current}>{children}</AuthProvider>;
}

export function ThemeProvider({ children, ...props }: any) {
  return (
    <JotaiProvider>
      <NextThemesProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
      >
        <MobileMenuProvider>
          <FrameworkProvider>
            <TooltipProvider delayDuration={0}>
              <ClientOnlyConvexProvider>{children}</ClientOnlyConvexProvider>
            </TooltipProvider>
          </FrameworkProvider>
        </MobileMenuProvider>
      </NextThemesProvider>
    </JotaiProvider>
  );
}
