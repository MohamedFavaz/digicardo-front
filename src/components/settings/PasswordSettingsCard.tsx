"use client";

import * as React from "react";
import { Check, Eye, EyeOff, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsMessage, SettingsSection, Spinner, settingsInput, settingsLabel, settingsPrimaryButton } from "./SettingsSection";

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

function PasswordInput({ id, value, onChange, show, onToggle, placeholder, autoComplete }: { id: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder: string; autoComplete: string }) {
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required className={cn(settingsInput, "pr-12")} />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
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
  const rules = [
    { ok: newPassword.length >= 8, text: "At least 8 characters" },
    { ok: /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword), text: "Letters and numbers" },
    { ok: newPassword !== "" && newPassword === confirmPassword, text: "Both new passwords match" },
  ];
  return (
    <SettingsSection icon={KeyRound} title="Password" description="Use a password you don't use anywhere else. You'll stay signed in on this device.">
      <SettingsMessage message={message} />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="current-password" className={settingsLabel}>
            Current password
          </label>
          <PasswordInput id="current-password" value={currentPassword} onChange={onCurrentChange} show={showCurrent} onToggle={onToggleShowCurrent} placeholder="Your current password" autoComplete="current-password" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new-password" className={settingsLabel}>
              New password
            </label>
            <PasswordInput id="new-password" value={newPassword} onChange={onNewChange} show={showNew} onToggle={onToggleShowNew} placeholder="At least 8 characters" autoComplete="new-password" />
          </div>
          <div>
            <label htmlFor="confirm-password" className={settingsLabel}>
              Repeat new password
            </label>
            <input id="confirm-password" type={showNew ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(e) => onConfirmChange(e.target.value)} placeholder="Type it again" required className={settingsInput} />
          </div>
        </div>
        {newPassword && (
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3" aria-label="Password checks">
            {rules.map((r) => (
              <li key={r.text} className={cn("flex items-center gap-1.5 text-[13px]", r.ok ? "text-[#1E7B43]" : "text-muted-foreground")}>
                <span className={cn("flex h-4 w-4 items-center justify-center rounded-full", r.ok ? "bg-[#22A55A] text-white" : "border border-input")}>
                  {r.ok && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
                </span>
                {r.text}
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end border-t border-border pt-4">
          <button id="update-password-btn" type="submit" disabled={isChanging} className={settingsPrimaryButton}>
            {isChanging && <Spinner />}
            {isChanging ? "Changing…" : "Change password"}
          </button>
        </div>
      </form>
    </SettingsSection>
  );
}
