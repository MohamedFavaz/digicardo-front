"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoginSchema } from "@/lib/validation/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";
import { ApiClientError } from "@/lib/api/errors";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { login, logout, isAuthenticated, user } = useAuth();
  // True while a sign-in from this form is being checked (stops the redirect below from racing it).
  const submittingRef = React.useRef(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Redirect if already authenticated — admins and agents go to their own portals
  React.useEffect(() => {
    if (submittingRef.current) return;
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "agent") {
        router.push("/agent/dashboard");
      } else {
        router.push(returnUrl);
      }
    }
  }, [isAuthenticated, user, router, returnUrl]);

  const handleSubmit = async () => {
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
    submittingRef.current = true;
    try {
      const loggedInUser = await login(result.data);
      // Admins sign in only on the hidden admin page. Here an admin account is treated exactly
      // like wrong credentials, so this page never reveals that the account exists or is an admin.
      if (loggedInUser?.role === "admin") {
        await logout().catch(() => undefined);
        setServerError("Invalid email, username, or password. Please check your credentials and try again.");
        return;
      }
      // Route users to their dedicated portal based on their role
      if (loggedInUser?.role === "agent") {
        window.location.href = "/agent/dashboard";
      } else {
        window.location.href = returnUrl === "/dashboard" || !returnUrl ? "/dashboard" : returnUrl;
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
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Digicardo account">
      <SignInForm
        idPrefix="login"
        identifierLabel="Email or username"
        identifierPlaceholder="you@example.com or username"
        identifier={email}
        password={password}
        onIdentifierChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        submitting={isSubmitting}
        submitLabel="Sign in"
        serverError={serverError}
        fieldErrors={{ identifier: fieldErrors.email, password: fieldErrors.password }}
        footer={
          <>
            Need an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Request access
            </Link>
          </>
        }
      />
    </AuthLayout>
  );
}
