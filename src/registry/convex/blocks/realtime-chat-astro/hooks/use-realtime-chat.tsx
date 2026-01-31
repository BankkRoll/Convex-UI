"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useEffect, useState } from "react";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

// Get or create a session ID for demo mode
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("demo-session-id");
  if (!id) {
    id = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("demo-session-id", id);
  }
  return id;
}

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const [sessionId, setSessionId] = useState("");
  const rawMessages = useQuery(api.messages.list, { roomId: roomName });
  const sendMutation = useMutation(api.messages.send);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const messages: ChatMessage[] = (rawMessages ?? []).map((msg: any) => ({
    id: msg._id,
    content: msg.content,
    user: {
      name: msg.userName,
    },
    createdAt: new Date(msg._creationTime).toISOString(),
  }));

  const sendMessage = useCallback(
    async (content: string) => {
      await sendMutation({
        roomId: roomName,
        content,
        userName: username,
        sessionId,
      });
    },
    [sendMutation, roomName, username, sessionId],
  );

  const isConnected = rawMessages !== undefined;

  return { messages, sendMessage, isConnected };
}
