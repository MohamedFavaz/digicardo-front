"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Check,
  Copy,
  Palette,
} from "lucide-react";
import { SaveStatus, type SaveState } from "./SaveStatus";
import type { Profile } from "@/types/profile";

export interface EditorHeaderProps {
  profile: Profile | null;
  saveState: SaveState;
  errorMessage?: string | null;
  onRetrySave?: () => void;
}

export function EditorHeader({
  profile,
  saveState,
  errorMessage,
  onRetrySave,
}: EditorHeaderProps) {
  const [copied, setCopied] = React.useState(false);
  const username = profile?.username || "demo";
  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://digicardo.app/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="pb-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Save Status */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span>Studio Editor</span>
          <span>·</span>
          <SaveStatus
            status={saveState}
            errorMessage={errorMessage}
            onRetry={onRetrySave}
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Page Studio
        </h1>

        <p className="text-xs text-muted-foreground max-w-lg">
          Reorder, customize, and publish content for your visitors.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-muted text-xs font-medium text-foreground transition-colors"
          title="Copy link"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <span>{copied ? "Copied!" : "Copy link"}</span>
        </button>

        <Link href="/dashboard/appearance">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl font-bold text-xs bg-card hover:bg-muted border-border/80 h-9 px-3 shadow-2xs"
          >
            <Palette className="w-3.5 h-3.5 text-brand-600" />
            <span>Appearance</span>
          </Button>
        </Link>

        <Link href={`/${username}`} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl font-bold text-xs bg-card hover:bg-muted border-border/80 h-9 px-3 shadow-2xs"
          >
            <span>View Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
