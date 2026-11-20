"use client";

import * as React from "react";
import { ExternalLink, Flag, Gavel, History, Loader2, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ConsolePage, EmptyState, PageHeader, Panel, StatusPill } from "@/components/console/ui";
import { FilterTabs, Pager } from "@/components/console/Pager";
import { adminCall, humanize, timeAgo, type Paged } from "@/lib/api/admin-console";

type ModStatus = "active" | "under_review" | "restricted" | "suspended";

interface CardRow {
  id: string;
  username: string;
  display_name: string | null;
  is_public: boolean;
  moderation_status: ModStatus;
  moderation_reason: string | null;
  moderated_at: string | null;
  created_at: string;
  user?: { name: string; email: string } | null;
}

interface ActionRow {
  id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  reason: string | null;
  created_at: string;
  metadata?: Record<string, unknown> | null;
  actor?: { name: string } | null;
}

const LABEL: Record<ModStatus, string> = { active: "Visible", under_review: "Under review", restricted: "Restricted", suspended: "Hidden" };
const TONE: Record<ModStatus, "success" | "warning" | "danger" | "neutral"> = { active: "success", under_review: "warning", restricted: "warning", suspended: "danger" };
const HELP: Record<ModStatus, string> = {
  active: "Card is public as normal.",
  under_review: "Still public; flagged for a closer look.",
  restricted: "Card shows a limited version.",
  suspended: "Card is hidden from the public.",
};

function CardModRow({ card, onChanged }: { card: CardRow; onChanged: () => void }) {
  const [next, setNext] = React.useState<ModStatus>(card.moderation_status);
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const changed = next !== card.moderation_status;

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await adminCall(`/profiles/${card.id}/moderation`, { method: "PATCH", body: JSON.stringify({ moderation_status: next, reason: reason || null }) });
      setReason("");
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <tr className="align-top">
      <td className="px-5 py-3">
        <p className="text-sm font-medium text-foreground">{card.display_name || card.username}</p>
        <a href={`/${card.username}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline">
          /{card.username} <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </td>
      <td className="px-5 py-3 text-sm text-muted-foreground">
        {card.user?.name ?? "—"}
        <span className="block text-xs">{card.user?.email}</span>
      </td>
      <td className="px-5 py-3">
        <StatusPill tone={TONE[card.moderation_status]}>{LABEL[card.moderation_status]}</StatusPill>
        {card.moderation_reason && <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">{card.moderation_reason}</p>}
        {card.moderated_at && <p className="text-[11px] text-muted-foreground">{timeAgo(card.moderated_at)}</p>}
      </td>
      <td className="px-5 py-3">
        <div className="flex min-w-[260px] flex-col gap-2">
          <select value={next} onChange={(e) => setNext(e.target.value as ModStatus)} aria-label={`Status for /${card.username}`} className="h-9 rounded-xl border border-input bg-card px-2.5 text-sm">
            {(Object.keys(LABEL) as ModStatus[]).map((s) => (
              <option key={s} value={s}>
                {LABEL[s]} — {HELP[s]}
              </option>
            ))}
          </select>
          {changed && (
            <>
              <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} placeholder="Reason (shown in the log)" className="h-9 rounded-xl border border-input bg-card px-2.5 text-sm" />
              <button type="button" onClick={() => void save()} disabled={busy} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#343C22] px-3 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-50">
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Apply
              </button>
            </>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </td>
    </tr>
  );
}

/** Admin: review cards (visible / under review / restricted / hidden) and the moderation log. */
export default function AdminModerationPage() {
  const [status, setStatus] = React.useState<"" | ModStatus>("");
  const [search, setSearch] = React.useState("");
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [cards, setCards] = React.useState<Paged<CardRow> | null>(null);
  const [actions, setActions] = React.useState<Paged<ActionRow> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = React.useCallback(() => {
    const params = new URLSearchParams({ page: String(page), per_page: "15", ...(status ? { moderation_status: status } : {}), ...(q ? { search: q } : {}) });
    adminCall<Paged<CardRow>>(`/profiles?${params}`)
      .then((d) => (setCards(d), setError(null)))
      .catch((e: Error) => setError(e.message));
    adminCall<Paged<ActionRow>>(`/moderation-actions?per_page=8`).then(setActions).catch(() => {});
  }, [page, status, q]);

  React.useEffect(() => load(), [load]);

  return (
    <ConsolePage>
      <PageHeader
        title="Moderation"
        description="Check cards and hide anything that breaks the rules. Owners can still sign in and fix their card."
        actions={
          <Link href="/admin/reports" className="inline-flex h-10 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm font-medium hover:bg-white">
            <Flag className="h-4 w-4" aria-hidden="true" /> Reports
          </Link>
        }
      />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          label="Card status"
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={[
            { id: "", label: "All cards" },
            { id: "under_review", label: "Under review" },
            { id: "restricted", label: "Restricted" },
            { id: "suspended", label: "Hidden" },
            { id: "active", label: "Visible" },
          ]}
        />
        <label className="relative lg:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or link" aria-label="Search cards" className="h-10 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" />
        </label>
      </div>
      {error && <p className="rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">{error}</p>}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]">
          {!cards ? (
            <div className="space-y-3 p-5" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          ) : cards.items.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="No cards here" text="Try another filter or search." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Card</th>
                    <th className="px-5 py-3 font-medium">Owner</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cards.items.map((c) => (
                    <CardModRow key={c.id + c.moderation_status} card={c} onChanged={load} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {cards && <Pager page={cards.pagination.current_page} lastPage={cards.pagination.last_page} total={cards.pagination.total} onPage={setPage} />}
        </section>

        <Panel title="Recent actions" icon={History} className="2xl:self-start">
          {!actions ? (
            <div className="skeleton m-5 h-24 rounded-xl" />
          ) : actions.items.length === 0 ? (
            <EmptyState icon={Gavel} title="No actions yet" text="Changes you make to cards are logged here." />
          ) : (
            <ul className="divide-y divide-border">
              {actions.items.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-foreground">{humanize(a.action_type)}</p>
                  <p className="text-xs text-muted-foreground">
                    {(a.metadata?.username as string | undefined) ? `/${a.metadata?.username} · ` : ""}
                    {a.actor?.name ?? "Admin"} · {timeAgo(a.created_at)}
                  </p>
                  {a.reason && <p className="mt-0.5 text-xs text-muted-foreground">“{a.reason}”</p>}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </ConsolePage>
  );
}
