"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight, TrendingUp } from "lucide-react";
import type { AnalyticsTimeseriesPoint } from "@/types/analytics";

export interface PerformanceOverviewProps {
  timeseries: AnalyticsTimeseriesPoint[];
}

export function PerformanceOverview({ timeseries }: PerformanceOverviewProps) {
  const hasData =
    timeseries.length > 0 && timeseries.some((p) => p.views > 0 || p.clicks > 0);

  const totalViews = timeseries.reduce((acc, p) => acc + p.views, 0);
  const totalClicks = timeseries.reduce((acc, p) => acc + p.clicks, 0);

  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-border/80 bg-card p-4 sm:p-7 shadow-card space-y-6 select-none relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">
              Performance Trend
            </h3>
            <p className="text-xs text-muted-foreground font-medium">Activity over the last 7 days</p>
          </div>
        </div>

        <Link href="/dashboard/analytics">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground gap-1.5 hover:bg-muted/70"
          >
            <span>Detailed Analytics</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {hasData ? (
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600 shadow-2xs" />
              <span className="text-muted-foreground">Views: <strong className="text-foreground">{totalViews}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-2xs" />
              <span className="text-muted-foreground">Clicks: <strong className="text-foreground">{totalClicks}</strong></span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="h-40 w-full flex items-end justify-between gap-2 pt-2">
            {timeseries.map((point) => {
              const maxVal = Math.max(
                ...timeseries.map((p) => Math.max(p.views, p.clicks, 1))
              );
              const viewsH = Math.max((point.views / maxVal) * 100, 6);
              const clicksH = Math.max((point.clicks / maxVal) * 100, 6);

              return (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                >
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    <div
                      className="flex-1 max-w-[12px] rounded-t-md bg-brand-500/80 group-hover:bg-brand-600 transition-all duration-200 shadow-2xs"
                      style={{ height: `${viewsH}%` }}
                      title={`${point.views} Views`}
                    />
                    <div
                      className="flex-1 max-w-[12px] rounded-t-md bg-blue-400/80 group-hover:bg-blue-400 transition-all duration-200 shadow-2xs"
                      style={{ height: `${clicksH}%` }}
                      title={`${point.clicks} Clicks`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono font-semibold">
                    {point.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="py-12 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center shadow-2xs">
            <BarChart3 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-black text-foreground">No Traffic Logged Yet</p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xs font-medium">
              Share your page link or scan your QR code to start tracking live visitors.
            </p>
          </div>
          <Link href="/dashboard/qr">
            <Button size="sm" className="h-9 px-4 rounded-xl text-xs font-extrabold bg-brand-600 text-white hover:bg-brand-700 shadow-cta">
              Share QR &amp; NFC
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
