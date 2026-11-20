"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/** Previous / next footer for paged console tables. */
export function Pager({ page, lastPage, total, onPage }: { page: number; lastPage: number; total?: number; onPage: (p: number) => void }) {
  if (lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3">
      <span className="text-[13px] text-muted-foreground">
        Page {page} of {lastPage}
        {typeof total === "number" ? ` · ${total.toLocaleString()} total` : ""}
      </span>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="inline-flex h-9 items-center gap-1 rounded-full border border-input bg-card px-3 text-[13px] disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
        </button>
        <button type="button" disabled={page >= lastPage} onClick={() => onPage(page + 1)} className="inline-flex h-9 items-center gap-1 rounded-full border border-input bg-card px-3 text-[13px] disabled:opacity-40">
          Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/** Segmented filter (pill tabs) used above console tables. */
export function FilterTabs<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string; count?: number }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] ${value === o.id ? "bg-card font-medium text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
        >
          {o.label}
          {typeof o.count === "number" && <span className="rounded-full bg-muted px-1.5 text-[11px] tabular-nums">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}
