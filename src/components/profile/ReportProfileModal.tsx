"use client";

import * as React from "react";
import { useState } from "react";
import { submitPublicAbuseReport } from "@/lib/api/admin";
import { ShieldAlert, Flag, CheckCircle2, X } from "lucide-react";

interface ReportProfileModalProps {
  username: string;
}

export function ReportProfileModal({ username }: ReportProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [hpField, setHpField] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await submitPublicAbuseReport(username, {
        reason,
        description,
        reporter_email: email || undefined,
        hp_field: hpField || undefined,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit abuse report. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSubmitted(false);
    setDescription("");
    setEmail("");
    setError(null);
  };

  return (
    <>
      <div className="flex items-center justify-center pb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          data-testid="report-profile-button"
        >
          <Flag className="h-3 w-3" /> Report profile
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Report Received
                </h3>
                <p className="mt-2 text-xs text-neutral-500">
                  Thank you for helping keep Digicardo safe. Our Trust & Safety team will investigate this profile.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="h-5 w-5" />
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    Report @{username}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Select a category and explain why this profile violates platform terms.
                </p>

                {error && (
                  <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  {/* Honeypot */}
                  <input
                    type="text"
                    value={hpField}
                    onChange={(e) => setHpField(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Reason
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-neutral-300 bg-white p-2 text-xs outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    >
                      <option value="spam">Spam / Excessive Promotional Links</option>
                      <option value="phishing">Phishing / Scam / Credential Harvesting</option>
                      <option value="impersonation">Impersonation / Fake Account</option>
                      <option value="malicious_content">Malicious Content / Malware</option>
                      <option value="copyright">Copyright Infringement</option>
                      <option value="harassment">Harassment / Hate Speech</option>
                      <option value="inappropriate_content">Inappropriate / Adult Content</option>
                      <option value="other">Other Violation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Description (Minimum 10 characters)
                    </label>
                    <textarea
                      rows={3}
                      required
                      minLength={10}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please provide specific details..."
                      className="mt-1 w-full rounded-lg border border-neutral-300 bg-white p-2 text-xs outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Your Email (Optional for updates)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-lg border border-neutral-300 bg-white p-2 text-xs outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || description.trim().length < 10}
                      className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
