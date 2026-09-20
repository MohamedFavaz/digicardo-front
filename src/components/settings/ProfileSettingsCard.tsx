"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import type { AccountUser } from "@/types/account";

export interface ProfileSettingsCardProps {
  account: AccountUser | null;
  name: string;
  email: string;
  isSaving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileSettingsCard({
  account,
  name,
  email,
  isSaving,
  message,
  onNameChange,
  onEmailChange,
  onSubmit,
}: ProfileSettingsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <User className="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Personal Details
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Update your account display name and primary email address.
          </p>
        </div>
      </div>

      {/* Inline Feedback Banner */}
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
          <label htmlFor="account-name" className="block text-xs font-semibold text-foreground">
            Full Name
          </label>
          <Input
            id="account-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Alex Rivers"
            required
            className="h-9 rounded-lg border-input bg-card text-xs font-medium px-3"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="account-email" className="block text-xs font-semibold text-foreground">
              Email Address
            </label>
            {account?.is_email_verified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Unverified</span>
              </span>
            )}
          </div>
          <Input
            id="account-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-9 rounded-lg border-input bg-card text-xs font-medium px-3"
          />
        </div>

        <div className="pt-2">
          <Button
            id="save-account-details-btn"
            type="submit"
            disabled={isSaving}
            size="sm"
            className="h-9 px-4 gap-2 bg-primary hover:bg-primary/90 text-white font-medium text-xs rounded-lg"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
