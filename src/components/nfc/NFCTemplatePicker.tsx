"use client";

import * as React from "react";
import { Sparkles, Check, Radio, ShieldCheck, Type, Palette } from "lucide-react";
import { NFC_CARD_THEMES, type NFCFontStyle } from "./NFCCardPreview";
import { cn } from "@/lib/utils";

export interface NFCTemplatePickerProps {
  selectedThemeId: string;
  onSelectTheme: (id: string) => void;
  fontStyle?: NFCFontStyle;
  onSelectFontStyle?: (font: NFCFontStyle) => void;
}

export function NFCTemplatePicker({
  selectedThemeId,
  onSelectTheme,
  fontStyle = "modern",
  onSelectFontStyle,
}: NFCTemplatePickerProps) {
  const fontOptions: { id: NFCFontStyle; label: string; preview: string; desc: string }[] = [
    {
      id: "modern",
      label: "Modern Geometric",
      preview: "ALEX RIVERS",
      desc: "Clean geometric uppercase sans",
    },
    {
      id: "serif",
      label: "Luxury Editorial",
      preview: "Alex Rivers",
      desc: "High-fashion Playfair serif",
    },
    {
      id: "cyber",
      label: "High-Tech Mono",
      preview: "ALEX RIVERS",
      desc: "JetBrains technical monospace",
    },
    {
      id: "cinematic",
      label: "Cinematic Italic",
      preview: "ALEX RIVERS",
      desc: "Dynamic slanted power sans",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* ── Section 1: Full-Color Visual Finishes ── */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-2xs">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-foreground">
                  NFC Full-Color Finishes
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Internal Antenna (No Chip)</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Vibrant, saturated luxury gradients and metallic foil finishes.
              </p>
            </div>
          </div>
        </div>

        {/* Full-Color Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {NFC_CARD_THEMES.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all text-left space-y-3 select-none shadow-2xs group hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden",
                  isSelected
                    ? "bg-card border-brand-500 ring-2 ring-brand-500/30 shadow-md"
                    : "bg-card border-border/80 hover:border-brand-300 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-foreground group-hover:text-brand-600 transition-colors block">
                        {theme.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-muted-foreground block">
                      {theme.material}
                    </span>
                  </div>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-3 h-3 flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-border/80 group-hover:border-brand-400 transition-colors" />
                  )}
                </div>

                {/* Saturated Full-Color Mini Swatch */}
                <div
                  className={cn(
                    "w-full h-14 rounded-xl border bg-gradient-to-r flex items-center justify-between px-3.5 relative overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-[1.01]",
                    theme.bgGradient,
                    theme.foilBorder
                  )}
                  style={{
                    backgroundImage: theme.surfaceTexture,
                    boxShadow: `0 4px 14px ${theme.glowColor}`,
                  }}
                >
                  {/* Dynamic Sheen overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-tr pointer-events-none opacity-80",
                      theme.sheenOverlay
                    )}
                  />

                  {/* Monogram Emblem */}
                  <div className="flex items-center gap-1.5 z-10">
                    <div className="w-5 h-5 rounded-md bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-[9px] text-white shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className={cn("text-[9px] font-mono font-black tracking-widest uppercase drop-shadow-xs", theme.textColor)}>
                      {theme.badgeLabel}
                    </span>
                  </div>

                  {/* Wave Icon */}
                  <div className="flex items-center gap-1.5 z-10 px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20">
                    <Radio className={cn("w-3 h-3", theme.textColor)} />
                    <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider", theme.textColor)}>
                      NFC
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 2: Attractive Typography Styles ── */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">
              Cardholder Typography
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Choose an eye-catching font personality for your engraved name.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {fontOptions.map((opt) => {
            const isSelected = fontStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectFontStyle && onSelectFontStyle(opt.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all text-left space-y-1.5 select-none shadow-2xs group hover:-translate-y-0.5 flex flex-col justify-between",
                  isSelected
                    ? "bg-card border-brand-500 ring-2 ring-brand-500/25 shadow-md"
                    : "bg-card border-border/80 hover:border-brand-300 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black text-foreground group-hover:text-brand-600 transition-colors">
                    {opt.label}
                  </span>
                  {isSelected ? (
                    <div className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border/80 group-hover:border-brand-400 transition-colors" />
                  )}
                </div>

                {/* Font sample preview */}
                <div className="py-1">
                  <span
                    className={cn(
                      "text-base truncate block",
                      opt.id === "serif" && "font-serif italic font-black text-foreground text-lg",
                      opt.id === "modern" && "font-sans font-black tracking-widest text-foreground",
                      opt.id === "cyber" && "font-mono font-black tracking-widest text-foreground text-sm",
                      opt.id === "cinematic" && "font-sans font-extrabold italic tracking-wider text-foreground"
                    )}
                  >
                    {opt.preview}
                  </span>
                </div>

                <p className="text-[10px] text-muted-foreground font-medium truncate">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
