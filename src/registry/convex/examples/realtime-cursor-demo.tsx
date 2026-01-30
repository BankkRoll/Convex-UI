"use client";

import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import { RealtimeCursors } from "@/registry/convex/blocks/realtime-cursor-nextjs/components/realtime-cursors";

const userColors: Record<string, string> = {
  left: "#3b82f6", // Blue
  right: "#ef4444", // Red
};

interface RealtimeCursorDemoProps {
  roomName?: string;
  userId?: string;
}

export default function RealtimeCursorDemo({
  roomName = "demo-cursor-room",
  userId,
}: RealtimeCursorDemoProps) {
  const username = userId
    ? `User ${userId}`
    : `User-${Math.floor(Math.random() * 1000)}`;
  const userColor =
    userId && userColors[userId] ? userColors[userId] : "#3b82f6";

  return (
    <DemoAuthWrapper>
      <RealtimeCursors
        roomName={roomName}
        username={username}
        userColor={userColor}
        className="h-[400px] w-full border rounded-lg bg-muted/20 cursor-crosshair"
      >
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Move your cursor here
        </div>
      </RealtimeCursors>
    </DemoAuthWrapper>
  );
}
