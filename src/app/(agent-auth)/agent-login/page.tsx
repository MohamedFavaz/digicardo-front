"use client";

import * as React from "react";
import Link from "next/link";
import { agentLoginSchema } from "@/lib/zod/agent";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";

const AGENT_ASIDE = {
  title: "Make cards for your clients.",
  text: "Create and update client cards, order NFC cards and track your commission, all from the partner portal.",
  points: ["Client cards", "NFC orders", "Commission tracking"],
};

export default function AgentLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit() {
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    const parsed = agentLoginSchema.safeParse({ email: normalizedEmail, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bff/v1/agent/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password, remember: true }),
      });
      const json = await res.json();
      if (json.success) {
        window.location.href = "/agent/dashboard";
      } else {
        setError(json.message || json.error?.message || "Wrong email or password. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      badge="Partner portal"
      title="Agent sign in"
      subtitle="Sign in to manage your clients' cards"
      topLink={{ href: "/login", label: "Card owner sign in" }}
      aside={AGENT_ASIDE}
    >
      <SignInForm
        idPrefix="agent"
        identifierLabel="Agent email"
        identifierPlaceholder="agent@example.com"
        identifierType="email"
        identifier={email}
        password={password}
        onIdentifierChange={(v) => {
          setEmail(v);
          setError("");
        }}
        onPasswordChange={(v) => {
          setPassword(v);
          setError("");
        }}
        onSubmit={handleSubmit}
        submitting={loading}
        submitLabel="Sign in to partner portal"
        serverError={error}
        footer={
          <>
            Not an agent yet?{" "}
            <Link href="/#contact" className="font-medium text-primary hover:underline">
              Apply to become a partner
            </Link>
          </>
        }
      />
    </AuthLayout>
  );
}
