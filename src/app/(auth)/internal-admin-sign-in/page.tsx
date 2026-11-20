"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoginSchema } from "@/lib/validation/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";
import { ApiClientError } from "@/lib/api/errors";

const ADMIN_ASIDE = {
  title: "Run Digicardo from one place.",
  text: "Approve access requests, manage accounts and plans, and look after your partner agents.",
  points: ["Access requests", "Accounts & plans", "Agents & payouts"],
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout, isAuthenticated, user } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<{ identifier?: string; password?: string }>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Already signed in as an admin: go straight to the console.
  React.useEffect(() => {
    if (isAuthenticated && user?.role === "admin") router.replace("/admin/dashboard");
  }, [isAuthenticated, user, router]);

  const handleSubmit = async () => {
    setServerError(null);
    const parsed = LoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors: { identifier?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "email") errors.identifier = issue.message;
        if (issue.path[0] === "password") errors.password = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const signedIn = await login(parsed.data);
      if (signedIn?.role === "admin") {
        window.location.href = "/admin/dashboard";
        return;
      }
      // Not an admin: don't leave them signed in on the admin page.
      await logout();
      setServerError("This account doesn't have admin access. Card owners sign in on the regular sign-in page.");
    } catch (err: unknown) {
      const message = err instanceof ApiClientError || err instanceof Error ? err.message : "";
      setServerError(
        !message || /unauthenticated|invalid/i.test(message)
          ? "Wrong email or password. Please try again."
          : message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Admin"
      title="Admin sign in"
      subtitle="Sign in to the Digicardo admin console"
      topLink={{ href: "/login", label: "Card owner sign in" }}
      aside={ADMIN_ASIDE}
    >
      <SignInForm
        idPrefix="admin"
        identifierLabel="Admin email"
        identifierPlaceholder="admin@company.com"
        identifier={email}
        password={password}
        onIdentifierChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Sign in to admin"
        serverError={serverError}
        fieldErrors={fieldErrors}
        footer={
          <>
            Not an admin?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Go to the regular sign in
            </Link>
          </>
        }
      />
    </AuthLayout>
  );
}
