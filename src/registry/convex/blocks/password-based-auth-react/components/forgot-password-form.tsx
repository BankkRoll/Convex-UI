"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

/**
 * Props for the ForgotPasswordForm component.
 *
 * @property onBackToLoginClick - Callback when user clicks "Back to login"
 * @property onEnterCodeClick - Callback when user clicks "Enter reset code" after success.
 *   Receives the email address to pass along to the update password form.
 */
interface ForgotPasswordFormProps {
  onBackToLoginClick?: () => void;
  onEnterCodeClick?: (email: string) => void;
}

/**
 * ForgotPasswordForm component for requesting password reset.
 *
 * Per Convex Auth docs, submits with flow: "reset" which triggers
 * the ResendOTPPasswordReset provider to send an OTP code via email.
 *
 * After successful submission, displays a success message and provides
 * callbacks for navigation (since this is framework-agnostic).
 */
export function ForgotPasswordForm({
  onBackToLoginClick,
  onEnterCodeClick,
}: ForgotPasswordFormProps) {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("flow", "reset");

      await signIn("password", formData);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset code",
      );
    } finally {
      setLoading(false);
    }
  };

  // Success state - show confirmation and navigation options
  if (success) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a password reset code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          Enter the 8-digit code from your email to reset your password.
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {onEnterCodeClick && (
            <Button onClick={() => onEnterCodeClick(email)} className="w-full">
              Enter reset code
            </Button>
          )}
          {onBackToLoginClick && (
            <Button
              variant="outline"
              onClick={onBackToLoginClick}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a code to reset your password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert
              variant="destructive"
              className="animate-in fade-in-0 slide-in-from-top-1 duration-300"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Send reset code
          </Button>
          {onBackToLoginClick && (
            <Button
              type="button"
              variant="ghost"
              onClick={onBackToLoginClick}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
