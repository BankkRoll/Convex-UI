"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

/**
 * Props for the LogoutButton component.
 * Extends all standard Button props for full customization.
 */
interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  /** Whether to display the logout icon. Defaults to true. */
  showIcon?: boolean;
  /** Optional callback invoked after successful sign out. */
  onLogout?: () => void;
}

/**
 * A reusable logout button component for React applications using Convex Auth.
 * Handles the sign-out flow and provides optional callback support.
 *
 * @example
 * // Basic usage
 * <LogoutButton />
 *
 * @example
 * // With callback and custom styling
 * <LogoutButton
 *   onLogout={() => navigate('/login')}
 *   variant="destructive"
 *   showIcon={false}
 * >
 *   Log out
 * </LogoutButton>
 */
export function LogoutButton({
  showIcon = true,
  onLogout,
  children,
  ...props
}: LogoutButtonProps) {
  const { signOut } = useAuthActions();

  /**
   * Handles the sign-out process.
   * Signs the user out via Convex Auth, then invokes the optional callback.
   */
  const handleLogout = async () => {
    await signOut();
    onLogout?.();
  };

  return (
    <Button onClick={handleLogout} {...props}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children ?? "Sign out"}
    </Button>
  );
}
