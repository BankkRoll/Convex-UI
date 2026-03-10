"use client";

import Link from "next/link";
import { useFramework } from "@/context/framework-context";
import { cn } from "@/lib/utils";

interface FrameworkLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "href"> {
  /**
   * The page slug without framework prefix
   * e.g., "password-based-auth" instead of "nextjs/password-based-auth"
   */
  page: string;
  /**
   * Optional hash/anchor (e.g., "troubleshooting")
   */
  hash?: string;
  children: React.ReactNode;
}

/**
 * A context-aware Link that routes to the correct framework docs page.
 *
 * Usage in MDX:
 * <FrameworkLink page="password-based-auth">Auth docs</FrameworkLink>
 * <FrameworkLink page="password-based-auth" hash="troubleshooting">Troubleshooting</FrameworkLink>
 */
export function FrameworkLink({
  page,
  hash,
  children,
  className,
  ...props
}: FrameworkLinkProps) {
  const { framework } = useFramework();
  const href = `/ui/docs/${framework}/${page}${hash ? `#${hash}` : ""}`;

  return (
    <Link
      href={href}
      className={cn(
        "text-foreground underline decoration-1 decoration-foreground-muted underline-offset-4 transition-colors hover:decoration-brand hover:decoration-2",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
