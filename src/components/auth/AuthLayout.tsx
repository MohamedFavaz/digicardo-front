"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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

export function AuthLayout({ children, title, subtitle, showBackToHome = true, badge, topLink, aside = OWNER_ASIDE }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-card text-foreground antialiased">
      {/* Form */}
      <div className="flex min-h-screen flex-1 flex-col">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10">
          <Link href="/" aria-label="Digicardo home">
            <DigicardoLogo size="sm" />
          </Link>
          {topLink ? (
            <Link href={topLink.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {topLink.label}
            </Link>
          ) : (
            showBackToHome && (
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Home
              </Link>
            )
          )}
        </div>

        <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[400px] space-y-7">
            <div className="space-y-1.5">
              {badge && (
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {badge}
                </span>
              )}
              <h1 className="text-[28px] font-semibold leading-9 tracking-tight text-foreground">{title}</h1>
              <p className="text-[15px] text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </main>

        <footer className="px-6 pb-6 text-center text-xs text-muted-foreground sm:px-10">
          By continuing you agree to Digicardo&apos;s Terms and Privacy Policy.
        </footer>
      </div>

      {/* Brand panel */}
      <aside className="hidden w-[46%] max-w-[680px] flex-col items-center justify-center gap-10 border-l border-border bg-[#F6F6F7] px-12 lg:flex">
        <div className="max-w-sm text-center">
          <h2 className="text-[26px] font-semibold leading-8 tracking-tight text-foreground">{aside.title}</h2>
          <p className="mt-2 text-[15px] text-[#52525B]">{aside.text}</p>
        </div>
        <ExampleCardPhone />
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[#52525B]">
          {aside.points.map((f) => (
            <li key={f} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
