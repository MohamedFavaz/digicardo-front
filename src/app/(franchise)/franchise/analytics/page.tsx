"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, CreditCard, Eye, IndianRupee, Loader2, MousePointerClick, Radio, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ConsolePage, EmptyState, PageHeader, Panel, StatCard } from "@/components/console/ui";
import { FilterTabs } from "@/components/console/Pager";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { franchiseApi, rupees } from "@/lib/franchise/api";
import { BarList, CHART, ChartTip, dayLabel, monthLabel, num, rupeeTick } from "@/components/analytics/charts";
import { TEMPLATE_MANIFESTS } from "@/templates/manifests";

const C = CHART;

type Range = "7" | "30" | "90" | "365";

interface Analytics {
  is_owner: boolean;
  days: number;
  totals: { cards: number; live: number; sales: number; commission: number; views: number; taps: number };
  status: { live: number; hidden: number; expired: number; expiring: number };
  monthly: { month: string; cards: number; sales: number }[];
  daily: { date: string; views: number; taps: number }[];
  top_cards: { id: string; card_name: string; username?: string | null; views: number; taps: number }[];
  templates: { template: string; cards: number }[];
  people: { id: string; name: string; cards: number; sales: number; commission: number }[];
}

export default function FranchiseAnalyticsPage() {
  const me = useFranchise();
  const [range, setRange] = useState<Range>("30");
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    franchiseApi<Analytics>(`franchise/analytics?days=${range}`)
      .then((r) => {
        setData(r.data);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [range]);

  const daily = useMemo(() => {
    if (!data) return [];
    // A year of days is too dense to read: show weeks instead.
    if (data.days < 365) return data.daily;
    const weeks: { date: string; views: number; taps: number }[] = [];
    data.daily.forEach((d, i) => {
      if (i % 7 === 0) weeks.push({ date: d.date, views: 0, taps: 0 });
      weeks[weeks.length - 1].views += d.views;
      weeks[weeks.length - 1].taps += d.taps;
    });
    return weeks;
  }, [data]);

  const owner = me.is_owner;
  const t = data?.totals;
  const statusRows = data
    ? [
        { key: "live", label: "Live", value: data.status.live, color: C.status.live },
        { key: "expiring", label: "Live, expiring within a week", value: data.status.expiring, color: C.status.expiring },
        { key: "expired", label: "Expired", value: data.status.expired, color: C.status.expired },
        { key: "hidden", label: "Hidden", value: data.status.hidden, color: C.status.hidden },
      ]
    : [];
  const templateName = (id: string) => (TEMPLATE_MANIFESTS as Record<string, { name: string }>)[id]?.name ?? (id === "unknown" ? "Not set" : id);
  const noVisitors = data && data.totals.views + data.totals.taps === 0;

  return (
    <ConsolePage>
      <PageHeader
        title="Analytics"
        description={owner ? "Your franchise in charts: cards, money, visitors and your team." : "Your cards, visitors and earnings in charts."}
        actions={
          <FilterTabs<Range>
            label="Time range for visitors"
            value={range}
            onChange={setRange}
            options={[
              { id: "7", label: "7 days" },
              { id: "30", label: "30 days" },
              { id: "90", label: "90 days" },
              { id: "365", label: "1 year" },
            ]}
          />
        }
      />

      {error && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label={owner ? "Cards made" : "My cards"} icon={CreditCard} loading={loading && !data} value={num(t?.cards ?? 0)} hint="All time" />
        <StatCard label="Live now" icon={Radio} loading={loading && !data} value={num(t?.live ?? 0)} hint={data ? `${data.status.expired} expired` : undefined} tone={(data?.status.expired ?? 0) > 0 ? "warning" : "neutral"} />
        <StatCard label="Card views" icon={Eye} loading={loading && !data} value={num(t?.views ?? 0)} hint={`Last ${range === "365" ? "year" : `${range} days`}`} />
        <StatCard label="Taps" icon={MousePointerClick} loading={loading && !data} value={num(t?.taps ?? 0)} hint="Calls, WhatsApp, links…" />
        <StatCard label="Money collected" icon={IndianRupee} loading={loading && !data} value={rupees(t?.sales)} hint="From customers" />
        <StatCard label={owner ? "Staff commission" : "My commission"} icon={Wallet} loading={loading && !data} value={rupees(t?.commission)} hint="All time" />
      </div>

      {/* Visitors over time: two counts on one axis (same unit), legend + crosshair tooltip. */}
      <Panel
        title="Visitors"
        icon={Eye}
        description="How many times your cards were opened, and how often people tapped a button on them."
        action={
          <div className="flex items-center gap-4 text-xs text-[#52525B]" aria-label="Legend">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: C.views }} />Card views</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: C.taps }} />Taps</span>
          </div>
        }
      >
        <div className="h-72 px-2 py-4">
          {loading && !data ? (
            <div className="flex h-full items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : noVisitors ? (
            <EmptyState icon={Eye} title="No visitors yet in this period" text="Share your customers' card links: views and taps appear here within a day." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="date" tickFormatter={dayLabel} tick={{ fill: C.axis, fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
                <YAxis allowDecimals={false} tick={{ fill: C.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTip format={(l) => (data?.days === 365 ? `Week of ${dayLabel(l)}` : dayLabel(l))} />} cursor={{ stroke: C.axis, strokeDasharray: "3 3" }} />
                <Line isAnimationActive={false} type="monotone" dataKey="views" name="Card views" stroke={C.views} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: "#FBFBF8", strokeWidth: 2 }} />
                <Line isAnimationActive={false} type="monotone" dataKey="taps" name="Taps" stroke={C.taps} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: "#FBFBF8", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Panel>

      {/* Monthly: two separate charts (cards vs rupees are different scales — never a dual axis). */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Cards made per month" icon={BarChart3} description="Last 12 months">
          <div className="h-64 px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthly ?? []} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fill: C.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: C.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<ChartTip format={(l) => monthLabel(l) + " " + l.slice(0, 4)} />} cursor={{ fill: "rgba(90,122,31,0.08)" }} />
                <Bar isAnimationActive={false} dataKey="cards" name="Cards made" fill={C.views} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Money collected per month" icon={IndianRupee} description="What customers paid, last 12 months">
          <div className="h-64 px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthly ?? []} margin={{ top: 8, right: 12, bottom: 0, left: 8 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fill: C.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={rupeeTick} tick={{ fill: C.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<ChartTip money format={(l) => monthLabel(l) + " " + l.slice(0, 4)} />} cursor={{ fill: "rgba(90,122,31,0.08)" }} />
                <Bar isAnimationActive={false} dataKey="sales" name="Money collected" fill={C.views} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Card status" icon={Radio} description="Right now">
          {data && data.totals.cards > 0 ? (
            <BarList rows={statusRows} color={C.status.live} />
          ) : (
            <EmptyState icon={CreditCard} title={loading ? "Loading…" : "No cards yet"} />
          )}
        </Panel>
        <Panel title="Designs used" icon={CreditCard} description="Which card design your customers have">
          {data && data.templates.length > 0 ? (
            <BarList rows={data.templates.map((x) => ({ key: x.template, label: templateName(x.template), value: x.cards }))} color={C.views} />
          ) : (
            <EmptyState icon={CreditCard} title={loading ? "Loading…" : "No cards yet"} />
          )}
        </Panel>
      </div>

      {owner && (
        <Panel title="Team" icon={Wallet} description="Cards each person made, money they collected and their commission (all time).">
          {data && data.people.length > 0 ? (
            <BarList
              rows={data.people.map((p) => ({
                key: p.id,
                label: p.name,
                value: p.cards,
                extra: <span className="ml-3 font-normal text-[#6B6D63]">{rupees(p.sales)} collected · {rupees(p.commission)} commission</span>,
              }))}
              color={C.views}
              valueLabel={(v) => `${v} card${v === 1 ? "" : "s"}`}
            />
          ) : (
            <EmptyState icon={Wallet} title={loading ? "Loading…" : "No cards made yet"} />
          )}
        </Panel>
      )}

      <Panel title="Most viewed cards" icon={Eye} description={`Last ${range === "365" ? "year" : `${range} days`}`}>
        {data && data.top_cards.length > 0 ? (
          <BarList
            rows={data.top_cards.map((c) => ({
              key: c.id,
              label: (
                <Link href={`/franchise/cards/${c.id}`} className="hover:underline">
                  {c.card_name}
                  {c.username && <span className="text-[#6B6D63]"> · /{c.username}</span>}
                </Link>
              ),
              value: c.views,
              extra: <span className="ml-3 font-normal text-[#6B6D63]">{num(c.taps)} taps</span>,
            }))}
            color={C.views}
            valueLabel={(v) => `${num(v)} views`}
          />
        ) : (
          <EmptyState icon={Eye} title={loading ? "Loading…" : "No views in this period"} />
        )}
      </Panel>
    </ConsolePage>
  );
}
