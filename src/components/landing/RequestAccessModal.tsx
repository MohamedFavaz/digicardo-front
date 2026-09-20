"use client";
import * as React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function RequestAccessModal({ open, onClose }: Props) {
  const [form, setForm] = React.useState({
    name: "", email: "", phone: "", business_name: "", message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/bff/v1/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          business_name: form.business_name.trim() || undefined,
          message: form.message.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        const details = json?.error?.details;
        if (details && typeof details === "object") {
          const first = Object.values(details)[0];
          setError(Array.isArray(first) ? first[0] : String(first));
        } else {
          setError(json?.error?.message || "Something went wrong. Please try again.");
        }
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setSubmitted(false);
    setError("");
    setForm({ name: "", email: "", phone: "", business_name: "", message: "" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={handleClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
          <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="text-lg font-black">Request Access to Digicardo</h2>
          <p className="text-[13px] text-indigo-100 mt-0.5">Fill in your details and we'll reach out shortly.</p>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-[16px] font-black text-slate-800">Request Submitted!</p>
              <p className="text-[13px] text-slate-500 mt-1">Thank you, <strong>{form.name.split(" ")[0]}</strong>! We'll review your request and reach out to <strong>{form.email}</strong> soon.</p>
            </div>
            <button onClick={handleClose}
              className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold transition-all">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700 font-medium">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Full Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Mobile Number *</label>
                <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Business / Brand</label>
                <input value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
                  placeholder="Acme Pvt Ltd"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tell us about your needs</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={2} placeholder="I want a digital business card for my team…"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none" />
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-[13px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-indigo-200">
              {submitting ? (
                <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting…</>
              ) : "Request Access →"}
            </button>
            <p className="text-[10px] text-slate-400 text-center">We typically respond within 24 hours. No spam, ever.</p>
          </form>
        )}
      </div>
    </div>
  );
}
