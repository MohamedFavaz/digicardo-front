"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Palette,
  Share2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/profile";
import type { AuthUser } from "@/types/auth";

export interface DashboardWelcomeProps {
  user: AuthUser | null;
  profile: Profile | null;
}

export function DashboardWelcome({ user, profile }: DashboardWelcomeProps) {
  const [copied, setCopied] = React.useState(false);
  const [greeting, setGreeting] = React.useState("Welcome back");

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const displayName = profile?.display_name || user?.name || "Creator";
  const profileHandle = profile?.username || "your-profile";
  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profileHandle}`
      : `https://digicardo.app/${profileHandle}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="relative rounded-[28px] sm:rounded-[36px] border border-border/80 bg-gradient-to-br from-card via-card to-brand-50/25 dark:to-brand-950/15 p-5 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
      {/* Ambient Brand Aura Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-36 bg-brand-500/10 blur-3xl pointer-events-none" />

      {/* Left: Greeting & Profile Identity */}
      <div className="space-y-2.5 z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span suppressHydrationWarning>{greeting}, {displayName}</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Profile Live</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Welcome to your Studio
        </h1>

        {/* Live URL Pill with copy button */}
        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-muted/60 dark:bg-muted/40 border border-border/80 text-xs font-mono text-muted-foreground shadow-2xs">
            <span className="flex-shrink-0">digicardo.app/</span>
            <span className="font-bold text-foreground truncate max-w-[120px] sm:max-w-none" suppressHydrationWarning>{profileHandle}</span>
            <button
              onClick={handleCopyLink}
              title="Copy Profile URL"
              aria-label="Copy profile link"
              className="p-1 rounded-full hover:bg-card text-muted-foreground hover:text-foreground transition-all ml-0.5 active:scale-90 flex-shrink-0"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {copied && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
              Copied!
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap z-10 flex-shrink-0">
        <Link href={`/${profileHandle}`} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4 rounded-xl text-xs font-bold gap-1.5 border-border/80 bg-card hover:bg-muted/80 shadow-2xs active:scale-95"
          >
            <span>View Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </Link>

        <Link href="/dashboard/qr">
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4 rounded-xl text-xs font-bold gap-1.5 border-border/80 bg-card hover:bg-muted/80 shadow-2xs active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-brand-600" />
            <span>QR &amp; NFC</span>
          </Button>
        </Link>

        <Link href="/dashboard/appearance">
          <Button
            size="sm"
            className="h-10 px-4 rounded-xl text-xs font-extrabold gap-1.5 bg-brand-600 hover:bg-brand-700 text-white shadow-cta active:scale-95"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
