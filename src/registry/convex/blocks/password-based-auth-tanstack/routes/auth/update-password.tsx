import { createFileRoute } from "@tanstack/react-router";
import { UpdatePasswordForm } from "../../components/update-password-form";

export const Route = createFileRoute("/auth/update-password")({
  component: UpdatePasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: search.token as string | undefined,
    };
  },
});

function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
      <UpdatePasswordForm />
    </div>
  );
}
