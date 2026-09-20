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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Admin Overview Dashboard</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              System Online
            </span>
          </div>
          <p className="text-indigo-200 text-xs mt-1.5 max-w-xl leading-relaxed">
            Real-time control center for user link-in-bio accounts, validity subscriptions, incoming access requests, and administrative audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/access-requests"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
          >
            <Inbox className="w-4 h-4 text-amber-300" />
            <span>Access Requests</span>
          </Link>
          <Link
            href="/admin/admin-panel"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow hover:bg-indigo-50 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision User</span>
          </Link>
        </div>
      </div>

      {/* Urgent Alerts (Expiring / Expired) */}
      {(expiring.length > 0 || expired.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {expired.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50 border border-red-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-800">
                    {expired.length} User Account{expired.length > 1 ? "s" : ""} Expired
                  </p>
                  <p className="text-[11px] text-red-600">Validity period has ended. Links may be inactive.</p>
                </div>
              </div>
              <Link
                href="/admin/my-links?filter=expired"
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all whitespace-nowrap shadow-sm"
              >
                View Expired →
              </Link>
            </div>
          )}

          {expiring.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    {expiring.length} Account{expiring.length > 1 ? "s" : ""} Expiring Soon
                  </p>
                  <p className="text-[11px] text-amber-700">Reaches subscription end date within 7 days.</p>
                </div>
              </div>
              <Link
                href="/admin/my-links?filter=expiring"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all whitespace-nowrap shadow-sm"
              >
                View Accounts →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Users</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{loading ? "…" : totalUsers}</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{activeUsers} active accounts</span>
              {suspendedUsers > 0 && <span className="text-slate-400 font-normal">({suspendedUsers} suspended)</span>}
            </p>
          </div>
        </div>

        {/* Total Bio Profiles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Public Profiles</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{loading ? "…" : totalProfiles}</span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Live profiles on the web</p>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today&apos;s Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">
              {loading ? "…" : `${currency}${(sales?.today?.total ?? 0).toFixed(0)}`}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {sales?.today?.count ?? 0} plan purchase{sales?.today?.count === 1 ? "" : "s"} today
            </p>
          </div>
        </div>

        {/* Month Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">
              {loading ? "…" : `${currency}${(sales?.month?.total ?? 0).toFixed(0)}`}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Current month ({sales?.month?.count ?? 0} orders)
            </p>
          </div>
        </div>
      </div>

      {/* Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Expiring Soon Watchlist (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Expiring in 7 Days</h2>
            </div>
            <Link
              href="/admin/my-links?filter=expiring"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-xs text-slate-400">Loading expiring users…</div>
            ) : expiring.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">All accounts currently healthy</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No accounts expiring in the next 7 days.</p>
              </div>
            ) : (
              expiring.map(u => (
                <div key={u.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {u.days_remaining}d remaining
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Admin Audit & Security Log (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Admin Activity</h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Live Audit Trail</span>
          </div>

          <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-xs text-slate-400">Loading audit history…</div>
            ) : auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No recent logs recorded.</div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
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
