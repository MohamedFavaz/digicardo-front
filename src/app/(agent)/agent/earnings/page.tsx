"use client";
import { useEffect, useState, useCallback } from "react";
import { Wallet, TrendingUp, CreditCard, CheckCircle2, Clock, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { AgentTransaction } from "@/types/agent";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

interface EarningsData {
  total_revenue: number;
  total_commission: number;
  paid_commission: number;
  pending_commission: number;
  total_cards_sold: number;
}

export default function AgentEarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [transactions, setTransactions] = useState<AgentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [txPage, setTxPage] = useState(1);
  const [txLastPage, setTxLastPage] = useState(1);

  const fetchEarnings = useCallback(async () => {
    try {
      const res = await fetch("/api/bff/v1/agent/earnings", { credentials: "include" });
      const json = await res.json();
      if (json.success) setEarnings(json.data);
    } catch { /* */ } finally { setLoading(false); }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`/api/bff/v1/agent/earnings/transactions?page=${txPage}&per_page=10`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data?.transactions || json.data || []);
        const meta = json.data?.pagination || json.meta || {};
        setTxLastPage(meta.last_page || 1);
      }
    } catch { /* */ }
  }, [txPage]);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  if (loading) return <div className="p-6 flex items-center justify-center py-32"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">My Earnings</h1>
        <p className="text-xs text-slate-500 mt-1">Commission and revenue summary</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Revenue", value: `₹${(earnings?.total_revenue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-indigo-600 bg-indigo-50" },
          { label: "My Commission", value: `₹${(earnings?.total_commission || 0).toLocaleString()}`, icon: Wallet, color: "text-emerald-600 bg-emerald-50" },
          { label: "Paid", value: `₹${(earnings?.paid_commission || 0).toLocaleString()}`, icon: CheckCircle2, color: "text-blue-600 bg-blue-50" },
          { label: "Pending", value: `₹${(earnings?.pending_commission || 0).toLocaleString()}`, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Cards Sold", value: String(earnings?.total_cards_sold || 0), icon: CreditCard, color: "text-violet-600 bg-violet-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-4 h-4" /></div>
            <p className="text-lg font-black text-slate-900">{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Transaction History</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="text-center py-12"><p className="text-xs text-slate-400">No transactions yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${tx.type === "card_sale" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : tx.type === "commission_payment" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>{tx.type.replace(/_/g, " ")}</span></td>
                    <td className="px-5 py-3 text-right"><span className="text-xs font-bold text-slate-900">₹{tx.amount?.toLocaleString()}</span></td>
                    <td className="px-5 py-3"><span className="text-[11px] text-slate-500">{tx.description}</span></td>
                    <td className="px-5 py-3"><span className="text-[11px] text-slate-500">{formatDate(tx.created_at)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {txLastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Page {txPage} of {txLastPage}</span>
            <div className="flex gap-1.5">
              <button onClick={() => setTxPage((p) => Math.max(1, p - 1))} disabled={txPage <= 1} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button onClick={() => setTxPage((p) => Math.min(txLastPage, p + 1))} disabled={txPage >= txLastPage} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

