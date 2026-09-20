import type React from "react";
import type { ThemeTokens, FontFamily, ButtonRadius } from "@/types/profile";
import { hexColorSchema } from "@/lib/validation/theme";

const FONT_FAMILY_STACKS: Record<FontFamily, string> = {
  inter: "var(--font-inter, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif)",
  roboto: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  outfit: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  poppins: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  lato: "'Lato', -apple-system, BlinkMacSystemFont, sans-serif",
  montserrat: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
  raleway: "'Raleway', -apple-system, BlinkMacSystemFont, sans-serif",
  nunito: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
  "playfair-display": "'Playfair Display', Georgia, serif",
  "system-ui": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const RADIUS_MAP: Record<ButtonRadius, string> = {
  none: "0px",
  small: "0.375rem",
  medium: "0.75rem",
  large: "1rem",
  pill: "9999px",
};

function sanitizeColor(val?: string | null, fallback: string = "#ffffff"): string {
  if (!val) return fallback;
  const parse = hexColorSchema.safeParse(val);
  return parse.success ? parse.data : fallback;
}

/**
 * Transforms validated ThemeTokens into safe CSS Custom Properties.
 */
export function getThemeVariables(
  tokens?: Partial<ThemeTokens> | null,
  defaultTokens?: ThemeTokens
): React.CSSProperties {
  const fallback = defaultTokens ?? {
    color_background: "#ffffff",
    color_surface: "#f8fafc",
    color_text_primary: "#0f172a",
    color_text_secondary: "#64748b",
    color_accent: "#6366f1",
    font_family: "inter",
    button_radius: "medium",
    button_style: "solid",
    animation: "none",
  };

  const bg = sanitizeColor(tokens?.color_background, fallback.color_background);
  const surface = sanitizeColor(tokens?.color_surface, fallback.color_surface);
  const textPrimary = sanitizeColor(tokens?.color_text_primary, fallback.color_text_primary);
  const textSecondary = sanitizeColor(tokens?.color_text_secondary, fallback.color_text_secondary);
  const accent = sanitizeColor(tokens?.color_accent, fallback.color_accent);

  const fontKey = (tokens?.font_family ?? fallback.font_family) as FontFamily;
  const fontStack = FONT_FAMILY_STACKS[fontKey] ?? FONT_FAMILY_STACKS.inter;

  const radiusKey = (tokens?.button_radius ?? fallback.button_radius) as ButtonRadius;
  const radiusVal = RADIUS_MAP[radiusKey] ?? RADIUS_MAP.medium;

  const buttonStyle = tokens?.button_style ?? fallback.button_style;
  const animation = tokens?.animation ?? fallback.animation;

  return {
    "--lf-bg": bg,
    "--lf-surface": surface,
    "--lf-text-primary": textPrimary,
    "--lf-text-secondary": textSecondary,
    "--lf-accent": accent,
    "--lf-font": fontStack,
    "--lf-radius": radiusVal,
    "--lf-button-style": buttonStyle,
    "--lf-animation": animation,
  } as React.CSSProperties;
}
