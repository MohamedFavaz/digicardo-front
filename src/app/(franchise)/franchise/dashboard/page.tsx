"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Gauge, HandCoins, IndianRupee, PlusCircle, TrendingUp, Users, Wallet } from "lucide-react";
import { ButtonLink, ConsolePage, DataTable, EmptyState, PageHeader, Panel, StatCard, StatusPill } from "@/components/console/ui";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { commissionLabel, franchiseApi, rupees, shortDate, type FranchiseCard, type StaffSummary } from "@/lib/franchise/api";

interface Dashboard {
  is_owner: boolean;
  total_cards: number;
  active_cards: number;
  cards_this_month: number;
  total_sales: number;
  card_limit: number;
  cards_used: number;
  remaining_credits: number;
  recent_cards: FranchiseCard[];
  staff?: StaffSummary[];
  staff_count?: number;
  commission_owed?: number;
  cash_with_staff?: number;
  pending_handovers?: number;
  earnings?: { collected: number; renewals?: number; staff_commission: number; digicardo_cost: number; net: number; this_month_collected: number };
  my_commission?: { commission_type: "fixed" | "percentage"; commission_value: number; earned: number; paid: number; balance: number; cash_due?: number; pending_handover?: number };
}

export default function FranchiseDashboardPage() {
  const me = useFranchise();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    franchiseApi<Dashboard>("franchise/dashboard")
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message));
  }, []);

  const loading = !data && !error;
  const owner = me.is_owner;

  return (
    <ConsolePage>
      <PageHeader
        title={owner ? me.franchise.name : `Hi, ${me.user.name.split(" ")[0]}`}
        description={owner ? "Your franchise at a glance: cards, staff and commission." : `Your cards and commission at ${me.franchise.name}.`}
        actions={
          <ButtonLink href="/franchise/cards/create" icon={PlusCircle}>
            New card
          </ButtonLink>
        }
      />

      {error && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label={owner ? "Cards made" : "My cards"} icon={CreditCard} loading={loading} value={data?.total_cards ?? 0} hint={`${data?.cards_this_month ?? 0} this month`} href="/franchise/cards" />
        <StatCard
          label="Credits left"
          icon={Gauge}
          loading={loading}
          value={data?.remaining_credits ?? 0}
          hint={`of ${data?.card_limit ?? 0} for the franchise`}
          tone={(data?.card_limit ?? 0) > 0 && data?.remaining_credits === 0 ? "danger" : "neutral"}
        />
        {owner ? (
          <>
            <StatCard
              label="Cash with staff"
              icon={Users}
              loading={loading}
              value={rupees(data?.cash_with_staff)}
              hint={data?.pending_handovers ? `${data.pending_handovers} handover${data.pending_handovers === 1 ? "" : "s"} to confirm` : `${data?.staff_count ?? 0} staff`}
              href="/franchise/cash"
              tone={(data?.pending_handovers ?? 0) > 0 ? "warning" : "neutral"}
            />
            <StatCard label="Commission to pay" icon={HandCoins} loading={loading} value={rupees(data?.commission_owed)} hint="Owed to staff" href="/franchise/payouts" tone={(data?.commission_owed ?? 0) > 0 ? "warning" : "neutral"} />
          </>
        ) : (
          <>
            <StatCard label="Commission earned" icon={Wallet} loading={loading} value={rupees(data?.my_commission?.earned)} hint={data?.my_commission ? `${commissionLabel(data.my_commission.commission_type, data.my_commission.commission_value)} · ${rupees(data.total_sales)} collected` : undefined} href="/franchise/payouts" />
            <StatCard
              label={(data?.my_commission?.cash_due ?? 0) < 0 ? "Franchise owes you" : "Cash to hand over"}
              icon={IndianRupee}
              loading={loading}
              value={rupees(Math.abs(data?.my_commission?.cash_due ?? 0))}
              hint={data?.my_commission?.pending_handover ? `${rupees(data.my_commission.pending_handover)} waiting for owner` : "Collected + renewals − your commission"}
              href="/franchise/cash"
              tone={(data?.my_commission?.cash_due ?? 0) > 0 ? "warning" : "neutral"}
            />
          </>
        )}
      </div>

      {owner && (
        <Panel title="Your earnings" icon={TrendingUp} description="All cards your franchise has made and renewed, all time.">
          <div className="grid grid-cols-2 gap-px bg-[#E9E9E2] lg:grid-cols-5">
            {[
              { label: "Collected for cards", value: data?.earnings?.collected, hint: `${rupees(data?.earnings?.this_month_collected)} this month (with renewals)`, sign: "" },
              { label: "Renewals", value: data?.earnings?.renewals ?? 0, hint: "All yours: no commission", sign: "+" },
              { label: "Staff commission", value: data?.earnings?.staff_commission, hint: "Paid or owed to staff", sign: "−" },
              { label: "Paid to Digicardo", value: data?.earnings?.digicardo_cost, hint: "Card price per card", sign: "−" },
              { label: "Your net earnings", value: data?.earnings?.net, hint: "What the franchise keeps", sign: "=" },
            ].map((x, i) => (
              <div key={x.label} className={`bg-[#FBFBF8] px-5 py-4 ${i === 4 ? "col-span-2 bg-[#F1F5E8] lg:col-span-1" : ""}`}>
                <p className="text-sm text-muted-foreground">
                  {x.sign && <span className="mr-1 font-semibold text-foreground">{x.sign}</span>}
                  {x.label}
                </p>
                <p className={`mt-1 text-[26px] font-light tracking-tight ${i === 4 ? "text-[#3F5520]" : "text-[#121212]"}`}>
                  {loading ? <span className="skeleton inline-block h-6 w-20 rounded-md align-middle" /> : rupees(x.value)}
                </p>
                <p className="text-xs text-muted-foreground">{x.hint}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {owner && (
        <Panel title="Staff performance" description="Who made how many cards, and what you owe each person." action={<ButtonLink href="/franchise/staff" variant="secondary">Manage staff</ButtonLink>}>
          {data?.staff && data.staff.length > 0 ? (
            <DataTable head={["Staff", "Commission rule", "Cards", "Total collected", "Commission", "Handed over", "Still with staff"]}>
              {data.staff.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3">
                    <Link href={`/franchise/cards?created_by=${s.id}`} className="font-medium text-foreground hover:underline">
                      {s.name}
                    </Link>
                    {s.status !== "active" && <StatusPill tone="danger" className="ml-2">Suspended</StatusPill>}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{commissionLabel(s.commission_type, s.commission_value)}</td>
                  <td className="px-5 py-3">{s.cards}</td>
                  <td className="px-5 py-3 font-medium">{rupees(s.sales)}</td>
                  <td className="px-5 py-3">{rupees(s.earned)}</td>
                  <td className="px-5 py-3">{rupees(s.handed_over)}</td>
                  <td className="px-5 py-3 font-medium">
                    {(s.cash_due ?? 0) > 0.009 ? rupees(s.cash_due) : (s.cash_due ?? 0) < -0.009 ? <span className="font-normal text-[#52525B]">You owe {rupees(-(s.cash_due ?? 0))}</span> : <span className="font-normal text-[#1E7B43]">Settled</span>}
                  </td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <EmptyState icon={Users} title={loading ? "Loading…" : "No staff yet"} text="Add your workers so they can sign in and make cards. You decide each person's commission." action={!loading && <ButtonLink href="/franchise/staff" icon={PlusCircle}>Add staff</ButtonLink>} />
          )}
        </Panel>
      )}

      <Panel title="Latest cards" action={<ButtonLink href="/franchise/cards" variant="secondary">See all</ButtonLink>}>
        {data && data.recent_cards.length > 0 ? (
          <DataTable head={owner ? ["Card", "Made by", "Date", "Status"] : ["Card", "Date", "Status"]}>
            {data.recent_cards.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3">
                  <Link href={`/franchise/cards/${c.id}`} className="font-medium text-foreground hover:underline">
                    {c.card_name}
                  </Link>
                  {c.profile?.username && <p className="text-xs text-muted-foreground">/{c.profile.username}</p>}
                </td>
                {owner && <td className="px-5 py-3 text-muted-foreground">{c.created_by ? (c.created_by.id === me.user.id ? "You" : c.created_by.name) : "—"}</td>}
                <td className="px-5 py-3 text-muted-foreground">{shortDate(c.created_at)}</td>
                <td className="px-5 py-3">
                  <StatusPill tone={c.status === "active" ? "success" : "neutral"}>{c.status === "active" ? "Live" : "Hidden"}</StatusPill>
                </td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <EmptyState icon={CreditCard} title={loading ? "Loading…" : "No cards yet"} text="Make the first card for a customer. It takes about a minute." action={!loading && <ButtonLink href="/franchise/cards/create" icon={PlusCircle}>Create a card</ButtonLink>} />
        )}
      </Panel>
    </ConsolePage>
  );
}
