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
 * Compact template preview card.
 * Fits 100% of the box width and height cleanly without horizontal slicing,
 * skinny margins, or scrolling.
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
  const [scale, setScale] = React.useState<number>(0.65);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        // Virtual mobile viewport is 360px
        // Scaling by width / 360 ensures the card fills 100% of the container width
        setScale(width / 360);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="compact-preview-card relative w-full h-[300px] sm:h-[325px] rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs group-hover:border-slate-300 transition-colors select-none"
    >
      {/* Scoped CSS rules to ensure 100% width fit and compact vertical spacing */}
      <style>{`
        .compact-preview-card .in-phone-frame {
          padding: 0 !important;
          min-height: auto !important;
        }

        /* Prevent 440px desktop max-width from clipping or overflowing on the 360px virtual viewport */
        .compact-preview-card .max-w-\\[440px\\],
        .compact-preview-card .botanical-page-wrapper,
        .compact-preview-card .card-canvas {
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* ── VCard Template Compact Layout Rules ── */
        .compact-preview-card .h-48,
        .compact-preview-card .sm\\:h-52 {
          height: 88px !important;
        }
        .compact-preview-card .-mt-14,
        .compact-preview-card .-mt-16 {
          margin-top: -24px !important;
        }
        .compact-preview-card .w-24,
        .compact-preview-card .w-28,
        .compact-preview-card .h-24,
        .compact-preview-card .h-28 {
          width: 52px !important;
          height: 52px !important;
        }
        .compact-preview-card .text-xl,
        .compact-preview-card .sm\\:text-\\[22px\\] {
          font-size: 13px !important;
          line-height: 1.15 !important;
        }
        .compact-preview-card .text-xs,
        .compact-preview-card .text-\\[11px\\] {
          font-size: 9px !important;
          line-height: 1.15 !important;
        }
        .compact-preview-card .px-5 {
          padding-left: 8px !important;
          padding-right: 8px !important;
        }
        .compact-preview-card .space-y-2\\.5 > :not([hidden]) ~ :not([hidden]),
        .compact-preview-card .space-y-2 > :not([hidden]) ~ :not([hidden]),
        .compact-preview-card .space-y-3 > :not([hidden]) ~ :not([hidden]) {
          margin-top: 2.5px !important;
        }
        .compact-preview-card .py-3,
        .compact-preview-card .py-2\\.5,
        .compact-preview-card .py-2 {
          padding-top: 3.5px !important;
          padding-bottom: 3.5px !important;
        }
        .compact-preview-card .pb-8 {
          padding-bottom: 2px !important;
        }
        .compact-preview-card .grid-cols-4 {
          gap: 2px !important;
        }
        .compact-preview-card .grid-cols-4 button {
          padding: 2px !important;
          gap: 1.5px !important;
        }
        .compact-preview-card .grid-cols-4 .w-11,
        .compact-preview-card .grid-cols-4 .h-11,
        .compact-preview-card .grid-cols-4 .w-12,
        .compact-preview-card .grid-cols-4 .h-12 {
          width: 27px !important;
          height: 27px !important;
        }
        .compact-preview-card .grid-cols-4 svg {
          width: 13px !important;
          height: 13px !important;
        }
        .compact-preview-card .grid-cols-4 span {
          font-size: 7.5px !important;
          line-height: 1 !important;
        }

        /* ── Botanical Template Compact Layout Rules ── */
        .compact-preview-card .botanical-cover,
        .compact-preview-card .botanical-banner {
          height: 88px !important;
        }
        .compact-preview-card .botanical-avatar-box {
          margin-top: -24px !important;
        }
        .compact-preview-card .botanical-avatar {
          width: 52px !important;
          height: 52px !important;
        }
        .compact-preview-card .card-canvas {
          padding: 4px 6px !important;
        }
        .compact-preview-card .card-action-bar,
        .compact-preview-card .botanical-action-grid {
          gap: 2px !important;
          margin-top: 3px !important;
        }
        .compact-preview-card .card-icon-box {
          width: 27px !important;
          height: 27px !important;
        }
        .compact-preview-card .card-icon-box svg {
          width: 13px !important;
          height: 13px !important;
        }
      `}</style>

      {/* Virtual 360px mobile viewport: scales to 100% width of container */}
      <div
        className="in-phone-frame pointer-events-none"
        style={{
          width: "360px",
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

      {/* Grid of Templates */}
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

              {/* Real Live Template Card Preview - 100% Width Fit */}
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
