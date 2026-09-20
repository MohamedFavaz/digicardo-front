import React from "react";
import type { PublicProfileBlock, EmailBlockConfig } from "@/types/blocks";
import { Mail } from "lucide-react";

interface EmailBlockProps {
  block: PublicProfileBlock<EmailBlockConfig>;
}

export function EmailBlock({ block }: EmailBlockProps) {
  const { config } = block;

  const mailtoParams = new URLSearchParams();
  if (config.subject) mailtoParams.append("subject", config.subject);
  if (config.body) mailtoParams.append("body", config.body);
  const queryStr = mailtoParams.toString();
  const mailtoUrl = `mailto:${encodeURIComponent(config.email)}${queryStr ? `?${queryStr}` : ""}`;

  return (
    <a
      href={mailtoUrl}
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-900/80 px-4 py-3.5 text-center font-medium text-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--lf-accent,#6366f1)] hover:bg-slate-800/90 active:translate-y-0"
    >
      <div className="flex items-center gap-3.5 truncate">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[var(--lf-accent,#6366f1)] transition-colors group-hover:bg-[var(--lf-accent,#6366f1)] group-hover:text-white">
          <Mail className="h-4 w-4" />
        </div>
        <div className="truncate text-left space-y-0.5">
          <span className="block truncate text-sm font-semibold tracking-tight text-white group-hover:text-indigo-200">
            {config.label || "Email Me"}
          </span>
          <span className="block truncate text-xs text-slate-400">
            {config.email}
          </span>
        </div>
      </div>
    </a>
  );
}
