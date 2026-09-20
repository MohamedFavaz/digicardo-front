"use client";

import React from "react";
import type { PublicProfileBlock, CtaBlockConfig } from "@/types/blocks";
import { trackCtaClick } from "@/lib/analytics/events";
import { ArrowRight, Sparkles } from "lucide-react";

interface CtaBlockProps {
  block: PublicProfileBlock<CtaBlockConfig>;
}

export function CtaBlock({ block }: CtaBlockProps) {
  const { config } = block;

  const style = config.style || "primary";
  const size = config.size || "medium";

  let btnClasses = "w-full font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ";

  if (size === "small") {
    btnClasses += "py-2 px-3 text-xs rounded-md ";
  } else if (size === "large") {
    btnClasses += "py-3.5 px-5 text-sm rounded-xl ";
  } else {
    btnClasses += "py-2.5 px-4 text-xs sm:text-sm rounded-lg ";
  }

  if (style === "secondary") {
    btnClasses += "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700";
  } else if (style === "outline") {
    btnClasses += "border-2 border-[var(--lf-accent,#6366f1)] text-white hover:bg-[var(--lf-accent,#6366f1)] hover:text-white bg-transparent";
  } else if (style === "gradient") {
    btnClasses += "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90";
  } else {
    btnClasses += "bg-[var(--lf-accent,#6366f1)] text-white hover:opacity-90";
  }

  return (
    <div className="w-full rounded-[var(--lf-radius,0.75rem)] border border-indigo-900/40 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 text-center shadow-xl space-y-3.5">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-800/40">
          <Sparkles className="h-3 w-3" />
          <span>Featured Offer</span>
        </div>
        <h3
          className="text-base font-extrabold tracking-tight text-white"
        >
          {config.title}
        </h3>
        {config.description && (
          <p
            className="text-xs leading-relaxed max-w-sm mx-auto"
            style={{ color: "var(--lf-text-secondary, #94a3b8)" }}
          >
            {config.description}
          </p>
        )}
      </div>

      <a
        href={config.url}
        target={config.open_in_new_tab !== false ? "_blank" : undefined}
        rel={config.open_in_new_tab !== false ? "noopener noreferrer" : undefined}
        onClick={() => {
          if (block?.profile_id && block?.id) {
            trackCtaClick(block.profile_id, block.id, config.url);
          }
        }}
        className={btnClasses}
      >
        <span>{config.button_label}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
