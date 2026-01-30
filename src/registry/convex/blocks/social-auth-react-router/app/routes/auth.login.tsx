import { SocialLoginForm } from "../../components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
      <SocialLoginForm />
    </div>
  );
}
