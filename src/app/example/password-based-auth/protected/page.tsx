"use client";

import dynamic from "next/dynamic";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

const LogoutButton = dynamic(
  () =>
    import(
      "@/registry/convex/blocks/password-based-auth-nextjs/components/logout-button"
    ).then((mod) => mod.LogoutButton),
  { ssr: false },
);

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    redirect("/example/password-based-auth/auth/login");
  }

  return (
    <>
      <p>You are logged in!</p>
      <LogoutButton />
    </>
  );
}
