"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertTriangle, Lock } from "lucide-react";

export interface PasswordSettingsCardProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrent: boolean;
  showNew: boolean;
  isChanging: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onCurrentChange: (val: string) => void;
  onNewChange: (val: string) => void;
  onConfirmChange: (val: string) => void;
  onToggleShowCurrent: () => void;
  onToggleShowNew: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PasswordSettingsCard({
  currentPassword,
  newPassword,
  confirmPassword,
  showCurrent,
  showNew,
  isChanging,
  message,
  onCurrentChange,
  onNewChange,
  onConfirmChange,
  onToggleShowCurrent,
  onToggleShowNew,
  onSubmit,
}: PasswordSettingsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
          <KeyRound className="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Password &amp; Security
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Update your account login password to keep your profile secure.
          </p>
        </div>
      </div>

      {/* Inline Message */}
      {message && (
        <div
          className={`rounded-lg border p-3 text-xs font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
        <div className="space-y-1.5">
          <label htmlFor="current-password" className="block text-xs font-semibold text-foreground">
            Current Password
          </label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => onCurrentChange(e.target.value)}
              placeholder="Enter current password"
              required
              className="h-9 rounded-lg border-input bg-card text-xs font-medium px-3 pr-10"
            />
            <button
              type="button"
              onClick={onToggleShowCurrent}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="new-password" className="block text-xs font-semibold text-foreground">
            New Password
          </label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => onNewChange(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              minLength={8}
              className="h-9 rounded-lg border-input bg-card text-xs font-medium px-3 pr-10"
            />
            <button
              type="button"
              onClick={onToggleShowNew}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="block text-xs font-semibold text-foreground">
            Confirm New Password
          </label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => onConfirmChange(e.target.value)}
            placeholder="Repeat new password"
            required
            className="h-9 rounded-lg border-input bg-card text-xs font-medium px-3"
          />
        </div>

        <div className="pt-2">
          <Button
            id="update-password-btn"
            type="submit"
            disabled={isChanging}
            size="sm"
            className="h-9 px-4 gap-2 bg-primary hover:bg-primary/90 text-white font-medium text-xs rounded-lg"
          >
            {isChanging ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
