"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft, AlertCircle, ArrowRight } from "lucide-react";
import { resetPassword } from "@/lib/api/password-reset";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token || !email) {
      setError("Invalid or missing reset link. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match. Please verify both inputs.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password.";
      setError(
        msg.includes("INVALID_OR_EXPIRED")
          ? "This reset link is invalid or has expired. Please request a new one."
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <AuthLayout
        title="Invalid reset link ⚠️"
        subtitle="This link has expired or has already been used"
      >
        <div className="text-center space-y-4 py-3">
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Password reset links are valid for a single use and expire after 60 minutes for your security.
          </p>
          <Link href="/forgot-password" className="block pt-2">
            <Button
              variant="pill"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs h-11"
            >
              Request a new reset link
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={success ? "Password updated! 🎉" : "Set new password 🔒"}
      subtitle={
        success
          ? "Your password has been changed successfully"
          : `Create a new password for ${email}`
      }
    >
      {success ? (
        /* ── Success State ── */
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-mint-50 border border-mint-200 text-mint-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-foreground">
              Ready to sign in
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              You will be redirected to the login page in a few seconds...
            </p>
          </div>

          <div className="pt-2">
            <Link href="/login" className="w-full">
              <Button
                variant="pill"
                size="sm"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs h-11 gap-1.5"
              >
                <span>Go to login now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* ── Form State ── */
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="rounded-2xl border border-coral/30 bg-coral-50/20 p-3.5 text-xs text-coral font-bold flex items-start gap-2.5 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="reset-password" className="block text-xs font-extrabold text-foreground tracking-tight">
              New password
            </label>
            <PasswordInput
              id="reset-password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reset-password-confirm" className="block text-xs font-extrabold text-foreground tracking-tight">
              Confirm new password
            </label>
            <PasswordInput
              id="reset-password-confirm"
              placeholder="Repeat new password"
              autoComplete="new-password"
              disabled={isLoading}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button
              id="reset-password-submit"
              type="submit"
              variant="pill"
              size="lg"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm h-12 shadow-cta hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <span>Update password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Request a new link</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
