"use client";

import * as React from "react";
import {
  Palette,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  LayoutTemplate,
  Store,
  CreditCard,
  Ticket,
  Maximize2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type QRCardTemplate = "standee" | "business-card" | "badge" | "minimal";

export interface QRTemplateOption {
  id: QRCardTemplate;
  name: string;
  badge: string;
  desc: string;
}

export const QR_CARD_TEMPLATES: QRTemplateOption[] = [
  {
    id: "standee",
    name: "Desk & Counter Standee",
    badge: "RETAIL & CAFE",
    desc: "Acrylic tabletop standee with weighted base for counters and desks.",
  },
  {
    id: "business-card",
    name: "Executive Business Card",
    badge: "NETWORKING",
    desc: "Horizontal pocket card with user bio and high-contrast QR.",
  },
  {
    id: "badge",
    name: "VIP Event Pass Badge",
    badge: "CONFERENCES",
    desc: "Vertical lanyard badge with punch hole and attendee credentials.",
  },
  {
    id: "minimal",
    name: "Modern Glass Plaque",
    badge: "MINIMALIST",
    desc: "Clean floating glassmorphic plaque with ambient edge glow.",
  },
];

export interface QRColorPreset {
  id: string;
  name: string;
  fgColor: string;
  bgColor: string;
}

export const QR_COLOR_PRESETS: QRColorPreset[] = [
  { id: "classic", name: "Classic Obsidian", fgColor: "#0f172a", bgColor: "#ffffff" },
  { id: "lavender", name: "Lavender Violet", fgColor: "#6366f1", bgColor: "#faf7ff" },
  { id: "ocean", name: "Ocean Sky", fgColor: "#0284c7", bgColor: "#f0f9ff" },
  { id: "mint", name: "Fresh Mint", fgColor: "#059669", bgColor: "#f0fdf4" },
  { id: "sunset", name: "Sunset Coral", fgColor: "#ea580c", bgColor: "#fff7ed" },
  { id: "dark", name: "Dark Titanium", fgColor: "#f8fafc", bgColor: "#090d16" },
];

export interface QRCustomizerProps {
  cardTemplate: QRCardTemplate;
  fgColor: string;
  bgColor: string;
  dotStyle: "square" | "rounded" | "dots";
  centerLogo: "badge" | "none";
  onChangeCardTemplate: (template: QRCardTemplate) => void;
  onChangeColors: (fg: string, bg: string) => void;
  onChangeDotStyle: (style: "square" | "rounded" | "dots") => void;
  onChangeCenterLogo: (logo: "badge" | "none") => void;
}

export function QRCustomizer({
  cardTemplate,
  fgColor,
  bgColor,
  dotStyle,
  centerLogo,
  onChangeCardTemplate,
  onChangeColors,
  onChangeDotStyle,
  onChangeCenterLogo,
}: QRCustomizerProps) {
  const [showCustomColors, setShowCustomColors] = React.useState(false);

  const getTemplateIcon = (id: QRCardTemplate) => {
    switch (id) {
      case "standee":
        return <Store className="w-4 h-4 text-amber-500" />;
      case "business-card":
        return <CreditCard className="w-4 h-4 text-brand-500" />;
      case "badge":
        return <Ticket className="w-4 h-4 text-purple-500" />;
      case "minimal":
        return <Maximize2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Section 1: Presentation Card Template ── */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">
              QR Card Template
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Select an attractive presentation card layout for display, print, or sharing.
            </p>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {QR_CARD_TEMPLATES.map((tmpl) => {
            const isSelected = cardTemplate === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChangeCardTemplate(tmpl.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all text-left space-y-2 select-none shadow-2xs group hover:-translate-y-0.5 flex flex-col justify-between",
                  isSelected
                    ? "bg-card border-brand-500 ring-2 ring-brand-500/20 shadow-md"
                    : "bg-card border-border/80 hover:border-brand-300 hover:bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-muted/60 border border-border/60">
                      {getTemplateIcon(tmpl.id)}
                    </div>
                    <div>
                      <span className="text-xs font-black text-foreground group-hover:text-brand-600 transition-colors block">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                        {tmpl.badge}
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-2xs flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-border/80 group-hover:border-brand-400 transition-colors flex-shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground font-medium leading-snug pt-1">
                  {tmpl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* ── Section 2: Color Palette ── */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-2xs">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">
              QR Color Palette
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Choose high-contrast color combinations for instant scannability.
            </p>
          </div>
        </div>

        {/* Preset Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {QR_COLOR_PRESETS.map((preset) => {
            const isSelected =
              fgColor.toLowerCase() === preset.fgColor.toLowerCase() &&
              bgColor.toLowerCase() === preset.bgColor.toLowerCase();

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChangeColors(preset.fgColor, preset.bgColor)}
                className={cn(
                  "p-3 rounded-2xl border transition-all text-left space-y-2 select-none shadow-2xs group hover:-translate-y-0.5",
                  isSelected
                    ? "bg-card border-brand-500 ring-2 ring-brand-500/20 shadow-xs"
                    : "bg-card border-border/80 hover:border-brand-300 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground group-hover:text-brand-600 transition-colors truncate">
                    {preset.name}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-0.5">
                  <div
                    className="w-4 h-4 rounded-full border border-border/80 shadow-2xs"
                    style={{ backgroundColor: preset.fgColor }}
                    title="Foreground color"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-border/80 shadow-2xs"
                    style={{ backgroundColor: preset.bgColor }}
                    title="Background color"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Expandable Custom Hex Colors */}
        <div className="pt-2 border-t border-border/70">
          <button
            type="button"
            onClick={() => setShowCustomColors(!showCustomColors)}
            className="flex items-center justify-between w-full py-1 text-xs font-extrabold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>{showCustomColors ? "Hide Custom Hex Pickers" : "Customize Exact Hex Colors →"}</span>
            {showCustomColors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCustomColors && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 animate-in fade-in-50">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/80 space-y-1.5">
                <label className="block text-xs font-extrabold text-foreground">
                  Foreground Pattern Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => onChangeColors(e.target.value, bgColor)}
                    className="w-9 h-9 rounded-xl border border-input p-0.5 bg-card cursor-pointer flex-shrink-0"
                  />
                  <Input
                    type="text"
                    value={fgColor}
                    onChange={(e) => onChangeColors(e.target.value, bgColor)}
                    className="font-mono text-xs h-9 uppercase"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/80 space-y-1.5">
                <label className="block text-xs font-extrabold text-foreground">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => onChangeColors(fgColor, e.target.value)}
                    className="w-9 h-9 rounded-xl border border-input p-0.5 bg-card cursor-pointer flex-shrink-0"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => onChangeColors(fgColor, e.target.value)}
                    className="font-mono text-xs h-9 uppercase"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: Module Pattern Style ── */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">
              Module Pattern Style
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Customize the geometry of your QR code dots and corner markers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "rounded" as const, label: "Rounded", desc: "Smooth squircle dots" },
            { id: "dots" as const, label: "Circular Dots", desc: "Playful bubble circles" },
            { id: "square" as const, label: "Geometric Square", desc: "Classic sharp blocks" },
          ].map((opt) => {
            const isSelected = dotStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeDotStyle(opt.id)}
                className={cn(
                  "p-3.5 rounded-2xl border transition-all text-left space-y-1 select-none shadow-2xs group hover:-translate-y-0.5",
                  isSelected
                    ? "bg-card border-brand-500 ring-2 ring-brand-500/20 shadow-xs"
                    : "bg-card border-border/80 hover:border-brand-300 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground group-hover:text-brand-600 transition-colors">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground font-medium truncate">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 4: Center Badge & Avatar ── */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">
              Center Icon &amp; Logo
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Embed a brand mark or profile avatar in the center of the QR code.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "badge" as const, label: "Digicardo Logo", desc: "Official Digicardo Insignia" },
            { id: "none" as const, label: "Pure Minimalist", desc: "Clean uninterrupted QR pattern" },
          ].map((opt) => {
            const isSelected = centerLogo === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeCenterLogo(opt.id)}
                className={cn(
                  "p-3.5 rounded-2xl border transition-all text-left space-y-1 select-none shadow-2xs group hover:-translate-y-0.5",
                  isSelected
                    ? "bg-card border-brand-500 ring-2 ring-brand-500/20 shadow-xs"
                    : "bg-card border-border/80 hover:border-brand-300 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground group-hover:text-brand-600 transition-colors">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  )}
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
