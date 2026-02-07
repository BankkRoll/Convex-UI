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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";

/**
 * UpdatePasswordForm component for completing password reset.
 *
 * Supports OTP code flow per Convex Auth docs.
 * User enters the 8-digit code received via email + new password.
 *
 * Per Convex Auth docs, the form submits:
 * - code: The verification code
 * - email: The user's email address
 * - newPassword: The new password
 * - flow: "reset-verification"
 */
export function UpdatePasswordForm() {
  const { signIn } = useAuthActions();
  const search = useSearch({ strict: false }) as { email?: string };
  const emailParam = search.email;

  const [email, setEmail] = useState(emailParam ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!code) {
      setError("Verification code is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("code", code);
      formData.set("email", email);
      formData.set("newPassword", password);
      formData.set("flow", "reset-verification");

      await signIn("password", formData);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-center">
            Password updated
          </CardTitle>
          <CardDescription className="text-center">
            Your password has been successfully updated
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link to="/auth/login">Continue to login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl">Set new password</CardTitle>
        <CardDescription>
          Enter the code from your email and your new password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {error && (
            <Alert
              variant="destructive"
              className="animate-in fade-in-0 slide-in-from-top-1 duration-300"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!emailParam && (
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
          )}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-semibold">
              Verification Code
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 8-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading}
              maxLength={8}
              pattern="[0-9]{8}"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Update password
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link to="/auth/forgot-password">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Request new code
            </Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
