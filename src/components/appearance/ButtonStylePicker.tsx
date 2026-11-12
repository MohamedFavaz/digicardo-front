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
  selectedStyle = "solid",
  selectedAnimation = "none",
  onChangeRadius,
  onChangeStyle,
  onChangeAnimation,
  stepNumber = 3,
  defaultOpen = false,
}: ButtonStylePickerProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const STYLE_OPTIONS: { id: ButtonStyle; label: string; desc: string }[] = [
    { id: "solid", label: "Solid Fill", desc: "Classic high-contrast background fill" },
    { id: "outline", label: "Outline", desc: "Transparent with crisp defined border" },
    { id: "soft", label: "Soft Tint", desc: "Subtle muted background with soft hover" },
    { id: "ghost", label: "Ghost", desc: "Minimal borderless appearance" },
    { id: "glass", label: "Glassmorphism", desc: "Translucent backdrop blur finish" },
  ];

  const ANIMATION_OPTIONS: { id: AnimationType; label: string; desc: string }[] = [
    { id: "none", label: "None", desc: "Static clean response" },
    { id: "fade", label: "Fade", desc: "Smooth opacity transition" },
    { id: "slide", label: "Slide", desc: "Dynamic subtle slide on hover" },
    { id: "scale", label: "Scale", desc: "Tactile micro-zoom on hover" },
  ];

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
                Button Shapes &amp; Animation
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/60 text-slate-700 text-[10px] font-semibold">
                <MousePointerClick className="w-3 h-3 text-slate-500" />
                <span>Interactive</span>
              </span>
              <span className="text-[11px] text-slate-700 font-semibold bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-full capitalize">
                Radius: {selectedRadius}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              Fine-tune the geometry, fill treatments, and motion feel for all profile links and action buttons.
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
          {/* 1. Corner Roundness */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Corner Roundness
              </label>
              <span className="text-[11px] text-slate-500 font-semibold capitalize">
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
                      "p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-2.5 select-none shadow-2xs group hover:-translate-y-0.5 cursor-pointer",
                      isSelected
                        ? "bg-white border-2 border-slate-900 shadow-xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    {/* Live Button Shape Mock */}
                    <div
                      className={cn(
                        "w-full h-8 bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center transition-all shadow-2xs group-hover:bg-black",
                        opt.radiusPx
                      )}
                    >
                      <span>Link</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <Check className="w-3 h-3 text-slate-900 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium leading-tight">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Button Fill Style */}
          {onChangeStyle && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Button Fill Style
                </label>
                <span className="text-[11px] text-slate-500 font-semibold capitalize">
                  Active: {selectedStyle}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {STYLE_OPTIONS.map((opt) => {
                  const isSelected = selectedStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangeStyle(opt.id)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2.5 select-none shadow-2xs group hover:-translate-y-0.5 cursor-pointer",
                        isSelected
                          ? "bg-white border-2 border-slate-900 shadow-xs"
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-full h-8 text-[11px] font-bold flex items-center justify-center rounded-xl transition-all",
                          opt.id === "solid" && "bg-slate-900 text-white",
                          opt.id === "outline" && "bg-transparent text-slate-900 border-2 border-slate-900",
                          opt.id === "soft" && "bg-slate-100 text-slate-900",
                          opt.id === "ghost" && "bg-transparent text-slate-700 hover:bg-slate-50",
                          opt.id === "glass" && "bg-slate-900/10 backdrop-blur-xs text-slate-900 border border-slate-300"
                        )}
                      >
                        <span>Button</span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            {opt.label}
                          </span>
                          {isSelected && (
                            <Check className="w-3 h-3 text-slate-900 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Button Motion & Hover Animation */}
          {onChangeAnimation && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Button Animation Feel
                </label>
                <span className="text-[11px] text-slate-500 font-semibold capitalize">
                  Active: {selectedAnimation}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ANIMATION_OPTIONS.map((opt) => {
                  const isSelected = selectedAnimation === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangeAnimation(opt.id)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-2.5 select-none shadow-2xs group hover:-translate-y-0.5 cursor-pointer",
                        isSelected
                          ? "bg-white border-2 border-slate-900 shadow-xs"
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-full h-8 bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center rounded-lg transition-transform",
                          opt.id === "slide" && "group-hover:translate-x-1",
                          opt.id === "scale" && "group-hover:scale-105",
                          opt.id === "fade" && "group-hover:opacity-75"
                        )}
                      >
                        <span>Hover Me</span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs font-bold text-slate-900">
                            {opt.label}
                          </span>
                          {isSelected && (
                            <Check className="w-3 h-3 text-slate-900 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
