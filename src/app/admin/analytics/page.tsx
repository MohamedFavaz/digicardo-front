"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Link2,
  ShieldAlert,
  TrendingUp,
  Activity,
} from "lucide-react";

interface KPI {
  label: string;
  value: string | number;
  icon: typeof Users;
  sub?: string;
  color: string;
}



function BarChart({ points, max }: { points: { label: string; value: number }[]; max: number }) {
  return (
    <div className="flex items-end gap-2 h-36 px-2 pt-6">
      {points.map((p, i) => {
        const heightPct = max > 0 ? (p.value / max) * 100 : 5;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {p.value}
            </span>
            <div className="w-full bg-zinc-100 rounded-t-lg h-24 flex items-end overflow-hidden">
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 group-hover:from-indigo-700 group-hover:to-indigo-500"
                style={{ height: `${Math.max(heightPct, 8)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground truncate w-full text-center">
              {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<{
    users: { total: number; active: number; suspended: number };
    profiles: { total: number };
  } | null>(null);
  const [signups, setSignups] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/bff/v1/admin/overview", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/analytics/signups/monthly", { credentials: "include" }).then(r => r.json()),
    ])
      .then(([ov, signupsData]) => {
        setMetrics(ov?.data?.metrics);
        const raw: { month: string; count: number }[] = signupsData?.data?.signups || [];
        setSignups(raw.slice(-8).map(m => ({ label: m.month?.slice(0, 3) || "", value: Number(m.count) })));
      })
      .finally(() => setLoading(false));
  }, []);

  const total = metrics?.users?.total ?? 0;
  const active = metrics?.users?.active ?? 0;
  const suspended = metrics?.users?.suspended ?? 0;
  const profiles = metrics?.profiles?.total ?? 0;
  const activeRate = total > 0 ? ((active / total) * 100).toFixed(0) : "0";
  const maxSignups = signups.reduce((m, p) => Math.max(m, p.value), 0);


  const kpis: KPI[] = [
    { label: "Total Users", value: loading ? "…" : total, icon: Users, sub: `${active} active accounts`, color: "bg-indigo-50 text-indigo-600" },
    { label: "Public Profiles", value: loading ? "…" : profiles, icon: Link2, sub: "live bio pages", color: "bg-violet-50 text-violet-600" },
    { label: "Suspended Accounts", value: loading ? "…" : suspended, icon: ShieldAlert, sub: "enforced suspensions", color: "bg-amber-50 text-amber-600" },
    { label: "Platform Active Rate", value: loading ? "…" : `${activeRate}%`, icon: TrendingUp, sub: "healthy standing", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div suppressHydrationWarning className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Analytics</h1>
          </div>
          <p className="mt-1 text-[15px] text-muted-foreground">
            User growth, registrations, and profile engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/accounts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Revenue</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-2xl p-5 hover:shadow-xs transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold capitalize text-muted-foreground">{k.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${k.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-semibold tracking-tight text-foreground">{k.value}</span>
                {k.sub && <p className="text-xs text-muted-foreground font-medium mt-1">{k.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Signups Chart (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#52525B]" />
              <h2 className="text-xs font-semibold text-foreground capitalize">New Registrations Trend</h2>
            </div>
            <span className="text-xs text-muted-foreground">Past 8 Months</span>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="h-36 bg-zinc-100 rounded-xl animate-pulse" />
            ) : signups.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-xs text-muted-foreground">
                No monthly registration records available yet.
              </div>
            ) : (
              <BarChart points={signups} max={maxSignups} />
            )}
          </div>
        </div>

        {/* Status Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-xs font-semibold text-foreground capitalize">Account Standing Distribution</h2>
          </div>

          <div className="p-5 space-y-4">
            {/* Active Users */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#52525B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Active Accounts
                </span>
                <span className="font-semibold text-foreground">
                  {active} ({total > 0 ? ((active / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (active / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Suspended Users */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#52525B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Suspended Accounts
                </span>
                <span className="font-semibold text-foreground">
                  {suspended} ({total > 0 ? ((suspended / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (suspended / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Profiles Created</span>
                <span className="font-semibold text-foreground text-sm">{profiles} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The user directory lives on Users (no duplicate list here). */}
      <Link
        href="/admin/admin-panel"
        className="flex items-center justify-between gap-4 rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8] p-5 transition-colors hover:bg-white"
      >
        <span>
          <span className="block text-[15px] font-medium text-foreground">Looking for a specific account?</span>
          <span className="block text-sm text-muted-foreground">Search, open and manage every user on the Users page.</span>
        </span>
        <span className="inline-flex h-10 shrink-0 items-center rounded-full bg-[#343C22] px-4 text-sm font-medium text-white">Open Users</span>
      </Link>
    </div>
  );
}
