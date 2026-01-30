"use client";

import { useMemo } from "react";
import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import { RealtimeAvatarStack } from "@/registry/convex/blocks/realtime-avatar-stack-nextjs/components/realtime-avatar-stack";

// Random colors for demo users
const colors = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export default function RealtimeAvatarStackDemo() {
  const user = useMemo(
    () => ({
      name: `User-${Math.floor(Math.random() * 1000)}`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }),
    [],
  );

  return (
    <DemoAuthWrapper>
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-sm font-medium mb-2">Small</h3>
          <RealtimeAvatarStack
            roomName="avatar-demo-room"
            user={user}
            size="sm"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Medium (default)</h3>
          <RealtimeAvatarStack
            roomName="avatar-demo-room"
            user={user}
            size="md"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Large</h3>
          <RealtimeAvatarStack
            roomName="avatar-demo-room"
            user={user}
            size="lg"
          />
        </div>
      </div>
    </DemoAuthWrapper>
  );
}
