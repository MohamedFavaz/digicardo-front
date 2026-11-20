import dynamic from "next/dynamic";
import type { TemplateDefinition } from "./types";
import { TEMPLATE_MANIFESTS } from "./manifests";

export const DEFAULT_TEMPLATE_ID = "vcard";

const classic = TEMPLATE_MANIFESTS.vcard;
const botanical = TEMPLATE_MANIFESTS.botanical;
const showcase = TEMPLATE_MANIFESTS.showcase;
const poster = TEMPLATE_MANIFESTS.poster;
const motion = TEMPLATE_MANIFESTS.motion;
const botanicalBackground = botanical.controls.find((c) => c.key === "background");

/**
 * Registered templates. Names, descriptions and default themes come from the manifests
 * (src/templates/manifests, ADR-031); the ids stay "vcard" / "botanical" so stored
 * profiles keep working. "showcase", "poster" and "motion" were added in Nov 2026.
 */
export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  vcard: {
    id: "vcard",
    name: classic.name,
    description: classic.description,
    category: "Business",
    preview: "/vcard-preview.png",
    default_theme: { ...classic.default_theme },
    supportedSections: ["profile", "socials", "quickActions", "links", "pdf", "qr", "vcard", "share"],
    Component: dynamic(() => import("./vcard").then((m) => m.VCardTemplate || m.default)),
  },
  botanical: {
    id: "botanical",
    name: botanical.name,
    description: botanical.description,
    category: "Corporate",
    preview: "/botanical-preview.png",
    default_theme: { ...botanical.default_theme },
    supportedSections: ["profile", "socials", "quickActions", "links", "pdf", "drive", "qr", "vcard", "share"],
    supportedBackgrounds:
      botanicalBackground?.type === "choice"
        ? botanicalBackground.options.map((o) => ({ id: `bg-${o.value}`, name: o.label, label: o.label }))
        : [],
    supportedColorPalettes: botanical.presets.map((p) => ({
      id: p.id,
      name: p.name,
      primary: p.tokens.color_text_primary ?? "#1B4332",
      secondary: p.tokens.color_text_secondary ?? "#2D6A4F",
      accent: p.tokens.color_accent,
      background: p.tokens.color_background,
    })),
    Component: dynamic(() => import("./botanical").then((m) => m.BotanicalTemplate || m.default)),
  },
  showcase: {
    id: "showcase",
    name: showcase.name,
    description: showcase.description,
    category: "Business",
    default_theme: { ...showcase.default_theme },
    supportedSections: ["profile", "socials", "quickActions", "links", "pdf", "qr", "vcard", "share"],
    Component: dynamic(() => import("./showcase").then((m) => m.ShowcaseTemplate || m.default)),
  },
  poster: {
    id: "poster",
    name: poster.name,
    description: poster.description,
    category: "Business",
    default_theme: { ...poster.default_theme },
    supportedSections: ["profile", "socials", "quickActions", "links", "pdf", "qr", "vcard", "share"],
    Component: dynamic(() => import("./poster").then((m) => m.PosterTemplate || m.default)),
  },
  motion: {
    id: "motion",
    name: motion.name,
    description: motion.description,
    category: "Modern",
    default_theme: { ...motion.default_theme },
    supportedSections: ["profile", "socials", "quickActions", "links", "pdf", "qr", "vcard", "share"],
    Component: dynamic(() => import("./motion").then((m) => m.MotionTemplate || m.default)),
  },
};

/**
 * Check if a given template ID exists in the registry.
 */
export function isValidTemplate(templateId?: string | null): boolean {
  if (!templateId) return false;
  return Boolean(TEMPLATE_REGISTRY[templateId]);
}

/**
 * Retrieve all registered templates as an array.
 */
export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(TEMPLATE_REGISTRY);
}

/**
 * Retrieve a template definition by ID with safe fallback and telemetry warning.
 */
export function getTemplate(templateId?: string | null): TemplateDefinition {
  if (templateId && TEMPLATE_REGISTRY[templateId]) {
    return TEMPLATE_REGISTRY[templateId];
  }

  if (templateId && !TEMPLATE_REGISTRY[templateId]) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[TemplateRegistry] Unknown template_id "${templateId}". Falling back to "${DEFAULT_TEMPLATE_ID}".`
      );
    }
  }

  return TEMPLATE_REGISTRY[DEFAULT_TEMPLATE_ID];
}
