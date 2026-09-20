"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2 } from "lucide-react";
import type { AbuseReportItem } from "@/types/admin";

export interface ReportResolveModalProps {
  report: AbuseReportItem | null;
  newStatus: "open" | "investigating" | "resolved" | "dismissed";
  notes: string;
  submitting: boolean;
  error: string | null;
  onStatusChange: (val: "open" | "investigating" | "resolved" | "dismissed") => void;
  onNotesChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReportResolveModal({
  report,
  newStatus,
  notes,
  submitting,
  error,
  onStatusChange,
  onNotesChange,
  onClose,
  onSubmit,
}: ReportResolveModalProps) {
  if (!report) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-resolve-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
    >
      <div className="relative w-full max-w-md rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-float space-y-5 animate-in zoom-in-95 select-none">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="report-resolve-dialog-title" className="text-base font-black text-foreground">
                Triage Abuse Report
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                @{report.profile?.username || "Deleted Profile"} · {report.reason}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="report-new-status" className="block text-xs font-black text-foreground">
              Resolution Status
            </label>
            <select
              id="report-new-status"
              value={newStatus}
              onChange={(e) => onStatusChange(e.target.value as "open" | "investigating" | "resolved" | "dismissed")}
              className="w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="resolved">Resolved (Action Taken / Profile Corrected)</option>
              <option value="investigating">Investigating (Gathering info)</option>
              <option value="dismissed">Dismissed (False Report / No Violation)</option>
              <option value="open">Re-open for Review</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="report-resolution-notes" className="block text-xs font-black text-foreground">
              Resolution Notes &amp; Summary
            </label>
            <textarea
              id="report-resolution-notes"
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Provide context regarding the decision or action taken..."
              className="w-full rounded-2xl border border-input bg-card p-3.5 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full text-xs font-bold h-9 px-4 bg-card"
            >
              Cancel
            </Button>

            <Button
              id="confirm-report-resolve-submit-btn"
              type="submit"
              size="sm"
              disabled={submitting}
              className="rounded-full text-xs font-black h-9 px-5 bg-rose-600 hover:bg-rose-700 text-white shadow-cta gap-1.5"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : null}
              <span>{submitting ? "Saving..." : "Save Resolution"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
