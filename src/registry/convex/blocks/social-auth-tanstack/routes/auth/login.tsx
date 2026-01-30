import { createFileRoute } from "@tanstack/react-router";
import { SocialLoginForm } from "../../components/login-form";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <SocialLoginForm />
    </div>
  );
}
