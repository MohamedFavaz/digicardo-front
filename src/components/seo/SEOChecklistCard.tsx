"use client";

import * as React from "react";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SEOChecklistCardProps {
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string | null;
  indexable: boolean;
}

export function SEOChecklistCard({
  seoTitle,
  seoDescription,
  ogImageUrl,
  indexable,
}: SEOChecklistCardProps) {
  const items = [
    {
      label: "Custom Page Title",
      desc: "Optimized title for browser tabs and search engines",
      isComplete: Boolean(seoTitle.trim()),
    },
    {
      label: "Meta Description",
      desc: "Brief summary shown beneath search snippet results",
      isComplete: Boolean(seoDescription.trim()),
    },
    {
      label: "Social Share Card Image",
      desc: "Visual banner for WhatsApp, iMessage, and Twitter",
      isComplete: Boolean(ogImageUrl),
    },
    {
      label: "Search Engine Indexing",
      desc: "Allowing Google & Bing bots to crawl and rank profile",
      isComplete: indexable,
    },
  ];

  const completedCount = items.filter((i) => i.isComplete).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground">
              SEO Readiness Checklist
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{completedCount}/{items.length} Ready</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Essential settings for optimal search engine discovery.
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
              : "bg-gradient-to-r from-brand-500 to-emerald-400"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2.5 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3 rounded-2xl bg-muted/20 border border-border/60"
          >
            {item.isComplete ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 opacity-60" />
            )}
            <div className="min-w-0">
              <span
                className={cn(
                  "block text-xs font-bold",
                  item.isComplete ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              <span className="block text-[11px] text-muted-foreground font-medium leading-tight">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
