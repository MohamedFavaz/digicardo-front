"use client";

import * as React from "react";
import type { AnalyticsOverview } from "@/types/analytics";
import { Eye, Users, MousePointerClick, Percent, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalyticsSummaryCardsProps {
  overview?: AnalyticsOverview | null;
}

/** The five headline numbers, in plain words. */
export function AnalyticsSummaryCards({ overview }: AnalyticsSummaryCardsProps) {
  const cards = [
    { title: "Card views", value: (overview?.total_views ?? 0).toLocaleString(), icon: Eye, tone: "bg-[#EFECFD] text-[#5B3FE4]", hint: "Times your card was opened" },
    { title: "People", value: (overview?.unique_views ?? 0).toLocaleString(), icon: Users, tone: "bg-[#EFF6FF] text-[#2563EB]", hint: "Different visitors" },
    { title: "Button taps", value: (overview?.total_clicks ?? 0).toLocaleString(), icon: MousePointerClick, tone: "bg-[#ECFDF5] text-[#059669]", hint: "Call, WhatsApp, links and more" },
    { title: "Tap rate", value: `${overview?.click_through_rate ?? 0}%`, icon: Percent, tone: "bg-[#F0FDFA] text-[#0D9488]", hint: "Views that led to a tap" },
    { title: "Messages", value: (overview?.total_contact_submissions ?? 0).toLocaleString(), icon: MessageSquare, tone: "bg-[#FFF7ED] text-[#EA580C]", hint: "Sent from your contact form" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className={cn("rounded-2xl border border-border bg-card p-4 sm:p-5", i === 0 && "col-span-2 md:col-span-1")}>
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", card.tone)}>
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight text-foreground sm:text-[28px]">{card.value}</p>
            <p className="text-sm font-medium text-foreground">{card.title}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{card.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
