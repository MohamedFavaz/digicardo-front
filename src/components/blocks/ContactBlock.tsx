"use client";

import * as React from "react";
import type { PublicProfileBlock, ContactBlockConfig } from "@/types/blocks";
import { contactApi } from "@/lib/api/contact";
import { ApiClientError } from "@/lib/api/errors";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

interface ContactBlockProps {
  block: PublicProfileBlock<ContactBlockConfig>;
  username?: string;
}

export function ContactBlock({ block, username }: ContactBlockProps) {
  const { config } = block;
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [websiteHp, setWebsiteHp] = React.useState(""); // Honeypot field

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Unable to submit: Profile username missing.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await contactApi.submitContact(username, {
        name,
        email,
        phone: phone || null,
        message,
        website_hp: websiteHp || undefined,
      });

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4 text-left">
      <div className="space-y-1">
        <h3
          className="text-base font-bold tracking-tight"
          style={{ color: "var(--lf-text-primary, #ffffff)" }}
        >
          {config.title || "Contact Me"}
        </h3>
        {config.description && (
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--lf-text-secondary, #94a3b8)" }}
          >
            {config.description}
          </p>
        )}
      </div>

      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-emerald-900/40 bg-emerald-950/30 p-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-200">
            Message Sent Successfully!
          </p>
          <p className="text-xs text-emerald-400/80">
            Thank you for reaching out. We will get back to you soon.
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="mt-3 text-xs font-semibold text-emerald-400 hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Honeypot hidden input */}
          <input
            type="text"
            name="website_hp"
            value={websiteHp}
            onChange={(e) => setWebsiteHp(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {config.name_enabled !== false && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Name</label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {config.email_enabled !== false && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Email</label>
              <input
                type="email"
                required
                disabled={isSubmitting}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {config.phone_enabled && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Phone Number (Optional)</label>
              <input
                type="tel"
                disabled={isSubmitting}
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {config.message_enabled !== false && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Message</label>
              <textarea
                required
                rows={3}
                disabled={isSubmitting}
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {error && <p className="text-xs font-medium text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--lf-radius,0.5rem)] bg-[var(--lf-accent,#6366f1)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>{config.button_label || "Send Message"}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
