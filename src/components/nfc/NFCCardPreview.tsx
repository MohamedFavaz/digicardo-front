/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Image from "next/image";
import {
  RotateCw,
  CheckCircle2,
  Radio,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Type,
} from "lucide-react";
import type { Profile } from "@/types/profile";
import { generateQrSvg } from "@/lib/qr/qr-code";
import { cn } from "@/lib/utils";

export type NFCFontStyle = "modern" | "serif" | "cyber" | "cinematic";

export interface NFCCardTheme {
  id: string;
  name: string;
  material: string;
  tier: string;
  badgeLabel: string;
  bgGradient: string;
  surfaceTexture: string;
  textColor: string;
  subtextColor: string;
  accentText: string;
  waveColor: string;
  accentBadge: string;
  accentBorder: string;
  sheenOverlay: string;
  qrBg: string;
  qrFg: string;
  foilBorder: string;
  glowColor: string;
}

export const NFC_CARD_THEMES: NFCCardTheme[] = [
  {
    id: "holographic-neon",
    name: "Prismatic Cyber Aurora",
    material: "VIBRANT IRIDESCENT FOIL",
    tier: "HOLOGRAPHIC VIP",
    badgeLabel: "AURORA FOIL",
    bgGradient: "from-[#6366f1] via-[#d946ef] to-[#06b6d4]",
    surfaceTexture: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 60%)",
    textColor: "text-white",
    subtextColor: "text-white/80",
    accentText: "text-cyan-200",
    waveColor: "text-white",
    accentBadge: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    accentBorder: "border-white/40",
    sheenOverlay: "from-white/0 via-white/20 to-cyan-300/30",
    qrBg: "#ffffff",
    qrFg: "#4338ca",
    foilBorder: "border-white/40 shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_12px_36px_rgba(217,70,239,0.35)]",
    glowColor: "rgba(217,70,239,0.3)",
  },
  {
    id: "azure-sapphire",
    name: "Electric Royal Sapphire",
    material: "VIBRANT COBALT & CYAN LASER",
    tier: "ROYAL AZURE",
    badgeLabel: "SAPPHIRE ALLOY",
    bgGradient: "from-[#0284c7] via-[#2563eb] to-[#4f46e5]",
    surfaceTexture: "radial-gradient(ellipse at 30% 20%, rgba(56,189,248,0.35) 0%, transparent 65%)",
    textColor: "text-white",
    subtextColor: "text-sky-100",
    accentText: "text-sky-300",
    waveColor: "text-sky-200",
    accentBadge: "bg-sky-400/20 text-sky-100 border-sky-300/30 backdrop-blur-md",
    accentBorder: "border-sky-400/40",
    sheenOverlay: "from-sky-400/0 via-white/20 to-sky-200/25",
    qrBg: "#ffffff",
    qrFg: "#1e3a8a",
    foilBorder: "border-sky-300/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_12px_36px_rgba(37,99,235,0.35)]",
    glowColor: "rgba(37,99,235,0.35)",
  },
  {
    id: "sunset-flare",
    name: "Radiant Solar Flare",
    material: "VIVID CORAL & SUNSET GOLD",
    tier: "SOLAR VIP",
    badgeLabel: "SOLAR FOIL",
    bgGradient: "from-[#e11d48] via-[#ea580c] to-[#f59e0b]",
    surfaceTexture: "radial-gradient(ellipse at 70% 30%, rgba(254,240,138,0.3) 0%, transparent 60%)",
    textColor: "text-white",
    subtextColor: "text-rose-100",
    accentText: "text-amber-200",
    waveColor: "text-amber-200",
    accentBadge: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    accentBorder: "border-amber-300/40",
    sheenOverlay: "from-amber-400/0 via-white/25 to-amber-200/30",
    qrBg: "#ffffff",
    qrFg: "#9f1239",
    foilBorder: "border-amber-300/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_12px_36px_rgba(234,88,12,0.35)]",
    glowColor: "rgba(234,88,12,0.35)",
  },
  {
    id: "emerald-matrix",
    name: "Electric Cyber Emerald",
    material: "VIVID JADE & NEON MINT",
    tier: "EMERALD PRESTIGE",
    badgeLabel: "CYBER JADE",
    bgGradient: "from-[#059669] via-[#0d9488] to-[#0284c7]",
    surfaceTexture: "radial-gradient(ellipse at 40% 70%, rgba(110,231,183,0.35) 0%, transparent 60%)",
    textColor: "text-white",
    subtextColor: "text-emerald-100",
    accentText: "text-emerald-300",
    waveColor: "text-emerald-200",
    accentBadge: "bg-emerald-400/20 text-emerald-100 border-emerald-300/30 backdrop-blur-md",
    accentBorder: "border-emerald-400/40",
    sheenOverlay: "from-emerald-400/0 via-white/20 to-teal-200/25",
    qrBg: "#ffffff",
    qrFg: "#064e3b",
    foilBorder: "border-emerald-300/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_12px_36px_rgba(13,148,136,0.35)]",
    glowColor: "rgba(13,148,136,0.35)",
  },
  {
    id: "imperial-gold",
    name: "Imperial 24K Molten Gold",
    material: "RICH BRASS & 24K GOLD FOIL",
    tier: "FOUNDER EDITION",
    badgeLabel: "24K GOLD",
    bgGradient: "from-[#b45309] via-[#d97706] to-[#f59e0b]",
    surfaceTexture: "radial-gradient(ellipse at 80% 20%, rgba(254,243,199,0.4) 0%, transparent 70%)",
    textColor: "text-amber-950",
    subtextColor: "text-amber-900/80",
    accentText: "text-amber-950",
    waveColor: "text-amber-950",
    accentBadge: "bg-amber-950/20 text-amber-950 border-amber-900/30 backdrop-blur-md",
    accentBorder: "border-amber-900/30",
    sheenOverlay: "from-amber-200/0 via-white/40 to-amber-100/30",
    qrBg: "#ffffff",
    qrFg: "#78350f",
    foilBorder: "border-amber-200/70 shadow-[inset_0_1px_3px_rgba(255,255,255,0.7),0_12px_36px_rgba(217,119,6,0.35)]",
    glowColor: "rgba(217,119,6,0.35)",
  },
  {
    id: "nebula-violet",
    name: "Cosmic Ultraviolet Galaxy",
    material: "DEEP MATTE VIOLET & MAGENTA",
    tier: "COSMIC EDITION",
    badgeLabel: "ULTRAVIOLET",
    bgGradient: "from-[#4c1d95] via-[#7c3aed] to-[#c026d3]",
    surfaceTexture: "radial-gradient(ellipse at 60% 30%, rgba(240,171,252,0.3) 0%, transparent 65%)",
    textColor: "text-white",
    subtextColor: "text-purple-100",
    accentText: "text-fuchsia-200",
    waveColor: "text-purple-200",
    accentBadge: "bg-white/20 text-white border-white/30 backdrop-blur-md",
    accentBorder: "border-purple-300/40",
    sheenOverlay: "from-purple-400/0 via-white/20 to-fuchsia-200/25",
    qrBg: "#ffffff",
    qrFg: "#3b0764",
    foilBorder: "border-purple-300/50 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_12px_36px_rgba(124,58,237,0.35)]",
    glowColor: "rgba(124,58,237,0.35)",
  },
  {
    id: "stealth-matrix",
    name: "Stealth Carbon Matrix Neon",
    material: "CARBON WEAVE & NEON MATRIX",
    tier: "CYBER MATRIX",
    badgeLabel: "STEALTH NEON",
    bgGradient: "from-[#090d14] via-[#101927] to-[#06090e]",
    surfaceTexture: "radial-gradient(ellipse at 20% 20%, rgba(16,185,129,0.2) 0%, transparent 60%)",
    textColor: "text-white",
    subtextColor: "text-slate-400",
    accentText: "text-emerald-400",
    waveColor: "text-emerald-400",
    accentBadge: "bg-emerald-950/80 text-emerald-300 border-emerald-500/50",
    accentBorder: "border-emerald-500/50",
    sheenOverlay: "from-emerald-400/0 via-emerald-400/10 to-white/10",
    qrBg: "#ffffff",
    qrFg: "#022c22",
    foilBorder: "border-emerald-500/50 shadow-[inset_0_1px_2px_rgba(16,185,129,0.3),0_12px_36px_rgba(16,185,129,0.25)]",
    glowColor: "rgba(16,185,129,0.25)",
  },
];

export interface NFCCardPreviewProps {
  profile: Profile | null;
  selectedThemeId: string;
  fontStyle?: NFCFontStyle;
}

export function NFCCardPreview({
  profile,
  selectedThemeId,
  fontStyle = "modern",
}: NFCCardPreviewProps) {
  const [cardSide, setCardSide] = React.useState<"front" | "back">("front");

  const theme =
    NFC_CARD_THEMES.find((t) => t.id === selectedThemeId) ||
    NFC_CARD_THEMES[0]!;

  const username = profile?.username || "alexrivers";
  const displayName = profile?.display_name || profile?.username || "ALEX RIVERS";
  const formattedName = displayName.toUpperCase();

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://digicardo.app/${username}`;

  // Deterministic Card Serial Number for luxury feel
  const serialNumber = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = (hash << 5) - hash + username.charCodeAt(i);
      hash |= 0;
    }
    const part1 = Math.abs(hash % 9000 + 1000);
    const part2 = Math.abs((hash * 3) % 9000 + 1000);
    const part3 = Math.abs((hash * 7) % 9000 + 1000);
    return `DC88 · ${part1} · ${part2} · ${part3}`;
  }, [username]);

  // Generate QR code for the back side of the card
  const backQrSvg = React.useMemo(() => {
    return generateQrSvg({
      text: publicUrl,
      size: 130,
      fgColor: theme.qrFg,
      bgColor: theme.qrBg,
      dotStyle: "rounded",
      centerLogo: "badge",
    });
  }, [publicUrl, theme.qrFg, theme.qrBg]);

  // Dynamic font class based on chosen style
  const getCardholderFontClass = () => {
    switch (fontStyle) {
      case "serif":
        return "font-serif text-2xl font-black italic tracking-wide drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]";
      case "cyber":
        return "font-mono text-lg font-black uppercase tracking-[0.25em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]";
      case "cinematic":
        return "font-sans text-xl font-black uppercase italic tracking-[0.16em] drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]";
      case "modern":
      default:
        return "font-sans text-xl font-black uppercase tracking-[0.18em] drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]";
    }
  };

  return (
    <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-6 flex flex-col items-center select-none sticky top-6">
      
      {/* Top Header & Flip Toggle Bar */}
      <div className="w-full flex items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-brand-600">
              SMART NFC HARDWARE
            </span>
          </div>
          <h3 className="text-base font-black text-foreground">
            Full-Color Smart Card
          </h3>
        </div>

        {/* Flip Orientation Switcher */}
        <button
          type="button"
          onClick={() => setCardSide((prev) => (prev === "front" ? "back" : "front"))}
          className="px-3.5 py-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground text-xs font-extrabold flex items-center gap-2 border border-border/80 transition-all active:scale-95 shadow-2xs group"
          title="Flip between Front and Back"
        >
          <RotateCw className="w-3.5 h-3.5 text-brand-600 transition-transform duration-500 group-hover:rotate-180" />
          <span>Flip to {cardSide === "front" ? "Back" : "Front"}</span>
        </button>
      </div>

      {/* ── Realistic 3D Tactile NFC Card Container (Standard CR80 1.586 Ratio) ── */}
      <div className="w-full max-w-[360px] mx-auto py-1 perspective-1000">
        {cardSide === "front" ? (
          /* ── FRONT FACE: Saturated Full-Color Luxury with Attractive Typography (100% Chip & Image Free) ── */
          <div
            className={cn(
              "relative w-full aspect-[1.586/1] rounded-[22px] sm:rounded-[24px] p-4 sm:p-6 border bg-gradient-to-br transition-all duration-500 flex flex-col justify-between overflow-hidden group select-none hover:scale-[1.03] hover:-rotate-0.5 animate-in fade-in-50 duration-300",
              theme.bgGradient,
              theme.foilBorder
            )}
            style={{
              backgroundImage: theme.surfaceTexture,
              boxShadow: `0 20px 50px -10px ${theme.glowColor}, 0 0 0 1px rgba(255,255,255,0.2) inset`,
            }}
          >
            {/* Dynamic Moving Sheen Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-tr pointer-events-none opacity-90 transition-opacity duration-300 group-hover:opacity-100",
                theme.sheenOverlay
              )}
            />

            {/* Inner Refined Beveled Border */}
            <div className="absolute inset-2 rounded-[16px] sm:rounded-[18px] border border-white/25 pointer-events-none" />

            {/* Top Row: Luxury Geometric Monogram Mark & Contactless Resonance Waves */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Geometric Insignia Crest */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-white/30 p-1 flex items-center justify-center shadow-md flex-shrink-0">
                  <Image src="/logo.png" alt="Digicardo" width={24} height={24} className="w-full h-full object-contain" />
                </div>
                <div className="text-left leading-none space-y-0.5">
                  <span className={cn("text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] sm:tracking-[0.25em] block drop-shadow-sm", theme.textColor)}>
                    DIGICARDO
                  </span>
                  <span className={cn("text-[7px] sm:text-[8px] font-mono font-bold tracking-widest uppercase opacity-90 block", theme.subtextColor)}>
                    {theme.tier}
                  </span>
                </div>
              </div>

              {/* Universal Contactless Wave Symbol with animated pulse */}
              <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/25 shadow-2xs">
                <Radio className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse", theme.waveColor)} />
                <span className={cn("text-[8px] sm:text-[9px] font-mono font-black tracking-wider uppercase", theme.textColor)}>
                  NFC TAP
                </span>
              </div>
            </div>

            {/* Middle Section: Typographic Centerpiece with Selected Luxury Font Style */}
            <div className="z-10 py-1 sm:py-2 text-left space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h4 className={cn("truncate leading-tight text-sm sm:text-base md:text-lg", theme.textColor, getCardholderFontClass())}>
                  {formattedName}
                </h4>
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 drop-shadow-sm flex-shrink-0" />
              </div>

              {/* Card Serial & Access Code */}
              <p className={cn("text-[9px] sm:text-[11px] font-mono font-bold tracking-[0.15em] sm:tracking-[0.2em] opacity-90 drop-shadow-xs", theme.subtextColor)}>
                {serialNumber}
              </p>
            </div>

            {/* Bottom Row: Smart Specifications & URL */}
            <div className="flex items-center justify-between z-10 pt-1.5 sm:pt-2 border-t border-white/20">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={cn("px-2 sm:px-2.5 py-0.5 rounded-md text-[7px] sm:text-[8px] font-mono uppercase font-black border tracking-wider", theme.accentBadge)}>
                  {theme.badgeLabel}
                </span>
                <span className={cn("text-[8px] sm:text-[9px] font-mono uppercase tracking-wider font-bold opacity-90 hidden xs:inline-block drop-shadow-xs", theme.subtextColor)}>
                  NTAG216 DUAL-COIL
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <Globe className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-80 flex-shrink-0", theme.subtextColor)} />
                <span className={cn("text-[9px] sm:text-[10px] font-mono font-bold tracking-wider drop-shadow-xs truncate", theme.textColor)}>
                  digicardo.app/{username}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ── BACK FACE: Saturated Color Back with Scannable Precision Register Window & Magnetic Band ── */
          <div
            className={cn(
              "relative w-full aspect-[1.586/1] rounded-[22px] sm:rounded-[24px] p-4 sm:p-6 border bg-gradient-to-br transition-all duration-500 flex flex-col justify-between overflow-hidden group select-none hover:scale-[1.03] hover:rotate-0.5 animate-in fade-in-50 duration-300",
              theme.bgGradient,
              theme.foilBorder
            )}
            style={{
              boxShadow: `0 20px 50px -10px ${theme.glowColor}, 0 0 0 1px rgba(255,255,255,0.2) inset`,
            }}
          >
            {/* Magnetic Stripe Band with Realistic Texture */}
            <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-black/80 backdrop-blur-md border-b border-white/20 flex items-center px-4 sm:px-6 justify-between">
              <span className="text-[7px] sm:text-[8px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/70 font-bold">
                ENCRYPTED TOUCHPOINT
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono text-white/70 tracking-wider">
                ISO/IEC 14443-A
              </span>
            </div>

            {/* Back Content Zone */}
            <div className="pt-6 sm:pt-7 flex items-center justify-between gap-3 sm:gap-4 z-10">
              {/* Left Column: Security Cryptogram & Signature Panel */}
              <div className="space-y-1.5 sm:space-y-2 text-left flex-1 min-w-0">
                {/* Debossed Signature Panel */}
                <div className="w-full h-6 sm:h-7 rounded-md bg-white/20 backdrop-blur-md border border-white/25 flex items-center px-2.5 sm:px-3 justify-between shadow-inner">
                  <span className="text-[8px] sm:text-[9px] font-mono italic text-white/80 tracking-wider">
                    Authorized Cardholder
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-white">
                    CID 892
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono uppercase font-bold text-white/90">
                    <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white flex-shrink-0" />
                    <span className="truncate">Instant Redirection</span>
                  </div>
                  <p className={cn("text-[9px] sm:text-[10px] font-mono truncate text-white/90")}>
                    digicardo.app/{username}
                  </p>
                </div>
              </div>

              {/* Right Column: Scannable Precision Register Window */}
              <div className="relative p-1 rounded-xl bg-white shadow-xl flex-shrink-0 border border-black/10">
                <div
                  className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: backQrSvg }}
                />
              </div>
            </div>

            {/* Bottom Back Footer */}
            <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-white/60 pt-1 border-t border-white/20 z-10">
              <span className="truncate mr-2">TAP NFC TO CONNECT</span>
              <span className="font-bold text-white/80 flex-shrink-0">DIGICARDO</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Pill */}
      <div className="w-full max-w-[360px] p-3 rounded-2xl bg-muted/40 border border-border/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          <span className="text-[11px] font-semibold text-muted-foreground">
            Cardholder: <strong className="text-foreground font-mono">{formattedName}</strong>
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
          FULL COLOR EDITION
        </span>
      </div>
    </div>
  );
}
