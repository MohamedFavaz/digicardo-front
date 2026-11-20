import React from "react";
import type { Profile, PublicProfile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock, PublicProfileBlock } from "@/types/blocks";
import { getTemplate } from "@/templates/registry";
import type { TemplateRenderMode } from "@/templates/types";
import { getThemeVariables } from "@/lib/theme/applyTheme";
import { ProfileViewTracker } from "@/components/analytics/ProfileViewTracker";
import { AgentBranding, CardBranding } from "@/templates/shared/CardChrome";
import { ReportProfileModal } from "./ReportProfileModal";

export interface ProfileRendererProps {
  profile: (Profile | PublicProfile) & { show_branding?: boolean };
  blocks: (ProfileBlock | PublicProfileBlock)[];
  templateId?: string | null;
  themeTokens?: Partial<ThemeTokens> | null;
  /** Defaults to "public". Dashboard previews must pass "preview" (no analytics). */
  mode?: TemplateRenderMode;
}

/**
 * CONTENT + BLOCKS + TEMPLATE + THEME = RENDERED PROFILE.
 * The template draws its own background; this adds view tracking and the footer links.
 */
export function ProfileRenderer({
  profile,
  blocks,
  templateId,
  themeTokens,
  mode = "public",
}: ProfileRendererProps) {
  const isPreview = mode === "preview";
  const templateDef = getTemplate(templateId || profile.template_id || "vcard");

  const mergedTokens: ThemeTokens = {
    ...templateDef.default_theme,
    ...(themeTokens ?? {}),
    custom_options: {
      ...(templateDef.default_theme.custom_options || {}),
      ...(themeTokens?.custom_options ?? {}),
    },
  };

  // --lf-* variables are still read by the extra blocks (BlockRenderer).
  const cssVariables = getThemeVariables(mergedTokens, templateDef.default_theme);
  const TemplateComponent = templateDef.Component;
  const showBranding = profile.show_branding !== false;

  const footer = (
    <>
      {"agent_brand" in profile && profile.agent_brand ? (
        <AgentBranding name={profile.agent_brand.name} url={profile.agent_brand.url} />
      ) : (
        showBranding && <CardBranding />
      )}
      {!isPreview && profile.username && <ReportProfileModal username={profile.username} />}
    </>
  );

  return (
    <div style={cssVariables} className={`flex w-full flex-col ${isPreview ? "" : "min-h-screen"}`}>
      {!isPreview && profile.id && <ProfileViewTracker profileId={profile.id} />}
      <TemplateComponent profile={profile} blocks={blocks} theme={mergedTokens} mode={mode} footer={footer} />
    </div>
  );
}
