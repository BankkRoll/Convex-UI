"use client";

import { useMemo } from "react";
import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import { RealtimeAvatarStack } from "@/registry/convex/blocks/realtime-avatar-stack-nextjs/components/realtime-avatar-stack";
import { generateRandomUser } from "@/lib/random-name";

export default function RealtimeAvatarStackDemo() {
  // Generate a random user identity that persists for this session
  const user = useMemo(() => generateRandomUser(), []);

  return (
    <DemoAuthWrapper>
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-sm font-medium mb-2">Small</h3>
          <RealtimeAvatarStack
            roomName="avatar-stack-demo"
            user={user}
            size="sm"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Medium (default)</h3>
          <RealtimeAvatarStack
            roomName="avatar-stack-demo"
            user={user}
            size="md"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Large</h3>
          <RealtimeAvatarStack
            roomName="avatar-stack-demo"
            user={user}
            size="lg"
          />
        </div>
      </div>
    </DemoAuthWrapper>
  );
}
