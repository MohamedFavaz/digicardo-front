"use client";

import * as React from "react";
import {
  Palette,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Sun,
  Moon,
  Flame,
  Droplets,
  Layers,
  Copy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ThemeTokens } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface ThemePreset {
  id: string;
  name: string;
  category: "light" | "vibrant" | "dark";
  tokens: Partial<ThemeTokens>;
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "default-light",
    name: "Classic Studio",
    category: "light",
    description: "Clean indigo accent on crisp paper white",
    tokens: {
      color_background: "#ffffff",
      color_surface: "#f8fafc",
      color_text_primary: "#0f172a",
      color_text_secondary: "#64748b",
      color_accent: "#6366f1",
    },
  },
  {
    id: "lavender-dream",
    name: "Lavender Bliss",
    category: "vibrant",
    description: "Gentle violet hues with luxury editorial feel",
    tokens: {
      color_background: "#faf7ff",
      color_surface: "#f3e8ff",
      color_text_primary: "#1e1b4b",
      color_text_secondary: "#6b21a8",
      color_accent: "#8b5cf6",
    },
  },
  {
    id: "ocean-sky",
    name: "Ocean Azure",
    category: "light",
    description: "Serene sky blue on soft airy surface",
    tokens: {
      color_background: "#f0f9ff",
      color_surface: "#e0f2fe",
      color_text_primary: "#082f49",
      color_text_secondary: "#0369a1",
      color_accent: "#0ea5e9",
    },
  },
  {
    id: "mint-fresh",
    name: "Emerald Mint",
    category: "light",
    description: "Refreshing botanical green for modern creators",
    tokens: {
      color_background: "#f0fdf4",
      color_surface: "#dcfce7",
      color_text_primary: "#052e16",
      color_text_secondary: "#15803d",
      color_accent: "#10b981",
    },
  },
  {
    id: "sunset-glow",
    name: "Sunset Peach",
    category: "vibrant",
    description: "Warm radiant amber with energetic punch",
    tokens: {
      color_background: "#fff7ed",
      color_surface: "#ffedd5",
      color_text_primary: "#431407",
      color_text_secondary: "#c2410c",
      color_accent: "#f97316",
    },
  },
  {
    id: "rose-petal",
    name: "Rose Berry",
    category: "vibrant",
    description: "Rich raspberry and coral for high-impact bios",
    tokens: {
      color_background: "#fff1f2",
      color_surface: "#ffe4e6",
      color_text_primary: "#4c0519",
      color_text_secondary: "#be123c",
      color_accent: "#f43f5e",
    },
  },
  {
    id: "midnight-cyber",
    name: "Midnight Cyber",
    category: "dark",
    description: "Deep tech navy canvas with electric cyan",
    tokens: {
      color_background: "#090d16",
      color_surface: "#1e293b",
      color_text_primary: "#f8fafc",
      color_text_secondary: "#94a3b8",
      color_accent: "#38bdf8",
    },
  },
  {
    id: "dark-obsidian",
    name: "Dark Obsidian",
    category: "dark",
    description: "Pure stealth black with warm golden amber",
    tokens: {
      color_background: "#0a0a0a",
      color_surface: "#171717",
      color_text_primary: "#ffffff",
      color_text_secondary: "#a3a3a3",
      color_accent: "#f59e0b",
    },
  },
];

export interface ThemePickerProps {
  themeTokens: ThemeTokens;
  onChangeTheme: (updated: Partial<ThemeTokens>) => void;
  stepNumber?: number;
  defaultOpen?: boolean;
}

export function ThemePicker({
  themeTokens,
  onChangeTheme,
  stepNumber = 1,
  defaultOpen = false,
}: ThemePickerProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [showCustom, setShowCustom] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState<"all" | "light" | "vibrant" | "dark">("all");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const filteredPresets = React.useMemo(() => {
    if (filterCategory === "all") return THEME_PRESETS;
    return THEME_PRESETS.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  const copyHex = (hex: string, key: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const currentPreset = THEME_PRESETS.find(
    (p) =>
      themeTokens.color_background?.toLowerCase() === p.tokens.color_background?.toLowerCase() &&
      themeTokens.color_accent?.toLowerCase() === p.tokens.color_accent?.toLowerCase()
  );
  const activeThemeName = currentPreset ? currentPreset.name : "Custom Palette";

  return (
    <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all">
      {/* ── Collapsible Header Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors select-none group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-black text-xs flex-shrink-0">
            {stepNumber}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base text-foreground tracking-tight group-hover:text-brand-600 transition-colors">
                Color Palette &amp; Themes
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-[10px] font-bold">
                <Palette className="w-3 h-3 text-brand-600" />
                <span>Presets</span>
              </span>
              <span className="text-[11px] text-brand-700 font-bold bg-brand-50 border border-brand-200/70 px-2 py-0.5 rounded-md">
                Active: {activeThemeName}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium line-clamp-1">
              Select a designer-crafted palette or fine-tune exact hex tokens for your brand.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className="hidden sm:inline text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
            {isOpen ? "Collapse" : "Customize"}
          </span>
          <div className="w-7 h-7 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-muted transition-all">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* ── Collapsible Content Body ── */}
      {isOpen && (
        <div className="p-6 sm:p-7 pt-4 space-y-6 border-t border-border/60 animate-in fade-in duration-200">
          {/* Category Filter Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-black text-foreground uppercase tracking-wider">
              Curated Palettes ({filteredPresets.length})
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/70 text-[11px] font-bold">
              {[
                { id: "all", label: "All", icon: Sparkles },
                { id: "light", label: "Light", icon: Sun },
                { id: "vibrant", label: "Vibrant", icon: Flame },
                { id: "dark", label: "Dark", icon: Moon },
              ].map((cat) => {
                const Icon = cat.icon;
                const isActive = filterCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilterCategory(cat.id as typeof filterCategory)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all select-none",
                      isActive
                        ? "bg-card text-foreground shadow-xs border border-border/80"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Curated Preset Grid with Visual Mini-Card Previews ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredPresets.map((preset) => {
          const isCurrent =
            themeTokens.color_background.toLowerCase() ===
              preset.tokens.color_background?.toLowerCase() &&
            themeTokens.color_accent.toLowerCase() ===
              preset.tokens.color_accent?.toLowerCase();

          const bg = preset.tokens.color_background || "#ffffff";
          const surface = preset.tokens.color_surface || "#f8fafc";
          const accent = preset.tokens.color_accent || "#6366f1";
          const textPrimary = preset.tokens.color_text_primary || "#0f172a";
          const textSecondary = preset.tokens.color_text_secondary || "#64748b";

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChangeTheme(preset.tokens)}
              className={cn(
                "relative p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between gap-3 group select-none shadow-2xs hover:shadow-md hover:-translate-y-0.5",
                isCurrent
                  ? "bg-card border-brand-500 ring-2 ring-brand-500/25 shadow-sm"
                  : "bg-card border-border/80 hover:border-brand-300/80 hover:bg-muted/20"
              )}
            >
              {/* Mini Profile Mockup Preview */}
              <div
                className="w-full h-24 rounded-xl p-2 flex flex-col justify-between border border-black/5 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]"
                style={{ backgroundColor: bg }}
              >
                {/* Simulated Header */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-2xs"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="space-y-0.5 flex-1">
                    <div
                      className="h-1.5 w-12 rounded-full opacity-80"
                      style={{ backgroundColor: textPrimary }}
                    />
                    <div
                      className="h-1 w-8 rounded-full opacity-50"
                      style={{ backgroundColor: textSecondary }}
                    />
                  </div>
                </div>

                {/* Simulated Link Buttons */}
                <div className="space-y-1">
                  <div
                    className="h-3 w-full rounded-md shadow-2xs flex items-center px-1.5"
                    style={{ backgroundColor: surface }}
                  >
                    <div
                      className="h-1 w-10 rounded-full"
                      style={{ backgroundColor: textPrimary }}
                    />
                  </div>
                  <div
                    className="h-3 w-full rounded-md shadow-2xs flex items-center justify-between px-1.5"
                    style={{ backgroundColor: accent }}
                  >
                    <div className="h-1 w-8 rounded-full bg-white/90" />
                    <div className="h-1 w-2 rounded-full bg-white/60" />
                  </div>
                </div>
              </div>

              {/* Bottom Meta & Color Swatches */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground group-hover:text-brand-600 transition-colors truncate">
                    {preset.name}
                  </span>
                  {isCurrent ? (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-600 text-white shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : null}
                </div>

                <p className="text-[10px] text-muted-foreground line-clamp-1">
                  {preset.description}
                </p>

                {/* Color Swatch Dots */}
                <div className="flex items-center gap-1 pt-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: bg }}
                    title={`Background: ${bg}`}
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: surface }}
                    title={`Surface: ${surface}`}
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: accent }}
                    title={`Accent: ${accent}`}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground ml-auto uppercase">
                    {accent}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Expandable Custom Precision Palette Studio ── */}
      <div className="rounded-2xl border border-border/80 bg-muted/20 overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center justify-between w-full p-4 text-xs font-bold text-foreground hover:text-brand-600 hover:bg-muted/40 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <span className="font-extrabold">Custom Color Token Studio</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              (Set exact brand hex codes)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600">
            <span>{showCustom ? "Collapse Studio" : "Open Token Editor"}</span>
            {showCustom ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showCustom && (
          <div className="p-5 pt-1 space-y-4 border-t border-border/60 animate-in fade-in-50 duration-200">
            <p className="text-[11px] text-muted-foreground">
              These design tokens are passed into your profile template. Click the color pip or edit the hex values directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Background Color */}
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-foreground">
                    Background Canvas
                  </label>
                  <button
                    type="button"
                    onClick={() => copyHex(themeTokens.color_background, "bg")}
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    <span>{copiedKey === "bg" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={themeTokens.color_background}
                      onChange={(e) => onChangeTheme({ color_background: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-border/80 p-0.5 bg-card cursor-pointer shadow-2xs"
                    />
                  </div>
                  <Input
                    type="text"
                    value={themeTokens.color_background}
                    onChange={(e) => onChangeTheme({ color_background: e.target.value })}
                    className="font-mono text-xs font-bold h-10 uppercase bg-background"
                  />
                </div>
              </div>

              {/* Surface / Card Color */}
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-foreground">
                    Surface / Cards
                  </label>
                  <button
                    type="button"
                    onClick={() => copyHex(themeTokens.color_surface, "surface")}
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    <span>{copiedKey === "surface" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={themeTokens.color_surface}
                      onChange={(e) => onChangeTheme({ color_surface: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-border/80 p-0.5 bg-card cursor-pointer shadow-2xs"
                    />
                  </div>
                  <Input
                    type="text"
                    value={themeTokens.color_surface}
                    onChange={(e) => onChangeTheme({ color_surface: e.target.value })}
                    className="font-mono text-xs font-bold h-10 uppercase bg-background"
                  />
                </div>
              </div>

              {/* Primary Text */}
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-foreground">
                    Primary Headings
                  </label>
                  <button
                    type="button"
                    onClick={() => copyHex(themeTokens.color_text_primary, "text1")}
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    <span>{copiedKey === "text1" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={themeTokens.color_text_primary}
                      onChange={(e) => onChangeTheme({ color_text_primary: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-border/80 p-0.5 bg-card cursor-pointer shadow-2xs"
                    />
                  </div>
                  <Input
                    type="text"
                    value={themeTokens.color_text_primary}
                    onChange={(e) => onChangeTheme({ color_text_primary: e.target.value })}
                    className="font-mono text-xs font-bold h-10 uppercase bg-background"
                  />
                </div>
              </div>

              {/* Accent Button */}
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-foreground">
                    Action / Accent Button
                  </label>
                  <button
                    type="button"
                    onClick={() => copyHex(themeTokens.color_accent, "accent")}
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    <span>{copiedKey === "accent" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={themeTokens.color_accent}
                      onChange={(e) => onChangeTheme({ color_accent: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-border/80 p-0.5 bg-card cursor-pointer shadow-2xs"
                    />
                  </div>
                  <Input
                    type="text"
                    value={themeTokens.color_accent}
                    onChange={(e) => onChangeTheme({ color_accent: e.target.value })}
                    className="font-mono text-xs font-bold h-10 uppercase bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )}
</div>
  );
}
