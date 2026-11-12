"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  CreditCard,
  ExternalLink,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  UserCog,
  AlertCircle,
} from "lucide-react";
import type { AgentCard } from "@/types/agent";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; dot: string; bg: string; text: string; border: string }> = {
    active: {
      label: "ACTIVE",
      dot: "bg-emerald-500",
      bg: "bg-emerald-50/60",
      text: "text-emerald-700",
      border: "border-emerald-200/60",
    },
    inactive: {
      label: "INACTIVE",
      dot: "bg-slate-400",
      bg: "bg-slate-50/60",
      text: "text-slate-600",
      border: "border-slate-200/60",
    },
    suspended: {
      label: "SUSPENDED",
      dot: "bg-amber-500",
      bg: "bg-amber-50/60",
      text: "text-amber-700",
      border: "border-amber-200/60",
    },
  };
  return map[status] || map.inactive;
}

export default function AdminAgentCardsPage() {
  const [cards, setCards] = useState<AgentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "15" });
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`/api/bff/v1/admin/agent-cards?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setCards(json.data?.cards || json.data || []);
        const meta = json.data?.pagination || json.meta || {};
        setLastPage(meta.last_page || 1);
        setTotal(meta.total || 0);
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  async function handleActivate(cardId: string) {
    setActionLoading(cardId);
    try {
      await fetch(`/api/bff/v1/admin/agent-cards/${cardId}/activate`, {
        method: "POST",
        credentials: "include",
      });
      fetchCards();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeactivate(cardId: string) {
    setActionLoading(cardId);
    try {
      await fetch(`/api/bff/v1/admin/agent-cards/${cardId}/deactivate`, {
        method: "POST",
        credentials: "include",
      });
      fetchCards();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(cardId: string) {
    if (!confirm("Are you sure you want to delete this agent card? This action cannot be undone.")) return;
    setActionLoading(cardId);
    try {
      await fetch(`/api/bff/v1/admin/agent-cards/${cardId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchCards();
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Agent Cards</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
              {total} Cards
            </span>
          </div>
          <p className="text-slate-500 font-medium text-xs mt-1 leading-relaxed">
            All digital business cards created and managed across all reseller agents.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {["all", "active", "inactive", "suspended"].map(s => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer capitalize ${statusFilter === s
                ? "bg-slate-900 text-white shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium"
                }`}
            >
              {s === "all" ? "All Statuses" : s}
            </button>
          ))}
        </div>

        <div className="relative sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by card name, customer, agent…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-9 pl-9 pr-4 rounded-full border border-slate-200/90 bg-white text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CreditCard className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">No agent cards found</p>
            <p className="text-xs text-slate-400 mt-1">Cards created by agents will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Card</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Customer</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Agent</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Revenue</th>
                  <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Commission</th>
                  <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Profit</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Created</th>
                  <th className="text-center px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70">
                {cards.map((card) => {
                  const st = statusBadge(card.status);
                  return (
                    <tr key={card.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{card.card_name || "Untitled"}</p>
                          {card.profile?.username && (
                            <p className="text-[10px] text-slate-400 mt-0.5">/{card.profile.username}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{card.customer_name}</p>
                            <p className="text-[10px] text-slate-400">{card.customer_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserCog className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <p className="text-xs font-semibold text-slate-700">{card.agent?.name || "—"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${st.bg} ${st.text} ${st.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-slate-900">₹{card.revenue?.toLocaleString() || "0"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-semibold text-amber-600">₹{card.agent_commission?.toLocaleString() || "0"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-semibold text-emerald-600">₹{card.admin_profit?.toLocaleString() || "0"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] text-slate-500">{formatDate(card.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {card.profile?.username && (
                            <Link
                              href={`/${card.profile.username}`}
                              target="_blank"
                              className="p-1.5 rounded-full border border-slate-200/80 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all shadow-2xs"
                              title="View card"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          {card.status === "active" ? (
                            <button
                              onClick={() => handleDeactivate(card.id)}
                              disabled={actionLoading === card.id}
                              className="p-1.5 rounded-full border border-slate-200/80 text-slate-500 hover:text-amber-600 hover:bg-amber-50/50 transition-all shadow-2xs disabled:opacity-50"
                              title="Deactivate"
                            >
                              {actionLoading === card.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleRight className="w-3.5 h-3.5" />}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(card.id)}
                              disabled={actionLoading === card.id}
                              className="p-1.5 rounded-full border border-slate-200/80 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all shadow-2xs disabled:opacity-50"
                              title="Activate"
                            >
                              {actionLoading === card.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(card.id)}
                            disabled={actionLoading === card.id}
                            className="p-1.5 rounded-full border border-slate-200/80 text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 transition-all shadow-2xs disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Page {page} of {lastPage} · {total} cards
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

