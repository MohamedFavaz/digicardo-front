"use client";
import type * as React from "react";
import { rupees } from "@/lib/franchise/api";

/**
 * Shared chart pieces for the admin and franchise Analytics pages.
 *
 * Colours were run through the data-viz validator (lightness band, chroma, colour-blind
 * separation on all pairs, 3:1 contrast on the panel surface #FBFBF8). Series colours mark
 * identity only; text always stays in text colours.
 */
export const CHART = {
  views: "#5A7A1F",
  taps: "#257de0",
  /** Who made a card: admin (olive) · agents (blue) · franchises (magenta). */
  source: { admin: "#5A7A1F", agents: "#257de0", franchises: "#C2337A" } as Record<"admin" | "agents" | "franchises", string>,
  grid: "#E9E9E2",
  axis: "#8A8C80",
  status: { live: "#1E7B43", expiring: "#B45309", expired: "#C62828", hidden: "#A1A1AA", blocked: "#52525B" },
};

export const SOURCE_LABEL = { admin: "Admin", agents: "Agents", franchises: "Franchises" } as const;

export const monthLabel = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "short" });
};
export const dayLabel = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};
export const num = (n: number) => n.toLocaleString("en-IN");
export const rupeeTick = (v: number) => (v >= 1000 ? `₹${Number((v / 1000).toFixed(1))}k` : `₹${v}`);

/** Tooltip card (text in text colours; a swatch carries the series colour). */
export function ChartTip({
  active,
  label,
  payload,
  format,
  money,
  total,
}: {
  active?: boolean;
  label?: string;
  payload?: { name: string; value: number; color: string }[];
  format: (l: string) => string;
  money?: boolean;
  total?: boolean;
}) {
  if (!active || !payload?.length) return null;
  const fmt = (v: number) => (money ? rupees(v) : num(v));
  return (
    <div className="rounded-xl border border-[#E9E9E2] bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-[#121212]">{format(String(label))}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-[#52525B]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
          {p.name}: <span className="font-semibold text-[#121212]">{fmt(p.value)}</span>
        </p>
      ))}
      {total && payload.length > 1 && (
        <p className="mt-1 border-t border-[#E9E9E2] pt-1 font-semibold text-[#121212]">Total: {fmt(payload.reduce((s, p) => s + (Number(p.value) || 0), 0))}</p>
      )}
    </div>
  );
}

/** Legend row (always shown for two or more series). */
export function Legend({ items }: { items: { label: string; color: string; line?: boolean }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#52525B]" aria-label="Legend">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className={i.line ? "h-0.5 w-4 rounded" : "h-2.5 w-2.5 rounded-sm"} style={{ background: i.color }} aria-hidden="true" />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/** Labelled horizontal bars (HTML) — readable on phones and doubles as the table view. */
export function BarList({
  rows,
  color,
  valueLabel,
}: {
  rows: { key: string; label: React.ReactNode; value: number; extra?: React.ReactNode; color?: string }[];
  color: string;
  valueLabel?: (v: number) => string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3 px-5 py-4">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
            <span className="min-w-0 max-w-full truncate text-[#121212]">{r.label}</span>
            <span className="font-medium text-[#121212]">
              {valueLabel ? valueLabel(r.value) : num(r.value)}
              {r.extra}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#EFEFE8]">
            <div className="h-full rounded-full" style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, background: r.color ?? color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
