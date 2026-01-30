"use client";

import { SocialLoginForm } from "@/registry/convex/blocks/social-auth-react/components/login-form";

export default function SocialAuthDemo() {
  return (
    <div className="flex min-h-[400px] items-center justify-center border-2 border-dashed rounded-lg p-4">
      <SocialLoginForm providers={["github", "google"]} />
    </div>
  );
}
