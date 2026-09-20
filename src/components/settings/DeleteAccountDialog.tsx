"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Trash2, X } from "lucide-react";

export interface DeleteAccountDialogProps {
  open: boolean;
  isDeleting: boolean;
  password: string;
  phrase: string;
  error: string | null;
  onPasswordChange: (val: string) => void;
  onPhraseChange: (val: string) => void;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void;
}

export function DeleteAccountDialog({
  open,
  isDeleting,
  password,
  phrase,
  error,
  onPasswordChange,
  onPhraseChange,
  onClose,
  onConfirm,
}: DeleteAccountDialogProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50"
    >
      <div className="relative w-full max-w-md rounded-[32px] border border-rose-200 bg-card p-6 sm:p-7 shadow-float space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="delete-account-dialog-title" className="text-base font-black text-foreground">
                Permanently Delete Account?
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                This action is destructive and irreversible
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
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-800 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={onConfirm} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="delete-confirm-password" className="block text-xs font-black text-foreground">
              Enter Your Password
            </label>
            <Input
              id="delete-confirm-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter account password"
              required
              className="h-11 rounded-2xl border-input bg-card text-xs font-semibold px-4"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="delete-confirm-phrase" className="block text-xs font-black text-foreground">
              Type <strong className="text-rose-600 font-mono">DELETE MY ACCOUNT</strong> to confirm
            </label>
            <Input
              id="delete-confirm-phrase"
              type="text"
              value={phrase}
              onChange={(e) => onPhraseChange(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              required
              className="h-11 rounded-2xl border-input bg-card text-xs font-semibold px-4"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-full text-xs font-bold h-9 px-4 bg-card"
            >
              Cancel
            </Button>

            <Button
              id="confirm-delete-account-submit-btn"
              type="submit"
              size="sm"
              disabled={isDeleting || phrase !== "DELETE MY ACCOUNT"}
              className="rounded-full text-xs font-black h-9 px-5 bg-rose-600 hover:bg-rose-700 text-white shadow-xs gap-1.5 disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>{isDeleting ? "Deleting..." : "Permanently Delete"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
