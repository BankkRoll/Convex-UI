"use client";

import dynamic from "next/dynamic";

const ForgotPasswordForm = dynamic(
  () =>
    import(
      "@/registry/convex/blocks/password-based-auth-nextjs/components/forgot-password-form"
    ).then((mod) => mod.ForgotPasswordForm),
  { ssr: false },
);

export default function Page() {
  return <ForgotPasswordForm />;
}
