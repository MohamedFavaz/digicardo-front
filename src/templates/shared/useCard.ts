"use client";

import * as React from "react";
import type { TemplateProps } from "../types";
import type { ThemeTokens } from "@/types/profile";
import type { AnalyticsEventType } from "@/types/analytics";
import { sendEventBeacon } from "@/lib/analytics/client";
import { cardPublicUrl, resolveCardData, type ResolvedCardData } from "@/lib/content/resolve";
import { getManifest, resolveTemplateStyle, type TemplateManifest } from "../manifests";
import { cardCssVars, cardPalette, isHex, type CardPalette } from "./palette";
import { downloadVCard } from "./vcf";

export type CardSheetState =
  | null
  | { kind: "share" }
  | { kind: "qr" }
  | { kind: "bank" }
  | { kind: "gallery"; index: number };

interface ColorInput {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
}

/**
 * Colours a card uses. Normally the theme tokens. Botanical cards that predate the content
 * model kept their colours in a named palette (custom_options.color_palette), so for those
 * the palette preset — plus any custom_colors overrides — is used, exactly as before.
 */
function effectiveColors(manifest: TemplateManifest, theme: ThemeTokens, data: ResolvedCardData): ColorInput {
  const defaults = manifest.default_theme;
  const pick = (value: unknown, fallback: string) => (isHex(value) ? value : fallback);

  let source: Partial<Record<keyof ThemeTokens, unknown>> = theme;
  if (manifest.id === "botanical" && !theme.template_style) {
    const paletteId = String(data.templateStyle.palette ?? "sage");
    const preset = manifest.presets.find((p) => p.id === paletteId) ?? manifest.presets[0];
    const custom = (theme.custom_options?.custom_colors ?? {}) as Record<string, unknown>;
    source = {
      ...preset?.tokens,
      ...(isHex(custom.background) ? { color_background: custom.background } : {}),
      ...(isHex(custom.primary) ? { color_text_primary: custom.primary } : {}),
      ...(isHex(custom.secondary) ? { color_text_secondary: custom.secondary } : {}),
      ...(isHex(custom.accent) ? { color_accent: custom.accent } : {}),
    };
  }

  return {
    background: pick(source.color_background, defaults.color_background),
    surface: pick(source.color_surface, defaults.color_surface),
    text: pick(source.color_text_primary, defaults.color_text_primary),
    textSecondary: pick(source.color_text_secondary, defaults.color_text_secondary),
    accent: pick(source.color_accent, defaults.color_accent),
  };
}

export interface CardModel extends ResolvedCardData {
  isPreview: boolean;
  manifest: TemplateManifest;
  style: Record<string, string | boolean>;
  palette: CardPalette;
  cssVars: React.CSSProperties;
  cardUrl: string;
  sheet: CardSheetState;
  setSheet: (sheet: CardSheetState) => void;
  closeSheet: () => void;
  /** Sends an analytics event on the live card; does nothing in previews. */
  track: (type: AnalyticsEventType, metadata?: Record<string, string | number>) => void;
  saveContact: () => void;
  shareCard: () => Promise<void>;
}

/** Everything a card template needs, derived once from {profile, blocks, theme, mode}. */
export function useCard({ profile, blocks, theme, mode = "public" }: TemplateProps, templateId: string): CardModel {
  const isPreview = mode === "preview";
  const manifest = getManifest(templateId);
  const data = React.useMemo(() => resolveCardData(profile, theme, blocks), [profile, theme, blocks]);
  const style = React.useMemo(() => resolveTemplateStyle(manifest, data.templateStyle), [manifest, data.templateStyle]);
  const palette = React.useMemo(() => cardPalette(effectiveColors(manifest, theme, data)), [manifest, theme, data]);
  const cssVars = React.useMemo(
    () =>
      cardCssVars(palette, {
        font_family: theme.font_family ?? manifest.default_theme.font_family,
        button_radius: theme.button_radius ?? manifest.default_theme.button_radius,
      }),
    [palette, theme.font_family, theme.button_radius, manifest]
  );

  // The origin is only known in the browser; render the canonical URL first to avoid a
  // hydration mismatch, then switch to the real origin (local dev, previews).
  const [origin, setOrigin] = React.useState<string | undefined>(undefined);
  React.useEffect(() => setOrigin(window.location.origin), []);
  const cardUrl = cardPublicUrl(profile, origin);

  const [sheet, setSheet] = React.useState<CardSheetState>(null);
  const closeSheet = React.useCallback(() => setSheet(null), []);

  const profileId = profile.id;
  const track = React.useCallback(
    (type: AnalyticsEventType, metadata?: Record<string, string | number>) => {
      if (isPreview || !profileId) return;
      sendEventBeacon({ profile_id: profileId, event_type: type, metadata: metadata ?? null });
    },
    [isPreview, profileId]
  );

  const saveContact = React.useCallback(() => {
    track("cta_click", { action: "save_contact" });
    downloadVCard(data.content, cardUrl);
  }, [track, data.content, cardUrl]);

  const shareCard = React.useCallback(async () => {
    track("cta_click", { action: "share" });
    if (!isPreview && typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: data.content.identity.name, url: cardUrl });
        return;
      } catch {
        // Cancelled or not allowed — fall back to the share sheet.
      }
    }
    setSheet({ kind: "share" });
  }, [track, isPreview, data.content.identity.name, cardUrl]);

  return {
    ...data,
    isPreview,
    manifest,
    style,
    palette,
    cssVars,
    cardUrl,
    sheet,
    setSheet,
    closeSheet,
    track,
    saveContact,
    shareCard,
  };
}

/** Props for an external link on the card: new tab, no access back to the card. */
export function externalLinkProps(href: string) {
  return /^https?:\/\//i.test(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
}
