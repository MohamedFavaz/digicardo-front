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
 * Automatically computes scale so that ALL contents of the template
 * (cover, avatar, name, badges, buttons, actions) fit 100% completely inside
 * the preview box without any bottom clipping or scrolling.
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
  const [scale, setScale] = React.useState<number>(0.66);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width > 0 && height > 0) {
        // Virtual mobile viewport width: 360px
        const scaleW = width / 360;
        // Virtual height of the compact template is ~440px
        const scaleH = (height - 8) / 440;
        // Fit both width and height so all content is completely visible without any cutoff
        setScale(Math.min(scaleW, scaleH));
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
      className="compact-preview-card relative w-full h-[325px] sm:h-[350px] rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs group-hover:border-slate-300 transition-colors flex items-center justify-center select-none"
    >
      {/* Scoped CSS rules: compacts spacing and hides overflowing secondary text so all key contents fit 100% */}
      <style>{`
        .compact-preview-card .in-phone-frame {
          padding: 0 !important;
          min-height: auto !important;
        }

        /* Prevent desktop 440px constraint from overflowing virtual 360px canvas */
        .compact-preview-card .max-w-\\[440px\\],
        .compact-preview-card [class*="max-w-[440px]"],
        .compact-preview-card .botanical-page-wrapper,
        .compact-preview-card .card-canvas {
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* ── Compact Cover & Banner ── */
        .compact-preview-card [class*="h-48"],
        .compact-preview-card [class*="h-52"],
        .compact-preview-card [class*="sm:h-52"],
        .compact-preview-card .botanical-cover,
        .compact-preview-card .botanical-banner {
          height: 58px !important;
          min-height: 58px !important;
          max-height: 58px !important;
        }

        /* ── Compact Circular Avatar ── */
        .compact-preview-card [class*="-mt-14"],
        .compact-preview-card [class*="-mt-16"] {
          margin-top: -20px !important;
        }
        .compact-preview-card [class*="w-24"],
        .compact-preview-card [class*="w-28"],
        .compact-preview-card [class*="h-24"],
        .compact-preview-card [class*="h-28"] {
          width: 44px !important;
          height: 44px !important;
          border-width: 2px !important;
        }
        .compact-preview-card [class*="w-24"] svg,
        .compact-preview-card [class*="w-28"] svg {
          width: 18px !important;
          height: 18px !important;
        }
        .compact-preview-card .avatar-wrapper {
          width: 46px !important;
          height: 46px !important;
          margin-top: 2px !important;
          margin-bottom: 3px !important;
        }
        .compact-preview-card .status-dot {
          width: 9px !important;
          height: 9px !important;
          border-width: 1.5px !important;
        }

        /* ── Compact Typography & Headers ── */
        .compact-preview-card h1,
        .compact-preview-card .profile-name,
        .compact-preview-card [class*="text-xl"],
        .compact-preview-card [class*="text-[22px]"] {
          font-size: 11.5px !important;
          line-height: 1.15 !important;
          margin: 0 !important;
        }
        .compact-preview-card [class*="text-xs"],
        .compact-preview-card [class*="text-[11px]"] {
          font-size: 8px !important;
          line-height: 1.1 !important;
        }
        .compact-preview-card .profile-hero {
          margin-bottom: 3px !important;
        }

        /* ── Botanical Preview Optimizations: Hide redundant subtitle in preview to fit buttons ── */
        .compact-preview-card .profile-company,
        .compact-preview-card .profile-tagline {
          display: none !important;
        }
        .compact-preview-card .profile-badges {
          margin-top: 2px !important;
          margin-bottom: 2px !important;
        }
        .compact-preview-card .card-canvas {
          padding: 4px 6px !important;
        }
        .compact-preview-card .card-action-bar,
        .compact-preview-card .contact-grid {
          margin-top: 3px !important;
          gap: 2px !important;
        }
        .compact-preview-card .card-booking,
        .compact-preview-card .card-action-btn,
        .compact-preview-card .btn-share-top {
          padding: 3px 6px !important;
          font-size: 8px !important;
        }

        /* ── Tight Spacing ── */
        .compact-preview-card .px-5 {
          padding-left: 8px !important;
          padding-right: 8px !important;
        }
        .compact-preview-card [class*="space-y-2"],
        .compact-preview-card [class*="space-y-2.5"],
        .compact-preview-card [class*="space-y-3"] {
          margin-top: 2px !important;
        }
        .compact-preview-card [class*="space-y-2"] > :not([hidden]) ~ :not([hidden]),
        .compact-preview-card [class*="space-y-2.5"] > :not([hidden]) ~ :not([hidden]),
        .compact-preview-card [class*="space-y-3"] > :not([hidden]) ~ :not([hidden]) {
          margin-top: 2px !important;
        }
        .compact-preview-card [class*="pb-8"],
        .compact-preview-card [class*="pb-6"],
        .compact-preview-card [class*="pb-4"] {
          padding-bottom: 2px !important;
        }

        /* ── Compact CTA Buttons ── */
        .compact-preview-card [class*="py-3"],
        .compact-preview-card [class*="py-2.5"],
        .compact-preview-card [class*="py-2"] {
          padding-top: 2.5px !important;
          padding-bottom: 2.5px !important;
        }
        .compact-preview-card button[class*="rounded-"] {
          padding: 2.5px 6px !important;
          font-size: 8px !important;
        }

        /* ── Compact Quick Action Grid: Clean 4 complete rows, hide cut-off 5th row ── */
        .compact-preview-card .grid-cols-4,
        .compact-preview-card [class*="grid-cols-4"] {
          gap: 2px !important;
          margin-top: 2.5px !important;
        }
        .compact-preview-card .grid-cols-4 button {
          padding: 1px !important;
          gap: 1px !important;
        }
        .compact-preview-card .grid-cols-4 button:nth-child(n+17) {
          display: none !important;
        }
        .compact-preview-card .grid-cols-4 [class*="w-11"],
        .compact-preview-card .grid-cols-4 [class*="w-12"],
        .compact-preview-card .grid-cols-4 [class*="h-11"],
        .compact-preview-card .grid-cols-4 [class*="h-12"],
        .compact-preview-card .card-icon-box {
          width: 23px !important;
          height: 23px !important;
        }
        .compact-preview-card .grid-cols-4 svg,
        .compact-preview-card .card-icon-box svg {
          width: 11px !important;
          height: 11px !important;
        }
        .compact-preview-card .grid-cols-4 span {
          font-size: 7px !important;
          line-height: 1 !important;
        }
      `}</style>

      {/* Virtual 360px mobile viewport: scales proportionally to fit completely inside the box */}
      <div
        className="in-phone-frame pointer-events-none flex-shrink-0"
        style={{
          width: "360px",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
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

              {/* Real Live Template Card Preview - Fully Fitted Without Cutoff */}
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
