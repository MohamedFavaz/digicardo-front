"use client";

import * as React from "react";
import type { AnalyticsReferrerMetric } from "@/types/analytics";
import { Globe, Compass } from "lucide-react";

export interface AnalyticsReferrersProps {
  referrers: AnalyticsReferrerMetric[];
}

export function AnalyticsReferrers({ referrers }: AnalyticsReferrersProps) {
  if (!referrers || referrers.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center space-y-2">
        <Globe className="w-8 h-8 text-muted-foreground mx-auto" />
        <h4 className="text-sm font-semibold text-foreground">
          No sources yet
        </h4>
        <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto">
          When people open your card from WhatsApp, Instagram, Google and so on, it shows here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground">
              Where visitors come from
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-50 text-stone-700 text-[10px] font-semibold">
              <Globe className="w-2.5 h-2.5" />
              <span>{referrers.length} sources</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Apps and sites people opened your card from.
          </p>
        </div>
      </div>

      {/* Referrers List */}
      <div className="space-y-2">
        {referrers.map((ref, idx) => (
          <div
            key={ref.referrer || idx}
            className="p-3 rounded-lg border border-border hover:border-stone-300/60 transition-all space-y-2 select-none group"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-stone-50 text-stone-700 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-foreground truncate capitalize group-hover:text-stone-700 transition-colors">
                  {ref.referrer || "Direct / Link in Bio"}
                </span>
              </div>

              <div className="flex items-center gap-2 tabular-nums flex-shrink-0">
                <span className="text-xs text-muted-foreground font-semibold">
                  {ref.count.toLocaleString()} visits
                </span>
                <span className="px-2 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-stone-800 text-[11px] font-bold">
                  {ref.percentage}%
                </span>
              </div>
            </div>

            {/* Smooth Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-stone-500 transition-all duration-500"
                style={{ width: `${ref.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
