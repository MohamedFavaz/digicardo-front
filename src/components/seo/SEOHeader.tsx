"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { SaveStatus, type SaveState } from "@/components/editor/SaveStatus";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import type { Profile } from "@/types/profile";

export interface SEOHeaderProps {
  /** Kept for compatibility; the card link lives in the top bar. */
  profile: Profile | null;
  saveState: SaveState;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  errorMessage?: string | null;
  onDiscard?: () => void;
  onSave: () => void;
}

/** Settings tabs + save actions for "Search & sharing" (title is in the top bar). */
export function SEOHeader({ saveState, hasUnsavedChanges, isSaving, errorMessage, onDiscard, onSave }: SEOHeaderProps) {
  return (
    <div className="space-y-4">
      <SettingsHeader />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SaveStatus status={saveState} errorMessage={errorMessage} />
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && onDiscard && (
            <button type="button" onClick={onDiscard} disabled={isSaving} className="inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-semibold text-[#52525B] hover:bg-muted disabled:opacity-50">
              Discard
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[#4A32C0] disabled:bg-[#E4E4E7] disabled:text-[#6B6B76]"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isSaving ? "Saving…" : hasUnsavedChanges ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>
    </div>
  );
}
