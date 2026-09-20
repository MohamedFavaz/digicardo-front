"use client";

import * as React from "react";
import { AlertTriangle, Trash2, X, ExternalLink } from "lucide-react";

export interface DeleteUserTarget {
  id: string;
  name: string;
  email: string;
  username?: string;
}

export interface DeleteUserModalProps {
  user: DeleteUserTarget | null;
  isOpen: boolean;
  isDeleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserModal({
  user,
  isOpen,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close dialog"
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 id="delete-user-dialog-title" className="text-base font-bold text-slate-900">
              Are you sure you want to delete?
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Permanently delete user login and public profile link
            </p>
          </div>
        </div>

        {/* User details card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">User Name:</span>
            <span className="font-semibold text-slate-800">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Email / Login:</span>
            <span className="font-mono text-slate-700 text-[11px] truncate max-w-[200px]">{user.email}</span>
          </div>
          {user.username && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Profile Link:</span>
              <span className="font-mono text-indigo-600 text-[11px] flex items-center gap-1">
                /{user.username}
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </span>
            </div>
          )}
        </div>

        {/* Warning callout */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/70 border border-red-200 text-red-700 text-[11px] leading-relaxed">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <span className="font-bold">Permanent Deletion:</span> When you click <strong>OK, Delete</strong>, this user login and profile link will be <strong>permanently deleted from both the database and the web</strong>. This action cannot be undone.
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-800 text-[12px] font-medium">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-[12px] font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold shadow-sm shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Deleting…</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>OK, Delete</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
