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
  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://digicardo.app/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="pb-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title & Save Status */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Page
          </h1>
          <SaveStatus
            status={saveState}
            errorMessage={errorMessage}
            onRetry={onRetrySave}
          />
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Choose your layout template and customize your digital business card.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          title="Copy link to clipboard"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{copied ? "Copied" : "Copy Link"}</span>
        </button>

        <Link
          href="/dashboard/appearance"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
        >
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <span>Appearance</span>
        </Link>

        <Link
          href={`/${username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-xs font-semibold text-white transition-all shadow-2xs"
        >
          <span>View Live</span>
          <ExternalLink className="w-3 h-3 text-slate-300" />
        </Link>
      </div>
    </div>
  );
}
