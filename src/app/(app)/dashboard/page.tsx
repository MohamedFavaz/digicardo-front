"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import { cardsApi } from "@/lib/api/cards";
import { analyticsApi } from "@/lib/api/analytics";
import type { Profile } from "@/types/profile";
import type { CardItem } from "@/types/cards";
import type { AnalyticsOverview } from "@/types/analytics";
import { CardTile } from "@/components/cards/CardTile";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import {
  CreditCard,
  PlusCircle,
  BarChart3,
  Globe,
  Share2,
  Check,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
  QrCode,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const [cards, setCards] = React.useState<CardItem[]>([]);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [analytics, setAnalytics] = React.useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [cardsRes, profileRes, analyticsRes] = await Promise.allSettled([
        cardsApi.listCards(),
        profileApi.getProfile(),
        analyticsApi.getOverview({ period: "7d" }),
      ]);

      if (cardsRes.status === "fulfilled") {
        setCards(cardsRes.value);
      }
      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value);
      }
      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/dashboard");
    } else if (isAuthenticated) {
      loadData();
    }
  }, [isAuthLoading, isAuthenticated, router, loadData]);

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
    if (!confirm(`Delete "${card.card_title || card.username}"?`)) return;
    try {
      await cardsApi.deleteCard(card.id);
      setCards((prev) => prev.filter((c) => c.id !== card.id));
    } catch {
      // ignore
    }
  };

  const primaryCard = cards.find((c) => c.is_primary) || cards[0] || null;
  const primaryUrl = primaryCard?.username
    ? typeof window !== "undefined"
      ? `${window.location.origin}/${primaryCard.username}`
      : `https://digicardo.app/${primaryCard.username}`
    : null;

  const handleSharePrimary = async () => {
    if (!primaryUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: primaryCard?.display_name || "Digital Business Card",
          url: primaryUrl,
        });
      } else {
        await navigator.clipboard.writeText(primaryUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  if (isAuthLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  const viewsCount = analytics?.total_views ?? analytics?.unique_views ?? 0;
  const publishedCardsCount = cards.filter((c) => c.status?.value === "published").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200 select-none pb-20">
      {/* ── Top Hero Greeting Banner ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Digicardo Digital Card Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Creator"}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              You have {cards.length} digital {cards.length === 1 ? "card" : "cards"} ({publishedCardsCount} published). Share your links, manage contacts, and grow your network.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/dashboard/cards/create"
              prefetch={false}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer group active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-brand-600 group-hover:rotate-90 transition-transform" />
              <span>Create New Card</span>
            </Link>

            {primaryUrl && (
              <button
                type="button"
                onClick={handleSharePrimary}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/15 backdrop-blur-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? "Copied Link!" : "Share Primary"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Key Statistics Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{viewsCount}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active across all cards</span>
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Digital Cards</span>
            <CreditCard className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{cards.length}</p>
          <p className="text-[11px] text-slate-500 font-semibold">
            {publishedCardsCount} Published &middot; {cards.length - publishedCardsCount} Drafts
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Primary Link</span>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-sm font-mono font-bold text-slate-900 truncate">
            {primaryCard ? `/${primaryCard.username}` : "Not published"}
          </p>
          <Link
            href="/dashboard/qr"
            className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1 mt-1"
          >
            <QrCode className="w-3 h-3" />
            <span>Get QR Code &rarr;</span>
          </Link>
        </div>
      </div>

      {/* ── Section: Existing Digital Cards ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-800" />
              <span>Your Digital Cards</span>
            </h2>
            <p className="text-xs text-slate-500">
              Manage your published cards, customize layouts, or build new cards.
            </p>
          </div>

          <Link
            href="/dashboard/cards"
            className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>View All ({cards.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.slice(0, 3).map((card) => (
              <CardTile
                key={card.id}
                card={card}
                onDuplicate={handleDuplicate}
                onSetPrimary={handleSetPrimary}
                onPublishToggle={handlePublishToggle}
                onDelete={handleDelete}
              />
            ))}

            {/* If fewer than 3 cards, show a quick Create Tile */}
            <Link
              href="/dashboard/cards/create"
              prefetch={false}
              className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-300 hover:border-slate-900 hover:bg-slate-50/60 transition-all text-center min-h-[280px] group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-600 flex items-center justify-center transition-all mb-3 shadow-2xs">
                <PlusCircle className="w-6 h-6 stroke-[2]" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-black">
                Create New Card
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Category &rarr; Template &rarr; Customize &rarr; Publish
              </p>
            </Link>
          </div>
        ) : (
          /* Empty Cards State */
          <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-2xs">
              <CreditCard className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No digital cards yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first digital business card in less than 2 minutes with our step-by-step wizard.
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

      {/* ── Quick Action Shortcuts ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link
          href="/dashboard/page"
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center gap-3 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">Card Content</h4>
            <p className="text-[10px] text-slate-400">Edit links & blocks</p>
          </div>
        </Link>

        <Link
          href="/dashboard/appearance"
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center gap-3 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">Appearance</h4>
            <p className="text-[10px] text-slate-400">Themes & colors</p>
          </div>
        </Link>

        <Link
          href="/dashboard/analytics"
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center gap-3 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">Analytics</h4>
            <p className="text-[10px] text-slate-400">Visitors & clicks</p>
          </div>
        </Link>

        <Link
          href="/dashboard/qr"
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center gap-3 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">QR Generator</h4>
            <p className="text-[10px] text-slate-400">Print & scan</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
