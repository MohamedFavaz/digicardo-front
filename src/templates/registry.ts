import dynamic from "next/dynamic";
import type { TemplateDefinition } from "./types";

export const DEFAULT_TEMPLATE_ID = "vcard";

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  vcard: {
    id: "vcard",
    name: "VCard Business",
    description: "3-column digital business card with icon action grid, modals (Call, Bank, QR, Booking), and WhatsApp share — inspired by modern vCard platforms.",
    category: "Business",
    default_theme: {
      color_background: "#f0f4f8",
      color_surface: "#ffffff",
      color_text_primary: "#1e293b",
      color_text_secondary: "#64748b",
      color_accent: "#f97316",
      font_family: "poppins",
      button_radius: "large",
      button_style: "solid",
      animation: "none",
    },
    Component: dynamic(() => import("./vcard").then((m) => m.VCardTemplate)),
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
