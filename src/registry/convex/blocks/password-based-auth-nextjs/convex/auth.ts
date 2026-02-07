import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Resend from "@auth/core/providers/resend";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { DataModel } from "./_generated/dataModel";

/**
 * Custom Resend provider for email verification OTP.
 *
 * Sends an 8-digit OTP code for email verification during sign-up.
 * Configure AUTH_RESEND_KEY environment variable to enable.
 */
const ResendOTP = Resend({
  id: "resend-otp-verification",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const code = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    return code;
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.AUTH_EMAIL_FROM ?? "onboarding@resend.dev",
        to: [email],
        subject: "Verify your email",
        text: `Your verification code is: ${token}\n\nThis code expires in 15 minutes.`,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not send verification email");
    }
  },
});

/**
 * Custom Resend provider for password reset OTP.
 *
 * Sends an 8-digit OTP code for password reset.
 * Configure AUTH_RESEND_KEY environment variable to enable.
 */
const ResendOTPPasswordReset = Resend({
  id: "resend-otp-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const code = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    return code;
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.AUTH_EMAIL_FROM ?? "onboarding@resend.dev",
        to: [email],
        subject: "Reset your password",
        text: `Your password reset code is: ${token}\n\nThis code expires in 15 minutes.`,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not send password reset email");
    }
  },
});

/**
 * Custom Password provider with:
 * - Email verification during sign-up (via ResendOTP)
 * - Password reset flow (via ResendOTPPasswordReset)
 * - Strong password requirements
 */
const CustomPassword = Password<DataModel>({
  // Require email verification during sign-up
  verify: ResendOTP,

  // Enable password reset via email
  reset: ResendOTPPasswordReset,

  // Custom password validation
  validatePasswordRequirements: (password: string) => {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
    }
  },

  // Customize profile to handle additional user fields
  profile(params) {
    return {
      email: params.email as string,
      name: (params.name as string) || undefined,
    };
  },
});

// Build providers list dynamically based on available env vars
const providers: Parameters<typeof convexAuth>[0]["providers"] = [
  CustomPassword,
];

// Only add GitHub if credentials are configured
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub);
}

// Only add Google if credentials are configured
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

/**
 * Convex Auth configuration.
 *
 * Features:
 * - Password authentication with email verification
 * - Password reset via OTP codes
 * - Strong password requirements
 * - Optional GitHub OAuth (if AUTH_GITHUB_ID/SECRET configured)
 * - Optional Google OAuth (if AUTH_GOOGLE_ID/SECRET configured)
 *
 * Environment variables:
 * - AUTH_RESEND_KEY: Resend API key for sending emails (required)
 * - AUTH_EMAIL_FROM: Sender email address (optional)
 * - AUTH_GITHUB_ID, AUTH_GITHUB_SECRET: GitHub OAuth (optional)
 * - AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET: Google OAuth (optional)
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers,
});
