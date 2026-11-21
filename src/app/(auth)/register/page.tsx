"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AlertCircle, ArrowRight, AtSign, Building2, CheckCircle2, Clock, Loader2, Mail, Phone, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";

/** One labelled field with an icon, matching the sign-in form. */
function Field({
  id,
  label,
  optional,
  icon: Icon,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-foreground">
        {label}
        {optional && <span className="text-xs font-normal text-muted-foreground">Optional</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
        {children}
      </div>
      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

const inputCls = (error?: string) => cn("h-11 pl-10 text-[15px]", error && "border-destructive focus-visible:ring-destructive/20");

/** Public "request access" form (self sign-up is off: an admin or partner creates the account). */
export default function RequestAccessPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [organization, setOrganization] = React.useState("");
  const [desiredHandle, setDesiredHandle] = React.useState("");
  const [useCase, setUseCase] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  // "Claim your card" on the home page passes the wanted username as ?handle=
  React.useEffect(() => {
    const handle = new URLSearchParams(window.location.search).get("handle");
    if (handle) setDesiredHandle(handle.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30));
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  const clearError = (key: string) => setFieldErrors((f) => (f[key] ? { ...f, [key]: "" } : f));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const local: Record<string, string> = {};
    if (!fullName.trim()) local.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) local.email = "Please enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 7) local.phone = "Please enter your mobile number with country code.";
    setFieldErrors(local);
    if (Object.keys(local).length) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bff/v1/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          business_name: organization.trim() || undefined,
          desired_username: desiredHandle.trim() || undefined,
          message: useCase.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const details = json?.error?.details as Record<string, string[] | string> | undefined;
        if (details && typeof details === "object") {
          const pick = (v: string[] | string | undefined) => (Array.isArray(v) ? v[0] : v) || "";
          const mapped: Record<string, string> = {
            name: pick(details.name),
            email: pick(details.email),
            phone: pick(details.phone ?? details.mobile),
            handle: pick(details.desired_username ?? details.desired_handle),
            organization: pick(details.business_name),
          };
          setFieldErrors(mapped);
          if (!Object.values(mapped).some(Boolean)) setError(pick(Object.values(details)[0]) || "Please check the form.");
        } else {
          setError(json?.error?.message || "Couldn't send your request. Please try again.");
        }
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network problem. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout title="Request sent" subtitle="We'll be in touch soon.">
        <div className="space-y-6">
          <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-emerald-900">Thank you, {fullName.trim().split(/\s+/)[0]}!</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                We&apos;ve received your request
                {desiredHandle && (
                  <>
                    {" "}for <span className="font-semibold">@{desiredHandle}</span>
                  </>
                )}
                . Our team will set up your card and send your sign-in details to <span className="font-semibold">{email.trim()}</span>.
              </p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" /> Usually within one working day.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/login">
              <Button size="lg" className="h-11 w-full gap-2">
                Go to sign in <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="h-11 w-full">
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Get your Digicardo" subtitle="Tell us about you and we'll set up your card. Your sign-in details arrive by email.">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <section className="space-y-4" aria-labelledby="req-you">
          <p id="req-you" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Your details
          </p>
          <Field id="req-name" label="Full name" icon={User} error={fieldErrors.name}>
            <Input
              id="req-name"
              autoComplete="name"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearError("name");
              }}
              aria-invalid={!!fieldErrors.name}
              className={inputCls(fieldErrors.name)}
            />
          </Field>
          <Field id="req-email" label="Email" icon={Mail} error={fieldErrors.email} hint="Your sign-in details are sent here.">
            <Input
              id="req-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              aria-invalid={!!fieldErrors.email}
              className={inputCls(fieldErrors.email)}
            />
          </Field>
          <Field id="req-phone" label="Mobile / WhatsApp" icon={Phone} error={fieldErrors.phone}>
            <Input
              id="req-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearError("phone");
              }}
              aria-invalid={!!fieldErrors.phone}
              className={inputCls(fieldErrors.phone)}
            />
          </Field>
        </section>

        <section className="space-y-4 border-t border-border pt-6" aria-labelledby="req-card">
          <p id="req-card" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Your card
          </p>
          <Field id="req-org" label="Business or brand name" optional icon={Building2} error={fieldErrors.organization}>
            <Input
              id="req-org"
              autoComplete="organization"
              placeholder="e.g. Verma Interiors"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                clearError("organization");
              }}
              className={inputCls(fieldErrors.organization)}
            />
          </Field>
          <Field
            id="req-handle"
            label="Card address you'd like"
            optional
            icon={AtSign}
            error={fieldErrors.handle}
            hint={
              desiredHandle ? (
                <>
                  Your card: <span className="font-medium text-foreground">digicardo.in/{desiredHandle}</span>
                </>
              ) : (
                "Letters, numbers, - and _ only."
              )
            }
          >
            <Input
              id="req-handle"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="yourname"
              value={desiredHandle}
              onChange={(e) => {
                setDesiredHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30));
                clearError("handle");
              }}
              aria-invalid={!!fieldErrors.handle}
              className={inputCls(fieldErrors.handle)}
            />
          </Field>
          <Field id="req-usecase" label="Anything we should know?" optional>
            <textarea
              id="req-usecase"
              rows={3}
              maxLength={2000}
              placeholder="e.g. A card for my salon, 5 cards for my team, NFC cards…"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="block w-full resize-none rounded-lg border border-input bg-card px-3.5 py-2.5 text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
        </section>

        <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" /> Request my card
            </>
          )}
        </Button>

        <p className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
