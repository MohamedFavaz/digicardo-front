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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs flex-shrink-0">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Card Template
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Select a design layout for your profile.
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

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allTemplates.map((template) => {
          const isActive = selectedTemplateId === template.id;

          const simpleSubtitle =
            template.id === "botanical"
              ? "Executive corporate layout with luxury backgrounds & clean branding"
              : "Digital business card with action buttons, WhatsApp & quick modals";

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate?.(template.id)}
              className={cn(
                "group relative flex flex-col rounded-2xl border p-4 cursor-pointer transition-all duration-200",
                isActive
                  ? "bg-slate-50/50 border-2 border-slate-900 shadow-xs"
                  : "bg-white hover:border-slate-300 border-slate-200/80 shadow-2xs hover:bg-slate-50/30"
              )}
            >
              {/* Header with Title & Active Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {template.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {simpleSubtitle}
                  </p>
                </div>

                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-2xs flex-shrink-0">
                    <Check className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors flex-shrink-0">
                    Select
                  </span>
                )}
              </div>

              {/* Template Thumbnail */}
              <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden mb-3 border border-slate-200/70 bg-slate-100/60 flex items-center justify-center p-2.5">
                <img
                  src={
                    template.id === "botanical"
                      ? "/botanical-preview.png"
                      : template.id === "vcard"
                        ? "/vcard-preview.png"
                        : template.preview || "/vcard-preview.png"
                  }
                  alt={template.name}
                  className="w-auto h-full max-h-full max-w-full object-contain rounded-lg drop-shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-500">
                  {isActive ? "Currently in use" : "Click to activate"}
                </span>

                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-bold",
                    isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                  )}
                >
                  <span>{isActive ? "Customize Details" : "Select Layout"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
