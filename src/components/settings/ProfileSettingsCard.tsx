"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, UserRound } from "lucide-react";
import type { AccountUser } from "@/types/account";
import { SettingsMessage, SettingsSection, Spinner, settingsInput, settingsLabel, settingsPrimaryButton } from "./SettingsSection";

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

export function ProfileSettingsCard({ account, name, email, isSaving, message, onNameChange, onEmailChange, onSubmit }: ProfileSettingsCardProps) {
  const changed = !!account && (name.trim() !== account.name || email.trim() !== account.email);
  return (
    <SettingsSection icon={UserRound} title="Your details" description="The name and email you sign in with. Your card's name is changed in Edit card.">
      <SettingsMessage message={message} />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="account-name" className={settingsLabel}>
            Full name
          </label>
          <input id="account-name" type="text" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Alex Rivers" required autoComplete="name" className={settingsInput} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="account-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            {account?.is_email_verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F6EC] px-2 py-0.5 text-xs font-medium text-[#1E7B43]">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-xs font-medium text-[#92400E]">
                <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Not verified
              </span>
            )}
          </div>
          <input id="account-email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="you@example.com" required autoComplete="email" className={settingsInput} />
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{changed ? "You have unsaved changes." : "Up to date."}</p>
          <button id="save-account-details-btn" type="submit" disabled={isSaving || !changed} className={settingsPrimaryButton}>
            {isSaving && <Spinner />}
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </SettingsSection>
  );
}
