"use client";

import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import { CurrentUserAvatar } from "@/registry/convex/blocks/current-user-avatar-nextjs/components/current-user-avatar";

export default function CurrentUserAvatarDemo() {
  return (
    <DemoAuthWrapper>
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-sm font-medium mb-2">Small</h3>
          <CurrentUserAvatar size="sm" />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Medium (default)</h3>
          <CurrentUserAvatar size="md" />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Large</h3>
          <CurrentUserAvatar size="lg" />
        </div>
      </div>
    </DemoAuthWrapper>
  );
}
