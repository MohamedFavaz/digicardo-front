"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Menu, MessageCircle, Nfc, QrCode, Share2, X } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { TemplatePhone } from "@/components/marketing/TemplatePhone";
import { SocialIcon } from "@/templates/shared/SocialIcon";
import { cn } from "@/lib/utils";
import { Reveal } from "./shared";
import { Hero3D } from "./Hero3D";

/**
 * Bold, colour-blocked landing page (full-bleed sections, oversized type, pill buttons).
 * Palette: lime / violet / plum / lavender / cream — Digicardo's violet stays the anchor.
 */
export const C = {
  lime: "#DAF56B",
  violet: "#5B3FE4",
  ink: "#1C1245",
  plum: "#3D0C45",
  pink: "#F6B6E6",
  lavender: "#ECE8FD",
  cream: "#F5F4EF",
} as const;

export const display = "font-extrabold tracking-[-0.045em] leading-[0.98]";

export function Pill({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cls = cn(
    "inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0",
    className,
  );
  return href.startsWith("#") || href.startsWith("http") ? (
    <a href={href} className={cls} style={style} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls} style={style}>
      {children}
    </Link>
  );
}

// ── Navigation ─────────────────────────────────────────────────────────────────────

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export function NavBar() {
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const signedIn = mounted && isAuthenticated;
  const dashboardHref = user?.role === "admin" ? "/admin/dashboard" : user?.role === "agent" ? "/agent/dashboard" : "/dashboard";

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-6">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 rounded-full bg-white px-3 pl-5 shadow-[0_10px_40px_-12px_rgba(28,18,69,0.25)] sm:h-[72px] sm:pl-7">
        <Link href="/" aria-label="Digicardo home" onClick={() => setOpen(false)}>
          <DigicardoLogo size="md" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-[#3F3B52] transition-colors hover:bg-[#F4F2EC]">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2" suppressHydrationWarning>
          {signedIn ? (
            <Link href={dashboardHref} className="inline-flex h-12 items-center rounded-full px-5 text-[15px] font-semibold text-white" style={{ background: C.ink }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden h-12 items-center rounded-xl bg-[#EFEEE9] px-5 text-[15px] font-semibold text-[#1C1245] sm:inline-flex">
                Log in
              </Link>
              <Link href="/register" className="inline-flex h-11 items-center rounded-full px-5 text-[15px] font-semibold text-white sm:h-12 sm:px-6" style={{ background: C.ink }}>
                Get your card
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#1C1245] hover:bg-[#F4F2EC] lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-[1240px] rounded-[28px] bg-white p-3 shadow-[0_20px_50px_-20px_rgba(28,18,69,0.35)] lg:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-semibold text-[#1C1245] hover:bg-[#F4F2EC]">
              {l.label}
              <ArrowRight className="h-5 w-5 text-[#A09CB0]" aria-hidden="true" />
            </a>
          ))}
          {!signedIn && (
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#EFEEE9] pt-3">
              <Link href="/login" className="flex h-12 items-center justify-center rounded-full bg-[#EFEEE9] font-semibold text-[#1C1245]">
                Log in
              </Link>
              <Link href="/agent-login" className="flex h-12 items-center justify-center rounded-full bg-[#EFEEE9] font-semibold text-[#1C1245]">
                Agent log in
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// ── "Claim your card" ──────────────────────────────────────────────────────────────

export function ClaimForm({
  button = "Claim your card",
  buttonStyle,
  className,
  defaultHandle = "",
}: {
  button?: string;
  buttonStyle: React.CSSProperties;
  className?: string;
  defaultHandle?: string;
}) {
  const router = useRouter();
  const [handle, setHandle] = React.useState(defaultHandle);
  const id = React.useId();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
    router.push(clean ? `/register?handle=${encodeURIComponent(clean)}` : "/register");
  };
  return (
    <form onSubmit={submit} className={cn("flex w-full max-w-[560px] flex-col gap-3 sm:flex-row", className)}>
      <label htmlFor={id} className="flex h-16 w-full shrink-0 cursor-text items-center rounded-2xl bg-white px-5 sm:w-auto sm:flex-1 text-[17px] shadow-[inset_0_0_0_2px_transparent] focus-within:shadow-[inset_0_0_0_2px_#1C1245]">
        <span className="select-none text-[#8C879C]">digicardo.app/</span>
        <input
          id={id}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="yourname"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="Choose your card name"
          className="min-w-0 flex-1 bg-transparent font-medium text-[#1C1245] outline-none placeholder:text-[#C9C6D3]"
        />
      </label>
      <button type="submit" className="h-16 shrink-0 rounded-full px-8 text-[17px] font-semibold transition-transform hover:-translate-y-0.5" style={buttonStyle}>
        {button}
      </button>
    </form>
  );
}

// ── Hero (lime) ────────────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-14 pt-28 sm:pb-20 sm:pt-36" style={{ background: C.lime }}>
      <div className="mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <h1 className={cn("text-[52px] sm:text-[84px] lg:text-[92px]", display)} style={{ color: C.ink }}>
            One card. Every customer.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium leading-8 sm:text-xl" style={{ color: "#2E2563" }}>
            Your phone, WhatsApp, services, payments and photos in one smart business card. Share it by QR code, NFC tap or chat — and
            update it any time.
          </p>
          <ClaimForm className="mt-9" buttonStyle={{ background: C.ink, color: "#fff" }} />
          <p className="mt-4 text-sm font-medium" style={{ color: "#4A4178" }}>
            No app needed · Works on every phone · Changes go live instantly
          </p>
        </div>

        <Hero3D />
      </div>
    </section>
  );
}

// ── Create (violet) ────────────────────────────────────────────────────────────────

export function CreateSection() {
  return (
    <section id="features" className="scroll-mt-24 overflow-hidden py-20 sm:py-32" style={{ background: C.violet }}>
      <div className="mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto h-[520px] w-full max-w-[460px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 rotate-[-8deg]">
              <TemplatePhone template="showcase" width={270} className="shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]" />
            </div>
            {(
              [
                ["instagram", "#E1306C", "top-16 right-2"],
                ["whatsapp", "#25D366", "top-48 -left-2"],
                ["facebook", "#1877F2", "bottom-28 right-0"],
                ["youtube", "#FF0000", "bottom-10 left-6"],
              ] as const
            ).map(([platform, color, pos], i) => (
              <span
                key={platform}
                aria-hidden="true"
                className={cn("absolute z-10 flex h-14 w-14 items-center justify-center rounded-full motion-safe:animate-float", pos)}
                style={{ background: C.lime, color, animationDelay: `${i * 0.8}s` }}
              >
                <SocialIcon platform={platform} className="h-6 w-6" />
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2">
          <h2 className={cn("text-[44px] sm:text-[64px]", display)} style={{ color: C.lime }}>
            Create your card in minutes
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/85">
            Add your contact buttons, services with prices, UPI payments, photos, opening hours and social links. Pick a template, tap a
            colour — it saves as you type and goes live instantly.
          </p>
          <Pill href="/register" className="mt-9" style={{ background: C.lime, color: C.ink }}>
            Get started
          </Pill>
        </Reveal>
      </div>
    </section>
  );
}

// ── Share (plum) ───────────────────────────────────────────────────────────────────

const CHANNELS: { label: string; bg: string; fg: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Email signature", bg: "#2F6BFF", fg: "#fff", icon: Mail },
  { label: "WhatsApp status", bg: "#1FAF5A", fg: "#fff", icon: MessageCircle },
  { label: "Counter QR code", bg: "#3A3550", fg: "#fff", icon: QrCode },
  { label: "NFC card tap", bg: "#111015", fg: "#fff", icon: Nfc },
  { label: "Instagram bio", bg: "#D63AAE", fg: "#fff", icon: Share2 },
];

export function ShareSection() {
  return (
    <section className="overflow-hidden py-20 sm:py-32" style={{ background: C.plum }}>
      <div className="mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <h2 className={cn("text-[44px] sm:text-[64px]", display)} style={{ color: C.pink }}>
            Share your card anywhere you like!
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
            Put your Digicardo link in your WhatsApp, Instagram and email. Print your QR code on the counter, or tap an NFC card on any
            phone — it opens instantly, no app needed.
          </p>
          <Pill href="/register" className="mt-9" style={{ background: C.pink, color: C.plum }}>
            Get started
          </Pill>
        </Reveal>
        <Reveal delay={100}>
          <div aria-hidden="true" className="relative mx-auto h-[400px] w-full max-w-[520px] [--step:26px] sm:h-[440px] sm:[--step:44px]">
            {CHANNELS.map((ch, i) => (
              <div
                key={ch.label}
                className="absolute flex h-[220px] w-[260px] flex-col justify-between rounded-[28px] p-5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)]"
                style={{ background: ch.bg, color: ch.fg, right: `calc(${i} * var(--step))`, top: `calc(${i} * var(--step))`, zIndex: 10 - i }}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                    <ch.icon className="h-5 w-5" />
                  </span>
                  <span className="h-2 w-16 rounded-full bg-white/30" />
                </div>
                <div>
                  <div className="h-2.5 w-28 rounded-full bg-white/40" />
                  <div className="mt-2 h-2 w-20 rounded-full bg-white/25" />
                  <p className="mt-4 text-sm font-semibold">{ch.label}</p>
                </div>
              </div>
            ))}
            <div className="absolute bottom-0 left-0 z-20 flex items-center gap-2 rounded-full bg-white py-3 pl-3 pr-5 text-[15px] font-semibold text-[#1C1245] shadow-xl">
              <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: C.lime }}>
                <span className="h-2 w-2 rounded-full" style={{ background: C.ink }} />
              </span>
              digicardo.app/yourname
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
