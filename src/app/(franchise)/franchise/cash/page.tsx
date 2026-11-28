"use client";
import { useCallback, useEffect, useState } from "react";
import { Banknote, Check, CheckCircle2, Clock, HandCoins, Loader2, Trash2, Wallet, X } from "lucide-react";
import { ConsolePage, DataTable, EmptyState, PageHeader, Panel, StatCard, StatusPill } from "@/components/console/ui";
import { FilterTabs } from "@/components/console/Pager";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { FranchiseApiError, franchiseApi, rupees, shortDate, type StaffSummary } from "@/lib/franchise/api";

interface Handover {
  id: string;
  amount: string | number;
  method?: string | null;
  note?: string | null;
  handed_on: string;
  status: "pending" | "confirmed" | "rejected";
  reject_reason?: string | null;
  staff?: { id: string; name: string } | null;
}

interface Mine {
  collected: number;
  renewals?: number;
  earned: number;
  to_hand_over: number;
  handed_over: number;
  pending_handover: number;
  cash_due: number;
}

type Tab = "pending" | "confirmed" | "rejected" | "all";
const input = "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#343C22]/20";
const today = () => new Date().toLocaleDateString("en-CA");

const STATUS: Record<Handover["status"], { tone: "warning" | "success" | "danger"; label: string }> = {
  pending: { tone: "warning", label: "Waiting for owner" },
  confirmed: { tone: "success", label: "Confirmed" },
  rejected: { tone: "danger", label: "Rejected" },
};

/** "Still with staff" / "Franchise owes" label for a cash position. */
function Due({ value }: { value: number }) {
  if (Math.abs(value) < 0.01) return <span className="text-[#1E7B43]">Settled</span>;
  return value > 0 ? <span className="font-medium text-[#92400E]">{rupees(value)}</span> : <span className="text-[#52525B]">You owe {rupees(-value)}</span>;
}

export default function FranchiseCashPage() {
  const me = useFranchise();
  const owner = me.is_owner;
  const [tab, setTab] = useState<Tab>(owner ? "pending" : "all");
  const [rows, setRows] = useState<Handover[] | null>(null);
  const [staff, setStaff] = useState<StaffSummary[]>([]);
  const [mine, setMine] = useState<Mine | null>(null);
  const [form, setForm] = useState({ amount: "", method: "Cash", handed_on: today(), note: "", staff_id: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadSummary = useCallback(() => {
    if (owner) franchiseApi<StaffSummary[]>("franchise/staff").then((r) => setStaff(r.data)).catch(() => {});
    else
      franchiseApi<{ my_commission: Mine }>("franchise/dashboard")
        .then((r) => {
          setMine(r.data.my_commission);
          setForm((f) => (f.amount ? f : { ...f, amount: r.data.my_commission.cash_due > 0 ? String(r.data.my_commission.cash_due) : "" }));
        })
        .catch(() => {});
  }, [owner]);

  const loadList = useCallback(() => {
    const qs = tab === "all" ? "" : `?status=${tab}`;
    franchiseApi<Handover[]>(`franchise/handovers${qs}`).then((r) => setRows(r.data)).catch(() => setRows([]));
  }, [tab]);

  useEffect(loadSummary, [loadSummary]);
  useEffect(loadList, [loadList]);

  const refresh = () => {
    loadSummary();
    loadList();
    window.dispatchEvent(new Event("franchise-cash-changed"));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setNotice("");
    if (!(Number(form.amount) >= 1)) return setErrors({ amount: "Enter the amount." });
    if (owner && !form.staff_id) return setErrors({ staff_id: "Choose who gave the money." });
    setSaving(true);
    try {
      await franchiseApi("franchise/handovers", {
        method: "POST",
        body: { amount: Number(form.amount), method: form.method || null, handed_on: form.handed_on || null, note: form.note || null, ...(owner ? { staff_id: form.staff_id } : {}) },
      });
      setForm({ amount: "", method: "Cash", handed_on: today(), note: "", staff_id: "" });
      setNotice(owner ? "Money received recorded." : "Sent to your franchise owner to confirm.");
      refresh();
    } catch (err) {
      setErrors(err instanceof FranchiseApiError && Object.keys(err.fields).length ? err.fields : { form: err instanceof Error ? err.message : "Couldn't save." });
    } finally {
      setSaving(false);
    }
  }

  async function act(h: Handover, action: "confirm" | "reject" | "delete") {
    let body: Record<string, unknown> | undefined;
    if (action === "reject") {
      const reason = prompt(`Reject ${rupees(h.amount)} from ${h.staff?.name ?? "staff"}? Reason (optional):`);
      if (reason === null) return;
      body = { reason };
    }
    if (action === "delete" && !confirm(`Remove this entry of ${rupees(h.amount)}?`)) return;
    setBusy(h.id);
    try {
      if (action === "delete") await franchiseApi(`franchise/handovers/${h.id}`, { method: "DELETE" });
      else await franchiseApi(`franchise/handovers/${h.id}/${action}`, { method: "POST", body: body ?? {} });
      refresh();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Couldn't update.");
    } finally {
      setBusy(null);
    }
  }

  const withStaff = staff.reduce((s, x) => s + Math.max(0, x.cash_due ?? 0), 0);
  const pendingTotal = staff.reduce((s, x) => s + (x.pending_handover ?? 0), 0);
  const handedTotal = staff.reduce((s, x) => s + (x.handed_over ?? 0), 0);

  return (
    <ConsolePage>
      <PageHeader
        title={owner ? "Cash handovers" : "Hand over cash"}
        description={
          owner
            ? "Staff collect money from customers, keep their commission and hand the rest to you. Confirm each handover when you receive it."
            : "You keep your commission from the money customers pay you for new cards. Renewal money has no commission: hand all of it over. Record each handover here; it counts once the owner confirms."
        }
      />

      {owner ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <StatCard label="Still with staff" icon={Banknote} value={rupees(withStaff)} hint="Collected + renewals − commission − handed over" tone={withStaff > 0 ? "warning" : "neutral"} />
          <StatCard label="Waiting for you to confirm" icon={Clock} value={rupees(pendingTotal)} hint="Handovers staff recorded" tone={pendingTotal > 0 ? "warning" : "neutral"} />
          <StatCard label="Received from staff" icon={CheckCircle2} value={rupees(handedTotal)} hint="Confirmed, all time" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Collected from customers" icon={Wallet} loading={!mine} value={rupees((mine?.collected ?? 0) + (mine?.renewals ?? 0))} hint={mine?.renewals ? `Includes ${rupees(mine.renewals)} renewals (no commission)` : undefined} />
          <StatCard label="My commission (kept)" icon={HandCoins} loading={!mine} value={rupees(mine?.earned)} />
          <StatCard label="Handed over (confirmed)" icon={CheckCircle2} loading={!mine} value={rupees(mine?.handed_over)} hint={mine && mine.pending_handover > 0 ? `${rupees(mine.pending_handover)} waiting for owner` : undefined} />
          <StatCard
            label={mine && mine.cash_due < 0 ? "Franchise owes you" : "Still to hand over"}
            icon={Banknote}
            loading={!mine}
            value={rupees(Math.abs(mine?.cash_due ?? 0))}
            tone={mine && mine.cash_due > 0 ? "warning" : "neutral"}
          />
        </div>
      )}

      {owner && staff.length > 0 && (
        <Panel title="Each staff member" description="Collected from customers, commission they keep, and what they still hold.">
          <DataTable head={["Staff", "Collected", "Renewals", "Commission", "To hand over", "Handed over", "Waiting", "Still with staff"]}>
            {staff.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                <td className="whitespace-nowrap px-5 py-3">{rupees(s.sales)}</td>
                <td className="whitespace-nowrap px-5 py-3">{s.renewals ? rupees(s.renewals) : "—"}</td>
                <td className="whitespace-nowrap px-5 py-3">{rupees(s.earned)}</td>
                <td className="whitespace-nowrap px-5 py-3">{rupees(Math.max(0, s.to_hand_over ?? 0))}</td>
                <td className="whitespace-nowrap px-5 py-3">{rupees(s.handed_over)}</td>
                <td className="whitespace-nowrap px-5 py-3">{s.pending_handover ? rupees(s.pending_handover) : "—"}</td>
                <td className="whitespace-nowrap px-5 py-3">
                  <Due value={s.cash_due ?? 0} />
                </td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      )}

      <Panel title={owner ? "Record money received" : "Record a handover"} description={owner ? "Money a staff member gave you in person. It's confirmed straight away." : "After you give the money to your owner. They confirm it."}>
        <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
          {owner && (
            <label className="space-y-1.5 text-sm">
              <span className="font-medium">From</span>
              <select
                className={input}
                value={form.staff_id}
                onChange={(e) => {
                  const s = staff.find((x) => x.id === e.target.value);
                  setForm({ ...form, staff_id: e.target.value, amount: s && (s.cash_due ?? 0) > 0 ? String(s.cash_due) : form.amount });
                }}
              >
                <option value="">Choose staff…</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {(s.cash_due ?? 0) > 0 ? ` (holds ${rupees(s.cash_due)})` : ""}
                  </option>
                ))}
              </select>
              {errors.staff_id && <span className="block text-xs text-destructive">{errors.staff_id}</span>}
            </label>
          )}
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Amount (₹)</span>
            <input type="number" min={1} step="0.01" inputMode="decimal" className={input} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            {errors.amount && <span className="block text-xs text-destructive">{errors.amount}</span>}
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">How</span>
            <select className={input} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
              {["Cash", "UPI", "Bank transfer", "Other"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Date</span>
            <input type="date" max={today()} className={input} value={form.handed_on} onChange={(e) => setForm({ ...form, handed_on: e.target.value })} />
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Note</span>
            <input className={input} value={form.note} maxLength={255} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Optional" />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-5">
            <button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-5 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandCoins className="h-4 w-4" />}
              {owner ? "Record received" : "Send for confirmation"}
            </button>
            {errors.form && <span className="text-sm text-destructive">{errors.form}</span>}
            {notice && <span className="text-sm text-[#1E7B43]">{notice}</span>}
          </div>
        </form>
      </Panel>

      <div>
        <FilterTabs<Tab>
          label="Handover status"
          value={tab}
          onChange={setTab}
          options={[
            { id: "pending", label: "Waiting" },
            { id: "confirmed", label: "Confirmed" },
            { id: "rejected", label: "Rejected" },
            { id: "all", label: "All" },
          ]}
        />
      </div>

      <Panel>
        {!rows ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState icon={Banknote} title={tab === "pending" ? "Nothing waiting" : "No handovers here"} />
        ) : (
          <DataTable head={owner ? ["Date", "Staff", "Amount", "How", "Note", "Status", ""] : ["Date", "Amount", "How", "Note", "Status", ""]}>
            {rows.map((h) => (
              <tr key={h.id} className="align-middle">
                <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{shortDate(h.handed_on)}</td>
                {owner && <td className="px-5 py-3 font-medium">{h.staff?.name ?? "—"}</td>}
                <td className="whitespace-nowrap px-5 py-3 font-medium">{rupees(h.amount)}</td>
                <td className="px-5 py-3 text-muted-foreground">{h.method || "—"}</td>
                <td className="px-5 py-3 text-muted-foreground">{h.status === "rejected" && h.reject_reason ? `Rejected: ${h.reject_reason}` : h.note || "—"}</td>
                <td className="px-5 py-3">
                  <StatusPill tone={STATUS[h.status].tone}>{owner && h.status === "pending" ? "Waiting for you" : STATUS[h.status].label}</StatusPill>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1 whitespace-nowrap">
                    {owner && h.status === "pending" && (
                      <>
                        <button type="button" disabled={busy !== null} onClick={() => void act(h, "confirm")} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#343C22] px-3 text-xs font-medium text-white hover:bg-[#4B5634] disabled:opacity-50">
                          {busy === h.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Confirm received
                        </button>
                        <button type="button" disabled={busy !== null} onClick={() => void act(h, "reject")} className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-destructive hover:bg-[#FDECEC] disabled:opacity-50">
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </>
                    )}
                    {(owner || h.status === "pending") && (
                      <button type="button" disabled={busy !== null} onClick={() => void act(h, "delete")} aria-label="Remove entry" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>
    </ConsolePage>
  );
}
