"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink } from "lucide-react";
import { SaveStatus, type SaveState } from "@/components/editor/SaveStatus";
import type { Profile } from "@/types/profile";

export interface SEOHeaderProps {
  profile: Profile | null;
  saveState: SaveState;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  errorMessage?: string | null;
  onSave: () => void;
}

export function SEOHeader({
  profile,
  saveState,
  hasUnsavedChanges,
  isSaving,
  errorMessage,
  onSave,
}: SEOHeaderProps) {
  const username = profile?.username || "demo";

  return (
    <div className="pb-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Live Status */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span>Discovery &amp; Open Graph</span>
          <span>·</span>
          <SaveStatus status={saveState} errorMessage={errorMessage} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          SEO &amp; Social Sharing
        </h1>

        <p className="text-xs text-muted-foreground max-w-xl">
          Control how your Digicardo page looks on Google search results, iMessage, WhatsApp, Twitter, and LinkedIn.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
        <Link href={`/${username}`} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs font-medium gap-1.5 h-9 px-3 border-border"
          >
            <span>View Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
        </Link>

        <Button
          onClick={onSave}
          disabled={isSaving}
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90 text-white font-medium text-xs rounded-lg h-9 px-4"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hasUnsavedChanges ? "Save Changes" : "Saved"}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
