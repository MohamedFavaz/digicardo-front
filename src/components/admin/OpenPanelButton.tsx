"use client";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { adminImpersonate } from "@/lib/admin/impersonate";
import { cn } from "@/lib/utils";

/** Admin: sign in as an agent / franchise owner / franchise staff and open their panel. */
export function OpenPanelButton({ userId, label, disabled, small }: { userId: string; label: string; disabled?: boolean; small?: boolean }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled || busy}
      title={disabled ? "The account must be active" : undefined}
      onClick={async () => {
        setBusy(true);
        try {
          await adminImpersonate(userId);
        } catch (e) {
          alert(e instanceof Error ? e.message : "Couldn't open this account.");
          setBusy(false);
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors disabled:opacity-50",
        small ? "h-8 whitespace-nowrap border border-border bg-card px-3 text-xs font-semibold text-[#343C22] hover:bg-muted" : "h-10 bg-[#343C22] px-4 text-sm text-white hover:bg-[#4B5634]",
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
      {label}
    </button>
  );
}
