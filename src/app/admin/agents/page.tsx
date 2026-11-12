"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  UserPlus,
  Search,
  UserCog,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Phone,
  Mail,
} from "lucide-react";
import type { AgentUser } from "@/types/agent";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    suspended: "bg-amber-50 text-amber-700 border-amber-200",
    banned: "bg-red-50 text-red-700 border-red-200",
  };
  return map[status] || "bg-slate-50 text-slate-600 border-slate-200";
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "15" });
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`/api/bff/v1/admin/agents?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setAgents(json.data?.agents || json.data || []);
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

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  async function handleActivate(id: string) {
    setActionLoading(id);
    try {
      await fetch(`/api/bff/v1/admin/agents/${id}/activate`, { method: "POST", credentials: "include" });
      fetchAgents();
    } finally { setActionLoading(null); }
  }

  async function handleDeactivate(id: string) {
    setActionLoading(id);
    try {
      await fetch(`/api/bff/v1/admin/agents/${id}/deactivate`, { method: "POST", credentials: "include" });
      fetchAgents();
    } finally { setActionLoading(null); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this agent? All their data will be permanently removed.")) return;
    setActionLoading(id);
    try {
      await fetch(`/api/bff/v1/admin/agents/${id}`, { method: "DELETE", credentials: "include" });
      fetchAgents();
    } finally { setActionLoading(null); }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Agents</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
              {total} Agents
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed font-medium">
            Manage reseller agents, permissions, and their card creation limits.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/agents/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Agent</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {["all", "active", "suspended", "banned"].map(s => (
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
            placeholder="Search by name or email…"
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
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UserCog className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">No agents found</p>
            <p className="text-xs text-slate-400 mt-1">Create your first agent to get started</p>
            <Link href="/admin/agents/create" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-black transition-all shadow-xs">
              <UserPlus className="w-3.5 h-3.5" /> Create Agent
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Agent</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Contact</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="text-center px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Cards Used / Limit</th>
                  <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Card Price</th>
                  <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Commission</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Created</th>
                  <th className="text-center px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70">
                {agents.map((agent) => {
                  const quota = agent.agent_quota;
                  const config = agent.commission_config;
                  const usedPct = quota ? Math.round((quota.cards_used / Math.max(quota.card_limit, 1)) * 100) : 0;

                  return (
                    <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-slate-200/60 shadow-2xs">
                            {agent.name?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{agent.name}</p>
                            <p className="text-[11px] text-slate-400">{agent.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Mail className="w-3 h-3 text-slate-400" /> {agent.email}
                          </div>
                          {agent.mobile && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Phone className="w-3 h-3 text-slate-400" /> {agent.mobile}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${statusBadge(agent.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-slate-900">
                            {quota?.cards_used ?? 0} / {quota?.card_limit ?? 0}
                          </span>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${usedPct >= 90 ? "bg-red-500" : usedPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                              style={{ width: `${Math.min(usedPct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-slate-900">₹{config?.card_price?.toLocaleString() ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-slate-900">₹{config?.agent_commission?.toLocaleString() ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500">{formatDate(agent.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link href={`/admin/agents/${agent.id}`}
                            className="px-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs inline-flex items-center gap-1 transition-all" title="View details">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>
                          {agent.status === "active" ? (
                            <button onClick={() => handleDeactivate(agent.id)} disabled={actionLoading === agent.id}
                              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center" title="Deactivate">
                              {actionLoading === agent.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleRight className="w-3.5 h-3.5" />}
                            </button>
                          ) : (
                            <button onClick={() => handleActivate(agent.id)} disabled={actionLoading === agent.id}
                              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-emerald-600 transition-all flex items-center justify-center" title="Activate">
                              {actionLoading === agent.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          <button onClick={() => handleDelete(agent.id)} disabled={actionLoading === agent.id}
                            className="w-8 h-8 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center" title="Delete">
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

        {lastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Page {page} of {lastPage} · {total} agents</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page >= lastPage}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
