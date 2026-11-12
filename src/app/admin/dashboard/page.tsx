"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Link2,
  CreditCard,
  AlertTriangle,
  Calendar,
  Clock,
  TrendingUp,
  ShieldCheck,
  UserPlus,
  Inbox,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  History
} from "lucide-react";

interface ExpiringUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  expires_at: string;
  days_remaining: number;
}

interface AuditLog {
  id: string;
  action: string;
  created_at: string;
  actor?: { name: string; email?: string };
}

interface Overview {
  metrics?: {
    users: { total: number; active: number; suspended: number };
    profiles: { total: number };
    reports: { total_pending: number };
  };
}

interface Sales {
  today?: { total: number; count: number };
  month?: { total: number; count: number };
}

function formatTime(isoStr?: string) {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "—";
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${mins}`;
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [expiring, setExpiring] = useState<ExpiringUser[]>([]);
  const [expired, setExpired] = useState<ExpiringUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [sales, setSales] = useState<Sales | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bff/v1/admin/overview", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/users/expiring", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/users/expired", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/sales/overview", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/audit-logs?per_page=8", { credentials: "include" }).then(r => r.json()),
    ])
      .then(([ov, exp, expiredD, salesD, audit]) => {
        setOverview(ov?.data);
        setExpiring(exp?.data?.users || []);
        setExpired(expiredD?.data?.users || []);
        setSales(salesD?.data);
        setAuditLogs(audit?.data?.items || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = overview?.metrics;
  const totalUsers = metrics?.users?.total ?? 0;
  const activeUsers = metrics?.users?.active ?? 0;
  const suspendedUsers = metrics?.users?.suspended ?? 0;
  const totalProfiles = metrics?.profiles?.total ?? 0;
  const currency = "₹";

  return (
    <div suppressHydrationWarning className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed font-medium">
            Platform metrics, user accounts, and system status overview.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/access-requests"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 text-xs font-bold border border-slate-300 hover:bg-slate-50 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-slate-600" />
            <span>Access Requests</span>
          </Link>
          <Link
            href="/admin/admin-panel"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Provision User</span>
          </Link>
        </div>
      </div>

      {/* Urgent Alerts (Expiring / Expired) */}
      {(expiring.length > 0 || expired.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {expired.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/80 border border-red-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-800">
                    {expired.length} Account{expired.length > 1 ? "s" : ""} Expired
                  </p>
                  <p className="text-[11px] text-red-600">Validity ended. Profiles are inactive.</p>
                </div>
              </div>
              <Link
                href="/admin/my-links?filter=expired"
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all whitespace-nowrap shadow-2xs"
              >
                View Expired
              </Link>
            </div>
          )}

          {expiring.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    {expiring.length} Expiring Soon
                  </p>
                  <p className="text-[11px] text-amber-700">Expires within 7 days.</p>
                </div>
              </div>
              <Link
                href="/admin/my-links?filter=expiring"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold transition-all whitespace-nowrap shadow-2xs"
              >
                View Expiring
              </Link>
            </div>
          )}
        </div>
      )}

      {/* KPI Stat Cards (JunoMind Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Platform Users</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{loading ? "…" : totalUsers}</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{activeUsers} active</span>
              {suspendedUsers > 0 && <span className="text-slate-400 font-normal">({suspendedUsers} suspended)</span>}
            </p>
          </div>
        </div>

        {/* Total Bio Profiles */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Public Profiles</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{loading ? "…" : totalProfiles}</span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Live smart bio profiles</p>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Today&apos;s Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {loading ? "…" : `${currency}${(sales?.today?.total ?? 0).toFixed(0)}`}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {sales?.today?.count ?? 0} order{sales?.today?.count === 1 ? "" : "s"} today
            </p>
          </div>
        </div>

        {/* Month Sales */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Monthly Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {loading ? "…" : `${currency}${(sales?.month?.total ?? 0).toFixed(0)}`}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {sales?.month?.count ?? 0} orders this month
            </p>
          </div>
        </div>
      </div>

      {/* Main Panels Grid (Inside Square White Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Expiring Soon Watchlist (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Expiring in 7 Days</h2>
            </div>
            <Link
              href="/admin/my-links?filter=expiring"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-xs text-slate-400">Loading expiring users…</div>
            ) : expiring.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">All accounts healthy</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No accounts expiring in the next 7 days.</p>
              </div>
            ) : (
              expiring.map(u => (
                <div key={u.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {u.days_remaining}d remaining
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Admin Audit & Security Log (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Admin Activity</h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Audit Trail</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-xs text-slate-400">Loading audit history…</div>
            ) : auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No recent logs recorded.</div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 capitalize">
                      {log.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      By {log.actor?.name || "System Admin"}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap pl-3">
                    {formatTime(log.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
