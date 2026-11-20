"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Mail, MessageSquareOff, Undo2 } from "lucide-react";
import type { Paged, SentMessage } from "@/lib/api/broadcasts";
import { EmptyState, StatusPill } from "@/components/console/ui";
import { cn } from "@/lib/utils";

function when(iso: string) {
  const d = new Date(iso);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.floor(mins / 60)} h ago`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function SentRow({ m, showSender, onUnsend }: { m: SentMessage; showSender: boolean; onUnsend: (m: SentMessage) => Promise<void> }) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const pct = m.recipient_count > 0 ? Math.round((m.read_count / m.recipient_count) * 100) : 0;
  const retracted = !!m.retracted_at;

  return (
    <li className={cn("px-4 py-4 sm:px-5", retracted && "bg-[#FAFAFA]")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={cn("break-words text-sm font-semibold", retracted ? "text-muted-foreground line-through" : "text-foreground")}>{m.title}</p>
            {retracted && <StatusPill tone="neutral">Unsent</StatusPill>}
            {m.emailed && !retracted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-[#52525B]">
                <Mail className="h-3 w-3" aria-hidden="true" /> Emailed
              </span>
            )}
          </div>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mt-1 block w-full text-left">
            <span className={cn("block whitespace-pre-line break-words text-sm text-[#52525B]", !open && "line-clamp-2")}>{m.body}</span>
          </button>
          {open && m.link_url && (
            <a href={m.link_url} target={m.link_url.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              {m.link_url} <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-[#52525B]">To {m.audience_label}</span>
            <span aria-hidden="true">·</span>
            <span>{when(m.created_at)}</span>
            {showSender && m.sender && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  by {m.sender_role === "agent" ? <span className="font-medium text-[#92400E]">agent {m.sender.name}</span> : m.sender.name}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          {!retracted ? (
            <div className="w-36" title={`${m.read_count} of ${m.recipient_count} have opened it`}>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Read</span>
                <span className="font-medium text-foreground">
                  {m.read_count}/{m.recipient_count}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Was sent to {m.recipient_count}</span>
          )}
          {!retracted && (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                if (!confirm(`Unsend “${m.title}”? It disappears from everyone's notifications.`)) return;
                setBusy(true);
                await onUnsend(m).finally(() => setBusy(false));
              }}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[#52525B] hover:bg-[#FDECEC] hover:text-destructive disabled:opacity-50"
            >
              <Undo2 className="h-3.5 w-3.5" aria-hidden="true" /> {busy ? "Unsending…" : "Unsend"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

/** History of sent messages with read progress and "Unsend". */
export function SentMessages({
  load,
  unsend,
  refreshKey,
  showSender = false,
  filters,
  emptyText,
}: {
  load: (page: number, filter?: string) => Promise<Paged<SentMessage>>;
  unsend: (id: string) => Promise<unknown>;
  refreshKey: number;
  showSender?: boolean;
  filters?: { id: string; label: string }[];
  emptyText: string;
}) {
  const [page, setPage] = React.useState(1);
  const [filter, setFilter] = React.useState(filters?.[0]?.id ?? "");
  const [data, setData] = React.useState<Paged<SentMessage> | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const loadRef = React.useRef(load);
  loadRef.current = load;

  const fetchPage = React.useCallback(() => {
    loadRef
      .current(page, filter || undefined)
      .then((d) => (setData(d), setError(null)))
      .catch((e: Error) => setError(e.message));
  }, [page, filter]);

  React.useEffect(() => {
    fetchPage();
  }, [fetchPage, refreshKey]);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Sent messages</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">See who read them, or unsend one.</p>
        </div>
        {filters && (
          <div role="tablist" aria-label="Filter sent messages" className="inline-flex self-start rounded-[10px] bg-muted p-[3px]">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => {
                  setFilter(f.id);
                  setPage(1);
                }}
                className={cn("h-8 rounded-lg px-3 text-[13px]", filter === f.id ? "bg-card font-semibold text-foreground shadow-xs" : "font-medium text-[#52525B] hover:text-foreground")}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <p className="p-5 text-sm text-destructive">{error}</p>
      ) : data === null ? (
        <div className="space-y-3 p-5" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <EmptyState icon={MessageSquareOff} title="Nothing sent yet" text={emptyText} />
      ) : (
        <ul className="divide-y divide-border">
          {data.items.map((m) => (
            <SentRow
              key={m.id}
              m={m}
              showSender={showSender}
              onUnsend={async (msg) => {
                try {
                  await unsend(msg.id);
                  fetchPage();
                } catch (e) {
                  alert(e instanceof Error ? e.message : "Couldn't unsend.");
                }
              }}
            />
          ))}
        </ul>
      )}

      {data && data.pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <span className="text-[13px] text-muted-foreground">
            Page {data.pagination.current_page} of {data.pagination.last_page}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="inline-flex h-9 items-center gap-1 rounded-lg border border-input bg-card px-3 text-[13px] font-semibold disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
            </button>
            <button type="button" disabled={page >= data.pagination.last_page} onClick={() => setPage(page + 1)} className="inline-flex h-9 items-center gap-1 rounded-lg border border-input bg-card px-3 text-[13px] font-semibold disabled:opacity-40">
              Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
