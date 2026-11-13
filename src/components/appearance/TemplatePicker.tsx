"use client";

import * as React from "react";
import { LayoutTemplate, Check, ArrowRight, Palette } from "lucide-react";
import type { TemplateDefinition } from "@/templates/types";
import { getAllTemplates } from "@/templates/registry";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import type { Profile } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";
import { cn } from "@/lib/utils";

export interface TemplatePickerProps {
  templates?: TemplateDefinition[];
  selectedTemplateId?: string;
  canUseAdvancedTemplates?: boolean;
  onSelectTemplate?: (templateId: string) => void;
  onOpenUpgradeModal?: () => void;
  profile?: Profile | null;
  blocks?: ProfileBlock[];
}

export function TemplatePicker({
  templates,
  selectedTemplateId = "vcard",
  onSelectTemplate,
  profile,
  blocks = [],
}: TemplatePickerProps) {
  const allTemplates = React.useMemo(() => {
    return templates && templates.length > 0 ? templates : getAllTemplates();
  }, [templates]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4 select-none">
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

      {/* Grid of Templates - Real Live View Cards (No Phone Chassis, Proportional Dimensions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {allTemplates.map((template) => {
          const isActive = selectedTemplateId === template.id;
          const isBotanical = template.id === "botanical";
          const tag = isBotanical ? "Executive Edition" : "Classic Business";
          const subtitle = isBotanical
            ? "Corporate layout with luxury architectural styling"
            : "Compact digital card with contact buttons & WhatsApp";

          const baseProfile: Profile = profile || {
            id: "demo",
            user_id: "demo",
            username: "demo",
            display_name: "Your Name",
            bio: "Digital Business Card",
            avatar_url: null,
            cover_url: null,
            template_id: template.id,
            theme_tokens: template.default_theme,
            is_public: true,
            seo_title: null,
            seo_description: null,
            version: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const effectiveProfile: Profile = {
            ...baseProfile,
            template_id: template.id,
            theme_tokens: {
              ...template.default_theme,
              ...(profile?.theme_tokens?.custom_options
                ? { custom_options: profile.theme_tokens.custom_options }
                : {}),
            },
          };

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate?.(template.id)}
              className={cn(
                "group relative flex flex-col rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-4",
                isActive
                  ? "bg-slate-50/40 border-2 border-slate-900 shadow-sm"
                  : "bg-white hover:border-slate-300 border-slate-200/80 shadow-2xs hover:bg-slate-50/20"
              )}
            >
              {/* Card Header */}
              <div className="pb-3 flex items-start justify-between gap-2">
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
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-black transition-colors truncate">
                    {template.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                    {subtitle}
                  </p>
                </div>

                {/* Status Indicator */}
                {isActive ? (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-2xs flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Active</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-800 transition-colors flex-shrink-0 px-2 py-1">
                    Select
                  </span>
                )}
              </div>

              {/* Real Live Template Card Preview - Clean, Borderless & No Mobile Frame */}
              <div className="relative w-full h-[270px] sm:h-[300px] rounded-xl overflow-hidden bg-slate-50 border border-slate-200/70 shadow-2xs flex justify-center group-hover:border-slate-300 transition-colors">
                <div className="w-[375px] h-[580px] origin-top scale-[0.46] sm:scale-[0.51] pointer-events-none select-none overflow-hidden">
                  <ProfileRenderer
                    profile={effectiveProfile}
                    blocks={blocks}
                    templateId={template.id}
                    themeTokens={template.default_theme}
                  />
                </div>
                {/* Subtle soft gradient fade at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/90 via-white/40 to-transparent pointer-events-none" />
              </div>

              {/* Action Button */}
              <div className="pt-3 flex items-center justify-between text-xs">
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
