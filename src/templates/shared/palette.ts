import type React from "react";
import type { ButtonRadius, ButtonStyle, FontFamily, ThemeTokens } from "@/types/profile";

/**
 * Colour helpers for card templates. Every colour starts from validated hex theme tokens
 * (AGENTS.md rule 3); the other shades are derived here, so a template needs only the
 * owner's background, text and one accent colour.
 */

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHex(value: unknown): value is string {
  return typeof value === "string" && HEX.test(value);
}

function rgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** `amount` of colour `a` over colour `b` (0 → b, 1 → a). */
export function mix(a: string, b: string, amount: number): string {
  const ca = rgb(a);
  const cb = rgb(b);
  return toHex([0, 1, 2].map((i) => cb[i] + (ca[i] - cb[i]) * amount) as [number, number, number]);
}

export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export const isDark = (hex: string) => luminance(hex) < 0.22;

/** White or near-black, whichever reads better on `background`. */
export function onColor(background: string): string {
  return contrastRatio("#FFFFFF", background) >= contrastRatio("#18181B", background) ? "#FFFFFF" : "#18181B";
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = rgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const FONT_STACKS: Record<FontFamily, string> = {
  inter: "var(--font-sans), Inter, ui-sans-serif, system-ui, sans-serif",
  roboto: "Roboto, ui-sans-serif, system-ui, sans-serif",
  outfit: "Outfit, ui-sans-serif, system-ui, sans-serif",
  poppins: "Poppins, ui-sans-serif, system-ui, sans-serif",
  lato: "Lato, ui-sans-serif, system-ui, sans-serif",
  montserrat: "Montserrat, ui-sans-serif, system-ui, sans-serif",
  raleway: "Raleway, ui-sans-serif, system-ui, sans-serif",
  nunito: "Nunito, ui-sans-serif, system-ui, sans-serif",
  "playfair-display": "'Playfair Display', Georgia, serif",
  "system-ui": "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

/** Google Fonts family names for the allowlisted fonts (Inter comes from next/font). */
export const GOOGLE_FONT_FAMILIES: Partial<Record<FontFamily, string>> = {
  roboto: "Roboto:wght@400;500;700",
  outfit: "Outfit:wght@400;500;600;700",
  poppins: "Poppins:wght@400;500;600;700",
  lato: "Lato:wght@400;700",
  montserrat: "Montserrat:wght@400;500;600;700",
  raleway: "Raleway:wght@400;500;600;700",
  nunito: "Nunito:wght@400;600;700",
  "playfair-display": "Playfair+Display:wght@600;700",
};

/** [button radius, tile radius] per theme token. */
const RADII: Record<ButtonRadius, [string, string]> = {
  none: ["4px", "6px"],
  small: ["8px", "10px"],
  medium: ["12px", "14px"],
  large: ["14px", "18px"],
  pill: ["999px", "999px"],
};

export interface CardPalette {
  bg: string;
  surface: string;
  ink: string;
  ink2: string;
  ink3: string;
  border: string;
  borderStrong: string;
  accent: string;
  onAccent: string;
  soft: string;
  line: string;
  tint1: string;
  tint2: string;
  tint3: string;
  dark: boolean;
}

export function cardPalette(colors: {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
}): CardPalette {
  const { background: bg, surface, text: ink, textSecondary: ink2, accent } = colors;
  return {
    bg,
    surface,
    ink,
    ink2,
    ink3: mix(ink2, surface, 0.8),
    border: mix(ink, surface, 0.09),
    borderStrong: mix(ink, surface, 0.18),
    accent,
    onAccent: onColor(accent),
    soft: mix(accent, surface, 0.11),
    line: mix(accent, bg, 0.3),
    tint1: mix(accent, surface, 0.24),
    tint2: mix(accent, surface, 0.34),
    tint3: mix(accent, surface, 0.46),
    dark: isDark(bg),
  };
}

/**
 * CSS custom properties for a card. Values are hex colours derived from validated tokens
 * and fixed enums only — never free text.
 */
export function cardCssVars(
  palette: CardPalette,
  tokens: Pick<ThemeTokens, "font_family" | "button_radius">
): React.CSSProperties {
  const [btn, tile] = RADII[tokens.button_radius] ?? RADII.large;
  return {
    "--c-bg": palette.bg,
    "--c-surface": palette.surface,
    "--c-ink": palette.ink,
    "--c-ink2": palette.ink2,
    "--c-ink3": palette.ink3,
    "--c-border": palette.border,
    "--c-border-strong": palette.borderStrong,
    "--c-accent": palette.accent,
    "--c-on-accent": palette.onAccent,
    "--c-soft": palette.soft,
    "--c-line": palette.line,
    "--c-tint1": palette.tint1,
    "--c-tint2": palette.tint2,
    "--c-tint3": palette.tint3,
    "--c-btn-r": btn,
    "--c-tile-r": tile,
    "--c-font": FONT_STACKS[tokens.font_family] ?? FONT_STACKS.inter,
  } as React.CSSProperties;
}

/** Tailwind classes for the card's main button in the owner's button style. */
export function primaryButtonClass(style: ButtonStyle | undefined): string {
  switch (style) {
    case "outline":
      return "border-2 border-[var(--c-accent)] bg-transparent text-[var(--c-accent)]";
    case "soft":
    case "ghost":
    case "glass":
      return "bg-[var(--c-soft)] text-[var(--c-accent)]";
    default:
      return "bg-[var(--c-accent)] text-[var(--c-on-accent)]";
  }
}

/** Entrance animation class for the theme's `animation` token (honours reduced motion). */
export function entranceClass(animation: string | undefined): string {
  switch (animation) {
    case "fade":
      return "motion-safe:animate-card-fade";
    case "slide":
      return "motion-safe:animate-card-slide";
    case "scale":
      return "motion-safe:animate-card-scale";
    default:
      return "";
  }
}
