import React from "react";
import type { PublicProfileBlock, WhatsAppBlockConfig } from "@/types/blocks";
import { MessageSquare } from "lucide-react";

interface WhatsAppBlockProps {
  block: PublicProfileBlock<WhatsAppBlockConfig>;
}

export function WhatsAppBlock({ block }: WhatsAppBlockProps) {
  const { config } = block;
  const sanitizedPhone = config.phone.replace(/[^\d]/g, "");
  const encodedMsg = config.message ? encodeURIComponent(config.message) : "";
  const waUrl = `https://wa.me/${sanitizedPhone}${encodedMsg ? `?text=${encodedMsg}` : ""}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-emerald-900/40 bg-emerald-950/20 px-4 py-3.5 text-center font-medium text-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:bg-emerald-950/40 active:translate-y-0"
    >
      <div className="flex items-center gap-3.5 truncate">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors group-hover:bg-emerald-500">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className="truncate text-left space-y-0.5">
          <span className="block truncate text-sm font-semibold tracking-tight text-white group-hover:text-emerald-200">
            {config.label || "Chat on WhatsApp"}
          </span>
          <span className="block truncate text-xs text-emerald-400/80">
            {config.phone}
          </span>
        </div>
      </div>
    </a>
  );
}
