/**
 * Block Type Definitions for Digicardo Content Block Engine (18 Block Types)
 */

export type BlockType =
  | "link"
  | "heading"
  | "text"
  | "divider"
  | "social"
  | "image"
  | "video"
  | "music"
  | "map"
  | "contact"
  | "email"
  | "phone"
  | "whatsapp"
  | "booking"
  | "faq"
  | "gallery"
  | "countdown"
  | "cta";

export type BlockCategory = "BASIC" | "MEDIA" | "CONTACT" | "BUSINESS" | "CONTENT";

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "x"
  | "tiktok"
  | "github"
  | "website";

export interface LinkBlockConfig {
  title: string;
  url: string;
  icon?: string | null;
  thumbnail_media_id?: string | null;
  thumbnail_url?: string | null;
}

export interface HeadingBlockConfig {
  text: string;
  level?: "h1" | "h2" | "h3";
}

export interface TextBlockConfig {
  content: string;
  align?: "left" | "center" | "right";
}

export interface DividerBlockConfig {
  style?: "line" | "dots" | "space";
}

export interface SocialBlockConfig {
  platform: SocialPlatform;
  url: string;
}

export interface ImageBlockConfig {
  media_id: string;
  alt_text?: string | null;
  caption?: string | null;
  link_url?: string | null;
  open_in_new_tab?: boolean;
  url?: string;
  width?: number | null;
  height?: number | null;
}

export interface VideoBlockConfig {
  provider: "youtube" | "vimeo";
  url: string;
  title?: string | null;
  video_id?: string;
  embed_url?: string;
}

export interface MusicBlockConfig {
  provider: "spotify" | "apple_music" | "soundcloud";
  url: string;
  title?: string | null;
  embed_url?: string;
}

export interface MapBlockConfig {
  label?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  map_provider?: "google_maps" | "osm";
  display_mode?: "card" | "embed";
  open_in_new_tab?: boolean;
}

export interface ContactBlockConfig {
  title: string;
  description?: string | null;
  name_enabled?: boolean;
  email_enabled?: boolean;
  phone_enabled?: boolean;
  message_enabled?: boolean;
  button_label?: string | null;
}

export interface EmailBlockConfig {
  label: string;
  email: string;
  subject?: string | null;
  body?: string | null;
}

export interface PhoneBlockConfig {
  label: string;
  phone: string;
}

export interface WhatsAppBlockConfig {
  label: string;
  phone: string;
  message?: string | null;
}

export interface BookingBlockConfig {
  provider: "calendly" | "cal";
  url: string;
  title?: string | null;
  display_mode?: "button" | "inline_embed";
  is_allowlisted?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqBlockConfig {
  title?: string | null;
  items: FaqItem[];
}

export interface GalleryImageItem {
  id: string;
  url: string;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
}

export interface GalleryBlockConfig {
  layout?: "grid" | "carousel" | "masonry";
  media_ids: string[];
  images?: GalleryImageItem[];
}

export interface CountdownBlockConfig {
  title: string;
  target_date: string; // ISO 8601 string
  expired_message?: string | null;
}

export interface CtaBlockConfig {
  title: string;
  description?: string | null;
  button_label: string;
  url: string;
  style?: "primary" | "secondary" | "outline" | "gradient";
  size?: "small" | "medium" | "large";
  open_in_new_tab?: boolean;
}

export type BlockConfig =
  | LinkBlockConfig
  | HeadingBlockConfig
  | TextBlockConfig
  | DividerBlockConfig
  | SocialBlockConfig
  | ImageBlockConfig
  | VideoBlockConfig
  | MusicBlockConfig
  | MapBlockConfig
  | ContactBlockConfig
  | EmailBlockConfig
  | PhoneBlockConfig
  | WhatsAppBlockConfig
  | BookingBlockConfig
  | FaqBlockConfig
  | GalleryBlockConfig
  | CountdownBlockConfig
  | CtaBlockConfig;

export interface ProfileBlock<T = BlockConfig> {
  id: string; // 26-char ULID
  profile_id: string;
  type: BlockType;
  sort_order: number;
  config: T;
  is_visible: boolean;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export interface PublicProfileBlock<T = BlockConfig> {
  id: string;
  profile_id?: string;
  type: BlockType;
  sort_order: number;
  config: T;
}

export interface CreateBlockInput {
  type: BlockType;
  config: BlockConfig;
  is_visible?: boolean;
}

export interface UpdateBlockInput {
  type?: BlockType;
  config?: BlockConfig;
  is_visible?: boolean;
  version: number;
}

export interface BlockReorderInput {
  ordered_ids: string[];
  version: number;
}
