"use client";

import * as React from "react";
import Image from "next/image";
import { getAllTemplates } from "@/templates/registry";
import type { TemplateDefinition } from "@/templates/types";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, Sparkles, Eye } from "lucide-react";

export interface TemplateBrowserProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (template: TemplateDefinition) => void;
  onPreviewTemplate?: (template: TemplateDefinition) => void;
}

export function TemplateBrowser({
  selectedTemplateId,
  onSelectTemplate,
  onPreviewTemplate,
}: TemplateBrowserProps) {
  const templates = React.useMemo(() => getAllTemplates(), []);

  return (
    <div className="space-y-6">
      {/* Templates Grid - Inspired by Linktree Template Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const isBotanical = template.id === "botanical";
          const tag = isBotanical ? "Executive Edition" : "Classic Business";
          const previewImg = isBotanical
            ? "/botanical-preview.png"
            : "/vcard-preview.png";

          return (
            <div
              key={template.id}
              className={cn(
                "group relative flex flex-col rounded-3xl border transition-all duration-200 overflow-hidden bg-white shadow-2xs hover:shadow-card",
                isSelected
                  ? "border-2 border-slate-900 ring-2 ring-slate-900/10"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              {/* Header Badge Row */}
              <div className="p-4 pb-2 flex items-center justify-between gap-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                    {tag}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {template.category}
                  </span>
                </div>

                {isSelected && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-2xs">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Selected</span>
                  </div>
                )}
              </div>

              {/* Title & Short Description */}
              <div className="px-5 pt-3 pb-2 space-y-0.5">
                <h4 className="text-base font-bold text-slate-900 group-hover:text-black truncate">
                  {template.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {template.description}
                </p>
              </div>

              {/* Visual Card Preview Image (Mockup Display) */}
              <div className="relative mx-4 my-2 h-72 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/60 flex items-center justify-center p-3 group-hover:bg-slate-100/60 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImg}
                  alt={template.name}
                  className="w-auto h-full max-h-full max-w-full object-contain rounded-xl drop-shadow-md transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* Hover Preview Overlay */}
                {onPreviewTemplate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewTemplate(template);
                    }}
                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs cursor-pointer"
                  >
                    <div className="px-3.5 py-2 rounded-full bg-white/90 text-slate-900 font-bold shadow-lg flex items-center gap-1.5 hover:bg-white transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Preview</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Footer CTA: Use Template button (Linktree style) */}
              <div className="p-4 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={() => onSelectTemplate(template)}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs",
                    isSelected
                      ? "bg-slate-900 text-white hover:bg-black"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <span>{isSelected ? "Template Selected" : "Use Template"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
