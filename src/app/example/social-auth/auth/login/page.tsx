"use client";

import dynamic from "next/dynamic";

const SocialLoginForm = dynamic(
  () =>
    import(
      "@/registry/convex/blocks/social-auth-nextjs/components/login-form"
    ).then((mod) => mod.SocialLoginForm),
  { ssr: false },
);

const SocialAuthDemo = () => {
  return <SocialLoginForm />;
};

export default SocialAuthDemo;
