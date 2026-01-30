"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useEffect, useRef, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorData {
  position: CursorPosition;
  name: string;
  color: string;
}

interface UseRealtimeCursorsProps {
  roomName: string;
  username: string;
  userColor?: string;
  throttleMs?: number;
}

export interface Cursor {
  id: string;
  name: string;
  color: string;
  position: CursorPosition;
}

// Generate a unique session ID
// Important: Do NOT use localStorage as it's shared between iframes on the same domain,
// which would cause all instances to share the same sessionId and filter out each other's cursors
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useRealtimeCursors({
  roomName,
  username,
  userColor = "#3b82f6",
  throttleMs = 100,
}: UseRealtimeCursorsProps) {
  const [sessionId, setSessionId] = useState("");
  const presenceData = useQuery(api.presence.list, { roomId: roomName });
  const updatePresence = useMutation(api.presence.update);
  const leaveRoom = useMutation(api.presence.leave);
  const lastUpdateRef = useRef<number>(0);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  // Filter out current user's cursor and map to Cursor type
  const cursors: Cursor[] = (presenceData ?? [])
    .filter((p: any) => {
      // Must have position data
      if (!p.data?.position) return false;
      // Filter out current user's cursor (by sessionId)
      if (p.sessionId && p.sessionId === sessionId) return false;
      return true;
    })
    .map((p: any) => ({
      id: p._id,
      name: p.data.name || "Anonymous",
      color: p.data.color || "#888888",
      position: p.data.position!,
    }));

  const updateCursor = useCallback(
    (position: CursorPosition) => {
      if (!sessionId) return;

      const now = Date.now();
      if (now - lastUpdateRef.current < throttleMs) {
        return;
      }
      lastUpdateRef.current = now;

      const data: CursorData = {
        position,
        name: username,
        color: userColor,
      };
      updatePresence({ roomId: roomName, data, sessionId });
    },
    [updatePresence, roomName, username, userColor, throttleMs, sessionId],
  );

  // Create a mouse move handler that calculates container-relative position
  const createMouseMoveHandler = useCallback(
    (container: HTMLElement) => {
      containerRef.current = container;
      return (e: any) => {
        const rect = container.getBoundingClientRect();
        // Calculate position relative to container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        updateCursor({ x, y });
      };
    },
    [updateCursor],
  );

  // Set the container reference
  const setContainer = useCallback((container: any) => {
    containerRef.current = container;
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    return () => {
      leaveRoom({ roomId: roomName, sessionId });
    };
  }, [leaveRoom, roomName, sessionId]);

  return {
    cursors,
    updateCursor,
    createMouseMoveHandler,
    setContainer,
    isConnected: presenceData !== undefined,
    sessionId,
  };
}
