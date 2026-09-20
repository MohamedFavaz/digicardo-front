"use client";

import * as React from "react";
import type { AnalyticsOverview } from "@/types/analytics";
import {
  Eye,
  Users,
  MousePointerClick,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalyticsSummaryCardsProps {
  overview?: AnalyticsOverview | null;
}

export function AnalyticsSummaryCards({
  overview,
}: AnalyticsSummaryCardsProps) {
  const cards = [
    {
      title: "Profile Views",
      value: (overview?.total_views ?? 0).toLocaleString(),
      icon: Eye,
      color: "text-brand-600",
      bg: "bg-brand-50 border-brand-200/80",
      description: "Total page impressions",
    },
    {
      title: "Unique Visitors",
      value: (overview?.unique_views ?? 0).toLocaleString(),
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50 border-sky-200/80",
      description: "Distinct IP visitors",
    },
    {
      title: "Link Clicks",
      value: (overview?.total_clicks ?? 0).toLocaleString(),
      icon: MousePointerClick,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200/80",
      description: "Interactions on links & blocks",
    },
    {
      title: "Click Rate (CTR)",
      value: `${overview?.click_through_rate ?? 0}%`,
      icon: TrendingUp,
      color: "text-mint-600",
      bg: "bg-mint-50 border-mint-200/80",
      description: "Clicks per profile visit",
    },
    {
      title: "Contact Leads",
      value: (overview?.total_contact_submissions ?? 0).toLocaleString(),
      icon: MessageSquare,
      color: "text-coral",
      bg: "bg-coral-50 border-coral/20",
      description: "Direct form submissions",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 hover:border-brand-500/30 shadow-2xs hover:shadow-card transition-all space-y-3 select-none group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {card.title}
              </span>
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-transform",
                  card.bg
                )}
              >
                <Icon className={cn("w-4 h-4", card.color)} />
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold text-foreground tracking-tight font-sans">
                {card.value}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
