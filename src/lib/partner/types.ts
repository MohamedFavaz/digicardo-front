/** Agent landing page ("partner site") — mirrors App\Services\AgentSiteContent on the backend. */

export type PartnerPreset = "sage" | "midnight" | "sunrise" | "ocean";
export type PartnerSectionKey = "about" | "packages" | "showcase" | "steps" | "testimonials" | "faq" | "contact";

export const PARTNER_SECTIONS: PartnerSectionKey[] = ["about", "packages", "showcase", "steps", "testimonials", "faq", "contact"];

export interface PartnerStat {
  id: string;
  value: string;
  label: string;
}
export interface PartnerPackage {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
}
export interface PartnerStep {
  id: string;
  title: string;
  text: string;
}
export interface PartnerTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}
export interface PartnerFaq {
  id: string;
  q: string;
  a: string;
}

/** Logo size on the landing page (top bar / footer). */
export type PartnerLogoSize = "small" | "medium" | "large" | "xl";
export const PARTNER_LOGO_PX: Record<PartnerLogoSize, number> = { small: 30, medium: 36, large: 48, xl: 60 };

export interface PartnerContent {
  brand: { name: string; tagline: string; logo_url: string; logo_size?: PartnerLogoSize };
  theme: { preset: PartnerPreset; accent: string };
  hero: { eyebrow: string; title: string; highlight: string; subtitle: string; image_url: string; cta_label: string; secondary_label: string };
  stats: PartnerStat[];
  about: { enabled: boolean; title: string; text: string; image_url: string; points: string[] };
  packages: { enabled: boolean; title: string; subtitle: string; items: PartnerPackage[] };
  showcase: { enabled: boolean; title: string; subtitle: string; profile_ids: string[] };
  steps: { enabled: boolean; title: string; items: PartnerStep[] };
  testimonials: { enabled: boolean; title: string; items: PartnerTestimonial[] };
  faq: { enabled: boolean; title: string; items: PartnerFaq[] };
  contact: {
    enabled: boolean;
    title: string;
    text: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    map_url: string;
    instagram: string;
    facebook: string;
    website: string;
  };
  lead_form: { enabled: boolean; title: string; button_label: string };
  layout: PartnerSectionKey[];
  seo: { title: string; description: string };
}

/** A customer's card shown on the landing page. */
export interface PartnerCard {
  id: string;
  username: string;
  name: string;
  role: string;
  avatar_url: string | null;
  cover_url: string | null;
  template_id: string;
  is_public: boolean;
  url: string;
}

export interface PartnerPublicPayload {
  slug: string;
  domain: string | null;
  page_url: string;
  content: PartnerContent;
  showcase: PartnerCard[];
}

export interface PartnerSiteOwner {
  id: string;
  slug: string;
  content: PartnerContent;
  published: boolean;
  published_at: string | null;
  landing_disabled: boolean;
  page_url: string;
  default_url: string;
  domain: string | null;
  domain_status: "pending" | "active" | "failed" | null;
  domain_error: string | null;
  domain_checked_at: string | null;
  domain_activated_at: string | null;
  updated_at: string | null;
}

/** Palettes for the four designs (CSS variables consumed by the landing page). */
export const PARTNER_PRESETS: Record<PartnerPreset, { label: string; vars: Record<string, string>; dark: boolean }> = {
  sage: {
    label: "Sage",
    dark: false,
    vars: {
      "--lp-bg": "#F3F2EE",
      "--lp-surface": "#FBFBF8",
      "--lp-ink": "#121212",
      "--lp-ink2": "#5E6054",
      "--lp-muted": "#9A9C8F",
      "--lp-line": "#E4E4DC",
      "--lp-accent": "#343C22",
      "--lp-accent-ink": "#FFFFFF",
      "--lp-soft": "#EEF2E4",
      "--lp-tint": "#B0C08F",
      "--lp-band": "#343C22",
      "--lp-band-ink": "#F3F2EE",
      "--lp-glow": "#CBD5B1",
    },
  },
  midnight: {
    label: "Midnight",
    dark: true,
    vars: {
      "--lp-bg": "#0B0F1A",
      "--lp-surface": "#131A2B",
      "--lp-ink": "#F4F5FA",
      "--lp-ink2": "#A9B0C7",
      "--lp-muted": "#6B7390",
      "--lp-line": "#232C44",
      "--lp-accent": "#E8C27A",
      "--lp-accent-ink": "#0B0F1A",
      "--lp-soft": "#1A2238",
      "--lp-tint": "#E8C27A",
      "--lp-band": "#131A2B",
      "--lp-band-ink": "#F4F5FA",
      "--lp-glow": "#2B3A67",
    },
  },
  sunrise: {
    label: "Sunrise",
    dark: false,
    vars: {
      "--lp-bg": "#F7F1EA",
      "--lp-surface": "#FFFBF6",
      "--lp-ink": "#2A1A12",
      "--lp-ink2": "#6E5A4C",
      "--lp-muted": "#A8968A",
      "--lp-line": "#EBDDD0",
      "--lp-accent": "#B4462B",
      "--lp-accent-ink": "#FFFFFF",
      "--lp-soft": "#F6E3D6",
      "--lp-tint": "#E9A77F",
      "--lp-band": "#4C220B",
      "--lp-band-ink": "#F7F1EA",
      "--lp-glow": "#F2C9A8",
    },
  },
  ocean: {
    label: "Ocean",
    dark: false,
    vars: {
      "--lp-bg": "#F2F6FA",
      "--lp-surface": "#FFFFFF",
      "--lp-ink": "#0E1B2C",
      "--lp-ink2": "#4F6176",
      "--lp-muted": "#8A9AAC",
      "--lp-line": "#DCE6F1",
      "--lp-accent": "#1F5FD6",
      "--lp-accent-ink": "#FFFFFF",
      "--lp-soft": "#E3EDFA",
      "--lp-tint": "#8DB4EE",
      "--lp-band": "#0E2A4F",
      "--lp-band-ink": "#EAF2FB",
      "--lp-glow": "#BBD3F2",
    },
  },
};

/** Readable text colour on a hex background. */
export function inkOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#FFFFFF";
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#121212" : "#FFFFFF";
}

export function partnerThemeVars(theme: PartnerContent["theme"]): Record<string, string> {
  const preset = PARTNER_PRESETS[theme.preset] ?? PARTNER_PRESETS.sage;
  const vars = { ...preset.vars };
  if (/^#[0-9A-Fa-f]{6}$/.test(theme.accent)) {
    vars["--lp-accent"] = theme.accent;
    vars["--lp-accent-ink"] = inkOn(theme.accent);
  }
  return vars;
}

export function whatsappLink(number: string, text?: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
