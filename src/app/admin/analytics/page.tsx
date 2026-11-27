"use client";
import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Building2, CreditCard, Eye, IndianRupee, Layers, Radio, UserCog, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ButtonLink, ConsolePage, EmptyState, PageHeader, Panel, StatCard } from "@/components/console/ui";
import { FilterTabs } from "@/components/console/Pager";
import { BarList, CHART, ChartTip, Legend, SOURCE_LABEL, dayLabel, monthLabel, num, rupeeTick } from "@/components/analytics/charts";
import { franchiseApi, rupees } from "@/lib/franchise/api";
import { TEMPLATE_MANIFESTS } from "@/templates/manifests";

type Range = "7" | "30" | "90" | "365";
type Source = "admin" | "agents" | "franchises";
const SOURCES: Source[] = ["admin", "agents", "franchises"];

interface Platform {
  days: number;
  totals: { cards: number; live: number; agents: number; franchises: number; staff: number; revenue_12m: number; views: number; taps: number };
  by_source: Record<Source, number>;
  status: { live: number; expiring: number; expired: number; hidden: number; blocked: number };
  cards_monthly: ({ month: string } & Record<Source, number>)[];
  money_monthly: ({ month: string } & Record<Source, number>)[];
  daily: { date: string; views: number; taps: number }[];
  top_cards: { id: string; name: string; username?: string | null; source: Source; views: number }[];
  partners: { id: string; name: string; type: "agents" | "franchises"; cards: number; revenue: number }[];
  templates: { template: string; cards: number }[];
}

/** Singular label for one card. */
const ONE_SOURCE: Record<Source, string> = { admin: "Admin card", agents: "Agent card", franchises: "Franchise card" };

const monthFull = (l: string) => `${monthLabel(l)} ${l.slice(0, 4)}`;

/** Admin Analytics: the whole platform in charts. */
export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<Range>("30");
  const [data, setData] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    franchiseApi<Platform>(`admin/analytics/platform?days=${range}`)
      .then((r) => {
        setData(r.data);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [range]);

  const daily = useMemo(() => {
    if (!data) return [];
    if (data.days < 365) return data.daily;
    const weeks: { date: string; views: number; taps: number }[] = [];
    data.daily.forEach((d, i) => {
      if (i % 7 === 0) weeks.push({ date: d.date, views: 0, taps: 0 });
      weeks[weeks.length - 1].views += d.views;
      weeks[weeks.length - 1].taps += d.taps;
    });
    return weeks;
  }, [data]);

  const t = data?.totals;
  const first = loading && !data;
  const sourceLegend = SOURCES.map((s) => ({ label: SOURCE_LABEL[s], color: CHART.source[s] }));
  const templateName = (id: string) => (TEMPLATE_MANIFESTS as Record<string, { name: string }>)[id]?.name ?? (id === "unknown" ? "Not set" : id);
  const periodLabel = range === "365" ? "Last year" : `Last ${range} days`;

  return (
    <ConsolePage>
      <PageHeader
        title="Analytics"
        description="The whole platform in charts: cards, money, visitors, partners and designs."
        actions={
          <>
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
            <ButtonLink href="/admin/accounts" variant="secondary" icon={Activity}>
              Revenue
            </ButtonLink>
          </>
        }
      />

      {error && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Customer cards" icon={CreditCard} loading={first} value={num(t?.cards ?? 0)} hint={data ? `${num(data.status.live)} live · ${num(data.status.expired)} expired` : undefined} href="/admin/my-links" />
        <StatCard label="Partners" icon={UserCog} loading={first} value={num((t?.agents ?? 0) + (t?.franchises ?? 0))} hint={t ? `${t.agents} agents · ${t.franchises} franchises · ${t.staff} staff` : undefined} href="/admin/franchises" />
        <StatCard label="Revenue (12 months)" icon={IndianRupee} loading={first} value={rupees(t?.revenue_12m)} hint="Plans sold + partner cards" href="/admin/accounts" />
        <StatCard label="Card views" icon={Eye} loading={first} value={num(t?.views ?? 0)} hint={`${num(t?.taps ?? 0)} taps · ${periodLabel.toLowerCase()}`} />
      </div>

      <Panel title="Visitors" icon={Eye} description="Card views and button taps across every card.">
        <div className="px-5 pt-3"><Legend items={[{ label: "Card views", color: CHART.views, line: true }, { label: "Taps", color: CHART.taps, line: true }]} /></div>
        <div className="h-72 px-2 py-4">
          {first ? null : data && data.totals.views + data.totals.taps === 0 ? (
            <EmptyState icon={Eye} title="No visitors in this period" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="date" tickFormatter={dayLabel} tick={{ fill: CHART.axis, fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
                <YAxis allowDecimals={false} tick={{ fill: CHART.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTip format={(l) => (data?.days === 365 ? `Week of ${dayLabel(l)}` : dayLabel(l))} />} cursor={{ stroke: CHART.axis, strokeDasharray: "3 3" }} />
                <Line isAnimationActive={false} type="monotone" dataKey="views" name="Card views" stroke={CHART.views} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: "#FBFBF8", strokeWidth: 2 }} />
                <Line isAnimationActive={false} type="monotone" dataKey="taps" name="Taps" stroke={CHART.taps} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: "#FBFBF8", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Panel>

      {/* Cards and money per month — separate charts (different units), stacked by who made them. */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Cards made per month" icon={BarChart3} description="Last 12 months, by who made them">
        <div className="px-5 pt-3"><Legend items={sourceLegend} /></div>
          <div className="h-72 px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.cards_monthly ?? []} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fill: CHART.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: CHART.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<ChartTip total format={monthFull} />} cursor={{ fill: "rgba(90,122,31,0.08)" }} />
                {SOURCES.map((s, i) => (
                  <Bar key={s} isAnimationActive={false} dataKey={s} name={SOURCE_LABEL[s]} stackId="cards" fill={CHART.source[s]} stroke="#FBFBF8" strokeWidth={1} radius={i === SOURCES.length - 1 ? [4, 4, 0, 0] : 0} maxBarSize={28} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Money per month" icon={IndianRupee} description="Plans sold by admin + what partners pay per card">
        <div className="px-5 pt-3"><Legend items={sourceLegend} /></div>
          <div className="h-72 px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.money_monthly ?? []} margin={{ top: 8, right: 12, bottom: 0, left: 8 }}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="month" tickFormatter={monthLabel} tick={{ fill: CHART.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={rupeeTick} tick={{ fill: CHART.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                <Tooltip content={<ChartTip money total format={monthFull} />} cursor={{ fill: "rgba(90,122,31,0.08)" }} />
                {SOURCES.map((s, i) => (
                  <Bar key={s} isAnimationActive={false} dataKey={s} name={SOURCE_LABEL[s]} stackId="money" fill={CHART.source[s]} stroke="#FBFBF8" strokeWidth={1} radius={i === SOURCES.length - 1 ? [4, 4, 0, 0] : 0} maxBarSize={28} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Who made the cards" icon={Layers} description="All time">
          {data ? (
            <BarList rows={SOURCES.map((s) => ({ key: s, label: SOURCE_LABEL[s], value: data.by_source[s], color: CHART.source[s] }))} color={CHART.views} />
          ) : (
            <EmptyState icon={Layers} title="Loading…" />
          )}
        </Panel>
        <Panel title="Card status" icon={Radio} description="Right now">
          {data ? (
            <BarList
              rows={[
                { key: "live", label: "Live", value: data.status.live, color: CHART.status.live },
                { key: "expiring", label: "Live, expiring within a week", value: data.status.expiring, color: CHART.status.expiring },
                { key: "expired", label: "Expired", value: data.status.expired, color: CHART.status.expired },
                { key: "hidden", label: "Hidden by owner", value: data.status.hidden, color: CHART.status.hidden },
                { key: "blocked", label: "Suspended / moderated", value: data.status.blocked, color: CHART.status.blocked },
              ]}
              color={CHART.status.live}
            />
          ) : (
            <EmptyState icon={Radio} title="Loading…" />
          )}
        </Panel>
        <Panel title="Designs used" icon={CreditCard} description="Customer cards per design">
          {data && data.templates.length > 0 ? (
            <BarList rows={data.templates.map((x) => ({ key: x.template, label: templateName(x.template), value: x.cards }))} color={CHART.views} />
          ) : (
            <EmptyState icon={CreditCard} title={first ? "Loading…" : "No cards yet"} />
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Top partners" icon={Building2} description="Agents and franchises by cards made (all time)">
        <div className="px-5 pt-3"><Legend items={[{ label: "Agent", color: CHART.source.agents }, { label: "Franchise", color: CHART.source.franchises }]} /></div>
          {data && data.partners.length > 0 ? (
            <BarList
              rows={data.partners.map((p) => ({
                key: p.id,
                label: (
                  <>
                    {p.name} <span className="text-[#6B6D63]">· {p.type === "franchises" ? "Franchise" : "Agent"}</span>
                  </>
                ),
                value: p.cards,
                color: CHART.source[p.type],
                extra: <span className="ml-3 font-normal text-[#6B6D63]">{rupees(p.revenue)}</span>,
              }))}
              color={CHART.source.agents}
              valueLabel={(v) => `${num(v)} card${v === 1 ? "" : "s"}`}
            />
          ) : (
            <EmptyState icon={Users} title={first ? "Loading…" : "No partner cards yet"} />
          )}
        </Panel>
        <Panel title="Most viewed cards" icon={Eye} description={periodLabel}>
          {data && data.top_cards.length > 0 ? (
            <BarList
              rows={data.top_cards.map((c) => ({
                key: c.id,
                label: (
                  <>
                    {c.name}
                    {c.username && <span className="text-[#6B6D63]"> · /{c.username}</span>}
                  </>
                ),
                value: c.views,
                color: CHART.source[c.source],
                extra: <span className="ml-3 font-normal text-[#6B6D63]">{ONE_SOURCE[c.source]}</span>,
              }))}
              color={CHART.views}
              valueLabel={(v) => `${num(v)} views`}
            />
          ) : (
            <EmptyState icon={Eye} title={first ? "Loading…" : "No views in this period"} />
          )}
        </Panel>
      </div>
    </ConsolePage>
  );
}
