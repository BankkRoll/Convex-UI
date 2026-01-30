"use client";

import dynamic from "next/dynamic";

const LoginForm = dynamic(
  () =>
    import(
      "@/registry/convex/blocks/password-based-auth-nextjs/components/login-form"
    ).then((mod) => mod.LoginForm),
  { ssr: false },
);

const PasswordBasedAuthDemo = () => {
  return <LoginForm />;
};

export default PasswordBasedAuthDemo;
