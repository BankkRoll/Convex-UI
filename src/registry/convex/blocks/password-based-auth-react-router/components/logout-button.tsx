"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline-solid"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function LogoutButton({
  variant = "outline",
  size = "default",
  className,
  showIcon = true,
  children,
}: LogoutButtonProps) {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4 mr-2" />}
          {children || "Sign out"}
        </>
      )}
    </Button>
  );
}
