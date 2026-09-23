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
    <div className="rounded-[28px] sm:rounded-[32px] border border-border/80 bg-card p-4 sm:p-6 shadow-card space-y-5 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 flex items-center justify-center shadow-2xs flex-shrink-0">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-foreground">
                Page Layout Template
              </h3>
              <span className="text-[11px] font-bold text-muted-foreground">
                ({allTemplates.length} Available)
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Choose a layout. Clicking any template directly opens its Appearance customization studio.
            </p>
          </div>
        </div>

        {/* Active Template Status Button / Pill */}
        <button
          type="button"
          onClick={() => onSelectTemplate?.(selectedTemplateId)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900/40 border border-brand-200 dark:border-brand-800 text-xs font-bold text-brand-700 dark:text-brand-300 transition-all cursor-pointer shadow-2xs group max-w-full"
          title="Click to customize this template in Appearance"
        >
          <Palette className="w-3.5 h-3.5 text-brand-600 group-hover:rotate-12 transition-transform flex-shrink-0" />
          <span className="truncate">Active: {allTemplates.find((t) => t.id === selectedTemplateId)?.name || "Botanical Corporate"}</span>
          <ArrowRight className="w-3 h-3 text-brand-600 group-hover:translate-x-0.5 transition-transform ml-0.5 flex-shrink-0" />
        </button>
      </div>

      {/* Grid of Templates - Responsive 1-col on mobile, 2-col on tablet, 1-col on laptop lg (due to 7-col layout), 2-col on xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
        {allTemplates.map((template) => {
          const isActive = selectedTemplateId === template.id;

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate?.(template.id)}
              className={cn(
                "group relative flex flex-col rounded-2xl border p-3.5 sm:p-4 cursor-pointer transition-all duration-300",
                isActive
                  ? "bg-brand-50/40 dark:bg-brand-950/20 border-brand-500 shadow-md ring-2 ring-brand-500/20"
                  : "bg-muted/20 hover:bg-muted/40 border-border/70 hover:border-brand-300 shadow-xs"
              )}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-xs">
                    <Check className="w-2.5 h-2.5" />
                    <span>Active</span>
                  </span>
                </div>
              )}

              {/* Category Pill */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5 pr-20">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-foreground/5 text-foreground/70 border border-border/60">
                  {template.category}
                </span>
                {template.id === "botanical" && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>New Executive Card</span>
                  </span>
                )}
              </div>

              {/* Template Thumbnail / Visual Representation - Fully Fluid, Responsive & Perfectly Fitted */}
              <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-64 xl:h-72 rounded-xl sm:rounded-2xl overflow-hidden mb-3 border border-border/60 bg-gradient-to-b from-slate-100/90 via-slate-50/60 to-slate-200/80 dark:from-slate-900/80 dark:via-slate-900/40 dark:to-slate-950/90 flex items-center justify-center p-2.5 sm:p-3 group-hover:scale-[1.01] transition-all">
                <img
                  src={
                    template.id === "botanical"
                      ? "/botanical-preview.png"
                      : template.id === "vcard"
                      ? "/vcard-preview.png"
                      : template.preview || "/vcard-preview.png"
                  }
                  alt={`${template.name} Preview`}
                  className="w-auto h-full max-h-full max-w-full object-contain rounded-lg sm:rounded-xl drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Hover overlay hint (shown on hover on sm+) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center rounded-xl sm:rounded-2xl backdrop-blur-[1px]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-brand-900 font-extrabold text-xs shadow-md">
                    <Palette className="w-3.5 h-3.5 text-brand-600" />
                    <span>{isActive ? "Customize in Appearance" : "Select & Customize in Appearance"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-black text-foreground group-hover:text-brand-600 transition-colors">
                  {template.name}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Footer Capability Chips & Action CTA */}
              <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 font-bold">
                  <Layers className="w-3 h-3 text-brand-600" />
                  <span>{template.supportedSections?.length || 6} Capabilities</span>
                </span>
                <span className="font-extrabold text-brand-600 flex items-center gap-1 group-hover:underline">
                  <Palette className="w-3 h-3" />
                  <span>{isActive ? "Customize Appearance" : "Select & Customize"}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
