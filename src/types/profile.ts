import type { ProfileBlock, PublicProfileBlock } from "./blocks";

export const FONT_ALLOWLIST = [
  "inter",
  "poppins",
  "montserrat",
  "outfit",
  "roboto",
  "playfair-display",
  "raleway",
  "lato",
  "nunito",
  "system-ui",
] as const;

export type FontFamily = (typeof FONT_ALLOWLIST)[number];
export type ButtonRadius = "none" | "small" | "medium" | "large" | "pill";
export type ButtonStyle = "solid" | "outline" | "ghost" | "soft" | "glass";
export type AnimationType = "none" | "fade" | "slide" | "scale";

export interface VCardActionIconToggles {
  call?: boolean;
  whatsapp?: boolean;
  email?: boolean;
  website?: boolean;
  bank?: boolean;
  address?: boolean;
  booking?: boolean;
  form?: boolean;
  // Social media
  facebook?: boolean;
  instagram?: boolean;
  youtube?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  telegram?: boolean;
  github?: boolean;
  snapchat?: boolean;
  tiktok?: boolean;
  pinterest?: boolean;
  threads?: boolean;
  discord?: boolean;
  twitch?: boolean;
  spotify?: boolean;
  whatsapp_channel?: boolean;
  behance?: boolean;
  dribbble?: boolean;
  // Utility
  review?: boolean;
  qr?: boolean;
  save_contact?: boolean;
  install?: boolean;
}

export interface VCardSocialUrls {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  telegram?: string;
  github?: string;
  snapchat?: string;
  tiktok?: string;
  pinterest?: string;
  threads?: string;
  discord?: string;
  twitch?: string;
  spotify?: string;
  whatsapp_channel?: string;
  behance?: string;
  dribbble?: string;
  [key: string]: string | undefined;
}

export interface VCardProduct {
  id: string;
  name: string;
  description?: string;
  price?: string;
  image_url?: string;
  /** Optional direct buy/order link */
  buy_url?: string;
}

export interface VCardService {
  id: string;
  name: string;
  description?: string;
  /** Price or fee (e.g. "₹499", "Free") */
  price?: string;
  /** Turnaround time (e.g. "Same day") */
  duration?: string;
}

export interface VCardCustomOptions {
  show_meta_verified?: boolean;
  banner_transition?: boolean;
  banner_image_url?: string;
  banner_images?: string[];
  custom_avatar_url?: string;
  category_badge_text?: string;
  /** Override the profile display_name shown on the card */
  display_name_override?: string;
  /** Override the profile bio/tagline shown below the name */
  tagline_override?: string;
  /** Business address text shown in the Address modal */
  address_text?: string;
  /** Google Maps link for the "Get Directions" button */
  map_url?: string;
  button_gradient_animation?: boolean;
  primary_button_color?: string;
  pay_button_color?: string;
  location_button_color?: string;
  services_button_text?: string;
  /** Show/hide the primary "View Services" full-width button */
  view_service_btn_enabled?: boolean;
  /** Show/hide the separate "View Products" button */
  view_products_btn_enabled?: boolean;
  /** Custom label for the View Products button */
  products_button_text?: string;
  /** Custom color for the View Products button */
  products_button_color?: string;
  /** Optional external URL for the View Products button */
  products_url?: string;
  /** Show/hide the "Pay Now" button */
  pay_now_btn_enabled?: boolean;
  /** Show/hide the "My Location" button */
  location_btn_enabled?: boolean;
  services_enquiry_template?: string;
  /** Business WhatsApp number — used for ALL internal WA functions: share, forms, enquiry, booking */
  whatsapp_number?: string;
  pay_now_enabled?: boolean;
  upi_id?: string;
  upi_number?: string;
  payment_phone?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_holder_name?: string;
  booking_enabled?: boolean;
  booking_whatsapp_message?: string;
  gallery_enabled?: boolean;
  google_review_url?: string;
  products?: VCardProduct[];
  /** Separate service entries — distinct from products */
  services?: VCardService[];
  /** Label for the Enquire button in the Services tab (default: "Enquire") */
  services_enquiry_btn_text?: string;
  /** Background color for the Enquire button in the Services tab */
  services_enquiry_btn_color?: string;
  /** WhatsApp message template for Products tab enquiry (use {product} for item name) */
  products_enquiry_template?: string;
  /** Label for the Enquire button in the Products tab (default: "Enquire") */
  products_enquiry_btn_text?: string;
  /** Background color for the Enquire button in the Products tab */
  products_enquiry_btn_color?: string;
  active_action_icons?: VCardActionIconToggles;
  social_urls?: VCardSocialUrls;
}

export type SocialPosition = "top" | "center" | "below" | "everywhere";

export interface SocialLink {
  id?: string;
  platform?: string;
  name?: string;
  title?: string;
  url?: string;
  icon?: string;
  enabled?: boolean;
  is_active?: boolean;
  order?: number;
  [key: string]: any;
}

export interface ContentLink {
  id?: string;
  headline?: string;
  title?: string;
  description?: string;
  url?: string;
  icon?: string;
  featured?: boolean;
  enabled?: boolean;
  is_active?: boolean;
  order?: number;
  [key: string]: any;
}

export interface DocumentBlock {
  id?: string;
  title?: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  enabled?: boolean;
  order?: number;
  [key: string]: any;
}

export interface DriveBlock {
  id?: string;
  title?: string;
  description?: string;
  url?: string;
  enabled?: boolean;
  order?: number;
  [key: string]: any;
}

export interface QuickActionConfig {
  phone?: { number?: string; label?: string; enabled?: boolean };
  whatsapp?: { number?: string; message?: string; label?: string; enabled?: boolean };
  email?: { address?: string; label?: string; enabled?: boolean };
  website?: { url?: string; label?: string; enabled?: boolean };
  enabled?: boolean;
  show_call?: boolean;
  show_whatsapp?: boolean;
  show_email?: boolean;
  show_website?: boolean;
  [key: string]: any;
}

export interface TemplateAppearanceOptions extends VCardCustomOptions {
  // Generic appearance & styling
  bg_style?: string;
  color_palette?: string;
  custom_colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  company_name?: string;
  company_logo_url?: string;
  profile_image_url?: string;
  executive_role?: string;
  bio_override?: string;
  verified_badge?: boolean;
  trust_badges?: Array<{ id: string; text: string; icon?: string; enabled?: boolean }>;

  // Generic Reusable content
  social_position?: SocialPosition;
  social_links?: SocialLink[];
  content_links?: ContentLink[];
  document_block?: DocumentBlock;
  drive_block?: DriveBlock;
  quick_actions?: QuickActionConfig;

  // Feature toggles
  save_contact_enabled?: boolean;
  share_profile_enabled?: boolean;
  qr_code_enabled?: boolean;
  qr_title?: string;
  qr_desc?: string;
  qr_target_url?: string;

  [key: string]: any;
}

export interface ThemeTokens {
  color_background: string;
  color_surface: string;
  color_text_primary: string;
  color_text_secondary: string;
  color_accent: string;
  font_family: FontFamily;
  button_radius: ButtonRadius;
  button_style: ButtonStyle;
  animation: AnimationType;
  custom_options?: TemplateAppearanceOptions;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  template_id: string;
  theme_tokens: ThemeTokens | null;
  is_public: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords?: string[] | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  indexable?: boolean;
  primary_custom_domain?: string | null;
  show_branding?: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface PublicProfileStats {
  views: number;
  clicks: number;
  actions: number;
  days_live: number;
  engage: number;
}

export interface PublicProfile {
  id?: string;
  username: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  template_id: string;
  theme_tokens?: ThemeTokens | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  indexable?: boolean;
  primary_custom_domain?: string | null;
  show_branding?: boolean;
  created_at?: string;
  stats?: PublicProfileStats;
  blocks?: (ProfileBlock | PublicProfileBlock)[];
}

export type { PublicProfileBlock };

export interface CreateProfileInput {
  username: string;
  display_name: string;
  bio?: string;
}

export interface UpdateProfileInput {
  username?: string;
  display_name?: string;
  bio?: string | null;
  is_public?: boolean;
  version?: number;
}
