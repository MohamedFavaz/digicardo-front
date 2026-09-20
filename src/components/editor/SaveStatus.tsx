"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export type SaveState = "saved" | "saving" | "unsaved" | "error";

export interface SaveStatusProps {
  status: SaveState;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export function SaveStatus({
  status,
  errorMessage,
  onRetry,
}: SaveStatusProps) {
  switch (status) {
    case "saving":
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold shadow-2xs animate-in fade-in-50">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
          <span>Saving changes...</span>
        </div>
      );
    case "unsaved":
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber/30 text-amber-800 text-xs font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Unsaved changes</span>
        </div>
      );
    case "error":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-50 border border-coral/30 text-coral text-xs font-bold shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-coral" />
          <span>{errorMessage || "Save failed"}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-1 underline hover:text-rose-700 font-extrabold cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      );
    case "saved":
    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>All changes saved</span>
        </div>
      );
  }
}
