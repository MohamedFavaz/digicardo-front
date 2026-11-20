"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { cn } from "@/lib/utils";

/**
 * The one sign-in form used by card owners (/login), admins (hidden ADMIN_LOGIN_PATH page) and agents
 * (/agent-login). Each page owns the submit logic; this only renders the fields.
 */
export interface SignInFormProps {
  idPrefix: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  identifierType?: "text" | "email";
  identifier: string;
  password: string;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  submitLabel: string;
  serverError?: string | null;
  fieldErrors?: { identifier?: string; password?: string };
  forgotHref?: string;
  footer?: React.ReactNode;
}

export function SignInForm({
  idPrefix,
  identifierLabel,
  identifierPlaceholder,
  identifierType = "text",
  identifier,
  password,
  onIdentifierChange,
  onPasswordChange,
  onSubmit,
  submitting,
  submitLabel,
  serverError,
  fieldErrors = {},
  forgotHref = "/forgot-password",
  footer,
}: SignInFormProps) {
  const identifierId = `${idPrefix}-email`;
  const passwordId = `${idPrefix}-password`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
      noValidate
    >
      {serverError && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor={identifierId} className="block text-sm font-medium text-foreground">
          {identifierLabel}
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id={identifierId}
            type={identifierType}
            placeholder={identifierPlaceholder}
            autoComplete={identifierType === "email" ? "email" : "username"}
            disabled={submitting}
            value={identifier}
            onChange={(e) => onIdentifierChange(e.target.value)}
            aria-invalid={fieldErrors.identifier ? true : undefined}
            className={cn("pl-10")}
          />
        </div>
        {fieldErrors.identifier && <p className="text-xs font-medium text-destructive">{fieldErrors.identifier}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={passwordId} className="block text-sm font-medium text-foreground">
            Password
          </label>
          {forgotHref && (
            <Link href={forgotHref} className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          )}
        </div>
        <PasswordInput
          id={passwordId}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={submitting}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          error={fieldErrors.password}
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="h-11 w-full gap-2">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      {footer && <div className="border-t border-border pt-5 text-center text-sm text-muted-foreground">{footer}</div>}
    </form>
  );
}
