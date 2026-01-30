"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useEffect, useRef, useState } from "react";

interface UserPresence {
  name: string;
  image?: string;
  color?: string;
}

interface UseRealtimePresenceRoomProps {
  roomName: string;
  user: UserPresence;
  heartbeatMs?: number;
}

export interface PresenceUser {
  id: string;
  name: string;
  image?: string;
  color?: string;
}

// Generate a unique session ID per component instance
// Important: Do NOT use localStorage as it's shared between iframes/tabs on the same domain,
// which would cause all instances to share the same sessionId and filter out each other
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useRealtimePresenceRoom({
  roomName,
  user,
  heartbeatMs = 10000,
}: UseRealtimePresenceRoomProps) {
  const [sessionId, setSessionId] = useState("");
  const presenceData = useQuery(api.presence.list, { roomId: roomName });
  const updatePresence = useMutation(api.presence.update);
  const leaveRoom = useMutation(api.presence.leave);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  const users: PresenceUser[] = (presenceData ?? []).map((p: any) => ({
    id: p._id,
    name: p.data?.name || "Anonymous",
    image: p.data?.userImage,
    color: p.data?.color,
  }));

  const join = useCallback(() => {
    if (!sessionId) return;
    updatePresence({
      roomId: roomName,
      data: {
        name: user.name,
        userImage: user.image,
        color: user.color,
      },
      sessionId,
    });
  }, [updatePresence, roomName, user, sessionId]);

  const leave = useCallback(() => {
    if (!sessionId) return;
    leaveRoom({ roomId: roomName, sessionId });
  }, [leaveRoom, roomName, sessionId]);

  // Join room on mount and set up heartbeat
  useEffect(() => {
    if (!sessionId) return;

    join();

    heartbeatRef.current = setInterval(() => {
      join();
    }, heartbeatMs);

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      leave();
    };
  }, [join, leave, heartbeatMs, sessionId]);

  return {
    users,
    isConnected: presenceData !== undefined,
    userCount: users.length,
  };
}
