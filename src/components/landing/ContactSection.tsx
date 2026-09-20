"use client";

import * as React from "react";
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  CreditCard,
  Building2,
  Globe2,
  HelpCircle,
  Handshake,
  Check,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INQUIRY_TYPES = [
  { id: "smart_card_order", label: "Order Smart NFC Card", icon: CreditCard },
  { id: "enterprise_team", label: "Enterprise & Teams", icon: Building2 },
  { id: "creator_custom_domain", label: "Custom Domains & Branding", icon: Globe2 },
  { id: "partnership", label: "Partnership & Press", icon: Handshake },
  { id: "general_inquiry", label: "General Support", icon: HelpCircle },
];

export function ContactSection() {
  const [inquiryType, setInquiryType] = React.useState("smart_card_order");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone.trim() || undefined,
          inquiry_type: inquiryType,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit message. Please try again.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow orbs */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ── Left Column: 3D NFC Card Showcase & Card Features (5 cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Digicardo NFC Smart Cards</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                Connect with a single tap.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
                Order custom matte-black NFC smart business cards or inquire about enterprise team rollouts. Share your profile, vCard, and links instantly on any smartphone with zero apps needed.
              </p>
            </div>

            {/* Generated 3D Luxury NFC Card Showcase */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-brand-500/25 shadow-[0_20px_60px_rgba(91,63,228,0.2)] bg-black aspect-[4/3] group select-none">
              <img
                src="/smart-nfc-card.jpg"
                alt="Digicardo Luxury Matte-Black NFC Smart Card"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-wider text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  NFC Chip Embedded
                </span>
                <span className="text-[10px] font-mono text-brand-300 font-bold px-2 py-0.5 rounded bg-brand-950/60 border border-brand-500/30">
                  TAP TO SHARE
                </span>
              </div>

              {/* Bottom Card Highlights */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                <div className="space-y-0.5 text-white">
                  <p className="text-xs font-black">Matte Holographic Edition</p>
                  <p className="text-[11px] text-slate-300">Works with all Apple &amp; Android devices</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Feature Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>No app required</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Instant vCard download</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Custom logo engraving</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Real-time link analytics</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Interactive Contact & Order Form (7 cols) ── */}
          <div className="lg:col-span-7">
            <div className="bg-card/95 dark:bg-card/90 backdrop-blur-2xl border border-border/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
              {submitted ? (
                <div className="py-16 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground">Message Submitted!</h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you for contacting Digicardo. Our team has received your details and will connect with you via email or phone within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-950 border border-brand-200 dark:border-brand-800 transition-all cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                      Order Cards or Get in Touch
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Fill in your specifications and our team will get back to you immediately.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Inquiry Type Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground block">
                      Inquiry Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {INQUIRY_TYPES.map((type) => {
                        const Icon = type.icon;
                        const selected = inquiryType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setInquiryType(type.id)}
                            className={cn(
                              "flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer active:scale-98",
                              selected
                                ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20"
                                : "bg-muted/40 hover:bg-muted/70 text-foreground border-border/80 hover:border-border"
                            )}
                          >
                            <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", selected ? "text-white" : "text-brand-600 dark:text-brand-400")} />
                            <span className="truncate text-[11px]">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        Your Name <span className="text-brand-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        Email Address <span className="text-brand-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@company.com"
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone / WhatsApp (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Phone / WhatsApp Number <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 234-5678"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Inquiry Details or Custom Card Specifications <span className="text-brand-600">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5 pointer-events-none" />
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about the quantity of cards, custom company branding, or any questions..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-2xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
