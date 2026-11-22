"use client";

import * as React from "react";
import { AlertCircle, AtSign, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { cleanUsername, usernameApi, usernameErrorMessage } from "@/lib/api/username";
import { cn } from "@/lib/utils";

/**
 * "Change card address" pop-up, shared by the owner dashboard, the admin console and the partner
 * panel. Checks availability as you type; the old address keeps forwarding to the new one.
 */
export function ChangeUsernameDialog({
  open,
  onClose,
  currentUsername,
  profileId,
  save,
  onSaved,
  who = "your",
}: {
  open: boolean;
  onClose: () => void;
  currentUsername: string;
  /** Card being edited (admins/agents), so its own address counts as available. */
  profileId?: string;
  /** Performs the change; throws on failure. */
  save: (username: string) => Promise<{ username: string }>;
  onSaved?: (username: string) => void;
  /** "your" for the owner, "this" for admins/agents. */
  who?: "your" | "this";
}) {
  const [value, setValue] = React.useState(currentUsername);
  const [check, setCheck] = React.useState<{ state: "idle" | "checking" | "ok" | "bad"; message?: string }>({ state: "idle" });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputId = React.useId();
  const host = typeof window !== "undefined" ? window.location.host : "digicardo";

  React.useEffect(() => {
    if (open) {
      setValue(currentUsername);
      setCheck({ state: "idle" });
      setError(null);
    }
  }, [open, currentUsername]);

  // Availability, checked shortly after typing stops.
  React.useEffect(() => {
    if (!open) return;
    const name = value.trim();
    if (!name || name === currentUsername) {
      setCheck({ state: "idle" });
      return;
    }
    if (name.length < 3) {
      setCheck({ state: "bad", message: "At least 3 characters." });
      return;
    }
    setCheck({ state: "checking" });
    let cancelled = false;
    const t = window.setTimeout(async () => {
      try {
        const res = await usernameApi.check(name, profileId);
        if (!cancelled) setCheck(res.available ? { state: "ok", message: "Available" } : { state: "bad", message: res.message ?? "Not available." });
      } catch {
        if (!cancelled) setCheck({ state: "idle" });
      }
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [value, open, currentUsername, profileId]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, saving, onClose]);

  if (!open) return null;

  const unchanged = value.trim() === currentUsername;
  const canSave = !saving && !unchanged && value.trim().length >= 3 && check.state !== "bad" && check.state !== "checking";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      const res = await save(value.trim());
      onSaved?.(res.username);
      onClose();
    } catch (err) {
      setError(usernameErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${inputId}-title`}
        className="w-full max-w-[460px] rounded-t-[24px] border border-border bg-card p-6 shadow-2xl sm:rounded-[24px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={`${inputId}-title`} className="text-[18px] font-semibold text-foreground">
              Change card address
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">The link people open to see {who} card.</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <label htmlFor={inputId} className="mt-5 block text-[13px] font-medium text-foreground">
          New address
        </label>
        <div
          className={cn(
            "mt-1.5 flex h-12 items-center rounded-xl border bg-background px-3.5 text-[15px] focus-within:ring-2 focus-within:ring-primary/20",
            check.state === "bad" ? "border-destructive" : check.state === "ok" ? "border-emerald-500" : "border-input",
          )}
        >
          <span className="shrink-0 select-none text-muted-foreground">{host}/</span>
          <input
            id={inputId}
            value={value}
            onChange={(e) => {
              setValue(cleanUsername(e.target.value));
              setError(null);
            }}
            autoFocus
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            maxLength={30}
            aria-invalid={check.state === "bad"}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-medium text-foreground shadow-none outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
          />
          <span className="ml-2 shrink-0" aria-live="polite">
            {check.state === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Checking" />}
            {check.state === "ok" && <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="Available" />}
            {check.state === "bad" && <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />}
          </span>
        </div>
        <p className={cn("mt-1.5 min-h-[18px] text-[12px]", check.state === "bad" ? "text-destructive" : check.state === "ok" ? "text-emerald-700" : "text-muted-foreground")}>
          {check.state === "bad" || check.state === "ok" ? check.message : "3–30 characters: letters, numbers, - and _."}
        </p>

        <div className="mt-3 flex gap-2.5 rounded-xl bg-muted/60 p-3 text-[12.5px] leading-5 text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            The old address <span className="font-semibold text-foreground">{host}/{currentUsername}</span> keeps working and forwards to the new one, so printed QR codes and NFC cards still open {who} card.
          </span>
        </div>

        {error && (
          <p role="alert" className="mt-3 flex items-start gap-1.5 text-[13px] font-medium text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="h-11 rounded-full px-5 text-[14px] font-semibold text-foreground transition-colors hover:bg-muted">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <AtSign className="h-4 w-4" aria-hidden="true" />}
            {saving ? "Saving…" : "Change address"}
          </button>
        </div>
      </form>
    </div>
  );
}
