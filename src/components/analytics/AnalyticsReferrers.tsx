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
          No Referrer Sources Yet
        </h4>
        <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto">
          Traffic channels (social media, direct clicks, search engines) will appear here.
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
              Traffic Sources
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-semibold">
              <Globe className="w-2.5 h-2.5" />
              <span>{referrers.length} Channels</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Privacy-normalized channel distribution of incoming visitors.
          </p>
        </div>
      </div>

      {/* Referrers List */}
      <div className="space-y-2">
        {referrers.map((ref, idx) => (
          <div
            key={ref.referrer || idx}
            className="p-3 rounded-lg border border-border hover:border-sky-300/60 transition-all space-y-2 select-none group"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-foreground truncate capitalize group-hover:text-sky-700 transition-colors">
                  {ref.referrer || "Direct / Link in Bio"}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono flex-shrink-0">
                <span className="text-xs text-muted-foreground font-semibold">
                  {ref.count.toLocaleString()} visits
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-black">
                  {ref.percentage}%
                </span>
              </div>
            </div>

            {/* Smooth Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-500"
                style={{ width: `${ref.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
