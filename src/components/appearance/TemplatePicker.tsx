"use client";

import * as React from "react";
import { LayoutTemplate, Sparkles, Check, ArrowRight, Palette, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateDefinition } from "@/templates/types";
import { getAllTemplates } from "@/templates/registry";
import { cn } from "@/lib/utils";

export interface TemplatePickerProps {
  templates?: TemplateDefinition[];
  selectedTemplateId?: string;
  canUseAdvancedTemplates?: boolean;
  onSelectTemplate?: (templateId: string) => void;
  onOpenUpgradeModal?: () => void;
}

export function TemplatePicker({
  templates,
  selectedTemplateId = "vcard",
  onSelectTemplate,
}: TemplatePickerProps) {
  const allTemplates = React.useMemo(() => {
    return templates && templates.length > 0 ? templates : getAllTemplates();
  }, [templates]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs flex-shrink-0">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Card Template
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Choose an executive layout for your digital card.
            </p>
          </div>
        </div>

        {/* Active Template Status Pill */}
        <button
          type="button"
          onClick={() => onSelectTemplate?.(selectedTemplateId)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-2xs group"
          title="Click to customize this template in Appearance"
        >
          <Palette className="w-3.5 h-3.5 text-slate-600 group-hover:rotate-12 transition-transform" />
          <span>Active: {allTemplates.find((t) => t.id === selectedTemplateId)?.name || "VCard Business"}</span>
          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid of Templates - Advanced Showcase View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {allTemplates.map((template) => {
          const isActive = selectedTemplateId === template.id;
          const isBotanical = template.id === "botanical";
          const tag = isBotanical ? "Executive Edition" : "Classic Business";
          const subtitle = isBotanical
            ? "Corporate layout with luxury architectural styling"
            : "Compact digital card with contact buttons & WhatsApp";

          const features = isBotanical
            ? ["Executive Branding", "10 Texture Themes", "Contact Modals"]
            : ["3-Column Grid", "WhatsApp Sharing", "Bank & QR Actions"];

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate?.(template.id)}
              className={cn(
                "group relative flex flex-col rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden",
                isActive
                  ? "bg-white border-2 border-slate-900 shadow-md ring-1 ring-slate-900/10"
                  : "bg-white hover:border-slate-300 border-slate-200/80 shadow-2xs hover:shadow-sm"
              )}
            >
              {/* Card Header */}
              <div className="p-5 pb-2 flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                      {tag}
                    </span>
                    {isBotanical && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Corporate
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-black transition-colors truncate">
                    {template.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                    {subtitle}
                  </p>
                </div>

                {/* Status Pill */}
                {isActive ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-xs flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-800 transition-colors flex-shrink-0 px-2 py-1">
                    Select
                  </span>
                )}
              </div>

              {/* Showcase Stage (Seamless, elevated device showcase — no harsh square box) */}
              <div className="relative w-full h-[360px] sm:h-[400px] px-4 py-3 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50/90 via-slate-50/30 to-white">
                {/* Soft ambient background glow */}
                <div
                  className={cn(
                    "absolute w-60 h-60 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-500",
                    isBotanical
                      ? "bg-amber-300/40 group-hover:opacity-70 group-hover:scale-110"
                      : "bg-emerald-300/40 group-hover:opacity-70 group-hover:scale-110"
                  )}
                />

                {/* Floating Device Mockup with 3D elevation */}
                <div className="relative z-10 h-full w-full flex items-center justify-center transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]">
                  <img
                    src={
                      isBotanical
                        ? "/botanical-preview.png"
                        : "/vcard-preview.png"
                    }
                    alt={template.name}
                    className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_16px_28px_rgba(15,23,42,0.12)] group-hover:drop-shadow-[0_24px_36px_rgba(15,23,42,0.2)] transition-all duration-300 rounded-2xl"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Feature Tags */}
              <div className="px-5 pt-3 pb-2 flex flex-wrap items-center gap-1.5 border-t border-slate-100">
                {features.map((f, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/60"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Action CTA Button */}
              <div className="p-5 pt-2">
                <button
                  type="button"
                  className={cn(
                    "w-full h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98",
                    isActive
                      ? "bg-slate-900 hover:bg-black text-white"
                      : "bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 hover:border-slate-900"
                  )}
                >
                  {isActive ? (
                    <>
                      <Palette className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Customize Appearance</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Select This Layout</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
