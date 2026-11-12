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
  templateName?: string;
  saveState: SaveState;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  errorMessage?: string | null;
  onDiscard?: () => void;
  onResetToDefault: () => void;
  onSave: () => void;
}

export function AppearanceHeader({
  profile,
  templateName,
  saveState,
  hasUnsavedChanges,
  isSaving,
  errorMessage,
  onDiscard,
  onResetToDefault,
  onSave,
}: AppearanceHeaderProps) {
  const username = profile?.username || "demo";

  return (
    <div className="pb-6 border-b border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Top Bar Left: Back Link + Studio Title & Save Indicator */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap text-xs font-medium mb-1">
          <Link
            href="/dashboard/page"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Page</span>
          </Link>

          {/* Real-Time Save Status Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all border",
              saveState === "saving" && "bg-amber-50 text-amber-800 border-amber-200",
              saveState === "saved" && "bg-emerald-50 text-emerald-800 border-emerald-200/80",
              saveState === "unsaved" && "bg-amber-50 text-amber-800 border-amber-200/80",
              saveState === "error" && "bg-rose-50 text-rose-700 border-rose-200"
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
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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

        <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customize Appearance
          </h1>
          {templateName && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200/60">
              {templateName}
            </span>
          )}
        </div>

        <p className="text-slate-500 font-medium text-xs max-w-xl mt-1 leading-relaxed">
          Visual theme studio with real-time mobile preview. Customize color tokens, background, typography, and button styling.
        </p>

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 font-medium flex items-center gap-2 mt-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Top Bar Right: Action Controls */}
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
        {hasUnsavedChanges && onDiscard && (
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="px-4 py-2 rounded-full border border-slate-200/80 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            Discard
          </button>
        )}

        <button
          type="button"
          onClick={onResetToDefault}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          title="Reset current styling to template defaults"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Defaults</span>
        </button>

        <Link href={`/${username}`} target="_blank" rel="noreferrer">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer">
            <span>Preview Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </span>
        </Link>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
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
        </button>
      </div>
    </div>
  );
}
