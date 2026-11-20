/**
 * NFC card designer: design options, colour themes and per-browser persistence.
 * A card is the standard CR80 size (85.6 × 54 mm) with 3.18 mm rounded corners.
 */

export const CARD_W = 85.6;
export const CARD_H = 54;
export const CARD_RADIUS = 3.18;
export const BLEED = 3;

export type FrontLayout = "signature" | "classic" | "centered" | "minimal";

/** Front templates in picker order (Signature = the card on the Digicardo landing page). */
export const FRONT_LAYOUTS: { id: FrontLayout; name: string; hint: string }[] = [
  { id: "signature", name: "Signature", hint: "Chip, tap button" },
  { id: "classic", name: "Classic", hint: "Logo and name" },
  { id: "centered", name: "Centred", hint: "Everything centred" },
  { id: "minimal", name: "Minimal", hint: "Big name" },
];
export type BackLayout = "qr-left" | "qr-center";
export type Decor = "none" | "orbits" | "waves";

export interface CardTheme {
  id: string;
  name: string;
  bg: string;
  bg2: string;
  fg: string;
  accent: string;
}

export const THEMES: CardTheme[] = [
  { id: "digicardo", name: "Digicardo", bg: "#1C1245", bg2: "#5B3FE4", fg: "#FFFFFF", accent: "#DAF56B" },
  { id: "midnight", name: "Midnight", bg: "#0E0B1F", bg2: "#241A55", fg: "#FFFFFF", accent: "#B9A8FF" },
  { id: "violet", name: "Violet", bg: "#4B2FD8", bg2: "#8B5CF6", fg: "#FFFFFF", accent: "#DAF56B" },
  { id: "carbon", name: "Carbon", bg: "#141416", bg2: "#3F3F46", fg: "#FFFFFF", accent: "#D4D4D8" },
  { id: "pearl", name: "Pearl", bg: "#F8F7F3", bg2: "#E7E3D8", fg: "#1C1245", accent: "#5B3FE4" },
  { id: "lime", name: "Lime", bg: "#DAF56B", bg2: "#BFE63A", fg: "#1C1245", accent: "#1C1245" },
  { id: "ocean", name: "Ocean", bg: "#0B3352", bg2: "#0E7490", fg: "#FFFFFF", accent: "#67E8F9" },
  { id: "forest", name: "Forest", bg: "#0F2E20", bg2: "#1F5A3D", fg: "#FFFFFF", accent: "#BBF7D0" },
  { id: "rose", name: "Rose gold", bg: "#F6DCD2", bg2: "#E2A996", fg: "#3B1F1A", accent: "#8A4B3B" },
  { id: "gold", name: "Black & gold", bg: "#0C0C0C", bg2: "#262019", fg: "#F5E7C6", accent: "#D4AF37" },
];

export interface NfcCardDesign {
  themeId: string;
  /** Used when themeId === "custom". */
  custom: { bg: string; bg2: string; fg: string; accent: string };
  gradient: boolean;
  decor: Decor;
  front: FrontLayout;
  back: BackLayout;
  showLogo: boolean;
  showRole: boolean;
  showContacts: boolean;
}

export const DEFAULT_DESIGN: NfcCardDesign = {
  themeId: "digicardo",
  custom: { bg: "#1C1245", bg2: "#5B3FE4", fg: "#FFFFFF", accent: "#DAF56B" },
  gradient: true,
  decor: "orbits",
  front: "signature",
  back: "qr-left",
  showLogo: true,
  showRole: true,
  showContacts: true,
};

export function resolveTheme(design: NfcCardDesign): CardTheme {
  if (design.themeId === "custom") return { id: "custom", name: "Custom", ...design.custom };
  return THEMES.find((t) => t.id === design.themeId) ?? THEMES[0];
}

const HEX = /^#[0-9a-f]{6}$/i;
const STORAGE_KEY = "dg.nfc-card.design";

/** Saved design for this browser (falls back to defaults; never throws). */
export function loadDesign(): NfcCardDesign {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DESIGN;
    const v = JSON.parse(raw) as Partial<NfcCardDesign>;
    const custom = { ...DEFAULT_DESIGN.custom };
    for (const k of ["bg", "bg2", "fg", "accent"] as const) {
      if (typeof v.custom?.[k] === "string" && HEX.test(v.custom[k])) custom[k] = v.custom[k];
    }
    const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
      typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
    return {
      themeId: pick(v.themeId, [...THEMES.map((t) => t.id), "custom"], DEFAULT_DESIGN.themeId),
      custom,
      gradient: typeof v.gradient === "boolean" ? v.gradient : DEFAULT_DESIGN.gradient,
      decor: pick(v.decor, ["none", "orbits", "waves"] as const, DEFAULT_DESIGN.decor),
      front: pick(v.front, FRONT_LAYOUTS.map((l) => l.id), DEFAULT_DESIGN.front),
      back: pick(v.back, ["qr-left", "qr-center"] as const, DEFAULT_DESIGN.back),
      showLogo: typeof v.showLogo === "boolean" ? v.showLogo : DEFAULT_DESIGN.showLogo,
      showRole: typeof v.showRole === "boolean" ? v.showRole : DEFAULT_DESIGN.showRole,
      showContacts: typeof v.showContacts === "boolean" ? v.showContacts : DEFAULT_DESIGN.showContacts,
    };
  } catch {
    return DEFAULT_DESIGN;
  }
}

export function saveDesign(design: NfcCardDesign): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
  } catch {
    // Storage blocked (private window): the design just isn't remembered.
  }
}

/** Relative luminance check used to pick readable text on custom colours. */
export function isLight(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45;
}
