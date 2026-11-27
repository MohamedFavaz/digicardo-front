"use client";

import * as React from "react";
import { franchiseLoginSchema } from "@/lib/zod/franchise";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";

const ASIDE = {
  title: "Your franchise, your team.",
  text: "Owners see every card, every staff member and every rupee of commission. Staff make cards and track their own earnings.",
  points: ["Cards by staff", "Commission tracking", "Staff payouts"],
};

export default function FranchiseLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit() {
    setError("");
    const identifier = email.trim().toLowerCase();
    const parsed = franchiseLoginSchema.safeParse({ email: identifier, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check your details.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bff/v1/franchise/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: identifier, password, remember: true }),
      });
      const json = await res.json().catch(() => null);
      if (json?.success) window.location.href = "/franchise/dashboard";
      else setError(json?.error?.message || json?.message || "Wrong email or password. Please try again.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      badge="Franchise"
      title="Franchise sign in"
      subtitle="For franchise owners and their staff"
      topLink={{ href: "/login", label: "Card owner sign in" }}
      aside={ASIDE}
    >
      <SignInForm
        idPrefix="franchise"
        identifierLabel="Email or mobile number"
        identifierPlaceholder="you@example.com"
        identifierType="text"
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
        submitLabel="Sign in"
        serverError={error}
        footer={<>Staff: ask your franchise owner for your login.</>}
      />
    </AuthLayout>
  );
}
