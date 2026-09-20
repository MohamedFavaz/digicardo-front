"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  Settings,
  Receipt,
  User as UserIcon,
  Clock
} from "lucide-react";

interface KpiItem {
  label: string;
  value: string | number;
  icon: typeof CreditCard;
  sub?: string;
  color: string;
}

interface SaleItem {
  id: string;
  user?: { name: string; email: string };
  plan_label: string;
  amount: number;
  currency_symbol: string;
  sale_date: string;
}

interface ChartPoint {
  label: string;
  value: number;
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

function BarChart({ points, maxVal, currency }: { points: ChartPoint[]; maxVal: number; currency: string }) {
  return (
    <div className="flex items-end gap-2 h-36 px-2 pt-6">
      {points.map((p, i) => {
        const heightPct = maxVal > 0 ? (p.value / maxVal) * 100 : 5;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {p.value > 0 ? `${currency}${Math.round(p.value)}` : ""}
            </span>
            <div className="w-full bg-slate-100 rounded-t-lg h-24 flex items-end overflow-hidden">
              <div
                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:from-emerald-700 group-hover:to-emerald-500"
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

export default function AdminAccountsPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<{
    today?: { total: number; count: number };
    month?: { total: number; count: number };
    all_time?: { total: number; count: number };
  } | null>(null);
  const [monthly, setMonthly] = useState<ChartPoint[]>([]);
  const [recent, setRecent] = useState<SaleItem[]>([]);
  const [currency, setCurrency] = useState("₹");
  const [salesPage, setSalesPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    Promise.all([
      fetch("/api/bff/v1/admin/sales/overview", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/sales/table?per_page=50", { credentials: "include" }).then(r => r.json()),
      fetch("/api/bff/v1/admin/sales/chart/monthly?months=6", { credentials: "include" }).then(r => r.json()),
    ])
      .then(([ov, sales, mo]) => {
        setOverview(ov?.data);
        const allSales: SaleItem[] = sales?.data?.items || [];
        setRecent(allSales);
        if (allSales.length > 0) setCurrency(allSales[0].currency_symbol || "₹");
        const rawMonthly: { label: string; total: number }[] = mo?.data?.chart || [];
        setMonthly(rawMonthly.slice(-6).map(m => ({ label: m.label?.slice(0, 3) || "", value: Number(m.total) })));
      })
      .finally(() => setLoading(false));
  }, []);

  const kpis: KpiItem[] = [
    {
      label: "Today's Revenue",
      value: loading ? "…" : `${currency}${(overview?.today?.total ?? 0).toFixed(0)}`,
      icon: CreditCard,
      sub: `${overview?.today?.count ?? 0} plan purchase(s)`,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "This Month",
      value: loading ? "…" : `${currency}${(overview?.month?.total ?? 0).toFixed(0)}`,
      icon: Calendar,
      sub: `${overview?.month?.count ?? 0} subscription sales`,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "All-Time Revenue",
      value: loading ? "…" : `${currency}${(overview?.all_time?.total ?? 0).toFixed(0)}`,
      icon: TrendingUp,
      sub: `${overview?.all_time?.count ?? 0} total sales completed`,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const maxMonthly = monthly.reduce((m, p) => Math.max(m, p.value), 0);
  const totalPages = Math.max(1, Math.ceil(recent.length / PER_PAGE));
  const pageSlice = recent.slice((salesPage - 1) * PER_PAGE, salesPage * PER_PAGE);

  return (
    <div suppressHydrationWarning className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Revenue Ledger & Accounts</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              Financial Tracking
            </span>
          </div>
          <p className="text-indigo-200 text-xs mt-1.5 max-w-xl leading-relaxed">
            Review validity subscription transactions, monthly revenue trajectory, and historical payment records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow hover:bg-indigo-50 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Configure Plan Pricing</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-slate-900">{kpi.value}</span>
                {kpi.sub && <p className="text-[11px] text-slate-500 font-medium mt-1">{kpi.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Revenue Trend (Last 6 Months)</h2>
            </div>
            <span className="text-xs text-slate-400">Currency: {currency}</span>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="h-36 bg-slate-100 rounded-xl animate-pulse" />
            ) : monthly.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-xs text-slate-400">
                No monthly sales records recorded yet.
              </div>
            ) : (
              <BarChart points={monthly} maxVal={maxMonthly} currency={currency} />
            )}
          </div>
        </div>

        {/* Quick Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Account Metrics</h2>
          </div>

          <div className="p-5 space-y-3 flex-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Transactions</span>
              <span className="font-bold text-slate-900">{recent.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Average Plan Value</span>
              <span className="font-bold text-slate-900">
                {recent.length > 0
                  ? `${currency}${(
                      recent.reduce((sum, s) => sum + (s.amount || 0), 0) / recent.length
                    ).toFixed(0)}`
                  : "—"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-medium">Billing Model</span>
              <span className="font-bold text-emerald-900">Fixed Validity Plans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Sales Transactions</h2>
          </div>
          <span className="text-xs text-slate-400">{recent.length} Total Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Plan Purchased</th>
                <th className="px-5 py-3">Amount Paid</th>
                <th className="px-5 py-3">Transaction Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i}>
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : pageSlice.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    No sales recorded yet. When accounts are provisioned with paid plans, transactions will appear here.
                  </td>
                </tr>
              ) : (
                pageSlice.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{sale.user?.name || "System User"}</p>
                      <p className="text-[11px] text-slate-400">{sale.user?.email || "—"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {sale.plan_label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {sale.currency_symbol || "₹"}{Number(sale.amount).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {sale.sale_date ? formatDate(sale.sale_date) : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        PAID / COMPLETED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Page {salesPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSalesPage(p => Math.max(1, p - 1))}
                disabled={salesPage === 1 || loading}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => setSalesPage(p => Math.min(totalPages, p + 1))}
                disabled={salesPage === totalPages || loading}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
