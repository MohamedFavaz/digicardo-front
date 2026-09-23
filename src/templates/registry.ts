import dynamic from "next/dynamic";
import type { TemplateDefinition } from "./types";

export const DEFAULT_TEMPLATE_ID = "vcard";

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  vcard: {
    id: "vcard",
    name: "VCard Business",
    description:
      "3-column digital business card with icon action grid, modals (Call, Bank, QR, Booking), and WhatsApp share — inspired by modern vCard platforms.",
    category: "Business",
    preview: "/vcard-preview.png",
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
    supportedSections: ["profile", "socials", "quickActions", "qr", "vcard", "share"],
    Component: dynamic(() => import("./vcard").then((m) => m.VCardTemplate)),
    SettingsComponent: dynamic(() => import("./vcard/settings").then((m) => m.VCardSettings)),
  },
  botanical: {
    id: "botanical",
    name: "Botanical Corporate",
    description:
      "Executive digital business card with 10 organic & architectural background styles, 5 corporate color schemes, 4-way social placements, secure PDF document viewer, Google Drive vault, and full vCard contact sharing.",
    category: "Corporate",
    preview: "/botanical-preview.png",
    default_theme: {
      color_background: "#f4fbf7",
      color_surface: "#ffffff",
      color_text_primary: "#1b4332",
      color_text_secondary: "#40916c",
      color_accent: "#2d6a4f",
      font_family: "inter",
      button_radius: "large",
      button_style: "solid",
      animation: "fade",
      custom_options: {
        bg_style: "botanical",
        color_palette: "sage",
        quick_actions: {
          show_call: true,
          show_email: true,
          show_whatsapp: true,
          show_website: true,
        },
        social_links: [
          { platform: "linkedin", url: "https://linkedin.com", is_active: true },
          { platform: "x", url: "https://x.com", is_active: true },
          { platform: "google_business", url: "https://google.com", is_active: true },
          { platform: "youtube", url: "https://youtube.com", is_active: true },
          { platform: "instagram", url: "https://instagram.com", is_active: true },
          { platform: "website", url: "https://example.com", is_active: true },
        ],
        content_links: [
          {
            id: "link-1",
            title: "Corporate Services & Solutions",
            description: "Explore enterprise offerings & portfolio",
            url: "#services",
            icon: "services",
            is_active: true,
            is_featured: true,
          },
          {
            id: "link-2",
            title: "Bank & Payment Details",
            description: "Account, IFSC, UPI & billing info",
            url: "#payment",
            icon: "bank",
            is_active: true,
            is_featured: false,
          },
          {
            id: "link-3",
            title: "Schedule Consultation",
            description: "Book a 30-min executive strategy call",
            url: "#booking",
            icon: "meeting",
            is_active: true,
            is_featured: false,
          },
          {
            id: "link-4",
            title: "Download Company Profile",
            description: "Corporate brochure & credentials (PDF)",
            url: "#brochure",
            icon: "brochure",
            is_active: true,
            is_featured: false,
          },
          {
            id: "link-5",
            title: "Corporate Headquarters",
            description: "Business Park, Tower B, Level 8",
            url: "#location",
            icon: "location",
            is_active: true,
            is_featured: false,
          },
        ],
        document_block: {
          title: "Corporate Capability Statement",
          description: "Official 2026 Executive Overview (PDF)",
          file_name: "Corporate_Profile_2026.pdf",
          file_size_label: "2.4 MB",
          file_url: "",
          is_active: true,
        },
        drive_block: {
          title: "Executive Resource Vault",
          description: "Direct access to our shared Google Drive repository",
          drive_url: "https://drive.google.com",
          is_active: true,
        },
        show_save_contact: true,
        show_share: true,
        show_qr: true,
      },
    },
    supportedSections: [
      "profile",
      "socials",
      "quickActions",
      "links",
      "pdf",
      "drive",
      "qr",
      "vcard",
      "share",
    ],
    supportedBackgrounds: [
      { id: "bg-botanical", name: "Botanical", label: "🌿 Dual organic leaf branches" },
      { id: "bg-geometric", name: "Geometric", label: "📐 Modern architectural grid" },
      { id: "bg-topo", name: "Contours", label: "🌊 Topographic wave lines" },
      { id: "bg-aura", name: "Ambient", label: "🌌 Soft radiant glowing mesh" },
      { id: "bg-minimal", name: "Minimal", label: "💎 Executive gradient accent bar" },
      { id: "bg-marble", name: "Marble", label: "🏛️ Luxury marble veining" },
      { id: "bg-tech", name: "Tech Matrix", label: "🌐 Constellation grid nodes" },
      { id: "bg-frosted", name: "Frosted Glass", label: "🪟 Prismatic glass with backdrop blur" },
      { id: "bg-silk", name: "Silk Wave", label: "🎗️ Smooth fluid ribbon waves" },
      { id: "bg-bauhaus", name: "Bauhaus", label: "🏛️ Modernist geometric composition" },
    ],
    supportedColorPalettes: [
      { id: "sage", name: "Sage Forest", primary: "#1b4332", secondary: "#40916c", accent: "#2d6a4f" },
      { id: "navy", name: "Executive Navy", primary: "#0a192f", secondary: "#1e3a8a", accent: "#2563eb" },
      { id: "gold", name: "Luxury Gold", primary: "#1c1917", secondary: "#b45309", accent: "#d97706" },
      { id: "terracotta", name: "Warm Terracotta", primary: "#431407", secondary: "#9a3412", accent: "#c2410c" },
      { id: "charcoal", name: "Minimal Charcoal", primary: "#09090b", secondary: "#52525b", accent: "#27272a" },
    ],
    Component: dynamic(() => import("./botanical").then((m) => m.BotanicalTemplate)),
    SettingsComponent: dynamic(() => import("./botanical/settings").then((m) => m.BotanicalSettings)),
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
