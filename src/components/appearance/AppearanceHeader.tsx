"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ExternalLink,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { SaveState } from "@/components/editor/SaveStatus";
import type { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface AppearanceHeaderProps {
  profile: Profile | null;
  saveState: SaveState;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  errorMessage?: string | null;
  onResetToDefault: () => void;
  onSave: () => void;
}

export function AppearanceHeader({
  profile,
  saveState,
  hasUnsavedChanges,
  isSaving,
  errorMessage,
  onResetToDefault,
  onSave,
}: AppearanceHeaderProps) {
  const username = profile?.username || "demo";

  return (
    <div className="pb-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Top Bar Left: Back Link + Studio Title & Save Indicator */}
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground font-medium">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </Link>

          <span>·</span>

          {/* Real-Time Save Status Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all",
              saveState === "saving" && "bg-amber-50 text-amber-800 border border-amber-200",
              saveState === "saved" && "bg-emerald-50 text-emerald-800 border border-emerald-200",
              saveState === "unsaved" && "bg-primary/10 text-primary border border-primary/20",
              saveState === "error" && "bg-rose-50 text-rose-700 border border-rose-200"
            )}
          >
            {saveState === "saving" && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                <span>Saving changes...</span>
              </>
            )}
            {saveState === "saved" && (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>All changes saved</span>
              </>
            )}
            {saveState === "unsaved" && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>Unsaved changes</span>
              </>
            )}
            {saveState === "error" && (
              <>
                <AlertCircle className="w-3 h-3 text-rose-600" />
                <span>Save error</span>
              </>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Customize Appearance
        </h1>

        <p className="text-xs text-muted-foreground max-w-xl">
          Visual theme studio with real-time mobile preview. Customize color tokens, typography, and button styling.
        </p>

        {errorMessage && (
          <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-2.5 text-xs text-rose-700 font-medium flex items-center gap-2 mt-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Top Bar Right: Action Controls */}
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetToDefault}
          className="rounded-lg text-xs font-medium gap-1.5 h-9 px-3 border-border"
          title="Reset current styling to template defaults"
        >
          <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Reset Defaults</span>
        </Button>

        <Link href={`/${username}`} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs font-medium gap-1.5 h-9 px-3 border-border"
          >
            <span>Preview Live</span>
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
