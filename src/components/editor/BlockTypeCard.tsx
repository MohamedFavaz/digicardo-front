"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import type { BlockMetadata } from "@/lib/blocks/registry";

export interface BlockTypeCardProps {
  metadata: BlockMetadata;
  onSelect: (type: BlockMetadata["type"]) => void;
}

export function BlockTypeCard({ metadata, onSelect }: BlockTypeCardProps) {
  const Icon = metadata.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(metadata.type)}
      className="w-full text-left p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/50 hover:border-brand-300 transition-all flex items-center justify-between gap-3 shadow-2xs group select-none hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-black text-foreground group-hover:text-brand-600 transition-colors truncate">
            {metadata.label}
          </div>
          <div className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
            {metadata.description}
          </div>
        </div>
      </div>

      <div className="w-7 h-7 rounded-xl bg-muted/60 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center flex-shrink-0 text-muted-foreground transition-all">
        <Plus className="w-3.5 h-3.5 stroke-[3]" />
      </div>
    </button>
  );
}
