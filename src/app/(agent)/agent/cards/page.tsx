"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, CreditCard, PlusCircle, ExternalLink, Eye, Trash2,
  ChevronLeft, ChevronRight, Loader2, ToggleLeft, ToggleRight, Sparkles,
  Filter, Download, CheckSquare, Square, Info
} from "lucide-react";
import type { AgentCard } from "@/types/agent";
import { agentImpersonate } from "@/lib/agent/impersonate";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default function AgentCardsPage() {
  const [cards, setCards] = useState<AgentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "15" });
      if (search) params.append("search", search);
      const res = await fetch(`/api/bff/v1/agent/cards?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setCards(json.data?.cards || json.data || []);
        const meta = json.data?.pagination || json.meta || {};
        setLastPage(meta.last_page || 1);
        setTotal(meta.total || 0);
      }
    } catch { /* */ } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  async function handlePublish(id: string) {
    setActionLoading(id);
    try { await fetch(`/api/bff/v1/agent/cards/${id}/publish`, { method: "POST", credentials: "include" }); fetchCards(); }
    finally { setActionLoading(null); }
  }
  async function handleUnpublish(id: string) {
    setActionLoading(id);
    try { await fetch(`/api/bff/v1/agent/cards/${id}/unpublish`, { method: "POST", credentials: "include" }); fetchCards(); }
    finally { setActionLoading(null); }
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    setActionLoading(id);
    try { await fetch(`/api/bff/v1/agent/cards/${id}`, { method: "DELETE", credentials: "include" }); fetchCards(); }
    finally { setActionLoading(null); }
  }

  async function handleImpersonate(id: string) {
    setImpersonatingId(id);
    try {
      await agentImpersonate(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't open the card. Please try again.");
    } finally {
      setImpersonatingId(null);
    }
  }

  const activeCount = cards.filter((c) => c.status === "active").length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Cards</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Manage and customize your customer cards</p>
        </div>
      </div>

      {/* JunoMind Style Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#F5F3FE] flex items-center justify-center text-primary">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-[#52525B]">Active Cards</span>
            </div>
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-foreground">{activeCount}</span>
            <span className="text-xs text-muted-foreground font-normal">/ {total} total</span>
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
              {total ? Math.round((activeCount / total) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-700">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-[#52525B]">Published Status</span>
            </div>
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-foreground">{cards.length}</span>
            <span className="text-xs text-muted-foreground font-normal">loaded</span>
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-[#F5F3FE] text-primary">
              Ready
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-700">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-[#52525B]">Customizable</span>
            </div>
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground font-normal">available</span>
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700">
              Studio
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-700">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-[#52525B]">Total Cards</span>
            </div>
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-foreground">{total}</span>
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
              100%
            </span>
          </div>
        </div>
      </div>

      {/* JunoMind Style Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cards by name, customer, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#5B3FE4] focus:border-[#5B3FE4]"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-[#52525B] hover:bg-background transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Filter</span>
          </button>
          <Link
            href="/agent/cards/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-lg transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New +</span>
          </Link>
        </div>
      </div>

      {/* JunoMind Style Table Container */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CreditCard className="w-10 h-10 text-zinc-300 mb-3" />
            <p className="text-sm font-semibold text-[#52525B]">No cards yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Create your first digital business card for your customer to get started.</p>
            <Link
              href="/agent/cards/create"
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Create Your First Card
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-5 py-3 text-xs font-semibold capitalize text-muted-foreground">Card Name</th>
                  <th className="px-5 py-3 text-xs font-semibold capitalize text-muted-foreground">Customer</th>
                  <th className="px-5 py-3 text-xs font-semibold capitalize text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold capitalize text-muted-foreground text-right">Revenue</th>
                  <th className="px-5 py-3 text-xs font-semibold capitalize text-muted-foreground">Created</th>
                  <th className="px-5 py-3 text-xs font-semibold capitalize text-muted-foreground text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-background/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-foreground">{card.card_name || "Untitled Card"}</p>
                      {card.profile?.username && (
                        <p className="text-xs text-primary hover:underline cursor-pointer">
                          /{card.profile.username}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-[#52525B]">{card.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{card.customer_email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${card.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-[#52525B]"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${card.status === "active" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                        {card.status === "active" ? "Running" : "Paused"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-xs font-semibold text-foreground">₹{parseFloat(String(card.revenue || 0)).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-muted-foreground">{formatDate(card.created_at)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleImpersonate(card.id)}
                          disabled={impersonatingId === card.id || actionLoading === card.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-primary bg-[#EFECFD]/80 hover:bg-[#EFECFD] border border-[#DDD6FB] transition-all cursor-pointer disabled:opacity-50"
                          title="Customize card as customer in Studio"
                        >
                          {impersonatingId === card.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                          )}
                          <span>Customize</span>
                        </button>
                        {card.profile?.username && (
                          <a
                            href={card.public_url || `/${card.profile.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-muted-foreground hover:text-[#52525B] hover:bg-zinc-100 transition-all"
                            title="View public card"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <Link
                          href={`/agent/cards/${card.id}`}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-[#52525B] hover:bg-zinc-100 transition-all"
                          title="Card details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {card.status === "active" ? (
                          <button
                            onClick={() => handleUnpublish(card.id)}
                            disabled={actionLoading === card.id}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-all"
                            title="Pause / Unpublish"
                          >
                            {actionLoading === card.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleRight className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(card.id)}
                            disabled={actionLoading === card.id}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-[#EFECFD] transition-all"
                            title="Activate / Publish"
                          >
                            {actionLoading === card.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(card.id)}
                          disabled={actionLoading === card.id}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* JunoMind Style Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-border bg-background/30 gap-2">
          <span className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-[#52525B]">{cards.length}</span> of {total} items
          </span>
          {lastPage > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-2.5 py-1 rounded-md border border-border bg-card text-xs text-[#52525B] hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-[#52525B] font-medium px-2">
                {page} / {lastPage}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage}
                className="px-2.5 py-1 rounded-md border border-border bg-card text-xs text-[#52525B] hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

