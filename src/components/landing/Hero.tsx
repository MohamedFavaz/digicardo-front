"use client";

import * as React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RequestAccessModal } from "@/components/landing/RequestAccessModal";
import {
  ArrowRight,
  Play,
  Star,
  Sparkles,
  CheckCircle2,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  ChevronRight,
  Phone,
  Download,
  QrCode,
  CreditCard,
  TrendingUp,
  MessageCircle,
  MapPin,
  Flame,
  ShieldCheck,
  Zap,
  Radio,
} from "lucide-react";

export function Hero() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <RequestAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <section className="relative pt-32 pb-20 md:pt-38 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/50 via-background to-background">
        
        {/* ── Artistic Ambient Studio Lighting Mesh ── */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-brand-300/30 via-amber-200/25 to-rose-200/25 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-16 right-5 w-[420px] h-[420px] bg-sky-200/25 rounded-full blur-[90px] pointer-events-none -z-10" />
        <div className="absolute bottom-5 left-5 w-[420px] h-[420px] bg-emerald-200/20 rounded-full blur-[90px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* ── Left Column: Editorial Headline, Refined Copy & CTAs ── */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-10">
              
              {/* Refined Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-brand-500/20 text-xs font-black tracking-wide text-foreground shadow-xs">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="uppercase text-[10px] tracking-widest text-brand-600 font-black">
                  Next-Gen Identity Platform
                </span>
                <span className="text-border">|</span>
                <span className="text-muted-foreground font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  NFC Smart Cards &amp; Profiles
                </span>
              </div>

              {/* Attention-Grabbing Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
                The smart card for{" "}
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-black lf-gradient-brand mt-1.5">
                  instant networking.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Share your digital profile, vCard contact info, social links, and business portfolio with a single tap of your Digicardo physical NFC card or dynamic QR code. No app required.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-600 hover:bg-brand-500 text-white font-black text-sm shadow-cta hover:shadow-[0_8px_25px_rgba(91,63,228,0.35)] hover:-translate-y-0.5 active:translate-y-0 h-13 px-8 rounded-full transition-all cursor-pointer"
                >
                  <span>Create Your Smart Card</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card hover:bg-muted/70 text-foreground font-bold text-sm rounded-full h-13 px-6 border border-border/90 shadow-xs cursor-pointer transition-all hover:border-brand-500/40"
                >
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  <span>Order Custom NFC Card</span>
                </a>
              </div>

              {/* Social Proof with Real Photo Avatars */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center -space-x-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Creator"
                    width={36}
                    height={36}
                    decoding="async"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-black/5"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Executive"
                    width={36}
                    height={36}
                    decoding="async"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-black/5"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Designer"
                    width={36}
                    height={36}
                    decoding="async"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-black/5"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Director"
                    width={36}
                    height={36}
                    decoding="async"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-black/5"
                  />
                </div>

                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-1 text-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber text-amber" />
                    ))}
                    <span className="text-[11px] font-black text-foreground ml-1">4.98 / 5.0</span>
                  </div>
                  <div className="text-[11px] text-foreground font-bold mt-0.5">
                    Curated by <span className="text-brand-600 font-black">20,000+</span> creators &amp; luxury retreats
                  </div>
                </div>
              </div>

            </div>

            {/* ── Right Column: Grand Dual-Device Art Showcase (7 cols) ── */}
            <div className="lg:col-span-7 relative flex items-center justify-center min-h-[580px] sm:min-h-[640px] select-none">
              
              {/* Floating Stat Badge 1: Top Left */}
              <div className="absolute top-2 left-0 sm:left-4 z-30 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-border/80 shadow-2xl flex items-center gap-3 animate-bounce-subtle">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">98.4% Contact Saves</div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> Direct vCard Download
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge 2: Bottom Right */}
              <div className="absolute bottom-4 right-0 sm:right-6 z-30 px-4 py-2.5 rounded-2xl bg-slate-950/95 text-white backdrop-blur-md border border-slate-800 shadow-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Contactless NFC Active</div>
                  <div className="text-[10px] font-medium text-slate-400">Instant Wallet &amp; Phone Sync</div>
                </div>
              </div>

              {/* ── DEVICE 1 (Left): Digicardo Luxury Matte-Black NFC Smart Card ── */}
              <div className="relative w-64 sm:w-76 rounded-3xl bg-slate-950 p-2.5 border-2 border-brand-500/30 shadow-[0_32px_75px_rgba(91,63,228,0.25)] -mr-8 sm:-mr-12 z-10 transform -rotate-6 hover:rotate-0 transition-all duration-700 overflow-hidden group">
                {/* Ambient Card Rim Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 rounded-3xl opacity-30 blur-lg group-hover:opacity-60 transition-opacity" />

                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] flex flex-col justify-between p-4 text-white shadow-2xl">
                  {/* Real Image of the 3D NFC Card */}
                  <img
                    src="/smart-nfc-card.jpg"
                    alt="Digicardo Luxury Matte-Black NFC Smart Card"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Overlay for Text Readability & Hologram effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Card Top Pill */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-wider text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      NFC Embedded
                    </span>
                    <span className="text-[10px] font-mono text-brand-300 font-bold">DIGICARDO SMART</span>
                  </div>

                  {/* Card Bottom Info */}
                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-white">
                      <CreditCard className="w-3.5 h-3.5 text-brand-400" />
                      <span>Matte Holographic NFC</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium">
                      Instant tap on any iPhone or Android
                    </p>
                  </div>
                </div>
              </div>

              {/* ── DEVICE 2 (Right): Elena Vance · Luxury Digital Business Card ── */}
              <div className="relative w-64 sm:w-76 rounded-[40px] bg-slate-950 p-4 border-[2px] border-slate-800 shadow-[0_36px_85px_rgba(0,0,0,0.55)] z-20 transform rotate-3 hover:rotate-0 transition-all duration-700 text-white overflow-hidden">
                
                {/* Dynamic Island Notch Accent */}
                <div className="w-20 h-3.5 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-between px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                </div>

                {/* High-End Architectural Penthouse Banner */}
                <div className="relative h-28 sm:h-32 w-full rounded-2xl overflow-hidden mb-3 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80"
                    alt="Executive Office"
                    width={350}
                    height={128}
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-black text-emerald-300">
                    NFC vCard
                  </span>
                </div>

                {/* Executive Profile Identity */}
                <div className="flex flex-col items-center text-center space-y-1.5 -mt-9 relative z-10 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Elena Vance"
                    width={56}
                    height={56}
                    decoding="async"
                    fetchPriority="high"
                    className="w-14 h-14 rounded-full border-[3px] border-slate-900 object-cover shadow-md"
                  />
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <h3 className="font-extrabold text-sm text-white">Elena Vance</h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-400">
                      Partner · Vantage Capital &amp; Private Office
                    </p>
                  </div>

                  {/* 3-Column Action Icons */}
                  <div className="grid grid-cols-3 gap-1.5 w-full pt-1">
                    <div className="py-1.5 px-2 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-0.5">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span className="text-[8px] font-bold text-slate-300">Call</span>
                    </div>
                    <div className="py-1.5 px-2 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-0.5">
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      <span className="text-[8px] font-bold text-slate-300">WhatsApp</span>
                    </div>
                    <div className="py-1.5 px-2 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-0.5">
                      <QrCode className="w-3 h-3 text-emerald-400" />
                      <span className="text-[8px] font-bold text-slate-300">Scan QR</span>
                    </div>
                  </div>

                  {/* Action Link Buttons */}
                  <div className="w-full space-y-2 pt-1 text-left">
                    <div className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-xs flex items-center justify-between shadow-cta">
                      <span>Reserve Advisory Consultation</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>

                    <div className="w-full py-2 px-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold flex items-center justify-between">
                      <span>Portfolio Case Studies (2026)</span>
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
