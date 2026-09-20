"use client";

import * as React from "react";
import { Sparkles, Trophy, TrendingUp } from "lucide-react";
import type {
  AnalyticsBlockMetric,
  AnalyticsTimeseriesPoint,
} from "@/types/analytics";

export interface PerformanceInsightCardProps {
  blocks: AnalyticsBlockMetric[];
  timeseries: AnalyticsTimeseriesPoint[];
}

export function PerformanceInsightCard({
  blocks,
  timeseries,
}: PerformanceInsightCardProps) {
  const topBlock = blocks[0];

  const peakDay = React.useMemo(() => {
    if (!timeseries || timeseries.length === 0) return null;
    let max = timeseries[0];
    for (const pt of timeseries) {
      if (pt.views > (max?.views || 0)) {
        max = pt;
      }
    }
    return max && max.views > 0 ? max : null;
  }, [timeseries]);

  if (!topBlock && !peakDay) return null;

  return (
    <div className="rounded-[36px] bg-gradient-to-br from-brand-50/60 via-card to-card border border-brand-200/80 p-6 sm:p-7 shadow-card space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-black text-sm text-foreground">
            Performance Highlights
          </h3>
          <p className="text-[11px] text-muted-foreground font-medium">
            Automated insights derived from your active visitor metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {topBlock && (
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-brand-700">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Top Converting Link</span>
            </div>
            <p className="text-xs text-foreground font-bold truncate">
              &quot;{topBlock.title}&quot;
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">
              Generated <strong className="text-foreground">{topBlock.count} clicks</strong> across all channels.
            </p>
          </div>
        )}

        {peakDay && (
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Peak Visitor Traffic</span>
            </div>
            <p className="text-xs text-foreground font-bold font-mono">
              {peakDay.date}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">
              Recorded <strong className="text-foreground">{peakDay.views} profile views</strong> in a single day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
