"use client";

import React from "react";
import type { LinkBlockConfig } from "@/types/blocks";
import { trackLinkClick } from "@/lib/analytics/events";
import { ExternalLink, Globe } from "lucide-react";

interface LinkBlockProps {
  config: LinkBlockConfig;
  blockId?: string;
  profileId?: string;
}

export function LinkBlock({ config, blockId, profileId }: LinkBlockProps) {
  const handleClick = () => {
    if (profileId && blockId) {
      trackLinkClick(profileId, blockId, config.url);
    }
  };

  return (
    <a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-900/80 px-4 py-3.5 text-center font-medium text-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--lf-accent,#6366f1)] hover:bg-slate-800/90 active:translate-y-0"
    >
      <div className="flex items-center gap-3.5 truncate">
        {config.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.thumbnail_url}
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg object-cover shadow-sm ring-1 ring-white/10"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[var(--lf-accent,#6366f1)] transition-colors group-hover:bg-[var(--lf-accent,#6366f1)] group-hover:text-white">
            <Globe className="h-4 w-4" />
          </div>
        )}
        <span className="truncate text-sm font-semibold tracking-tight text-white group-hover:text-indigo-200">
          {config.title}
        </span>
      </div>

      <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-[var(--lf-accent,#6366f1)]" />
    </a>
  );
}
