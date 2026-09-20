import React from "react";
import type { PublicProfileBlock, BookingBlockConfig } from "@/types/blocks";
import { Calendar, ExternalLink } from "lucide-react";

interface BookingBlockProps {
  block: PublicProfileBlock<BookingBlockConfig>;
}

export function BookingBlock({ block }: BookingBlockProps) {
  const { config } = block;

  if (config.display_mode === "inline_embed" && config.is_allowlisted !== false) {
    return (
      <div className="w-full space-y-2">
        {config.title && (
          <h3
            className="text-sm font-semibold tracking-tight text-center sm:text-left"
            style={{ color: "var(--lf-text-primary, #ffffff)" }}
          >
            {config.title}
          </h3>
        )}
        <div className="relative h-[480px] w-full overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-950 shadow-md">
          <iframe
            src={config.url}
            title={config.title || "Book Appointment"}
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-900/80 px-4 py-3.5 text-center font-medium text-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--lf-accent,#6366f1)] hover:bg-slate-800/90 active:translate-y-0"
    >
      <div className="flex items-center gap-3.5 truncate">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[var(--lf-accent,#6366f1)] transition-colors group-hover:bg-[var(--lf-accent,#6366f1)] group-hover:text-white">
          <Calendar className="h-4 w-4" />
        </div>
        <span className="truncate text-sm font-semibold tracking-tight text-white group-hover:text-indigo-200">
          {config.title || `Book on ${config.provider === "cal" ? "Cal.com" : "Calendly"}`}
        </span>
      </div>

      <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-[var(--lf-accent,#6366f1)]" />
    </a>
  );
}
