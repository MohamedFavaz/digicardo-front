"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoginSchema } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ApiClientError } from "@/lib/api/errors";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Redirect if already authenticated — admins go to their own panel
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(returnUrl);
      }
    }
  }, [isAuthenticated, user, router, returnUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path) formattedErrors[path] = issue.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(result.data);
      // Admins always go to their own panel — ignore returnUrl
      if (loggedInUser?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(returnUrl === "/dashboard" || !returnUrl ? "/dashboard" : returnUrl);
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        const msg = err.message;
        if (
          msg === "Unauthenticated." ||
          msg.toLowerCase().includes("unauthenticated") ||
          msg.toLowerCase().includes("invalid email") ||
          msg.toLowerCase().includes("invalid credentials")
        ) {
          setServerError("Invalid email, username, or password. Please check your credentials and try again.");
        } else if (err.details && Object.keys(err.details).length > 0) {
          const detailMsgs = Object.values(err.details).flat().join(" ");
          setServerError(detailMsgs || msg);
        } else {
          setServerError(msg);
        }
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("We couldn't sign you in. Please check your email or username and password and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Digicardo account"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* Server Error Alert Banner */}
        {serverError && (
          <div className="rounded-2xl border border-coral/30 bg-coral-50/20 p-3.5 text-xs text-coral font-bold flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{serverError}</span>
          </div>
        )}

        {/* Email or Username Field */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-extrabold text-foreground tracking-tight">
            Email or Username
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Mail className="w-4 h-4" />
            </div>
            <Input
              id="login-email"
              type="text"
              placeholder="you@example.com or username"
              autoComplete="username"
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn("pl-10", fieldErrors.email && "border-coral focus-visible:border-coral focus-visible:ring-coral/20 bg-coral-50/10")}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-[11px] font-bold text-coral flex items-center gap-1">
              <span>•</span> {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-xs font-extrabold text-foreground tracking-tight">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isSubmitting}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm h-11 rounded-lg gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Request Access Notice */}
        <div className="pt-3 text-center border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            Need an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Request Access
            </Link>{" "}
            from your administrator.
          </p>
        </div>

      </form>
    </AuthLayout>
  );
}
