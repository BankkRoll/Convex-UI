"use client";

import { useState } from "react";
import { LoginForm } from "@/registry/convex/blocks/password-based-auth-react/components/login-form";
import { SignUpForm } from "@/registry/convex/blocks/password-based-auth-react/components/sign-up-form";

export default function PasswordBasedAuthDemo() {
  const [view, setView] = useState<"login" | "signup">("login");

  return (
    <div className="flex min-h-[500px] items-center justify-center border-2 border-dashed rounded-lg p-4">
      {view === "login" ? (
        <LoginForm
          onSignUpClick={() => setView("signup")}
          onForgotPasswordClick={() => alert("Forgot password clicked")}
        />
      ) : (
        <SignUpForm
          onLoginClick={() => setView("login")}
          onSuccess={() => setView("login")}
        />
      )}
    </div>
  );
}
