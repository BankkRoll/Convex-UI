"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

/**
 * Props for the LogoutButton component.
 *
 * Extends all standard Button props with additional customization options.
 *
 * @property showIcon - Whether to show the logout icon (default: true)
 * @property onLogout - Optional callback invoked after successful logout
 */
interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  showIcon?: boolean;
  onLogout?: () => void;
}

/**
 * LogoutButton component for signing out the current user.
 *
 * Uses Convex Auth's signOut action to clear the session.
 * Fully customizable through standard Button props.
 *
 * @example
 * // Basic usage
 * <LogoutButton />
 *
 * @example
 * // Custom styling and callback
 * <LogoutButton
 *   variant="destructive"
 *   showIcon={false}
 *   onLogout={() => navigate("/login")}
 * >
 *   Log out now
 * </LogoutButton>
 */
export function LogoutButton({
  showIcon = true,
  onLogout,
  children,
  ...props
}: LogoutButtonProps) {
  const { signOut } = useAuthActions();

  const handleClick = async () => {
    await signOut();
    onLogout?.();
  };

  return (
    <Button onClick={handleClick} {...props}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children ?? "Sign out"}
    </Button>
  );
}
