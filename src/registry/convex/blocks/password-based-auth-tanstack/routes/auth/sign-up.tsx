import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "../../components/sign-up-form";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <SignUpForm />
    </div>
  );
}
