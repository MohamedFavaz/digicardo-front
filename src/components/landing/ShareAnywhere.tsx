"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Link2,
  Sparkles,
  ArrowRight,
  Radio,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareAnywhere() {
  const [activeTab, setActiveTab] = React.useState<"qr" | "nfc" | "link">("nfc");

  const tabs = [
    { id: "qr" as const, label: "QR Code", icon: QrCode },
    { id: "nfc" as const, label: "NFC Smart Card", icon: Radio },
    { id: "link" as const, label: "Custom Link", icon: Link2 },
  ];

  return (
    <section id="share" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Split Layout: Storytelling vs Physical NFC & QR Mockup ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Headline, Tabs, Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="coral" size="default" className="gap-1.5 shadow-2xs">
              <Share2 className="w-3.5 h-3.5" />
              <span>OMNICHANNEL SHARING</span>
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.12]">
              Share in <span className="lf-gradient-brand">more ways.</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              Share your page with a scannable custom QR code or let anyone tap your physical Digicardo NFC smart card. No app required.
            </p>

            {/* Interactive Mode Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 w-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all select-none",
                      isActive
                        ? "bg-card text-brand-700 shadow-sm border border-brand-200"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Step Pipeline */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[11px]">
                  1
                </div>
                <span>Create your link: <code className="text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md">digicardo.app/you</code></span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                <div className="w-6 h-6 rounded-full bg-mint-50 text-mint-600 flex items-center justify-center text-[11px]">
                  2
                </div>
                <span>Generate dynamic high-res QR codes for packaging & prints</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                <div className="w-6 h-6 rounded-full bg-coral-50 text-coral flex items-center justify-center text-[11px]">
                  3
                </div>
                <span>Tap any modern smartphone with contactless NFC</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "pill", size: "lg" }),
                  "gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-cta inline-flex items-center cursor-pointer"
                )}
              >
                <span>Get your NFC card</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: High-Fidelity Physical 3D NFC Card & QR Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px]">
            
            {/* Background Radial Glow */}
            <div className="absolute w-96 h-96 bg-brand-200/40 rounded-full blur-3xl -z-10" />

            {/* Physical NFC Card Mockup - Matte Obsidian & Gold */}
            <div className="relative w-80 sm:w-96 rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-black p-7 text-white shadow-[0_32px_70px_-15px_rgba(0,0,0,0.6)] transform -rotate-3 hover:rotate-0 transition-transform duration-500 select-none border border-slate-700/80 overflow-hidden">
              {/* Subtle gold metallic shimmer line */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-400/20 via-transparent to-transparent pointer-events-none" />

              {/* Card Top: Chip & NFC Contactless Wave */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-white/20">
                    <Image src="/logo.png" alt="Digicardo" width={28} height={28} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-black text-sm tracking-tight text-white block">Digicardo Black</span>
                    <span className="text-[9px] text-amber-400 font-extrabold uppercase tracking-wider">Metal Smart Edition</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-400">TAP READY</span>
                </div>
              </div>

              {/* Card Center: QR Code & NFC Sensor */}
              <div className="my-8 flex items-center justify-between">
                <div className="w-22 h-22 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-white">
                    <QrCode className="w-13 h-13 text-white" />
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-400">
                    CONTACTLESS 3.0
                  </span>
                  <div className="font-black text-base text-white">Zero App Required</div>
                  <div className="text-xs text-slate-400 font-medium">Instantly saves to Apple &amp; Google Wallet</div>
                </div>
              </div>

              {/* Card Bottom: Holder Name & Tag */}
              <div className="flex items-end justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="Elena Vance"
                    className="w-8 h-8 rounded-full border border-amber-400/60 object-cover shadow-xs"
                  />
                  <div>
                    <div className="font-black text-xs text-white">Elena Vance</div>
                    <span className="text-[10px] text-slate-400 font-mono">digicardo.app/elena</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-amber-300 border-amber-500/40 bg-amber-500/10 text-[10px] font-extrabold">
                  NFC ACTIVE
                </Badge>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
