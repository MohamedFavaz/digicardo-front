import type { Profile, PublicProfile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock, PublicProfileBlock } from "@/types/blocks";
import { normalizeCardContent, type CardContent } from "@/lib/zod/content";
import { legacyToCardContent } from "./legacy";

type AnyBlock = ProfileBlock | PublicProfileBlock;

export interface ResolvedCardData {
  content: CardContent;
  /** Visible blocks that are not already shown as contact buttons or social icons. */
  extraBlocks: AnyBlock[];
  /** Stored template_style, or the style derived from legacy options. */
  templateStyle: Record<string, string | boolean>;
  /** True when the card has no typed content yet and was mapped from custom_options. */
  isLegacy: boolean;
}

/**
 * What a template renders: the typed content when the profile has it (ADR-030), otherwise
 * the same content derived from the legacy theme options. `theme.custom_options` is used
 * (not `profile.theme_tokens`) so the old editor's unsaved draft shows in its preview.
 */
export function resolveCardData(
  profile: Profile | PublicProfile,
  theme: ThemeTokens,
  blocks: AnyBlock[]
): ResolvedCardData {
  const visible = blocks.filter((b) => (b as { is_visible?: boolean }).is_visible !== false);
  const stored = profile.content;

  if (stored && typeof stored === "object") {
    return {
      content: normalizeCardContent(stored),
      extraBlocks: visible,
      templateStyle: theme.template_style ?? {},
      isLegacy: false,
    };
  }

  const legacy = legacyToCardContent(profile, theme.custom_options, blocks);
  const lifted = new Set(legacy.liftedBlockIds);
  return {
    content: legacy.content,
    extraBlocks: visible.filter((b) => !lifted.has(b.id)),
    templateStyle: theme.template_style ?? legacy.templateStyle,
    isLegacy: true,
  };
}

/** Public address of the card, used for sharing, the QR code and the saved contact. */
export function cardPublicUrl(profile: Pick<PublicProfile, "username" | "primary_custom_domain" | "agent_domain">, origin?: string): string {
  if (profile.primary_custom_domain) return `https://${profile.primary_custom_domain}/`;
  // Cards made by an agent with a live domain: https://{agent-domain}/{username}.
  if (profile.agent_domain) return `https://${profile.agent_domain}/${profile.username}`;
  const base = (origin || process.env.NEXT_PUBLIC_APP_URL || "https://digicardo.app").replace(/\/+$/, "");
  return `${base}/${profile.username}`;
}
