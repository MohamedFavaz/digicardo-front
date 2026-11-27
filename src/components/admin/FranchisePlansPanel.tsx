"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Loader2, Save } from "lucide-react";
import { franchiseApi } from "@/lib/franchise/api";

interface FranchiseOption {
  id: string;
  name: string;
  email: string;
}

interface PlanRow {
  id: string;
  name: string;
  months: number;
  price: number;
  currency_symbol: string;
  is_active: boolean;
  assigned: boolean;
  is_default: boolean;
}

/**
 * Admin → Plans & prices: choose which plans each franchise may sell (for new cards and renewals)
 * and its default. Nothing ticked = the franchise sees every active plan.
 */
export function FranchisePlansPanel() {
  const [franchises, setFranchises] = useState<FranchiseOption[] | null>(null);
  const [franchiseId, setFranchiseId] = useState("");
  const [plans, setPlans] = useState<PlanRow[] | null>(null);
  const [ticked, setTicked] = useState<string[]>([]);
  const [defaultId, setDefaultId] = useState("");
  const [custom, setCustom] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    franchiseApi<FranchiseOption[]>("admin/franchises?per_page=100")
      .then((r) => {
        setFranchises(r.data);
        if (r.data[0]) setFranchiseId(r.data[0].id);
      })
      .catch(() => setFranchises([]));
  }, []);

  useEffect(() => {
    if (!franchiseId) return;
    setPlans(null);
    setMessage(null);
    franchiseApi<{ custom: boolean; plans: PlanRow[] }>(`admin/franchises/${franchiseId}/plans`).then((r) => {
      setPlans(r.data.plans);
      setCustom(r.data.custom);
      setTicked(r.data.custom ? r.data.plans.filter((p) => p.assigned).map((p) => p.id) : r.data.plans.filter((p) => p.is_active).map((p) => p.id));
      setDefaultId(r.data.plans.find((p) => p.is_default)?.id ?? "");
    });
  }, [franchiseId]);

  function toggle(id: string) {
    setMessage(null);
    setTicked((t) => {
      const next = t.includes(id) ? t.filter((x) => x !== id) : [...t, id];
      if (!next.includes(defaultId)) setDefaultId(next[0] ?? "");
      return next;
    });
  }

  async function save(useAll: boolean) {
    setSaving(true);
    setMessage(null);
    try {
      const r = await franchiseApi<{ custom: boolean; plans: PlanRow[] }>(`admin/franchises/${franchiseId}/plans`, {
        method: "PUT",
        body: useAll ? { plan_ids: [], default_plan_id: null } : { plan_ids: ticked, default_plan_id: defaultId },
      });
      setPlans(r.data.plans);
      setCustom(r.data.custom);
      if (useAll) {
        setTicked(r.data.plans.filter((p) => p.is_active).map((p) => p.id));
        setDefaultId(r.data.plans.find((p) => p.is_default)?.id ?? "");
      }
      setMessage({ ok: true, text: useAll ? "This franchise now sees every active plan." : "Franchise plans saved." });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Couldn't save." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card" aria-labelledby="franchise-plans-title">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-[#52525B]">
            <Building2 className="h-4 w-4" />
          </span>
          <div>
            <h2 id="franchise-plans-title" className="text-sm font-semibold text-foreground">
              Franchise plans
            </h2>
            <p className="text-xs text-muted-foreground">Which plans each franchise can sell for new cards and renewals, and its default plan.</p>
          </div>
        </div>
        {franchises && franchises.length > 0 && (
          <select
            aria-label="Franchise"
            value={franchiseId}
            onChange={(e) => setFranchiseId(e.target.value)}
            className="h-10 rounded-full border border-border bg-white px-4 text-sm"
          >
            {franchises.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {!franchises ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : franchises.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">
          No franchises yet.{" "}
          <Link href="/admin/franchises" className="font-medium text-primary hover:underline">
            Create one
          </Link>{" "}
          to give it its own plans.
        </p>
      ) : !plans ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4 p-5">
          <p className={`rounded-xl px-3.5 py-2.5 text-xs font-medium ${custom ? "bg-[#EEF3E6] text-[#3F5520]" : "bg-muted text-[#52525B]"}`}>
            {custom ? "This franchise uses its own plan list." : "Nothing chosen yet: this franchise sees every active plan. Untick plans to limit it."}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-medium">Can sell</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Plan</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Price</th>
                  <th scope="col" className="py-2 font-medium">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {plans.map((p) => {
                  const on = ticked.includes(p.id);
                  return (
                    <tr key={p.id} className={p.is_active ? "" : "opacity-50"}>
                      <td className="py-2.5 pr-4">
                        <input
                          type="checkbox"
                          aria-label={`Allow ${p.name}`}
                          checked={on}
                          disabled={!p.is_active}
                          onChange={() => toggle(p.id)}
                          className="h-4 w-4 accent-[#343C22]"
                        />
                      </td>
                      <td className="py-2.5 pr-4 font-medium text-foreground">
                        {p.name}
                        {!p.is_active && <span className="ml-2 text-xs font-normal text-muted-foreground">(switched off)</span>}
                      </td>
                      <td className="py-2.5 pr-4 text-[#52525B]">
                        {p.currency_symbol}
                        {Number(p.price).toLocaleString("en-IN")}
                      </td>
                      <td className="py-2.5">
                        <input
                          type="radio"
                          name="franchise-default-plan"
                          aria-label={`Make ${p.name} the default`}
                          checked={defaultId === p.id}
                          disabled={!on}
                          onChange={() => setDefaultId(p.id)}
                          className="h-4 w-4 accent-[#343C22]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={saving || ticked.length === 0 || !defaultId}
              onClick={() => void save(false)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save plans
            </button>
            {custom && (
              <button type="button" disabled={saving} onClick={() => void save(true)} className="h-10 rounded-full px-4 text-sm font-medium text-[#52525B] hover:bg-muted disabled:opacity-50">
                Use all plans instead
              </button>
            )}
            {ticked.length === 0 && <span className="text-xs text-destructive">Tick at least one plan.</span>}
            {message && (
              <span className={`inline-flex items-center gap-1.5 text-sm ${message.ok ? "text-[#1E7B43]" : "text-destructive"}`}>
                {message.ok && <CheckCircle2 className="h-4 w-4" />}
                {message.text}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
