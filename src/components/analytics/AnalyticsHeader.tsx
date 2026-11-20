"use client";

import * as React from "react";
import { RotateCw } from "lucide-react";
import { AnalyticsDateRangeSelector } from "./AnalyticsDateRangeSelector";
import type { AnalyticsPeriod } from "@/types/analytics";
import type { Profile } from "@/types/profile";

export interface AnalyticsHeaderProps {
  /** Kept for compatibility; the card link lives in the top bar. */
  profile: Profile | null;
  period: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
  isLoading: boolean;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  onCustomDateChange?: (start: string, end: string) => void;
  onRefresh: () => void;
}

/** Analytics toolbar: the page title is in the top bar, so this only holds the controls. */
export function AnalyticsHeader({ period, startDate, endDate, isLoading, onPeriodChange, onCustomDateChange, onRefresh }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <AnalyticsDateRangeSelector
        period={period}
        onPeriodChange={onPeriodChange}
        startDate={startDate}
        endDate={endDate}
        onCustomDateChange={onCustomDateChange}
        isLoading={isLoading}
      />
      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-[13px] font-semibold text-foreground hover:bg-muted disabled:opacity-50"
      >
        <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
        Refresh
      </button>
    </div>
  );
}
