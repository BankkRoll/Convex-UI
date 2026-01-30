"use client";

import dynamic from "next/dynamic";

const SignUpForm = dynamic(
  () =>
    import(
      "@/registry/convex/blocks/password-based-auth-nextjs/components/sign-up-form"
    ).then((mod) => mod.SignUpForm),
  { ssr: false },
);

const PasswordBasedAuthDemo = () => {
  return <SignUpForm />;
};

export default PasswordBasedAuthDemo;
