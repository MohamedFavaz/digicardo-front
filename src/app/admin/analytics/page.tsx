"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  Link2, 
  ShieldAlert, 
  TrendingUp, 
  Search, 
  Calendar, 
  ExternalLink,
  CheckCircle2,
  Activity,
  ArrowUpRight
} from "lucide-react";

interface KPI {
  label: string;
  value: string | number;
  icon: typeof Users;
  sub?: string;
  color: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  username?: string;
  created_at: string;
  status: string;
  total_profile_views?: number;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function BarChart({ points, max }: { points: { label: string; value: number }[]; max: number }) {
  return (
    <div className="flex items-end gap-2 h-36 px-2 pt-6">
      {points.map((p, i) => {
        const heightPct = max > 0 ? (p.value / max) * 100 : 5;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {p.value}
            </span>
            <div className="w-full bg-slate-100 rounded-t-lg h-24 flex items-end overflow-hidden">
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 group-hover:from-indigo-700 group-hover:to-indigo-500"
                style={{ height: `${Math.max(heightPct, 8)}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-slate-500 truncate w-full text-center">
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
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/bff/v1/admin/overview", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/users?per_page=50&sort_by=created_at&sort_dir=desc", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/analytics/signups/monthly", { credentials: "include" }).then(r => r.json()),
    ])
      .then(([ov, usersData, signupsData]) => {
        setMetrics(ov?.data?.metrics);
        const items = (usersData?.data?.items || []).map((u: Record<string, unknown>) => ({
          ...u,
          username: (u.profile as Record<string, unknown>)?.username,
        }));
        setUsers(items);
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

  const filtered = users.filter(
    u =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(search.toLowerCase()))
  );

  const kpis: KPI[] = [
    { label: "Total Users", value: loading ? "…" : total, icon: Users, sub: `${active} active accounts`, color: "bg-indigo-50 text-indigo-600" },
    { label: "Public Profiles", value: loading ? "…" : profiles, icon: Link2, sub: "live bio pages", color: "bg-violet-50 text-violet-600" },
    { label: "Suspended Accounts", value: loading ? "…" : suspended, icon: ShieldAlert, sub: "enforced suspensions", color: "bg-amber-50 text-amber-600" },
    { label: "Platform Active Rate", value: loading ? "…" : `${activeRate}%`, icon: TrendingUp, sub: "healthy standing", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div suppressHydrationWarning className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Platform Analytics & Growth</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Live Insights
            </span>
          </div>
          <p className="text-indigo-200 text-xs mt-1.5 max-w-xl leading-relaxed">
            Track user account creation trends, monthly registrations, account status health, and bio link footprint across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/accounts"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow hover:bg-indigo-50 transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>Revenue Ledger</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-slate-900">{k.value}</span>
                {k.sub && <p className="text-[11px] text-slate-500 font-medium mt-1">{k.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Signups Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">New Registrations Trend</h2>
            </div>
            <span className="text-xs text-slate-400">Past 8 Months</span>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="h-36 bg-slate-100 rounded-xl animate-pulse" />
            ) : signups.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-xs text-slate-400">
                No monthly registration records available yet.
              </div>
            ) : (
              <BarChart points={signups} max={maxSignups} />
            )}
          </div>
        </div>

        {/* Status Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Account Standing Distribution</h2>
          </div>

          <div className="p-5 space-y-4">
            {/* Active Users */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Active Accounts
                </span>
                <span className="font-bold text-slate-900">
                  {active} ({total > 0 ? ((active / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (active / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Suspended Users */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Suspended Accounts
                </span>
                <span className="font-bold text-slate-900">
                  {suspended} ({total > 0 ? ((suspended / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (suspended / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Profiles Created</span>
                <span className="font-black text-indigo-600 text-sm">{profiles} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Directory Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Registered Accounts Directory</h2>
            <p className="text-[11px] text-slate-400">Recently registered users and their profile handles</p>
          </div>
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search directory…"
              className="w-full h-8 pl-8 pr-3 rounded-xl border border-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Profile Handle</th>
                <th className="px-5 py-3">Registered Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td colSpan={4} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    No users found matching search.
                  </td>
                </tr>
              ) : (
                filtered.slice(0, 15).map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-5 py-3 font-mono">
                      {u.username ? (
                        <a
                          href={`/${u.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>/{u.username}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
