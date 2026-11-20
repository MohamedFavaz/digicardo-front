"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, CheckCircle2, ExternalLink, Loader2, LogIn, RefreshCw } from "lucide-react";
import { ConsolePage, EmptyState, PageHeader, StatusPill } from "@/components/console/ui";
import { FilterTabs } from "@/components/console/Pager";
import { adminCall, formatDate } from "@/lib/api/admin-console";
import { adminImpersonate } from "@/lib/admin/impersonate";

interface Row {
  id: string;
  name: string;
  email: string;
  username: string | null;
  expires_at: string | null;
  days_remaining?: number;
  expired_days?: number;
  status?: string;
  validity_label?: string | null;
}
interface Plan {
  id: string;
  name: string;
  formatted_price: string;
  is_active: boolean;
}

function RenewRow({ row, plans, expired, onDone }: { row: Row; plans: Plan[]; expired: boolean; onDone: () => void }) {
  const [plan, setPlan] = React.useState(plans[0]?.id ?? "");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);

  const renew = async () => {
    if (!plan) return;
    setBusy("renew");
    setMsg(null);
    try {
      const res = await adminCall<{ expires_at: string }>(`/users/${row.id}/renew`, { method: "POST", body: JSON.stringify({ validity_plan_id: plan }) });
      setMsg(`Renewed until ${formatDate(res.expires_at)}`);
      setTimeout(onDone, 1200);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Couldn't renew.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <tr className="align-middle">
      <td className="px-5 py-3">
        <p className="text-sm font-medium text-foreground">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.email}</p>
      </td>
      <td className="px-5 py-3 text-sm">
        {row.username ? (
          <a href={`/${row.username}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:underline">
            /{row.username} <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        ) : (
          <span className="text-muted-foreground">No card</span>
        )}
      </td>
      <td className="px-5 py-3">
        <p className="text-sm text-foreground">{formatDate(row.expires_at)}</p>
        {expired ? (
          <StatusPill tone="danger">Expired {row.expired_days ?? 0} d ago</StatusPill>
        ) : (
          <StatusPill tone={(row.days_remaining ?? 0) <= 2 ? "danger" : "warning"}>
            {row.days_remaining === 0 ? "Expires today" : `${row.days_remaining} d left`}
          </StatusPill>
        )}
      </td>
      <td className="px-5 py-3">
        {msg?.startsWith("Renewed") ? (
          <p className="inline-flex items-center gap-1.5 text-sm text-[#1E7B43]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {msg}
          </p>
        ) : (
          <div className="flex min-w-[300px] flex-wrap items-center gap-2">
            <select value={plan} onChange={(e) => setPlan(e.target.value)} aria-label={`Plan for ${row.name}`} className="h-9 rounded-xl border border-input bg-card px-2.5 text-sm">
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.formatted_price}
                </option>
              ))}
            </select>
            <button type="button" disabled={!!busy || !plan} onClick={() => void renew()} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#343C22] px-3.5 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-50">
              {busy === "renew" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />} Renew
            </button>
            <button
              type="button"
              disabled={!!busy}
              onClick={async () => {
                setBusy("open");
                await adminImpersonate(row.id).catch((e: Error) => {
                  setMsg(e.message);
                  setBusy(null);
                });
              }}
              aria-label={`Open ${row.name}'s account`}
              title="Open as customer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-input bg-card hover:bg-muted disabled:opacity-50"
            >
              {busy === "open" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
            </button>
            {msg && <p className="w-full text-xs text-destructive">{msg}</p>}
          </div>
        )}
      </td>
    </tr>
  );
}

/** Admin: accounts that expire this week or already expired — renew them in one click. */
export default function AdminRenewalsPage() {
  const [tab, setTab] = React.useState<"expiring" | "expired">("expiring");
  const [expiring, setExpiring] = React.useState<Row[] | null>(null);
  const [expired, setExpired] = React.useState<Row[] | null>(null);
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    adminCall<{ users: Row[] }>("/users/expiring").then((d) => setExpiring(d.users)).catch((e: Error) => setError(e.message));
    adminCall<{ users: Row[] }>("/users/expired").then((d) => setExpired(d.users)).catch((e: Error) => setError(e.message));
  }, []);

  React.useEffect(() => {
    load();
    adminCall<{ plans: Plan[] }>("/validity-plans")
      .then((d) => setPlans(d.plans.filter((p) => p.is_active)))
      .catch(() => {});
  }, [load]);

  const rows = tab === "expiring" ? expiring : expired;

  return (
    <ConsolePage>
      <PageHeader
        title="Renewals"
        description="Accounts whose card plan ends this week, or has already ended. Renew them here."
        actions={
          <Link href="/admin/plans" className="inline-flex h-10 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm font-medium hover:bg-white">
            Plans & prices
          </Link>
        }
      />
      <FilterTabs
        label="Renewal list"
        value={tab}
        onChange={setTab}
        options={[
          { id: "expiring", label: "Expiring in 7 days", count: expiring?.length },
          { id: "expired", label: "Expired", count: expired?.length },
        ]}
      />
      {error && <p className="rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">{error}</p>}
      {plans.length === 0 && rows && rows.length > 0 && (
        <p className="rounded-2xl border border-[#FDE68A] bg-[#FEF3C7] p-3 text-sm text-[#92400E]">
          No active plans to renew with. <Link href="/admin/plans" className="font-medium underline">Add a plan</Link> first.
        </p>
      )}
      <section className="overflow-hidden rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]">
        {!rows ? (
          <div className="space-y-3 p-5" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState icon={CalendarClock} title={tab === "expiring" ? "Nothing expires this week" : "No expired accounts"} text="You're all caught up." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Card</th>
                  <th className="px-5 py-3 font-medium">Ends</th>
                  <th className="px-5 py-3 font-medium">Renew</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <RenewRow key={r.id} row={r} plans={plans} expired={tab === "expired"} onDone={load} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </ConsolePage>
  );
}
