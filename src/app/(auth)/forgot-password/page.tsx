"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { forgotPassword } from "@/lib/api/password-reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={submitted ? "Check your email 📬" : "Forgot password? 🔑"}
      subtitle={
        submitted
          ? "We've sent instructions to your inbox"
          : "Enter your email to receive a password reset link"
      }
    >
      {submitted ? (
        /* ── Success State ── */
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-mint-50 border border-mint-200 text-mint-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-foreground">
              Reset instructions sent
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              If an account exists for <strong className="text-foreground">{email}</strong>, you will receive a secure password reset link shortly.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 text-[11px] text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or wait a few minutes before trying again.
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="w-full rounded-full font-bold text-xs"
            >
              Try a different email
            </Button>

            <Link href="/login" className="w-full">
              <Button
                variant="pill"
                size="sm"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
              >
                Back to login
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
            <label htmlFor="forgot-email" className="block text-xs font-extrabold text-foreground tracking-tight">
              Email address
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              id="forgot-password-submit"
              type="submit"
              variant="pill"
              size="lg"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm h-12 shadow-cta hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <>
                  <span>Send reset link</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to login</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
