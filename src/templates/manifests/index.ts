import type { ThemeTokens } from "@/types/profile";
import type { SectionKey } from "@/lib/zod/content";
import vcard from "./vcard.json";
import botanical from "./botanical.json";
import showcase from "./showcase.json";
import poster from "./poster.json";
import motion from "./motion.json";

/**
 * Template manifests (ADR-031). Copies of backend/resources/templates/*.json — the backend
 * uses them to validate `theme_tokens.template_style`; the editor builds its style controls
 * and one-click colour presets from them. `src/tests/template-manifests.test.ts` fails when
 * the copies drift.
 */

export type ManifestControl =
  | { key: string; label: string; type: "toggle"; default: boolean }
  | { key: string; label: string; type: "color"; default: string }
  | { key: string; label: string; type: "choice"; default: string; options: { value: string; label: string; image?: string }[] };

export type ManifestThemeTokens = Pick<
  ThemeTokens,
  | "color_background"
  | "color_surface"
  | "color_text_primary"
  | "color_text_secondary"
  | "color_accent"
  | "font_family"
  | "button_radius"
  | "button_style"
  | "animation"
>;

export interface TemplatePreset {
  id: string;
  name: string;
  tokens: Partial<ManifestThemeTokens>;
}

export interface TemplateManifest {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: SectionKey[];
  default_theme: ManifestThemeTokens;
  controls: ManifestControl[];
  presets: TemplatePreset[];
}

export const TEMPLATE_MANIFESTS: Record<string, TemplateManifest> = {
  vcard: vcard as TemplateManifest,
  botanical: botanical as TemplateManifest,
  showcase: showcase as TemplateManifest,
  poster: poster as TemplateManifest,
  motion: motion as TemplateManifest,
};

export function getManifest(templateId: string | null | undefined): TemplateManifest {
  return TEMPLATE_MANIFESTS[templateId ?? ""] ?? TEMPLATE_MANIFESTS.vcard;
}

/** Control defaults merged with stored values; unknown keys and wrong types are ignored. */
export function resolveTemplateStyle(
  manifest: TemplateManifest,
  stored: Record<string, unknown> | null | undefined
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const control of manifest.controls) {
    const value = stored?.[control.key];
    if (control.type === "toggle") {
      out[control.key] = typeof value === "boolean" ? value : control.default;
    } else if (control.type === "choice") {
      out[control.key] =
        typeof value === "string" && control.options.some((o) => o.value === value) ? value : control.default;
    } else {
      out[control.key] = typeof value === "string" && /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(value) ? value : control.default;
    }
  }
  return out;
}
