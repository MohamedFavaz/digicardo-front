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
    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs transition-all">
      {/* ── Collapsible Header Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors select-none group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/60 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
            {stepNumber}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-slate-900 tracking-tight group-hover:text-black transition-colors">
                Typography &amp; Fonts
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/60 text-slate-700 text-[10px] font-semibold">
                <Type className="w-3 h-3 text-slate-500" />
                <span>Allowlisted Fonts</span>
              </span>
              <span className="text-[11px] text-slate-700 font-semibold bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
                Active: {activeFontLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              Select typography that conveys your brand personality across headlines, body copy, and CTA buttons.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className="hidden sm:inline text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
            {isOpen ? "Collapse" : "Customize"}
          </span>
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-slate-900 transition-all">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* ── Collapsible Content Body ── */}
      {isOpen && (
        <div className="p-6 sm:p-7 pt-4 space-y-6 border-t border-slate-100 animate-in fade-in duration-200">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Font Library ({filteredFonts.length})
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-[11px] font-semibold">
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
                    "px-3 py-1 rounded-lg transition-all select-none cursor-pointer",
                    filter === cat.id
                      ? "bg-slate-900 text-white shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
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
                    "p-4 rounded-2xl border transition-all text-left flex flex-col justify-between gap-3 group select-none shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
                    isSelected
                      ? "bg-white border-2 border-slate-900 shadow-xs"
                      : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
                  )}
                >
                  {/* Header row: Font Name + Category Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-black transition-colors">
                        {meta.label}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {meta.category}
                      </span>
                    </div>
                    {isSelected ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white shadow-xs flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-slate-400 transition-colors" />
                    )}
                  </div>

                  {/* Large Typographic Specimen rendered in actual font family */}
                  <div
                    className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-900"
                    style={{ fontFamily: meta.cssFamily }}
                  >
                    <div className="text-lg font-bold truncate leading-tight">
                      {meta.specimen}
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate mt-0.5 opacity-90">
                      Build links that convert.
                    </div>
                  </div>

                  {/* Best For Recommendation */}
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
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
