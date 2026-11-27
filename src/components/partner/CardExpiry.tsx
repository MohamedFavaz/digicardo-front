"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Days until `iso` (negative once it has passed). */
function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

/** "Expires 27 Nov 2027" / "Expires in 3 days" / "Expired" — for card lists and pages. */
export function ExpiryLabel({ expiresAt, plan, className }: { expiresAt?: string | null; plan?: string | null; className?: string }) {
  if (!expiresAt) return <span className={cn("text-xs text-muted-foreground", className)}>No expiry</span>;
  const days = daysUntil(expiresAt);
  const date = new Date(expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const tone = days <= 0 ? "bg-[#FDECEC] text-destructive" : days <= 7 ? "bg-[#FEF3C7] text-[#92400E]" : "bg-muted text-[#52525B]";
  return (
    <span className={cn("inline-flex flex-col", className)}>
      <span className={cn("w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", tone)}>
        {days <= 0 ? "Expired" : days <= 7 ? `${days} day${days === 1 ? "" : "s"} left` : date}
      </span>
      <span className="mt-0.5 whitespace-nowrap text-xs text-muted-foreground">
        {days <= 0 ? `on ${date}` : plan || ""}
      </span>
    </span>
  );
}

interface ExpiringCard {
  id: string;
  card_name: string;
  username?: string | null;
  expires_at: string;
  expired: boolean;
  days_left: number;
  created_by?: string | null;
}

/**
 * Alert at the top of the agent and franchise panels when cards have expired or expire within a
 * week. Can be hidden for the rest of the browser session.
 */
export function ExpiryAlert({ panel }: { panel: "agent" | "franchise" }) {
  const [data, setData] = useState<{ expired: number; expiring: number; cards: ExpiringCard[] } | null>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(`expiry-alert-hidden-${panel}`) === "1") setHidden(true);
    } catch {
      // storage unavailable: always show
    }
    fetch(`/api/bff/v1/${panel}/cards/expiring`, { credentials: "include", headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.data && setData(j.data))
      .catch(() => {});
  }, [panel]);

  if (hidden || !data || data.expired + data.expiring === 0) return null;

  const parts = [
    data.expired > 0 && `${data.expired} card${data.expired === 1 ? " has" : "s have"} expired`,
    data.expiring > 0 && `${data.expiring} card${data.expiring === 1 ? "" : "s"} expire${data.expiring === 1 ? "s" : ""} within a week`,
  ].filter(Boolean);

  return (
    <div
      role="alert"
      className={cn(
        "mx-4 mt-4 rounded-2xl border px-4 py-3 sm:mx-6 lg:mx-8",
        data.expired > 0 ? "border-[#F5C2C2] bg-[#FDF1F1]" : "border-[#F3D58A] bg-[#FFF8E6]",
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className={cn("mt-0.5 h-5 w-5 shrink-0", data.expired > 0 ? "text-destructive" : "text-[#B45309]")} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{parts.join(" · ")}</p>
          <p className="text-sm text-muted-foreground">
            {panel === "franchise" ? (
              <>
                Renew them with a plan on the{" "}
                <Link href="/franchise/renewals" className="font-medium text-foreground underline underline-offset-2">
                  Renewals
                </Link>{" "}
                page.
              </>
            )
              : "Remind these customers to renew. The admin renews expired cards."}
          </p>
          {open && (
            <ul className="mt-2 divide-y divide-black/5 rounded-xl bg-white/70">
              {data.cards.map((c) => (
                <li key={c.id}>
                  <Link href={`/${panel}/cards/${c.id}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-white">
                    <span className="min-w-0 truncate">
                      <span className="font-medium text-foreground">{c.card_name}</span>
                      {c.username && <span className="text-muted-foreground"> · /{c.username}</span>}
                      {c.created_by && <span className="text-muted-foreground"> · by {c.created_by}</span>}
                    </span>
                    <ExpiryLabel expiresAt={c.expires_at} className="shrink-0 items-end" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-white/70">
          {open ? "Hide" : "See cards"} {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setHidden(true);
            try {
              sessionStorage.setItem(`expiry-alert-hidden-${panel}`, "1");
            } catch {
              // ignore
            }
          }}
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-white/70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
