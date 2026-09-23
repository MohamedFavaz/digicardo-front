import React from "react";
import type { Profile, PublicProfile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock, PublicProfileBlock } from "@/types/blocks";
import { getTemplate } from "@/templates/registry";
import { getThemeVariables } from "@/lib/theme/applyTheme";
import { ProfileViewTracker } from "@/components/analytics/ProfileViewTracker";
import { DigicardoBadge } from "./DigicardoBadge";
import { ReportProfileModal } from "./ReportProfileModal";

export interface ProfileRendererProps {
  profile: (Profile | PublicProfile) & { show_branding?: boolean };
  blocks: (ProfileBlock | PublicProfileBlock)[];
  templateId?: string | null;
  themeTokens?: Partial<ThemeTokens> | null;
}

export function ProfileRenderer({
  profile,
  blocks,
  templateId,
  themeTokens,
}: ProfileRendererProps) {
  const activeTemplateId = templateId || profile.template_id || "vcard";
  const templateDef = getTemplate(activeTemplateId);

  const mergedTokens: ThemeTokens = {
    ...templateDef.default_theme,
    ...(themeTokens ?? {}),
    custom_options: {
      ...(templateDef.default_theme.custom_options || {}),
      ...(themeTokens?.custom_options ?? {}),
    },
  };

  const cssVariables = getThemeVariables(mergedTokens, templateDef.default_theme);
  const TemplateComponent = templateDef.Component;
  const showBranding = profile.show_branding !== false;

  const isBotanical = activeTemplateId === "botanical";

  return (
    <div
      style={{
        ...cssVariables,
        backgroundColor: isBotanical
          ? "transparent"
          : ((cssVariables as any)["--lf-bg"] || "#f8fafc"),
      }}
      className={`w-full min-h-screen flex flex-col justify-between ${
        isBotanical ? "p-0" : ""
      }`}
    >
      <div>
        {profile?.id && <ProfileViewTracker profileId={profile.id} />}
        <TemplateComponent
          profile={profile}
          blocks={blocks}
          theme={mergedTokens}
        />
      </div>
      {!isBotanical && (
        <div>
          {showBranding && <DigicardoBadge />}
          {profile?.username && <ReportProfileModal username={profile.username} />}
        </div>
      )}
    </div>
  );
}

