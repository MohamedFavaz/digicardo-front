"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CreditCard, ExternalLink, Gauge, Loader2, PencilLine, PlusCircle, TrendingUp, Wallet } from "lucide-react";
import { ButtonLink, ConsolePage, EmptyState, PageHeader, Panel, StatCard, StatusPill } from "@/components/console/ui";
import type { AgentCard } from "@/types/agent";
import { agentImpersonate } from "@/lib/agent/impersonate";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

interface DashboardData {
  total_cards: number;
  active_cards: number;
  card_limit: number;
  cards_used: number;
  remaining_credits: number;
  total_revenue: number;
  total_commission: number;
  monthly_cards: Record<string, number>;
  monthly_revenue: Record<string, number>;
  recent_cards: AgentCard[];
}

export default function AgentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  async function handleImpersonate(cardId: string) {
    setImpersonatingId(cardId);
    try {
      await agentImpersonate(cardId);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't open the card. Please try again.");
    } finally {
      setImpersonatingId(null);
    }
  }

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/bff/v1/agent/dashboard", { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const used = data?.cards_used || 0;
  const limit = data?.card_limit || 0;
  const usedPct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const monthlyEntries = Object.entries(data?.monthly_cards || {}).slice(-6);
  const maxCount = Math.max(1, ...monthlyEntries.map(([, c]) => c));
  const recent = data?.recent_cards ?? [];
  const noCards = !loading && (data?.total_cards || 0) === 0;
  const left = data?.remaining_credits || 0;

  return (
    <ConsolePage>
      <PageHeader
        title="Home"
        description="Your cards, credits and earnings at a glance."
        actions={
          <ButtonLink href="/agent/cards/create" icon={PlusCircle}>
            New card
          </ButtonLink>
        }
      />

      {noCards && (
        <div className="flex flex-col gap-4 rounded-2xl bg-foreground p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">Make your first card</p>
            <p className="mt-1 text-[15px] text-white/70">
              Enter your client&apos;s details and we&apos;ll create their account and card. Takes about a minute.
            </p>
          </div>
          <Link
            href="/agent/cards/create"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-foreground hover:bg-white/90"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            Create a card
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Active cards"
          icon={CreditCard}
          loading={loading}
          value={data?.active_cards || 0}
          hint={`of ${data?.total_cards || 0} created`}
          href="/agent/cards"
        />
        <StatCard
          label="Credits left"
          icon={Gauge}
          loading={loading}
          value={left}
          hint={limit ? `of ${limit} credits` : "Ask your admin for credits"}
          href="/agent/limits"
          tone={limit > 0 && left === 0 ? "danger" : "neutral"}
        />
        <StatCard
          label="My commission"
          icon={Wallet}
          loading={loading}
          value={`₹${(data?.total_commission || 0).toLocaleString("en-IN")}`}
          hint="Earned so far"
          href="/agent/earnings"
        />
        <StatCard
          label="Card sales"
          icon={TrendingUp}
          loading={loading}
          value={`₹${(data?.total_revenue || 0).toLocaleString("en-IN")}`}
          hint="Total billed to clients"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel
          className="lg:col-span-8"
          title="Recent cards"
          description="The latest cards you made for clients."
          action={
            <Link href="/agent/cards" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          }
        >
          {loading ? (
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No cards yet"
              text="Cards you create for clients will show up here."
              action={
                <ButtonLink href="/agent/cards/create" icon={PlusCircle}>
                  New card
                </ButtonLink>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {recent.slice(0, 6).map((card) => (
                <li key={card.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {card.customer_name?.charAt(0)?.toUpperCase() || "C"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/agent/cards/${card.id}`} className="block truncate text-sm font-semibold text-foreground hover:text-primary">
                      {card.card_name || card.customer_name}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">
                      {card.customer_email} · {formatDate(card.created_at)}
                    </p>
                  </div>
                  <StatusPill tone={card.status === "active" ? "success" : "neutral"} className="hidden sm:inline-flex">
                    {card.status === "active" ? "Live" : "Paused"}
                  </StatusPill>
                  <button
                    type="button"
                    onClick={() => handleImpersonate(card.id)}
                    disabled={impersonatingId === card.id}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                    title="Open this card in the editor"
                  >
                    {impersonatingId === card.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <PencilLine className="h-4 w-4" aria-hidden="true" />}
                    Edit
                  </button>
                  {card.profile?.username && (
                    <Link
                      href={`/${card.profile.username}`}
                      target="_blank"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="View live card"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-6 lg:col-span-4">
          <Panel title="Card credits" description="Each new card uses one credit.">
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[28px] font-semibold leading-9 tracking-tight text-foreground">{used}</span>
                <span className="text-sm text-muted-foreground">of {limit} used</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${usedPct >= 90 ? "bg-destructive" : usedPct >= 70 ? "bg-[#F59E0B]" : "bg-primary"}`}
                  style={{ width: `${usedPct}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {left} credit{left === 1 ? "" : "s"} left. Need more? Ask your admin.
              </p>
            </div>
          </Panel>

          {monthlyEntries.length > 0 && (
            <Panel title="Cards per month">
              <div className="flex h-40 items-end gap-2 p-5">
                {monthlyEntries.map(([month, count]) => (
                  <div key={month} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-xs font-medium text-foreground">{count}</span>
                    <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${Math.max((count / maxCount) * 100, 4)}%` }} />
                    <span className="text-xs text-muted-foreground">{month.split("-")[1] || month}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </ConsolePage>
  );
}
