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

/**
 * Full template live preview.
 * Scales the entire card so the FULL template (from header to footer) is visible
 * inside the preview container without being oversized or cropped.
 */
function TemplateCardScreen({
  template,
  profile,
  blocks,
}: {
  template: TemplateDefinition;
  profile: Profile;
  blocks: ProfileBlock[];
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState<number>(0.37);
  const [contentHeight, setContentHeight] = React.useState<number>(880);

  React.useEffect(() => {
    const calculateFit = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container) return;

      const containerH = container.clientHeight || 350;
      const containerW = container.clientWidth || 240;

      // Measure the full rendered height of the template (or fallback to 880px)
      const measuredH = content?.scrollHeight || 880;
      const targetH = Math.max(measuredH, 750);
      setContentHeight(targetH);

      // Fit the entire card both vertically and horizontally with comfortable padding
      const scaleByH = (containerH - 20) / targetH;
      const scaleByW = (containerW - 20) / 375;

      const fullFitScale = Math.min(scaleByH, scaleByW);
      // Clamp between 0.30 and 0.55 for optimal visual fidelity
      setScale(Math.max(0.30, Math.min(fullFitScale, 0.52)));
    };

    calculateFit();
    const timer = setTimeout(calculateFit, 150);

    const observer = new ResizeObserver(calculateFit);
    if (containerRef.current) observer.observe(containerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [blocks, profile]);

  const scaledW = Math.round(375 * scale);
  const scaledH = Math.round(contentHeight * scale);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[330px] sm:h-[360px] rounded-xl overflow-hidden bg-slate-50/80 border border-slate-200/80 shadow-2xs group-hover:border-slate-300 transition-colors flex items-center justify-center p-2 select-none"
    >
      {/* Scaled card wrapper: exact layout footprint so it centers perfectly */}
      <div
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`,
        }}
        className="relative flex-shrink-0 rounded-[18px] overflow-hidden shadow-md border border-slate-200/70 bg-white"
      >
        {/* Full live template rendered at 375px virtual width, scaled down to fit */}
        <div
          ref={contentRef}
          className="in-phone-frame pointer-events-none"
          style={{
            width: "375px",
            minHeight: `${contentHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <ProfileRenderer
            profile={profile}
            blocks={blocks}
            templateId={template.id}
            themeTokens={template.default_theme}
          />
        </div>
      </div>
    </div>
  );
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

      {/* Grid of Templates - Full Template Visible, Not Oversized */}
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

              {/* Real Live Template Card Preview - Full Template Fit */}
              <TemplateCardScreen
                template={template}
                profile={effectiveProfile}
                blocks={blocks}
              />

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
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
