"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { ExampleCardPhone } from "@/components/marketing/ExampleCardPhone";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackToHome?: boolean;
  /** Small label above the title, e.g. "Admin" or "Partner portal". */
  badge?: string;
  /** Replaces the "Home" link in the top-right corner. */
  topLink?: { href: string; label: string };
  /** Copy for the brand panel on the right (defaults to the card-owner pitch). */
  aside?: AuthAside;
}

export interface AuthAside {
  title: string;
  text: string;
  points: string[];
}

const OWNER_ASIDE: AuthAside = {
  title: "Your business card, always up to date.",
  text: "One link for calls, WhatsApp, payments and your work. Share it by QR, NFC or chat.",
  points: ["Edits go live instantly", "QR & NFC ready", "Works on every phone"],
};

/**
 * Sign-in / sign-up layout shared by card owners, admins and agents: the form column on the
 * left, and on wide screens a violet brand card on the right with the example card phone.
 */
export function AuthLayout({ children, title, subtitle, showBackToHome = true, badge, topLink, aside = OWNER_ASIDE }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white text-foreground antialiased">
      {/* Form */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <Link href="/" aria-label="Digicardo home">
            <DigicardoLogo size="md" />
          </Link>
          {topLink ? (
            <Link href={topLink.href} className="rounded-full border border-border px-4 py-2 text-sm font-medium text-[#3F3F46] transition-colors hover:bg-[#F6F5FB]">
              {topLink.label}
            </Link>
          ) : (
            showBackToHome && (
              <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-[#3F3F46] transition-colors hover:bg-[#F6F5FB]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Home
              </Link>
            )
          )}
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[420px]">
            {badge && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {badge}
              </span>
            )}
            <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] text-foreground">{title}</h1>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </main>

        <footer className="px-6 pb-6 text-center text-xs text-muted-foreground sm:px-10">
          By continuing you agree to Digicardo&apos;s Terms and Privacy Policy.
        </footer>
      </div>

      {/* Brand card */}
      <aside className="sticky top-0 hidden h-screen w-[46%] max-w-[720px] p-3 lg:flex">
        <div className="relative flex w-full flex-col items-center justify-between overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#6A4EF0_0%,#5B3FE4_45%,#3B25B0_100%)] px-8 pb-8 pt-12 text-white">
          {/* Soft shapes */}
          <span aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/15" />
          <span aria-hidden="true" className="absolute -right-6 -top-6 h-44 w-44 rounded-full border border-white/10" />
          <span aria-hidden="true" className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/[0.07]" />

          <div className="relative max-w-lg text-center">
            <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">{aside.title}</h2>
            <p className="mt-3 text-[15px] leading-6 text-white/80">{aside.text}</p>
          </div>

          <div className="relative my-4 flex min-h-0 flex-1 items-center justify-center">
            <span aria-hidden="true" className="absolute h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
            <div className="relative rotate-[-3deg] scale-[0.9] drop-shadow-[0_40px_60px_rgba(16,8,60,0.45)] [@media(max-height:820px)]:scale-[0.78]">
              <ExampleCardPhone />
            </div>
          </div>

          <ul className="relative flex flex-wrap justify-center gap-2">
            {aside.points.map((f) => (
              <li key={f} className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[13px] font-medium backdrop-blur">
                <CheckCircle2 className="h-4 w-4 text-[#DAF56B]" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
