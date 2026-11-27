"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { stopImpersonationAndLeave } from "@/lib/auth/switch-account";

/**
 * Shown at the top of the agent and franchise panels while an admin has opened that account
 * ("Open panel" in the admin console). "Back to admin" restores the admin session.
 */
export function AdminViewingBanner() {
  const [name, setName] = useState<string | null>(null);
  // "admin" (admin viewing an agent / franchise / staff panel) or "franchise_owner" (owner viewing a staff panel).
  const [mode, setMode] = useState<"admin" | "franchise_owner">("admin");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/bff/v1/auth/me", { credentials: "include", headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const u = json?.data;
        if (alive && u?.is_impersonated && (u?.impersonator_role === "admin" || u?.impersonator_role === "franchise_owner")) {
          setMode(u.impersonator_role);
          setName(u.name || "this account");
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!name) return null;

  return (
    <div role="status" className="flex items-center justify-between gap-3 rounded-2xl bg-foreground px-4 py-2.5 text-white mx-4 mt-4 sm:mx-6 lg:mx-8">
      <div className="flex min-w-0 items-center gap-2.5 text-sm">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#C4B5FD]" aria-hidden="true" />
        <span className="shrink-0 font-semibold">{mode === "franchise_owner" ? "Owner mode" : "Admin mode"}</span>
        <span className="hidden text-white/70 sm:inline">·</span>
        <span className="truncate text-white/80">
          Viewing <span className="font-semibold text-white">{name}</span>&apos;s panel
        </span>
      </div>
      <button
        type="button"
        disabled={leaving}
        onClick={() => {
          setLeaving(true);
          void stopImpersonationAndLeave();
        }}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-foreground hover:bg-white/90 disabled:opacity-60"
      >
        {leaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowLeft className="h-4 w-4" aria-hidden="true" />}
        {leaving ? "Returning…" : mode === "franchise_owner" ? "Back to owner" : "Back to admin"}
      </button>
    </div>
  );
}
