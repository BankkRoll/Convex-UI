"use client";

import { useMemo } from "react";
import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import { RealtimeCursors } from "@/registry/convex/blocks/realtime-cursor-nextjs/components/realtime-cursors";
import { generateRandomUser } from "@/lib/random-name";

interface RealtimeCursorDemoProps {
  roomName?: string;
}

export default function RealtimeCursorDemo({
  roomName = "cursor-demo",
}: RealtimeCursorDemoProps) {
  // Generate a random user identity that persists for this session
  const user = useMemo(() => generateRandomUser(), []);

  return (
    <DemoAuthWrapper>
      <RealtimeCursors
        roomName={roomName}
        username={user.name}
        userColor={user.color}
        className="h-[400px] w-full border rounded-lg bg-muted/20 cursor-crosshair"
      >
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Move your cursor here
        </div>
      </RealtimeCursors>
    </DemoAuthWrapper>
  );
}
