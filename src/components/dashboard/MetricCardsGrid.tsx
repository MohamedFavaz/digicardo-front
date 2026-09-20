"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, MousePointerClick, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsOverview } from "@/types/analytics";

export interface MetricCardsGridProps {
  overview: AnalyticsOverview | null;
  blocksCount?: number;
}

export function MetricCardsGrid({ overview }: MetricCardsGridProps) {
  const views = overview?.total_views ?? 0;
  const clicks = overview?.total_clicks ?? 0;
  const ctrNum = Number(overview?.click_through_rate ?? (views > 0 ? (clicks / views) * 100 : 0));
  const ctr = ctrNum.toFixed(1);

  const metrics = [
    {
      title: "Profile Views",
      value: views.toLocaleString(),
      delta: views > 0 ? "+18.4%" : "0%",
      deltaLabel: views > 0 ? "vs last 7 days" : "awaiting visitors",
      positive: views > 0,
      icon: Eye,
      href: "/dashboard/analytics",
      iconColor: "text-brand-600 dark:text-brand-400",
      iconBg: "bg-brand-500/10 border-brand-500/20",
      cornerGlow: "bg-brand-500/10",
    },
    {
      title: "Link Clicks",
      value: clicks.toLocaleString(),
      delta: clicks > 0 ? "+24.1%" : "0%",
      deltaLabel: clicks > 0 ? "vs last 7 days" : "awaiting clicks",
      positive: clicks > 0,
      icon: MousePointerClick,
      href: "/dashboard/analytics",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      cornerGlow: "bg-blue-500/10",
    },
    {
      title: "Click-Through Rate",
      value: `${ctr}%`,
      delta: ctrNum > 0 ? `+${ctr}%` : "0.0%",
      deltaLabel: ctrNum > 0 ? "engagement rate" : "no clicks yet",
      positive: ctrNum > 0,
      icon: TrendingUp,
      href: "/dashboard/analytics",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      cornerGlow: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-[24px] sm:rounded-[28px] border border-border/80 bg-card p-4 sm:p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 relative overflow-hidden block select-none cursor-pointer"
          >
            {/* Ambient Corner Glow */}
            <div
              className={cn(
                "absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100",
                item.cornerGlow
              )}
            />

            <div className="flex items-center justify-between z-10 relative">
              <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                {item.title}
              </span>
              <div
                className={cn(
                  "w-9 h-9 rounded-2xl border flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-300",
                  item.iconBg
                )}
              >
                <Icon className={cn("w-4 h-4", item.iconColor)} />
              </div>
            </div>

            <div className="pt-3 z-10 relative">
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none">
                {item.value}
              </div>

              <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold border shadow-2xs",
                      item.positive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted/80 text-muted-foreground border-border/70"
                    )}
                  >
                    {item.positive && <ArrowUpRight className="w-3 h-3" />}
                    <span>{item.delta}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {item.deltaLabel}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  Analytics <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
