"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  RotateCw,
} from "lucide-react";
import { AnalyticsDateRangeSelector } from "./AnalyticsDateRangeSelector";
import type { AnalyticsPeriod } from "@/types/analytics";
import type { Profile } from "@/types/profile";

export interface AnalyticsHeaderProps {
  profile: Profile | null;
  period: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
  isLoading: boolean;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  onCustomDateChange?: (start: string, end: string) => void;
  onRefresh: () => void;
}

export function AnalyticsHeader({
  profile,
  period,
  startDate,
  endDate,
  isLoading,
  onPeriodChange,
  onCustomDateChange,
  onRefresh,
}: AnalyticsHeaderProps) {
  const username = profile?.username || "demo";

  return (
    <div className="rounded-[36px] bg-gradient-to-br from-card via-card to-brand-50/30 border border-border/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-black tracking-wider uppercase text-brand-600">
            METRICS STUDIO
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Telemetry</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Analytics &amp; Insights 📈
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl">
          Track profile views, click-through rates, top performing links, and audience referrers.
        </p>
      </div>

      {/* Date Range & Controls */}
      <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
        <AnalyticsDateRangeSelector
          period={period}
          onPeriodChange={onPeriodChange}
          startDate={startDate}
          endDate={endDate}
          onCustomDateChange={onCustomDateChange}
          isLoading={isLoading}
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="w-10 h-10 p-0 rounded-2xl border-border/80 bg-card hover:bg-muted shadow-xs"
            title="Refresh analytics"
          >
            <RotateCw className={`w-4 h-4 text-muted-foreground ${isLoading ? "animate-spin text-brand-600" : ""}`} />
          </Button>

          <Link href={`/${username}`} target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-bold gap-1.5 bg-card hover:bg-muted shadow-xs h-10 px-4"
            >
              <span>Live page</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
