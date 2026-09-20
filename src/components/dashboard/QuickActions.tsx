"use client";

import * as React from "react";
import Link from "next/link";
import {
  Palette,
  BarChart3,
  QrCode,
  Search,
  Sparkles,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const actions = [
    {
      title: "My Page",
      short: "Page",
      icon: Layers,
      href: "/dashboard/page",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10 hover:bg-indigo-500/20",
    },
    {
      title: "Appearance",
      short: "Design",
      icon: Palette,
      href: "/dashboard/appearance",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10 hover:bg-purple-500/20",
    },
    {
      title: "Analytics",
      short: "Stats",
      icon: BarChart3,
      href: "/dashboard/analytics",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 hover:bg-blue-500/20",
    },
    {
      title: "QR & NFC",
      short: "NFC",
      icon: QrCode,
      href: "/dashboard/qr",
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-500/10 hover:bg-brand-500/20",
    },
    {
      title: "SEO",
      short: "SEO",
      icon: Search,
      href: "/dashboard/seo",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Quick Studio Tools"
      className="fixed bottom-20 md:bottom-7 left-1/2 -translate-x-1/2 z-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full bg-card/90 dark:bg-card/85 backdrop-blur-2xl border border-border/90 shadow-[0_14px_40px_rgba(0,0,0,0.16)] ring-1 ring-black/5 dark:ring-white/10 transition-all hover:shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        
        {/* Floating Dock Brand Emblem */}
        <div className="flex items-center gap-1.5 pl-2.5 pr-2 py-1 select-none">
          <div className="w-5 h-5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Sparkles className="w-3 h-3 animate-pulse" />
          </div>
          <span className="hidden sm:inline text-[11px] font-black uppercase tracking-wider text-foreground">
            Quick Tools
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-border/80 mx-0.5" />

        {/* Action Pills */}
        <div className="flex items-center gap-1">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "group flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:shadow-2xs",
                  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                )}
                title={action.title}
              >
                <div
                  className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 flex-shrink-0",
                    action.bg,
                    action.color
                  )}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="hidden sm:inline text-xs font-bold whitespace-nowrap leading-none">
                  {action.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

