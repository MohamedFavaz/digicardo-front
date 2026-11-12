"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import { blocksApi } from "@/lib/api/blocks";
import { analyticsApi } from "@/lib/api/analytics";
import {
  ApiClientError,
  ApiNotFoundError,
} from "@/lib/api/errors";
import type { Profile } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";
import type { AnalyticsOverview } from "@/types/analytics";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import {
  User as UserIcon,
  Share2,
  ChevronRight,
  Globe,
  Sparkles,
  Check,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  // Data states
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [blocks, setBlocks] = React.useState<ProfileBlock[]>([]);
  const [analyticsOverview, setAnalyticsOverview] = React.useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dashboardError, setDashboardError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Load initial data
  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setDashboardError(null);

    try {
      const [profileResult, blocksResult, analyticsResult] = await Promise.allSettled([
        profileApi.getProfile(),
        blocksApi.getBlocks(),
        analyticsApi.getOverview({ period: "7d" }),
      ]);

      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value);
      } else {
        const err = profileResult.reason;
        if (err instanceof ApiNotFoundError) {
          setProfile(null);
          setIsLoading(false);
          return;
        }
        if (err instanceof ApiClientError) {
          setDashboardError(err.message);
        }
      }

      if (blocksResult.status === "fulfilled") {
        setBlocks(blocksResult.value);
      } else {
        setBlocks([]);
      }

      if (analyticsResult.status === "fulfilled") {
        setAnalyticsOverview(analyticsResult.value);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/dashboard");
    } else if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthLoading, isAuthenticated, router, loadDashboardData]);

  const publicUrl = profile?.username
    ? typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `https://digicardo.app/${profile.username}`
    : null;

  const handleShare = async () => {
    if (!publicUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: profile?.display_name || "My Smart Profile",
          url: publicUrl,
        });
      } else {
        await navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // non-blocking
    }
  };

  if (isAuthLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  // Brand New User without a Profile
  if (!profile) {
    return (
      <OnboardingWizard
        onComplete={(newlyCreated) => {
          setProfile(newlyCreated);
          loadDashboardData();
        }}
      />
    );
  }

  const viewsCount = analyticsOverview?.total_views ?? analyticsOverview?.unique_views ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 animate-in fade-in-50 duration-300">
      {/* ── Section 1: "Your Linktree" / "Your Smart Profile" ── */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">
          Your Smart Profile
        </h2>

        {/* Linktree style phone squircle card */}
        <div className="w-60 rounded-3xl bg-[#ECEEEF] border border-slate-200/70 p-6 flex flex-col items-center shadow-2xs">
          {/* Circular Avatar */}
          <div className="w-24 h-24 rounded-full bg-slate-300 flex items-center justify-center font-bold text-2xl mb-4 overflow-hidden border-2 border-white shadow-2xs">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-12 h-12 text-slate-400" />
            )}
          </div>

          {/* Username & link count */}
          <p className="text-sm font-bold text-slate-900 truncate max-w-full text-center" suppressHydrationWarning>
            {profile.username || "username"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 mb-5 text-center">
            {blocks.length} {blocks.length === 1 ? "link" : "links"}
          </p>

          {/* Action buttons: Share + Edit */}
          <div className="flex items-center gap-2 w-full justify-center">
            <button
              type="button"
              onClick={handleShare}
              title={copied ? "Copied URL!" : "Share Profile"}
              className="w-9 h-9 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-2xs cursor-pointer active:scale-95 transition-all"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <Link
              href="/dashboard/page"
              className="px-5 py-2 rounded-full bg-white border border-slate-200/90 text-xs font-bold text-slate-900 hover:bg-slate-50 shadow-2xs active:scale-95 transition-all"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* ── Section 2: "In the last week" ── */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">
          In the last week
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1: Visitors Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between min-h-[260px]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Profile visitors</h3>
              <Link
                href="/dashboard/analytics"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <span>Last 7 days</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="py-6 flex flex-col items-center justify-center text-center">
              {viewsCount === 0 ? (
                <>
                  <p className="text-xs font-medium text-slate-400 mb-4">
                    No activity during this time
                  </p>
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
                    <Globe className="w-8 h-8 stroke-[1.5]" />
                  </div>
                </>
              ) : (
                <div>
                  <span className="text-4xl font-extrabold text-slate-900">{viewsCount}</span>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Unique profile views in the last 7 days
                  </p>
                </div>
              )}
            </div>

            <div>
              <Link
                href="/dashboard/analytics"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-black transition-colors"
              >
                <span className="w-4 h-4 rounded-full bg-[#7C3AED]/15 text-[#7C3AED] flex items-center justify-center text-[10px] font-extrabold">
                  ?
                </span>
                <span>How do I get more visitors?</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Follower Growth / Insights Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between min-h-[260px]">
            {/* Visual chart placeholder */}
            <div className="bg-[#FAF9F6] rounded-2xl border border-slate-200/60 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pb-2 border-b border-slate-200/60">
                <span>Follower growth</span>
                <span>Cumulative</span>
              </div>
              <div className="h-16 flex items-center justify-center">
                <svg className="w-full h-14" viewBox="0 0 240 50" fill="none">
                  <path
                    d="M0 40 Q 60 35, 120 22 T 240 8"
                    stroke="#7C3AED"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <path
                    d="M0 46 Q 60 42, 120 32 T 240 18"
                    stroke="#EC4899"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="240" cy="8" r="3" fill="#7C3AED" />
                  <circle cx="240" cy="18" r="3" fill="#EC4899" />
                </svg>
              </div>
            </div>

            {/* Title & subtitle */}
            <div className="mt-3 text-center">
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Track your follower growth
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Get insights into your audience growth across all channels.
              </p>
            </div>

            {/* Social pills */}
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span>Instagram</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-black" />
                <span>TikTok</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>YouTube</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Purple Sparkle FAB (Linktree Style) ── */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/page")}
        title="Add Link / Block"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-30 cursor-pointer"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  );
}
