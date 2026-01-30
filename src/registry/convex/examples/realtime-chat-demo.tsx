"use client";

import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import { RealtimeChat } from "@/registry/convex/blocks/realtime-chat-nextjs/components/realtime-chat";

interface RealtimeChatDemoProps {
  roomName?: string;
}

export default function RealtimeChatDemo({
  roomName = "demo-room",
}: RealtimeChatDemoProps) {
  return (
    <DemoAuthWrapper>
      <div className="h-[500px] w-full max-w-2xl mx-auto overflow-hidden">
        <RealtimeChat
          roomName={roomName}
          username={`User-${Math.floor(Math.random() * 1000)}`}
        />
      </div>
    </DemoAuthWrapper>
  );
}
