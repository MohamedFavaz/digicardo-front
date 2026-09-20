"use client";

import * as React from "react";
import { Type, Check, ChevronDown, ChevronUp } from "lucide-react";
import { FONT_ALLOWLIST, type FontFamily } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface TypographyPickerProps {
  selectedFont: FontFamily;
  onSelectFont: (font: FontFamily) => void;
  stepNumber?: number;
  defaultOpen?: boolean;
}

interface FontDetail {
  label: string;
  category: string;
  vibe: string;
  specimen: string;
  bestFor: string;
  cssFamily: string;
}

const FONT_METADATA: Record<FontFamily, FontDetail> = {
  inter: {
    label: "Inter",
    category: "Neo-Grotesque Sans",
    vibe: "Clean, Ultra-Modern & Readable",
    specimen: "Aa Modern Creator",
    bestFor: "Tech founders, developers & modern SaaS",
    cssFamily: "'Inter', sans-serif",
  },
  roboto: {
    label: "Roboto",
    category: "Neutral Neo-Sans",
    vibe: "Universal Clarity & Balance",
    specimen: "Aa Universal Clarity",
    bestFor: "Clean corporate bios & agencies",
    cssFamily: "'Roboto', sans-serif",
  },
  outfit: {
    label: "Outfit",
    category: "Geometric Tech Sans",
    vibe: "Vibrant, Energetic & Contemporary",
    specimen: "Aa Expressive Links",
    bestFor: "Designers, startups & digital products",
    cssFamily: "'Outfit', sans-serif",
  },
  poppins: {
    label: "Poppins",
    category: "Geometric Rounded Sans",
    vibe: "Friendly, Social & Engaging",
    specimen: "Aa Social Influence",
    bestFor: "Content creators, influencers & retail",
    cssFamily: "'Poppins', sans-serif",
  },
  lato: {
    label: "Lato",
    category: "Warm Semi-Rounded",
    vibe: "Warm, Stable & Transparent",
    specimen: "Aa Warm & Approachable",
    bestFor: "Consultants, healthcare & community",
    cssFamily: "'Lato', sans-serif",
  },
  montserrat: {
    label: "Montserrat",
    category: "Architectural Grotesque",
    vibe: "Bold, Assertive & High-Impact",
    specimen: "Aa Bold Impact",
    bestFor: "Creative directors, studios & fashion",
    cssFamily: "'Montserrat', sans-serif",
  },
  raleway: {
    label: "Raleway",
    category: "Sophisticated Light Sans",
    vibe: "Refined, Elegant & High-End",
    specimen: "Aa Executive Brand",
    bestFor: "Luxury brands, architecture & portfolio",
    cssFamily: "'Raleway', sans-serif",
  },
  nunito: {
    label: "Nunito",
    category: "Soft Rounded Sans",
    vibe: "Playful, Gentle & Welcoming",
    specimen: "Aa Soft & Welcoming",
    bestFor: "Education, lifestyle & coaching",
    cssFamily: "'Nunito', sans-serif",
  },
  "playfair-display": {
    label: "Playfair Display",
    category: "Editorial Serif",
    vibe: "Luxurious, Magazine & Prestigious",
    specimen: "Aa Luxury & Prestige",
    bestFor: "Writers, beauty, jewelry & premium goods",
    cssFamily: "'Playfair Display', Georgia, serif",
  },
  "system-ui": {
    label: "System UI",
    category: "Native Fast Stack",
    vibe: "Instantaneous, Familiar & Clean",
    specimen: "Aa Native High-Speed",
    bestFor: "Zero load time, native OS integration",
    cssFamily: "system-ui, -apple-system, sans-serif",
  },
};

export function TypographyPicker({
  selectedFont,
  onSelectFont,
  stepNumber = 2,
  defaultOpen = false,
}: TypographyPickerProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [filter, setFilter] = React.useState<"all" | "sans" | "serif">("all");

  const filteredFonts = React.useMemo(() => {
    if (filter === "all") return FONT_ALLOWLIST;
    if (filter === "serif") return FONT_ALLOWLIST.filter((f) => f === "playfair-display");
    return FONT_ALLOWLIST.filter((f) => f !== "playfair-display");
  }, [filter]);

  const activeFontLabel = FONT_METADATA[selectedFont]?.label ?? selectedFont;

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
                Typography &amp; Fonts
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-[10px] font-bold">
                <Type className="w-3 h-3 text-brand-600" />
                <span>Allowlisted Fonts</span>
              </span>
              <span className="text-[11px] text-brand-700 font-bold bg-brand-50 border border-brand-200/70 px-2 py-0.5 rounded-md">
                Active: {activeFontLabel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium line-clamp-1">
              Select typography that conveys your brand personality across headlines, body copy, and CTA buttons.
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
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-black text-foreground uppercase tracking-wider">
              Font Library ({filteredFonts.length})
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/70 text-[11px] font-bold">
              {[
                { id: "all", label: "All Fonts" },
                { id: "sans", label: "Sans-Serif" },
                { id: "serif", label: "Serif" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id as typeof filter)}
                  className={cn(
                    "px-3 py-1 rounded-lg transition-all select-none",
                    filter === cat.id
                      ? "bg-card text-foreground shadow-2xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Specimen Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredFonts.map((fontKey) => {
              const meta = FONT_METADATA[fontKey] || {
                label: fontKey,
                category: "Sans-Serif",
                vibe: "Modern Typeface",
                specimen: "Aa Brand Identity",
                bestFor: "General purpose",
                cssFamily: "sans-serif",
              };
              const isSelected = selectedFont === fontKey;

              return (
                <button
                  key={fontKey}
                  type="button"
                  onClick={() => onSelectFont(fontKey)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all text-left flex flex-col justify-between gap-3 group select-none shadow-2xs hover:shadow-md hover:-translate-y-0.5",
                    isSelected
                      ? "bg-card border-brand-500 ring-2 ring-brand-500/25 shadow-sm"
                      : "bg-card border-border/80 hover:border-brand-300/80 hover:bg-muted/20"
                  )}
                >
                  {/* Header row: Font Name + Category Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-foreground group-hover:text-brand-600 transition-colors">
                        {meta.label}
                      </h4>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {meta.category}
                      </span>
                    </div>
                    {isSelected ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-600 text-white shadow-xs flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-border/80 group-hover:border-brand-300 transition-colors" />
                    )}
                  </div>

                  {/* Large Typographic Specimen rendered in actual font family */}
                  <div
                    className="py-2.5 px-3 rounded-xl bg-muted/30 border border-border/50 text-foreground"
                    style={{ fontFamily: meta.cssFamily }}
                  >
                    <div className="text-lg font-bold truncate leading-tight">
                      {meta.specimen}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium truncate mt-0.5 opacity-80">
                      Build links that convert.
                    </div>
                  </div>

                  {/* Best For Recommendation */}
                  <div className="pt-1 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                    <span className="truncate">{meta.bestFor}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
