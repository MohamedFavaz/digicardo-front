"use client";

import * as React from "react";
import type { PublicProfileBlock, FaqBlockConfig } from "@/types/blocks";
import { ChevronDown } from "lucide-react";

interface FaqBlockProps {
  block: PublicProfileBlock<FaqBlockConfig>;
}

export function FaqBlock({ block }: FaqBlockProps) {
  const { config } = block;
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!config.items || config.items.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3 text-left">
      {config.title && (
        <h3
          className="text-base font-bold tracking-tight text-center sm:text-left"
          style={{ color: "var(--lf-text-primary, #ffffff)" }}
        >
          {config.title}
        </h3>
      )}

      <div className="divide-y divide-slate-800 rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-900/80 shadow-md">
        {config.items.map((item) => {
          const isOpen = !!openItems[item.id];
          return (
            <div key={item.id} className="transition-colors hover:bg-slate-800/40">
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[var(--lf-accent)]"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[var(--lf-accent,#6366f1)]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3.5 pt-1 text-xs leading-relaxed text-slate-300">
                  <p className="whitespace-pre-line">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
