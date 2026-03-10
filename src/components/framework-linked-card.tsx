"use client";

import Link from "next/link";
import { useFramework } from "@/context/framework-context";
import { cn } from "@/lib/utils";

interface FrameworkLinkedCardProps
  extends Omit<React.ComponentProps<typeof Link>, "href"> {
  /**
   * The page slug without framework prefix
   * e.g., "password-based-auth" instead of "nextjs/password-based-auth"
   */
  page: string;
  children: React.ReactNode;
}

/**
 * A context-aware LinkedCard that routes to the correct framework docs page.
 *
 * Usage in MDX:
 * <FrameworkLinkedCard page="password-based-auth">
 *   <Icon />
 *   <span>Add Authentication</span>
 * </FrameworkLinkedCard>
 */
export function FrameworkLinkedCard({
  page,
  children,
  className,
  ...props
}: FrameworkLinkedCardProps) {
  const { framework } = useFramework();
  const href = `/ui/docs/${framework}/${page}`;

  return (
    <Link
      href={href}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-xl border bg-surface-100 text-card-background py-6 px-4 shadow-sm transition-colors hover:bg-muted/50 sm:p-10 h-52",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
