"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  ExternalLink,
  QrCode,
  TrendingUp,
} from "lucide-react";
export { AnalyticsSkeleton } from "./AnalyticsSkeleton";
import { DoodleSparkle } from "@/components/ui/playful/Doodles";

export interface AnalyticsEmptyStateProps {
  username?: string;
}

export function AnalyticsEmptyState({ username = "demo" }: AnalyticsEmptyStateProps) {
  const [copied, setCopied] = React.useState(false);
  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://Digicardo.app/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="rounded-[36px] border border-border/80 bg-gradient-to-b from-card to-brand-50/20 p-8 sm:p-12 text-center shadow-card space-y-6 relative overflow-hidden">
      {/* Playful Doodles */}
      <div className="absolute top-4 right-8 text-brand-300 opacity-60 hidden sm:block">
        <DoodleSparkle className="w-8 h-8" />
      </div>

      {/* Floating Animated Icon Badge */}
      <div className="relative mx-auto w-16 h-16 rounded-3xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-float">
        <TrendingUp className="w-8 h-8" />
      </div>

      {/* Text Headline & Encouragement */}
      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          Your story is just getting started 📈
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          Share your Digicardo handle on your Instagram, TikTok, Twitter, or WhatsApp bio.
          Visitor telemetry and click interactions will populate here in real time.
        </p>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          onClick={handleCopy}
          variant="pill"
          size="sm"
          className="h-10 px-5 gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-cta"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Profile Link</span>
            </>
          )}
        </Button>

        <Link href={`/${username}`} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-bold gap-1.5 bg-card hover:bg-muted shadow-xs h-10 px-4"
          >
            <span>Preview Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </Link>

        <Link href="/dashboard/domains">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-bold gap-1.5 bg-card hover:bg-muted shadow-xs h-10 px-4"
          >
            <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Generate QR Code</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
