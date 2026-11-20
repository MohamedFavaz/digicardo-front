"use client";

import * as React from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import type { PartnerContent } from "@/lib/partner/types";

const field =
  "block h-12 w-full rounded-2xl border border-[var(--lp-line)] bg-[var(--lp-bg)] px-4 text-[15px] text-[var(--lp-ink)] outline-none transition-colors placeholder:text-[var(--lp-muted)] focus:border-[var(--lp-accent)]";

/** "Get your card" enquiry form. In the editor preview it is shown but can't be sent. */
export function PartnerLeadForm({ slug, content, preview }: { slug: string; content: PartnerContent; preview?: boolean }) {
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const packages = content.packages.enabled ? content.packages.items.filter((p) => p.name) : [];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (preview) return;
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v).trim()]));
    if (!body.phone && !body.email) {
      setError("Add a phone number or an email so we can reach you.");
      return;
    }
    setState("sending");
    setError(null);
    try {
      const res = await fetch(`/api/bff/v1/public/partners/${encodeURIComponent(slug)}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const details = json?.error?.details as Record<string, string[]> | undefined;
        throw new Error((details && Object.values(details).flat()[0]) || json?.error?.message || "Couldn't send. Please try again.");
      }
      setState("sent");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Couldn't send. Please try again.");
    }
  };

  if (state === "sent") {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] bg-[var(--lp-surface)] p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-[var(--lp-accent)]" aria-hidden="true" />
        <p className="mt-4 text-2xl font-light text-[var(--lp-ink)]">Thank you!</p>
        <p className="mt-1 text-[15px] text-[var(--lp-ink2)]">We’ve got your request and will contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[28px] border border-[var(--lp-line)] bg-[var(--lp-surface)] p-6 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.35)] sm:p-8" noValidate>
      <p className="text-xl font-normal text-[var(--lp-ink)]">{content.lead_form.title || "Request a call back"}</p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="sr-only">Your name</span>
          <input name="name" required maxLength={80} autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label>
          <span className="sr-only">Phone or WhatsApp</span>
          <input name="phone" type="tel" inputMode="tel" maxLength={24} autoComplete="tel" placeholder="Phone / WhatsApp" className={field} />
        </label>
        <label>
          <span className="sr-only">Email</span>
          <input name="email" type="email" maxLength={120} autoComplete="email" placeholder="Email (optional)" className={field} />
        </label>
        {packages.length > 0 && (
          <label className="sm:col-span-2">
            <span className="sr-only">Package</span>
            <select name="package" defaultValue="" className={`${field} appearance-none`}>
              <option value="">Which package? (optional)</option>
              {packages.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                  {p.price ? ` — ${p.price}` : ""}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="sm:col-span-2">
          <span className="sr-only">Message</span>
          <textarea name="message" rows={3} maxLength={1000} placeholder="Tell us about your business (optional)" className={`${field} h-auto resize-none py-3`} />
        </label>
        {/* Honeypot */}
        <input name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#DC2626]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending" || preview}
        className="mt-5 inline-flex h-14 w-full items-center justify-between rounded-full bg-[var(--lp-accent)] pl-6 pr-2 text-[15px] font-medium text-[var(--lp-accent-ink)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-80"
      >
        {state === "sending" ? "Sending…" : content.lead_form.button_label || "Send request"}
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lp-accent-ink)] text-[var(--lp-accent)]">
          {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
        </span>
      </button>
      {preview && <p className="mt-2 text-center text-xs text-[var(--lp-muted)]">Preview — the form works on your live page.</p>}
    </form>
  );
}
