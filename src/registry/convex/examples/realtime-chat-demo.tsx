"use client";

import { useMemo } from "react";
import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import { RealtimeChat } from "@/registry/convex/blocks/realtime-chat-nextjs/components/realtime-chat";
import { generateRandomName } from "@/lib/random-name";

interface RealtimeChatDemoProps {
  roomName?: string;
}

export default function RealtimeChatDemo({
  roomName = "chat-demo",
}: RealtimeChatDemoProps) {
  // Generate a random username that persists for this session
  const username = useMemo(() => generateRandomName(), []);

  return (
    <DemoAuthWrapper>
      <div className="h-[500px] w-full max-w-2xl mx-auto overflow-hidden">
        <RealtimeChat roomName={roomName} username={username} />
      </div>
    </DemoAuthWrapper>
  );
}
