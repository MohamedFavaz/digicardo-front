"use client";

import * as React from "react";
import { AlertTriangle, Check, Loader2 } from "lucide-react";

export type SaveState = "saved" | "saving" | "unsaved" | "error";

export interface SaveStatusProps {
  status: SaveState;
  errorMessage?: string | null;
  onRetry?: () => void;
}

/**
 * Save status (design system v6): always an icon + words, never colour alone.
 * Announced to screen readers via role="status".
 */
export function SaveStatus({ status, errorMessage, onRetry }: SaveStatusProps) {
  if (status === "saving") {
    return (
      <span role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#52525B]">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
        Saving…
      </span>
    );
  }

  if (status === "unsaved") {
    return (
      <span role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-warning">
        <span className="h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
        Unsaved changes
      </span>
    );
  }

  if (status === "error") {
    return (
      <span role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        {errorMessage || "Couldn't save"}
        {onRetry && (
          <button type="button" onClick={onRetry} className="ml-1 font-semibold underline underline-offset-2">
            Try again
          </button>
        )}
      </span>
    );
  }

  return (
    <span role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
      <Check className="h-4 w-4" aria-hidden="true" />
      All changes saved
    </span>
  );
}
