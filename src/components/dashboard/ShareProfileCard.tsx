"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Globe, QrCode, ExternalLink } from "lucide-react";

export interface ShareProfileCardProps {
  username?: string;
}

export function ShareProfileCard({ username = "username" }: ShareProfileCardProps) {
  const [copied, setCopied] = React.useState(false);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://Digicardo.app/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-border/80 bg-card p-4 sm:p-6 shadow-card space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 flex items-center justify-center shadow-2xs">
            <Share2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-foreground">Share Profile</h3>
        </div>

        <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground px-2 py-0.5 rounded-full bg-muted/60 border border-border/60">
          PUBLIC
        </span>
      </div>

      {/* URL copy bar */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-muted/40 border border-border/80 text-xs font-mono">
        <Globe className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground font-semibold truncate flex-1">{profileUrl}</span>
        <button
          onClick={handleCopy}
          aria-label="Copy profile URL"
          className="p-1 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-all ml-1 flex-shrink-0 active:scale-90"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {copied && (
        <p className="text-[11px] text-emerald-600 font-bold -mt-2 animate-in fade-in duration-200">
          Link copied to clipboard!
        </p>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-1">
        <Link href="/dashboard/qr" className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 rounded-xl text-xs font-bold gap-1.5 border-border/80 bg-card hover:bg-muted/70 shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5 text-brand-600" />
            <span>QR &amp; NFC</span>
          </Button>
        </Link>

        <Link href={`/${username}`} target="_blank" rel="noreferrer" className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 rounded-xl text-xs font-bold gap-1.5 border-border/80 bg-card hover:bg-muted/70 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            <span>View Page</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
