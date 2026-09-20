"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackToHome?: boolean;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showBackToHome = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex antialiased">
      {/* ── Left: Brand Panel ── */}
      <div
        style={{ backgroundColor: "#0d0f14", color: "#ffffff" }}
        className="hidden lg:flex lg:w-[42%] xl:w-[45%] border-r border-white/10 flex-col justify-between p-12 xl:p-16 flex-shrink-0"
      >
        {/* Logo */}
        <Link href="/" className="group w-fit">
          <DigicardoLogo size="md" wordmarkClassName="text-white" />
        </Link>

        {/* Center content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
              Your smart card.<br />One digital identity.
            </h2>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              A single, stunning digital business card for all your contact details, NFC card, social links, and portfolio.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-2.5">
            {[
              "Digital business card & vCard",
              "NFC tap & branded QR codes",
              "Real-time contact analytics",
              "Custom domains & SEO preview",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-xs text-white/60">
                <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-white/40 leading-relaxed italic">
            "Digicardo transformed how I share my professional identity."
          </p>
          <p className="text-[10px] text-white/25 mt-1.5 font-medium">
            Entrepreneur &amp; Creative Director
          </p>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top nav */}
        <div className="flex items-center justify-between px-6 sm:px-10 pt-8">
          {showBackToHome ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </Link>
          ) : (
            <div />
          )}

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center">
            <DigicardoLogo size="sm" />
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {/* Form */}
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-10 pb-8 text-center">
          <p className="text-[11px] text-muted-foreground">
            By continuing, you agree to Digicardo&apos;s{" "}
            <span className="text-foreground font-medium hover:underline cursor-pointer">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-foreground font-medium hover:underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
