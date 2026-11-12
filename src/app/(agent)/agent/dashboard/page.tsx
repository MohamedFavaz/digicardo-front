"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  CreditCard,
  Gauge,
  Wallet,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  Loader2,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Info,
} from "lucide-react";
import type { AgentCard } from "@/types/agent";

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
      const res = await fetch(`/api/bff/v1/agent/cards/${cardId}/impersonate`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("digicardo_impersonating", "true");
          localStorage.setItem("digicardo_impersonator_role", "agent");
          document.cookie = "digicardo_impersonating=true; path=/; max-age=86400;";
        }
        window.location.href = json.data?.redirect_url || "/dashboard";
      } else {
        alert(json.error?.message || json.message || "Failed to impersonate customer.");
      }
    } catch {
      alert("Network error while trying to customize card.");
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

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Total Cards", value: String(data?.total_cards || 0), icon: CreditCard, color: "text-indigo-600 bg-indigo-50" },
    { label: "Card Limit", value: String(data?.card_limit || 0), icon: Gauge, color: "text-emerald-600 bg-emerald-50" },
    { label: "Remaining", value: String(data?.remaining_credits || 0), icon: BarChart3, color: "text-blue-600 bg-blue-50" },
    { label: "Total Revenue", value: `₹${(data?.total_revenue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-violet-600 bg-violet-50" },
    { label: "My Commission", value: `₹${(data?.total_commission || 0).toLocaleString()}`, icon: Wallet, color: "text-amber-600 bg-amber-50" },
  ];

  const usedPct = data?.card_limit ? Math.round(((data?.cards_used || 0) / data.card_limit) * 100) : 0;

  // Monthly data for simple bar chart display
  const monthlyEntries = Object.entries(data?.monthly_cards || {}).slice(-6);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Agent Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Overview of your digital card business and performance</p>
        </div>
        <Link
          href="/agent/cards/create"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0F766E] hover:bg-[#0D6B63] text-white text-xs font-semibold rounded-lg transition-all shadow-2xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Create Card
        </Link>
      </div>

      {/* JunoMind Style Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E3DFD9] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#EDF5F2] flex items-center justify-center text-[#0F766E]">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-700">Active Cards</span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{data?.active_cards || 0}</span>
            <span className="text-xs text-slate-400 font-normal">/ {data?.total_cards || 0} total</span>
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
              {data?.total_cards ? Math.round(((data?.active_cards || 0) / data.total_cards) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E3DFD9] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#EDF5F2] flex items-center justify-center text-[#0F766E]">
                <Gauge className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-700">Credits Remaining</span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{data?.remaining_credits || 0}</span>
            <span className="text-xs text-slate-400 font-normal">/ {data?.card_limit || 0} limit</span>
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EDF5F2] text-[#0F766E]">
              {data?.card_limit ? Math.round(((data?.remaining_credits || 0) / data.card_limit) * 100) : 0}% left
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E3DFD9] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-700">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-700">Total Earnings</span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">₹{(data?.total_commission || 0).toLocaleString()}</span>
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
              Commission
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E3DFD9] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-700">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-700">Gross Sales</span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">₹{(data?.total_revenue || 0).toLocaleString()}</span>
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
              Revenue
            </span>
          </div>
        </div>
      </div>

      {/* Quota Bar */}
      <div className="bg-white rounded-xl border border-[#E3DFD9] p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Card Quota Usage</h2>
          <span className="text-xs font-semibold text-slate-600">{data?.cards_used || 0} / {data?.card_limit || 0} used</span>
        </div>
        <div className="w-full h-2 bg-[#EAE6E1] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${usedPct >= 90 ? "bg-red-500" : usedPct >= 70 ? "bg-amber-500" : "bg-[#0F766E]"}`}
            style={{ width: `${Math.min(usedPct, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px]">
          <span className="text-slate-400">{usedPct}% used</span>
          <span className="text-[#0F766E] font-medium">{data?.remaining_credits || 0} credits remaining</span>
        </div>
      </div>

      {/* Monthly Cards Chart */}
      {monthlyEntries.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E3DFD9] p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Monthly Card Creation</h2>
          <div className="flex items-end gap-2 h-28 pt-2">
            {monthlyEntries.map(([month, count]) => {
              const maxCount = Math.max(...monthlyEntries.map(([, c]) => c), 1);
              const height = Math.max((count / maxCount) * 100, 6);
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-slate-600">{count}</span>
                  <div className="w-full rounded-t bg-[#0F766E]/80 hover:bg-[#0F766E] transition-colors" style={{ height: `${height}%` }} />
                  <span className="text-[10px] text-slate-400">{month.split("-")[1] || month}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Cards */}
      <div className="bg-white rounded-xl border border-[#E3DFD9] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E3DFD9] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Cards</h2>
            <p className="text-[11px] text-slate-400">Latest cards created for customers</p>
          </div>
          <Link href="/agent/cards" className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:text-[#0D6B63]">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!data?.recent_cards?.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-500">No cards created yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Start by creating your first digital card</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E3DFD9]/60">
            {data.recent_cards.slice(0, 5).map((card) => (
              <div key={card.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#F5F2EE]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EDF5F2] border border-[#D5EBE4] flex items-center justify-center text-[#0F766E] text-xs font-bold flex-shrink-0">
                    {card.customer_name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <Link href={`/agent/cards/${card.id}`} className="hover:text-[#0F766E] transition-colors">
                      <p className="text-xs font-semibold text-slate-900">{card.card_name || card.customer_name}</p>
                    </Link>
                    <p className="text-[10px] text-slate-400">{card.customer_email} · {formatDate(card.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${card.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${card.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {card.status === "active" ? "Running" : "Paused"}
                  </span>
                  <button
                    onClick={() => handleImpersonate(card.id)}
                    disabled={impersonatingId === card.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-[#0F766E] bg-[#D5EBE4]/70 hover:bg-[#D5EBE4] border border-[#BCE0D4] transition-all cursor-pointer disabled:opacity-50"
                    title="Customize card as customer in Studio"
                  >
                    {impersonatingId === card.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0F766E]" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                    )}
                    <span>Customize</span>
                  </button>
                  {card.profile?.username && (
                    <Link href={`/${card.profile.username}`} target="_blank" className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all" title="View live card">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

