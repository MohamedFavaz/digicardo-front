"use client";

import * as React from "react";
import { MousePointerClick, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { ButtonRadius, ButtonStyle, AnimationType } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface ButtonStylePickerProps {
  selectedRadius: ButtonRadius;
  selectedStyle?: ButtonStyle;
  selectedAnimation?: AnimationType;
  onChangeRadius: (radius: ButtonRadius) => void;
  onChangeStyle?: (style: ButtonStyle) => void;
  onChangeAnimation?: (anim: AnimationType) => void;
  stepNumber?: number;
  defaultOpen?: boolean;
}

const RADIUS_OPTIONS: { id: ButtonRadius; label: string; radiusPx: string; desc: string }[] = [
  { id: "none", label: "Sharp", radiusPx: "rounded-none", desc: "0px · Brutalist & Architectural" },
  { id: "small", label: "Subtle", radiusPx: "rounded-md", desc: "6px · Clean & Structured" },
  { id: "medium", label: "Medium", radiusPx: "rounded-xl", desc: "12px · Balanced Modern" },
  { id: "large", label: "Smooth", radiusPx: "rounded-2xl", desc: "16px · Soft & Friendly" },
  { id: "pill", label: "Pill", radiusPx: "rounded-full", desc: "9999px · Iconic Stadium Pill" },
];

export function ButtonStylePicker({
  selectedRadius,
  onChangeRadius,
  stepNumber = 3,
  defaultOpen = false,
}: ButtonStylePickerProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

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
                Button Shapes &amp; Animation
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-[10px] font-bold">
                <MousePointerClick className="w-3 h-3 text-brand-600" />
                <span>Interactive</span>
              </span>
              <span className="text-[11px] text-brand-700 font-bold bg-brand-50 border border-brand-200/70 px-2 py-0.5 rounded-md capitalize">
                Active: {selectedRadius}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium line-clamp-1">
              Fine-tune the geometry, fill treatments, and motion feel for all profile links and action buttons.
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
          {/* Corner Roundness */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-foreground uppercase tracking-wider">
                1. Corner Roundness
              </label>
              <span className="text-[11px] text-muted-foreground font-semibold capitalize">
                Active: {selectedRadius}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {RADIUS_OPTIONS.map((opt) => {
                const isSelected = selectedRadius === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeRadius(opt.id)}
                    className={cn(
                      "p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-2.5 select-none shadow-2xs group hover:-translate-y-0.5",
                      isSelected
                        ? "bg-card border-brand-500 ring-2 ring-brand-500/25 shadow-sm"
                        : "bg-card border-border/80 hover:border-brand-300 hover:bg-muted/20"
                    )}
                  >
                    {/* Live Button Shape Mock */}
                    <div
                      className={cn(
                        "w-full h-8 bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center transition-all shadow-2xs group-hover:bg-brand-600",
                        opt.radiusPx
                      )}
                    >
                      <span>Link</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-extrabold text-foreground">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <Check className="w-3 h-3 text-brand-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[9px] text-muted-foreground font-medium leading-tight">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
