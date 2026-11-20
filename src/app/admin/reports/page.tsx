"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ExternalLink, EyeOff, Flag, Loader2, ShieldAlert } from "lucide-react";
import { ConsolePage, EmptyState, PageHeader, StatusPill } from "@/components/console/ui";
import { FilterTabs, Pager } from "@/components/console/Pager";
import { adminCall, humanize, timeAgo, type Paged } from "@/lib/api/admin-console";

type ReportStatus = "open" | "investigating" | "resolved" | "dismissed";

interface Report {
  id: string;
  reason: string;
  description: string;
  status: ReportStatus;
  reporter_email: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  profile: { id: string; username: string; display_name: string | null; moderation_status: string; user?: { name: string; email: string } | null } | null;
  resolver?: { name: string } | null;
}

const TONE: Record<ReportStatus, "warning" | "primary" | "success" | "neutral"> = { open: "warning", investigating: "primary", resolved: "success", dismissed: "neutral" };

function ReportRow({ report, onChanged }: { report: Report; onChanged: () => void }) {
  // Unfinished reports start expanded so their actions are one click away.
  const [open, setOpen] = React.useState(report.status === "open" || report.status === "investigating");
  const [notes, setNotes] = React.useState(report.resolution_notes ?? "");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const setStatus = async (status: ReportStatus) => {
    setBusy(status);
    setError(null);
    try {
      await adminCall(`/reports/${report.id}`, { method: "PATCH", body: JSON.stringify({ status, resolution_notes: notes || null }) });
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update.");
    } finally {
      setBusy(null);
    }
  };

  const hideCard = async () => {
    if (!report.profile || !confirm(`Hide /${report.profile.username} from the public? The owner can still sign in.`)) return;
    setBusy("hide");
    setError(null);
    try {
      await adminCall(`/profiles/${report.profile.id}/moderation`, {
        method: "PATCH",
        body: JSON.stringify({ moderation_status: "suspended", reason: `Report: ${humanize(report.reason)}`, notes: notes || null }),
      });
      await adminCall(`/reports/${report.id}`, { method: "PATCH", body: JSON.stringify({ status: "resolved", resolution_notes: notes || "Card hidden after review." }) });
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't hide the card.");
    } finally {
      setBusy(null);
    }
  };

  const closed = report.status === "resolved" || report.status === "dismissed";

  return (
    <li className="px-5 py-4">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-start gap-3 text-left">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDECEC] text-destructive">
          <Flag className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-medium text-foreground">{humanize(report.reason)}</span>
            <StatusPill tone={TONE[report.status]}>{humanize(report.status)}</StatusPill>
            {report.profile && report.profile.moderation_status !== "active" && <StatusPill tone="danger">Card {humanize(report.profile.moderation_status).toLowerCase()}</StatusPill>}
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
            {report.profile ? `/${report.profile.username}` : "Deleted card"} · {report.profile?.user?.name ?? "—"} · {timeAgo(report.created_at)}
          </span>
        </span>
      </button>
      {open && (
        <div className="mt-3 space-y-3 pl-12">
          <p className="whitespace-pre-line rounded-2xl bg-muted/60 p-3 text-sm text-foreground">{report.description}</p>
          <p className="text-xs text-muted-foreground">Reported by {report.reporter_email || "an anonymous visitor"}</p>
          {report.profile && (
            <a href={`/${report.profile.username}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-[#343C22] hover:underline">
              Open the reported card <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
          <label className="block">
            <span className="text-sm font-medium text-foreground">Notes</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={2000} placeholder="What you checked and decided (kept in the record)." className="mt-1 block w-full resize-y rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary" />
          </label>
          {error && (
            <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" aria-hidden="true" /> {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {report.status === "open" && (
              <button type="button" disabled={!!busy} onClick={() => void setStatus("investigating")} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-input bg-card px-3.5 text-sm hover:bg-muted disabled:opacity-50">
                {busy === "investigating" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Mark investigating
              </button>
            )}
            {!closed && report.profile && report.profile.moderation_status === "active" && (
              <button type="button" disabled={!!busy} onClick={() => void hideCard()} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-destructive px-3.5 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50">
                {busy === "hide" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />} Hide card & resolve
              </button>
            )}
            {!closed && (
              <>
                <button type="button" disabled={!!busy} onClick={() => void setStatus("resolved")} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#343C22] px-3.5 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-50">
                  {busy === "resolved" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />} Resolve
                </button>
                <button type="button" disabled={!!busy} onClick={() => void setStatus("dismissed")} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm text-muted-foreground hover:bg-muted disabled:opacity-50">
                  Dismiss — not a problem
                </button>
              </>
            )}
            {closed && (
              <button type="button" disabled={!!busy} onClick={() => void setStatus("open")} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-input bg-card px-3.5 text-sm hover:bg-muted disabled:opacity-50">
                Reopen
              </button>
            )}
          </div>
          {closed && report.resolver && <p className="text-xs text-muted-foreground">Closed by {report.resolver.name}</p>}
        </div>
      )}
    </li>
  );
}

/** Admin: abuse reports sent from public cards. */
export default function AdminReportsPage() {
  const [status, setStatus] = React.useState<"" | ReportStatus>("open");
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<Paged<Report> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    const q = new URLSearchParams({ page: String(page), per_page: "20", ...(status ? { status } : {}) });
    adminCall<Paged<Report>>(`/reports?${q}`)
      .then((d) => (setData(d), setError(null)))
      .catch((e: Error) => setError(e.message));
  }, [page, status]);

  React.useEffect(() => load(), [load]);

  return (
    <ConsolePage width="narrow">
      <PageHeader
        title="Reports"
        description="Visitors can report a card from its menu. Review each one and act."
        actions={
          <Link href="/admin/moderation" className="inline-flex h-10 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm font-medium hover:bg-white">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" /> Moderation
          </Link>
        }
      />
      <FilterTabs
        label="Report status"
        value={status}
        onChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        options={[
          { id: "open", label: "Open" },
          { id: "investigating", label: "Investigating" },
          { id: "resolved", label: "Resolved" },
          { id: "dismissed", label: "Dismissed" },
          { id: "", label: "All" },
        ]}
      />
      {error && <p className="rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">{error}</p>}
      <section className="overflow-hidden rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]">
        {!data ? (
          <div className="space-y-3 p-5" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState icon={Flag} title={status === "open" ? "No open reports" : "Nothing here"} text="When a visitor reports a card, it appears here." />
        ) : (
          <ul className="divide-y divide-border">
            {data.items.map((r) => (
              <ReportRow key={r.id + r.status} report={r} onChanged={load} />
            ))}
          </ul>
        )}
        {data && <Pager page={data.pagination.current_page} lastPage={data.pagination.last_page} total={data.pagination.total} onPage={setPage} />}
      </section>
    </ConsolePage>
  );
}
