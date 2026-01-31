"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  showIcon?: boolean;
}

export function LogoutButton({
  showIcon = true,
  children,
  ...props
}: LogoutButtonProps) {
  const { signOut } = useAuthActions();

  return (
    <Button onClick={() => signOut()} {...props}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children ?? "Sign out"}
    </Button>
  );
}
