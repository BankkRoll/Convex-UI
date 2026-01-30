"use client";

import { AvatarStack } from "./avatar-stack";
import {
  useRealtimePresenceRoom,
  type PresenceUser,
} from "../hooks/use-realtime-presence-room";

interface RealtimeAvatarStackProps {
  roomName: string;
  user: {
    name: string;
    image?: string;
    color?: string;
  };
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RealtimeAvatarStack({
  roomName,
  user,
  maxVisible = 5,
  size = "md",
  className,
}: RealtimeAvatarStackProps) {
  const { users, isConnected, userCount } = useRealtimePresenceRoom({
    roomName,
    user,
  });

  const avatarUsers = users.map((u: PresenceUser) => ({
    id: u.id,
    name: u.name,
    image: u.image,
    color: u.color,
  }));

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <AvatarStack users={avatarUsers} maxVisible={maxVisible} size={size} />
      {userCount > 0 && (
        <span className="text-sm text-muted-foreground">
          {userCount} {userCount === 1 ? "user" : "users"} online
        </span>
      )}
      {!isConnected && (
        <span className="text-xs text-muted-foreground">(connecting...)</span>
      )}
    </div>
  );
}
