"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { ConsolePage, DataTable, EmptyState, PageHeader, Panel } from "@/components/console/ui";
import { FilterTabs } from "@/components/console/Pager";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { ExpiryLabel } from "@/components/partner/CardExpiry";
import { franchiseApi } from "@/lib/franchise/api";

interface Plan {
  id: string;
  name: string;
  months: number;
  price: number;
  currency_symbol: string;
  is_default?: boolean;
}

interface Row {
  id: string;
  card_name: string;
  username?: string | null;
  plan?: string | null;
  expires_at: string;
  expired: boolean;
  days_left: number;
  created_by?: string | null;
}

type Tab = "all" | "expired" | "soon";

/** Franchise renewals: expired cards and cards expiring within 30 days, renewed in place. */
export default function FranchiseRenewalsPage() {
  const me = useFranchise();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<Tab>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    franchiseApi<{ cards: Row[] }>("franchise/cards/expiring?days=30")
      .then((r) => setRows(r.data.cards))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
    franchiseApi<Plan[]>("franchise/cards/plans").then((r) => setPlans(r.data)).catch(() => {});
  }, [load]);

  const defaultPlan = plans.find((p) => p.is_default)?.id ?? plans.find((p) => p.months === 12)?.id ?? plans[0]?.id ?? "";

  async function renew(row: Row) {
    const planId = choice[row.id] || defaultPlan;
    const plan = plans.find((p) => p.id === planId);
    if (!plan || !confirm(`Renew "${row.card_name}" with the ${plan.name} plan?`)) return;
    setBusy(row.id);
    setError("");
    try {
      await franchiseApi(`franchise/cards/${row.id}/renew`, { method: "POST", body: { validity_plan_id: planId } });
      setDone((d) => [...d, row.id]);
      setTimeout(() => {
        setDone((d) => d.filter((x) => x !== row.id));
        load();
      }, 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't renew.");
    } finally {
      setBusy(null);
    }
  }

  const expiredCount = rows?.filter((r) => r.expired).length ?? 0;
  const soonCount = rows?.filter((r) => !r.expired).length ?? 0;
  const shown = (rows ?? []).filter((r) => (tab === "expired" ? r.expired : tab === "soon" ? !r.expired : true));

  return (
    <ConsolePage>
      <PageHeader
        title="Renewals"
        description={
          me.is_owner
            ? "Expired cards and cards that expire in the next 30 days. Renew with a plan: an expired card goes live again straight away."
            : "Your expired cards and the ones that expire in the next 30 days."
        }
      />

      <FilterTabs<Tab>
        label="Renewal filter"
        value={tab}
        onChange={setTab}
        options={[
          { id: "all", label: "All", count: rows?.length },
          { id: "expired", label: "Expired", count: expiredCount },
          { id: "soon", label: "Expiring in 30 days", count: soonCount },
        ]}
      />

      {error && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p>}

      <Panel>
        {!rows ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
          </div>
        ) : shown.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nothing to renew" text="No cards have expired and none expire in the next 30 days." />
        ) : (
          <DataTable head={me.is_owner ? ["Card", "Made by", "Expiry", "Plan", ""] : ["Card", "Expiry", "Plan", ""]}>
            {shown.map((r) => (
              <tr key={r.id} className="align-middle">
                <td className="px-5 py-3">
                  <Link href={`/franchise/cards/${r.id}`} className="font-medium text-foreground hover:underline">
                    {r.card_name}
                  </Link>
                  {r.username && <p className="text-xs text-muted-foreground">/{r.username}</p>}
                </td>
                {me.is_owner && <td className="px-5 py-3 text-muted-foreground">{r.created_by ?? "—"}</td>}
                <td className="px-5 py-3">
                  <ExpiryLabel expiresAt={r.expires_at} plan={r.plan} />
                </td>
                <td className="px-5 py-3">
                  <select
                    aria-label={`Plan for ${r.card_name}`}
                    value={choice[r.id] || defaultPlan}
                    onChange={(e) => setChoice((c) => ({ ...c, [r.id]: e.target.value }))}
                    className="h-9 rounded-full border border-border bg-white px-3 text-sm"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {p.currency_symbol}
                        {Number(p.price).toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3 text-right">
                  {done.includes(r.id) ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1E7B43]">
                      <CheckCircle2 className="h-4 w-4" /> Renewed
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={busy !== null || plans.length === 0}
                      onClick={() => void renew(r)}
                      className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60"
                    >
                      {busy === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      Renew
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>
    </ConsolePage>
  );
}
