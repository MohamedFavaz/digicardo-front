"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BarChart3,
  ArrowUpRight,
  ArrowRight,
  Eye,
  MousePointerClick,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AnalyticsShowcase() {
  const sources = [
    { label: "Instagram", pct: 46, color: "#7047eb", bg: "bg-[#7047eb]" },
    { label: "TikTok", pct: 24, color: "#ff4b72", bg: "bg-[#ff4b72]" },
    { label: "YouTube", pct: 14, color: "#ffaa1d", bg: "bg-[#ffaa1d]" },
    { label: "Direct", pct: 10, color: "#0ea5e9", bg: "bg-[#0ea5e9]" },
    { label: "Others", pct: 6, color: "#10b981", bg: "bg-[#10b981]" },
  ];

  return (
    <section id="analytics" className="py-20 md:py-28 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="max-w-3xl space-y-3 mb-16">
          <Badge variant="purple" size="default" className="gap-1.5 shadow-2xs">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>REAL-TIME INSIGHTS</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Analytics that help you <span className="lf-gradient-brand">grow.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            Beautiful insights to help you understand your audience, optimize your content, and convert traffic.
          </p>
        </div>

        {/* ── Main Analytics Dashboard Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: 3 Metric Cards with Sparklines */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Metric 1: Views */}
              <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Profile Views</span>
                  <div className="p-1.5 rounded-xl bg-brand-50 text-brand-600">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">12.4K</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-mint-600 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+18.6%</span>
                  </div>
                </div>
                {/* SVG Sparkline */}
                <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M0 20 Q 25 15, 50 18 T 100 4"
                    stroke="#7047eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 20 Q 25 15, 50 18 T 100 4 L 100 24 L 0 24 Z"
                    fill="url(#purpleGrad)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7047eb" />
                      <stop offset="100%" stopColor="#7047eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Metric 2: Clicks */}
              <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Link Clicks</span>
                  <div className="p-1.5 rounded-xl bg-coral-50 text-coral">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">3.8K</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-mint-600 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+24.2%</span>
                  </div>
                </div>
                {/* SVG Sparkline */}
                <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M0 22 Q 30 18, 60 12 T 100 6"
                    stroke="#ff4b72"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 22 Q 30 18, 60 12 T 100 6 L 100 24 L 0 24 Z"
                    fill="url(#coralGrad)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff4b72" />
                      <stop offset="100%" stopColor="#ff4b72" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Metric 3: CTR */}
              <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Click Rate</span>
                  <div className="p-1.5 rounded-xl bg-sky-50 text-sky-600">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">30.6%</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-mint-600 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+5.3%</span>
                  </div>
                </div>
                {/* SVG Sparkline */}
                <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M0 18 Q 35 12, 70 16 T 100 2"
                    stroke="#0ea5e9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 18 Q 35 12, 70 16 T 100 2 L 100 24 L 0 24 Z"
                    fill="url(#skyGrad)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

            </div>

            {/* Bottom Insight Banner */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-foreground">Privacy-first, zero cookie tracking</h4>
                <p className="text-xs text-muted-foreground font-medium">
                  Lightweight beacon telemetry that complies with GDPR without slowing your page down.
                </p>
              </div>
              <Link
                href="/dashboard/analytics"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full text-xs font-bold gap-1.5 flex-shrink-0 inline-flex items-center cursor-pointer"
                )}
              >
                <span>View dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Donut Chart of Traffic Sources */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-[32px] bg-card border border-border/80 shadow-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-foreground">Top Sources</h3>
                <p className="text-xs text-muted-foreground font-medium">Last 30 days breakdown</p>
              </div>
              <Badge variant="purple" size="sm">LIVE</Badge>
            </div>

            {/* SVG Donut Composition */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
              
              {/* Animated SVG Donut Chart */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background track */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f1f0f5"
                    strokeWidth="4.5"
                  />
                  {/* Segment 1: Instagram (46%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#7047eb"
                    strokeWidth="4.5"
                    strokeDasharray="46, 100"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: TikTok (24%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ff4b72"
                    strokeWidth="4.5"
                    strokeDasharray="24, 100"
                    strokeDashoffset="-46"
                  />
                  {/* Segment 3: YouTube (14%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ffaa1d"
                    strokeWidth="4.5"
                    strokeDasharray="14, 100"
                    strokeDashoffset="-70"
                  />
                  {/* Segment 4: Direct (10%) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="4.5"
                    strokeDasharray="10, 100"
                    strokeDashoffset="-84"
                  />
                </svg>

                {/* Donut Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-foreground">16.2K</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Visits</span>
                </div>
              </div>

              {/* Source Legend Chips */}
              <div className="space-y-2 w-full sm:w-auto">
                {sources.map((src) => (
                  <div key={src.label} className="flex items-center justify-between gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2.5 h-2.5 rounded-full", src.bg)} />
                      <span className="text-foreground">{src.label}</span>
                    </div>
                    <span className="text-muted-foreground">{src.pct}%</span>
                  </div>
                ))}
              </div>

            </div>

            <div className="pt-3 border-t border-border/60 text-center">
              <Link
                href="/dashboard/analytics"
                className="text-xs font-extrabold text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-1"
              >
                <span>View full analytics dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
