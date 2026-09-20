"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Radio,
  Twitter,
  Linkedin,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { DoodleSparkle, DoodleLoop } from "@/components/ui/playful/Doodles";

import { DigicardoLogo } from "@/components/ui/DigicardoLogo";

export function AuthVisualPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#f6f3fe] via-[#fff1f5] to-[#fff8ee] border-r border-border/80 flex-col justify-between p-10 xl:p-14 overflow-hidden select-none">
      
      {/* Background Pastel Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-coral-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-60 h-60 bg-amber-100/50 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Playful Doodles */}
      <div className="absolute top-12 right-16">
        <DoodleSparkle color="#7047eb" className="w-8 h-8 opacity-75" />
      </div>
      <div className="absolute bottom-20 left-12">
        <DoodleLoop color="#ff4b72" className="w-9 h-9 opacity-70" />
      </div>

      {/* ── Top: Brand Logo ── */}
      <Link href="/" className="w-fit group">
        <DigicardoLogo size="lg" subtitle="Smart Card Studio" />
      </Link>

      {/* ── Center: Realistic Floating Profile Card Composition ── */}
      <div className="relative my-auto py-8 flex items-center justify-center">
        
        {/* Floating Mini Chip 1: Analytics Sparkline */}
        <div className="absolute -left-2 top-4 z-20 p-3.5 rounded-2xl bg-card border border-border/80 shadow-float space-y-1 animate-in fade-in-50 duration-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-extrabold text-foreground">Live Stats</span>
          </div>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-lg font-black text-foreground">12.4K</span>
            <span className="text-[10px] font-bold text-mint-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.6%
            </span>
          </div>
        </div>

        {/* Floating Mini Chip 2: NFC Tap Card */}
        <div className="absolute -right-2 bottom-8 z-20 p-3 rounded-2xl bg-slate-900 text-white shadow-float space-y-1 border border-slate-700 animate-in fade-in-50 duration-700">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-white/80">
              NFC READY
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-white">Tap to Connect</p>
        </div>

        {/* Main Center Profile Card Mockup */}
        <div className="w-64 sm:w-72 rounded-[36px] bg-card p-5 border-2 border-brand-200/90 shadow-[0_24px_60px_rgba(112,71,235,0.18)] transform hover:scale-[1.02] transition-all duration-300">
          
          {/* Dynamic Island Notch */}
          <div className="w-14 h-3 bg-slate-900 rounded-full mx-auto mb-3" />

          <div className="flex flex-col items-center text-center space-y-2.5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-brand-600 via-pink-500 to-amber-400 shadow-md">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-lg">
                  FA
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            {/* Identity */}
            <div>
              <div className="flex items-center justify-center gap-1">
                <h3 className="font-extrabold text-xs text-foreground">Favaz Ahmed</h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 fill-brand-100" />
              </div>
              <p className="text-[10px] font-semibold text-muted-foreground">Product Designer</p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[10px]">
                <Twitter className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[10px]">
                <Linkedin className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[10px]">
                <Globe className="w-3 h-3" />
              </div>
            </div>

            {/* Interactive Links */}
            <div className="w-full space-y-1.5 pt-1">
              <div className="w-full py-2 px-3 rounded-xl bg-brand-50 border border-brand-200/80 text-[11px] font-extrabold text-brand-800 flex items-center justify-between shadow-2xs">
                <span>My Portfolio</span>
                <ChevronRight className="w-3 h-3 text-brand-600" />
              </div>
              <div className="w-full py-2 px-3 rounded-xl bg-card border border-border/80 text-[11px] font-bold text-foreground flex items-center justify-between shadow-2xs">
                <span>Case Studies (2026)</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-[11px] font-extrabold text-white flex items-center justify-between shadow-cta">
                <span>Book 1:1 Call</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Bottom: Testimonial Quote ── */}
      <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border/70 space-y-1">
        <p className="text-xs font-semibold text-foreground leading-relaxed">
          &ldquo;Digicardo transformed how I share my professional identity. My taps and connections doubled within the first week.&rdquo;
        </p>
        <span className="text-[10px] font-bold text-muted-foreground block">
          Favaz A. &middot; Designer &amp; Content Creator
        </span>
      </div>

    </div>
  );
}
