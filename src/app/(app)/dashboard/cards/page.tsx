"use client";

import * as React from "react";
import Link from "next/link";
import { cardsApi } from "@/lib/api/cards";
import type { CardItem, CardCategoryType } from "@/types/cards";
import { CARD_CATEGORIES } from "@/types/cards";
import { CardTile } from "@/components/cards/CardTile";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function MyCardsPage() {
  const [cards, setCards] = React.useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const loadCards = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const items = await cardsApi.listCards();
      setCards(items);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to load cards.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCards();
  }, [loadCards]);

  // Card Operations
  const handleDuplicate = async (card: CardItem) => {
    try {
      const dup = await cardsApi.duplicateCard(card.id);
      setCards((prev) => [dup, ...prev]);
    } catch {
      // ignore
    }
  };

  const handleSetPrimary = async (card: CardItem) => {
    try {
      await cardsApi.setPrimaryCard(card.id);
      setCards((prev) =>
        prev.map((c) => ({
          ...c,
          is_primary: c.id === card.id,
        }))
      );
    } catch {
      // ignore
    }
  };

  const handlePublishToggle = async (card: CardItem) => {
    try {
      const isPublished = card.status?.value === "published";
      const updated = isPublished
        ? await cardsApi.unpublishCard(card.id)
        : await cardsApi.publishCard(card.id);

      setCards((prev) => prev.map((c) => (c.id === card.id ? updated : c)));
    } catch {
      // ignore
    }
  };

  const handleDelete = async (card: CardItem) => {
    if (!confirm(`Are you sure you want to delete "${card.card_title || card.username}"?`)) {
      return;
    }
    try {
      await cardsApi.deleteCard(card.id);
      setCards((prev) => prev.filter((c) => c.id !== card.id));
    } catch {
      // ignore
    }
  };

  // Filtered Cards
  const filteredCards = React.useMemo(() => {
    return cards.filter((card) => {
      if (categoryFilter !== "all" && card.category?.value !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "all" && card.status?.value !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = card.card_title?.toLowerCase().includes(q);
        const matchesName = card.display_name?.toLowerCase().includes(q);
        const matchesUsername = card.username?.toLowerCase().includes(q);
        return matchesTitle || matchesName || matchesUsername;
      }
      return true;
    });
  }, [cards, categoryFilter, statusFilter, searchQuery]);

  return (
    <div className="py-4 sm:py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 select-none pb-20">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-slate-800" />
            <span>My Digital Cards</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Create, manage, and share all your professional identity cards.
          </p>
        </div>

        <Link
          href="/dashboard/cards/create"
          prefetch={false}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer group"
        >
          <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          <span>Create New Card</span>
        </Link>
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards by name or username..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CARD_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <button
            type="button"
            onClick={loadCards}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Refresh cards"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* ── Error Notification ── */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* ── Cards Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-slate-100 animate-pulse border border-slate-200/60"
            />
          ))}
        </div>
      ) : filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              onDuplicate={handleDuplicate}
              onSetPrimary={handleSetPrimary}
              onPublishToggle={handlePublishToggle}
              onDelete={handleDelete}
            />
          ))}

          {/* Prominent "Create Another Card" Tile at end of grid */}
          <Link
            href="/dashboard/cards/create"
            prefetch={false}
            className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-300 hover:border-slate-800 hover:bg-slate-50/50 transition-all text-center min-h-[320px] group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-600 flex items-center justify-center transition-all mb-3 shadow-2xs">
              <PlusCircle className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-black">
              Create New Card
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Add another card for a new business, portfolio, or profile.
            </p>
          </Link>
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-2xs">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No cards found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters or search terms."
                : "You have not created any digital cards yet. Start building your first card now!"}
            </p>
          </div>
          <Link
            href="/dashboard/cards/create"
            prefetch={false}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Your First Card</span>
          </Link>
        </div>
      )}
    </div>
  );
}
