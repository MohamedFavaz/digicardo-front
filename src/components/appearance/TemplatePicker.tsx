"use client";

import * as React from "react";
import { LayoutTemplate, Sparkles, Check, ArrowRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateDefinition } from "@/templates/types";
import { cn } from "@/lib/utils";

export interface TemplatePickerProps {
  templates?: TemplateDefinition[];
  selectedTemplateId?: string;
  canUseAdvancedTemplates?: boolean;
  onSelectTemplate?: (templateId: string) => void;
  onOpenUpgradeModal?: () => void;
}

export function TemplatePicker({
  selectedTemplateId = "vcard",
  onSelectTemplate,
}: TemplatePickerProps) {
  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-border/80 bg-card p-4 sm:p-6 shadow-card space-y-4 select-none">
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
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold shadow-2xs">
                <Check className="w-2.5 h-2.5" />
                <span>Active</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Click template to customize theme tokens, colors, and styling in Appearance.
            </p>
          </div>
        </div>

        {/* Direct Action Button to Appearance */}
        <Button
          type="button"
          size="sm"
          onClick={() => onSelectTemplate?.(selectedTemplateId || "vcard")}
          className="w-full sm:w-auto h-8 px-3 rounded-xl text-xs font-extrabold bg-brand-600 hover:bg-brand-700 text-white gap-1.5 shadow-cta flex-shrink-0 active:scale-95 justify-center"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Customize Styles</span>
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Interactive Template Preview Card */}
      <div
        onClick={() => onSelectTemplate?.("vcard")}
        className="relative w-full flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-muted/30 to-muted/10 border border-border/70 p-4 cursor-pointer group transition-all duration-300 hover:border-brand-500/60 hover:shadow-soft"
        title="Click to open this template in the Appearance Editor"
      >
        {/* Hover Action Badge Overlay */}
        <div className="absolute top-3 right-3 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card/90 dark:bg-card/80 backdrop-blur-md border border-border/80 text-brand-600 dark:text-brand-400 text-xs font-black shadow-xs group-hover:border-brand-500 group-hover:scale-105 transition-all">
            <Sparkles className="w-3 h-3" />
            <span>Open Appearance Editor →</span>
          </span>
        </div>

        <img
          src="/vcard-preview.png"
          alt="VCard Business Template Preview"
          className="w-full max-w-sm max-h-[500px] object-contain rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-[1.01]"
          loading="eager"
        />

        <div className="w-full pt-3 flex items-center justify-between text-xs text-muted-foreground font-medium border-t border-border/50 mt-3">
          <span className="font-bold text-foreground">VCard Business Template</span>
          <span className="text-[11px] text-brand-600 font-extrabold flex items-center gap-1 group-hover:underline">
            <span>Click to configure colors &amp; fonts</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
