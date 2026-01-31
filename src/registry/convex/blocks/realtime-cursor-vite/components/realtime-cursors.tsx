"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Cursor } from "./cursor";
import { useRealtimeCursors } from "../hooks/use-realtime-cursors";

interface RealtimeCursorsProps {
  roomName: string;
  username: string;
  userColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function RealtimeCursors({
  roomName,
  username,
  userColor,
  children,
  className,
}: RealtimeCursorsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cursors, createMouseMoveHandler, setContainer, isConnected } =
    useRealtimeCursors({
      roomName,
      username,
      userColor,
    });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set container reference for coordinate calculations
    setContainer(container);

    // Create handler that calculates container-relative positions
    const handleMove = createMouseMoveHandler(container);

    container.addEventListener("mousemove", handleMove);
    return () => {
      container.removeEventListener("mousemove", handleMove);
      setContainer(null);
    };
  }, [createMouseMoveHandler, setContainer]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      {children}
      <AnimatePresence>
        {cursors.map((cursor) => (
          <Cursor
            key={cursor.id}
            name={cursor.name}
            color={cursor.color}
            position={cursor.position}
          />
        ))}
      </AnimatePresence>
      {!isConnected && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Connecting...
        </div>
      )}
    </div>
  );
}
