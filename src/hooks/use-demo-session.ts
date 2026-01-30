"use client";

import { useEffect, useState } from "react";

/**
 * Hook that provides a stable session ID for demo mode.
 * This allows tracking user data without requiring authentication.
 */
export function useDemoSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session ID in localStorage
    let id = localStorage.getItem("demo-session-id");

    if (!id) {
      // Generate a new session ID
      id = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("demo-session-id", id);
    }

    setSessionId(id);
  }, []);

  return sessionId;
}
