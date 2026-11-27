"use client";
import { useCallback, useEffect, useState } from "react";
import { HandCoins, IndianRupee, Loader2, Trash2, Wallet } from "lucide-react";
import { ConsolePage, DataTable, EmptyState, PageHeader, Panel, StatCard } from "@/components/console/ui";
import { Pager } from "@/components/console/Pager";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { commissionLabel, franchiseApi, rupees, shortDate, type StaffSummary } from "@/lib/franchise/api";

interface Payment {
  id: string;
  amount: string | number;
  method?: string | null;
  note?: string | null;
  paid_on: string;
  staff?: { id: string; name: string } | null;
}

interface MyCommission {
  commission_type: "fixed" | "percentage";
  commission_value: number;
  earned: number;
  paid: number;
  balance: number;
}

export default function FranchisePayoutsPage() {
  const me = useFranchise();
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [staffId, setStaffId] = useState("");
  const [staff, setStaff] = useState<StaffSummary[]>([]);
  const [mine, setMine] = useState<MyCommission | null>(null);
  const [collected, setCollected] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (me.is_owner) franchiseApi<StaffSummary[]>("franchise/staff").then((r) => setStaff(r.data)).catch(() => {});
    else
      franchiseApi<{ my_commission: MyCommission; total_sales: number }>("franchise/dashboard")
        .then((r) => {
          setMine(r.data.my_commission);
          setCollected(r.data.total_sales);
        })
        .catch(() => {});
  }, [me.is_owner]);

  const load = useCallback(() => {
    const qs = new URLSearchParams({ page: String(page) });
    if (staffId) qs.set("staff_id", staffId);
    franchiseApi<Payment[]>(`franchise/payments?${qs}`)
      .then((r) => {
        setPayments(r.data);
        setMeta({ current_page: r.meta?.current_page ?? 1, last_page: r.meta?.last_page ?? 1, total: r.meta?.total ?? 0 });
      })
      .catch((e) => setError(e.message));
  }, [page, staffId]);
  useEffect(load, [load]);

  async function remove(p: Payment) {
    if (!confirm(`Remove the payment of ${rupees(p.amount)}${p.staff ? ` to ${p.staff.name}` : ""}?`)) return;
    try {
      await franchiseApi(`franchise/payments/${p.id}`, { method: "DELETE" });
      load();
      franchiseApi<StaffSummary[]>("franchise/staff").then((r) => setStaff(r.data)).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't remove.");
    }
  }

  const owed = staff.reduce((sum, s) => sum + Math.max(0, s.balance), 0);
  const paidTotal = staff.reduce((sum, s) => sum + s.paid, 0);

  return (
    <ConsolePage>
      <PageHeader
        title={me.is_owner ? "Payouts" : "My commission"}
        description={me.is_owner ? "Commission you have paid your staff. Record a payment from the Staff page." : "What you have earned for your cards and what has been paid to you."}
      />

      {error && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {me.is_owner ? (
          <>
            <StatCard label="Paid to staff" icon={HandCoins} value={rupees(paidTotal)} />
            <StatCard label="Still to pay" icon={IndianRupee} value={rupees(owed)} tone={owed > 0 ? "warning" : "neutral"} href="/franchise/staff" />
          </>
        ) : (
          <>
            <StatCard label="Total collected" icon={IndianRupee} loading={collected === null} value={rupees(collected)} hint="From your customers" />
            <StatCard label="Commission earned" icon={Wallet} loading={!mine} value={rupees(mine?.earned)} hint={mine ? commissionLabel(mine.commission_type, mine.commission_value) : undefined} />
            <StatCard label="Paid to me" icon={HandCoins} loading={!mine} value={rupees(mine?.paid)} />
            <StatCard label="Still to be paid" icon={IndianRupee} loading={!mine} value={rupees(mine?.balance)} tone={(mine?.balance ?? 0) > 0 ? "warning" : "neutral"} />
          </>
        )}
      </div>

      <Panel
        title="Payments"
        action={
          me.is_owner && staff.length > 0 ? (
            <select
              aria-label="Staff member"
              value={staffId}
              onChange={(e) => {
                setStaffId(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-full border border-border bg-white px-3 text-sm"
            >
              <option value="">Everyone</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : undefined
        }
      >
        {!payments ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
          </div>
        ) : payments.length === 0 ? (
          <EmptyState icon={HandCoins} title="No payments yet" text={me.is_owner ? "Use “Pay” next to a staff member to record what you paid." : "Payments from your franchise owner will show here."} />
        ) : (
          <DataTable head={me.is_owner ? ["Date", "Staff", "Amount", "Paid by", "Note", ""] : ["Date", "Amount", "Paid by", "Note"]}>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{shortDate(p.paid_on)}</td>
                {me.is_owner && <td className="px-5 py-3 font-medium">{p.staff?.name ?? "—"}</td>}
                <td className="whitespace-nowrap px-5 py-3 font-medium">{rupees(p.amount)}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.method || "—"}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.note || "—"}</td>
                {me.is_owner && (
                  <td className="px-5 py-3 text-right">
                    <button type="button" onClick={() => remove(p)} aria-label="Remove payment" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-[#FDECEC]">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>
      <Pager page={meta.current_page} lastPage={meta.last_page} total={meta.total} onPage={setPage} />
    </ConsolePage>
  );
}
