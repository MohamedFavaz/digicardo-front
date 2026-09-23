"use client";

import * as React from "react";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SEOChecklistCardProps {
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string | null;
  indexable: boolean;
  keywords?: string[];
}

export function SEOChecklistCard({
  seoTitle,
  seoDescription,
  ogImageUrl,
  indexable,
  keywords = [],
}: SEOChecklistCardProps) {
  const items = [
    {
      label: "Custom Page Title",
      desc: "Browser tab & Google snippet headline (40–60 chars)",
      isComplete: Boolean(seoTitle.trim()),
    },
    {
      label: "Meta Description",
      desc: "Clear profile overview for search results (120–160 chars)",
      isComplete: Boolean(seoDescription.trim()),
    },
    {
      label: "Target Keywords",
      desc: "Search intent tags for metadata indexing",
      isComplete: keywords.length > 0,
    },
    {
      label: "Social Share Card Banner",
      desc: "Custom visual preview for iMessage, WhatsApp & X",
      isComplete: Boolean(ogImageUrl),
    },
    {
      label: "Search Engine Indexing",
      desc: "Crawlers allowed to index and rank your link profile",
      isComplete: indexable,
    },
  ];

  const completedCount = items.filter((i) => i.isComplete).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-foreground">
              SEO Readiness Score
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                progressPercent === 100
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-primary/10 text-primary"
              )}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>{progressPercent}% Complete ({completedCount}/{items.length})</span>
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Recommendations for top visibility and click-through rates.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            progressPercent === 100
              ? "bg-emerald-500"
              : progressPercent >= 60
              ? "bg-primary"
              : "bg-amber-500"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors",
              item.isComplete
                ? "bg-muted/15 border-border/60"
                : "bg-muted/30 border-border/40 opacity-75"
            )}
          >
            {item.isComplete ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <span
                className={cn(
                  "block text-xs font-semibold leading-tight",
                  item.isComplete ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              <span className="block text-[11px] text-muted-foreground font-medium leading-normal mt-0.5">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
