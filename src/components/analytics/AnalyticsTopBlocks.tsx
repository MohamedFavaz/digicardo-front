"use client";

import * as React from "react";
import type { AnalyticsBlockMetric } from "@/types/analytics";
import { MousePointerClick, Layers, ExternalLink } from "lucide-react";
import { BLOCK_DEFINITIONS } from "@/lib/blocks/registry";
import type { BlockType } from "@/types/blocks";

export interface AnalyticsTopBlocksProps {
  blocks: AnalyticsBlockMetric[];
}

export function AnalyticsTopBlocks({ blocks }: AnalyticsTopBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center space-y-2">
        <Layers className="w-8 h-8 text-muted-foreground mx-auto" />
        <h4 className="text-sm font-semibold text-foreground">
          No Block Interactions Yet
        </h4>
        <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto">
          Clicks on your links, CTAs, and media items will populate here as visitors tap them.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...blocks.map((b) => b.count), 1);

  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground">
              Top Performing Links
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
              <MousePointerClick className="w-2.5 h-2.5" />
              <span>{blocks.length} Active</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Ranked by user interactions and total click conversions.
          </p>
        </div>
      </div>

      {/* Block Rankings List */}
      <div className="space-y-2">
        {blocks.map((item, idx) => {
          const percentage = Math.round((item.count / maxCount) * 100);
          const meta = BLOCK_DEFINITIONS[item.block_type as BlockType];
          const Icon = meta?.icon || ExternalLink;

          return (
            <div
              key={item.block_id || idx}
              className="p-3 rounded-lg border border-border hover:border-primary/20 transition-all space-y-2 select-none group"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-black text-muted-foreground w-5 flex-shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-foreground truncate group-hover:text-brand-600 transition-colors">
                    {item.title || "Untitled Link"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-card border border-border/80 text-[10px] uppercase font-bold text-muted-foreground flex-shrink-0">
                    {item.block_type}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono font-black text-emerald-600 flex-shrink-0 text-sm">
                  <span>{item.count.toLocaleString()}</span>
                  <span className="text-[10px] font-sans font-extrabold text-muted-foreground">clicks</span>
                </div>
              </div>

              {/* Smooth Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
