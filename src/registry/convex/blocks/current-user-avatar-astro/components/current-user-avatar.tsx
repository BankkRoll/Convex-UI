"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrentUserImage } from "../hooks/use-current-user-image";
import { useCurrentUserName } from "../hooks/use-current-user-name";

interface CurrentUserAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showFallback?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CurrentUserAvatar({
  size = "md",
  className,
  showFallback = true,
}: CurrentUserAvatarProps) {
  const image = useCurrentUserImage();
  const name = useCurrentUserName();

  // Loading state
  if (image === undefined || name === undefined) {
    return (
      <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
    );
  }

  // Not authenticated
  if (!showFallback && !image && !name) {
    return null;
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
