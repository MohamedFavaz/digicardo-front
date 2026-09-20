"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X, Shield, UserX } from "lucide-react";
import type { AdminUserItem } from "@/types/admin";

export interface UserActionModalProps {
  user: AdminUserItem | null;
  actionType: "status" | "role" | null;
  newStatus: "active" | "suspended" | "banned";
  newRole: "user" | "moderator" | "admin";
  reason: string;
  submitting: boolean;
  error: string | null;
  onStatusChange: (val: "active" | "suspended" | "banned") => void;
  onRoleChange: (val: "user" | "moderator" | "admin") => void;
  onReasonChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function UserActionModal({
  user,
  actionType,
  newStatus,
  newRole,
  reason,
  submitting,
  error,
  onStatusChange,
  onRoleChange,
  onReasonChange,
  onClose,
  onSubmit,
}: UserActionModalProps) {
  if (!user || !actionType) return null;

  const isStatus = actionType === "status";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-action-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
    >
      <div className="relative w-full max-w-md rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-float space-y-5 animate-in zoom-in-95 select-none">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xs ${
                isStatus ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-purple-50 text-purple-600 border border-purple-200"
              }`}
            >
              {isStatus ? <UserX className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h3 id="user-action-dialog-title" className="text-base font-black text-foreground">
                {isStatus ? "Update Account Standing" : "Change User Role"}
              </h3>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                {user.email}
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
          {isStatus ? (
            <div className="space-y-1.5">
              <label htmlFor="user-new-status" className="block text-xs font-black text-foreground">
                New Account Status
              </label>
              <select
                id="user-new-status"
                value={newStatus}
                onChange={(e) => onStatusChange(e.target.value as "active" | "suspended" | "banned")}
                className="w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="active">Active (Full access)</option>
                <option value="suspended">Suspended (Revokes active sessions)</option>
                <option value="banned">Banned (Permanent restriction)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label htmlFor="user-new-role" className="block text-xs font-black text-foreground">
                Assign System Role
              </label>
              <select
                id="user-new-role"
                value={newRole}
                onChange={(e) => onRoleChange(e.target.value as "user" | "moderator" | "admin")}
                className="w-full rounded-2xl border border-input bg-card px-4 py-2.5 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="user">User (Standard creator)</option>
                <option value="moderator">Moderator (Reports &amp; profiles)</option>
                <option value="admin">Administrator (Full control plane)</option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="user-action-reason" className="block text-xs font-black text-foreground">
              Reason / Justification Note (Logged to audit trail)
            </label>
            <textarea
              id="user-action-reason"
              rows={3}
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Explain why this governance action was performed..."
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
              id="confirm-user-action-submit-btn"
              type="submit"
              size="sm"
              disabled={submitting}
              className="rounded-full text-xs font-black h-9 px-5 bg-brand-600 hover:bg-brand-700 text-white shadow-cta gap-1.5"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : null}
              <span>{submitting ? "Applying..." : "Confirm Action"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
