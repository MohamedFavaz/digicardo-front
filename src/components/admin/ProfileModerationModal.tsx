"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X, ShieldBan } from "lucide-react";
import type { AdminProfileItem } from "@/types/admin";

export interface ProfileModerationModalProps {
  profile: AdminProfileItem | null;
  newStatus: "active" | "under_review" | "restricted" | "suspended";
  reason: string;
  notes: string;
  submitting: boolean;
  error: string | null;
  onStatusChange: (val: "active" | "under_review" | "restricted" | "suspended") => void;
  onReasonChange: (val: string) => void;
  onNotesChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileModerationModal({
  profile,
  newStatus,
  reason,
  notes,
  submitting,
  error,
  onStatusChange,
  onReasonChange,
  onNotesChange,
  onClose,
  onSubmit,
}: ProfileModerationModalProps) {
  if (!profile) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-moderation-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
    >
      <div className="relative w-full max-w-md rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-float space-y-5 animate-in zoom-in-95 select-none">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-600 flex items-center justify-center shadow-2xs">
              <ShieldBan className="w-5 h-5" />
            </div>
            <div>
              <h3 id="profile-moderation-dialog-title" className="text-base font-black text-foreground">
                Moderate @{profile.username}
              </h3>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                Owner: {profile.user?.email || "Unknown"}
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
            <label htmlFor="profile-new-status" className="block text-xs font-black text-foreground">
              Moderation Status
            </label>
            <select
              id="profile-new-status"
              value={newStatus}
              onChange={(e) => onStatusChange(e.target.value as "active" | "under_review" | "restricted" | "suspended")}
              className="w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="active">Active (Fully Public)</option>
              <option value="under_review">Under Review (Visible while investigated)</option>
              <option value="restricted">Restricted (Returns safe 404 to public)</option>
              <option value="suspended">Suspended (Returns safe 404 to public)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-moderation-reason" className="block text-xs font-black text-foreground">
              Reason for Decision (Required for Restricted/Suspended)
            </label>
            <input
              id="profile-moderation-reason"
              type="text"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="e.g. Terms violation, malware, impersonation..."
              className="w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-moderation-notes" className="block text-xs font-black text-foreground">
              Internal Compliance Notes
            </label>
            <textarea
              id="profile-moderation-notes"
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Internal notes for moderation audit..."
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
              id="confirm-profile-moderation-submit-btn"
              type="submit"
              size="sm"
              disabled={submitting}
              className="rounded-full text-xs font-black h-9 px-5 bg-purple-600 hover:bg-purple-700 text-white shadow-cta gap-1.5"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : null}
              <span>{submitting ? "Applying..." : "Confirm Moderation"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
