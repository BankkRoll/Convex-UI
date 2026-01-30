import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "../../components/forgot-password-form";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <ForgotPasswordForm />
    </div>
  );
}
