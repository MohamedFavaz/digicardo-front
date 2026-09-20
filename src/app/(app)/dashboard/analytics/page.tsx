"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { profileApi } from "@/lib/api/profile";
import type { Profile } from "@/types/profile";
import type { AnalyticsPeriod } from "@/types/analytics";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AnalyticsSummaryCards } from "@/components/analytics/AnalyticsSummaryCards";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { PerformanceInsightCard } from "@/components/analytics/PerformanceInsightCard";
import { AnalyticsTopBlocks } from "@/components/analytics/AnalyticsTopBlocks";
import { AnalyticsReferrers } from "@/components/analytics/AnalyticsReferrers";
import { AnalyticsEmptyState } from "@/components/analytics/AnalyticsEmptyState";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = React.useState<Profile | null>(null);

  const [period, setPeriod] = React.useState<AnalyticsPeriod>("7d");
  const [startDate, setStartDate] = React.useState<string | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<string | undefined>(undefined);

  const {
    overview,
    timeseries,
    blocks,
    referrers,
    isLoading: isAnalyticsLoading,
    isError,
    errorMessage,
    refresh,
  } = useAnalytics(period, startDate, endDate);

  // Load profile for username links
  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/dashboard/analytics");
      return;
    }

    if (isAuthenticated) {
      profileApi
        .getProfile()
        .then((p) => setProfile(p))
        .catch(() => {});
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handlePeriodChange = (newPeriod: AnalyticsPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== "custom") {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (isAuthLoading || (isAnalyticsLoading && !overview)) {
    return <AnalyticsSkeleton />;
  }

  const hasAnyData = overview && (overview.total_views > 0 || overview.total_clicks > 0);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* ── Studio Header ── */}
      <AnalyticsHeader
        profile={profile}
        period={period}
        startDate={startDate}
        endDate={endDate}
        isLoading={isAnalyticsLoading}
        onPeriodChange={handlePeriodChange}
        onCustomDateChange={handleCustomDateChange}
        onRefresh={refresh}
      />

      {/* ── Error Banner State ── */}
      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>
              {errorMessage || "Couldn't load latest analytics data."}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="h-8 rounded-xl border-rose-300 bg-white text-rose-800 hover:bg-rose-100 text-xs font-bold"
          >
            <RotateCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* ── Section 1: 5 Key Metrics Cards ── */}
      <AnalyticsSummaryCards overview={overview} />

      {/* ── Real Performance Highlights Insight ── */}
      {hasAnyData && (
        <PerformanceInsightCard
          blocks={blocks}
          timeseries={timeseries}
        />
      )}

      {/* ── Section 2: Performance Trend Over Time Chart ── */}
      <AnalyticsChart timeseries={timeseries} />

      {/* ── Section 3: 2-Column Grid (Top Links & Traffic Sources) ── */}
      {hasAnyData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <AnalyticsTopBlocks blocks={blocks} />
          <AnalyticsReferrers referrers={referrers} />
        </div>
      ) : (
        <AnalyticsEmptyState username={profile?.username} />
      )}

    </div>
  );
}
