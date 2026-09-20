"use client";

import * as React from "react";
import { Zap, Palette, BarChart3, QrCode, ShieldCheck, Sparkles, Building2, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Zap,
    title: "Sub-100ms Fast",
    desc: "Edge-cached Cloudflare",
    iconColor: "text-brand-600",
    iconBg: "bg-brand-50 border-brand-200/60",
  },
  {
    icon: Palette,
    title: "Rich Aesthetics",
    desc: "Luxury themes & vCards",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-200/60",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Non-blocking CTR telemetry",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-200/60",
  },
  {
    icon: QrCode,
    title: "QR & NFC Ready",
    desc: "Instant contactless sharing",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 border-purple-200/60",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Grade",
    desc: "ULID keys & zero tracking CSS",
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50 border-sky-200/60",
  },
];

const brandPartners = [
  { name: "Aman Luxury Resorts", tag: "Hospitality" },
  { name: "Soho House & Co", tag: "Private Clubs" },
  { name: "Alpha Wellness", tag: "Health Sanctuary" },
  { name: "Vantage Capital", tag: "Venture Partners" },
  { name: "Studio Vertex", tag: "Creative Agency" },
  { name: "Monocle Editorial", tag: "Global Media" },
];

export function TrustSection() {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Core Value Props Grid */}
        <div className="rounded-[32px] border border-border/80 bg-card p-5 sm:p-7 shadow-card">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            {benefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={cn(
                    "flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3 first:pt-0 first:pl-0 last:pr-0",
                    idx === 4 && "col-span-2 md:col-span-1"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-2xs",
                      item.iconBg
                    )}
                  >
                    <Icon className={cn("w-5 h-5", item.iconColor)} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-black text-foreground truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate font-medium">
                      {item.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Trusted Brands Marquee Row */}
        <div className="rounded-2xl bg-muted/40 border border-border/60 py-3.5 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground tracking-wider uppercase flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Powering elite identity profiles worldwide</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-75 hover:opacity-100 transition-opacity">
            {brandPartners.map((brand) => (
              <div key={brand.name} className="flex items-center gap-1.5 text-xs font-serif font-black text-foreground select-none">
                <span>{brand.name}</span>
                <span className="text-[9px] font-sans font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/5 text-muted-foreground">
                  {brand.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
