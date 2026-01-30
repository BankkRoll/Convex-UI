"use client";

import dynamic from "next/dynamic";

const UpdatePasswordForm = dynamic(
  () =>
    import(
      "@/registry/convex/blocks/password-based-auth-nextjs/components/update-password-form"
    ).then((mod) => mod.UpdatePasswordForm),
  { ssr: false },
);

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
