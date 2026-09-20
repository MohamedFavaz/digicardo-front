import { z } from "zod";

const HTTP_URL_REGEX = /^https?:\/\/[^\s$.?#].[^\s]*$/i;

export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
  "x",
  "tiktok",
  "github",
  "website",
] as const;

export const LinkBlockConfigSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  url: z
    .string()
    .min(1, "URL is required")
    .max(500, "URL is too long")
    .regex(HTTP_URL_REGEX, "Must be a valid HTTP or HTTPS URL"),
  icon: z.string().max(50).nullable().optional(),
  thumbnail_media_id: z.string().length(26, "Thumbnail ID must be a 26-char ULID").nullable().optional(),
});

export const HeadingBlockConfigSchema = z.object({
  text: z.string().min(1, "Heading text is required").max(120, "Heading is too long"),
  level: z.enum(["h1", "h2", "h3"]).default("h2"),
});

export const TextBlockConfigSchema = z.object({
  content: z.string().min(1, "Content is required").max(1000, "Text is too long"),
  align: z.enum(["left", "center", "right"]).default("center"),
});

export const DividerBlockConfigSchema = z.object({
  style: z.enum(["line", "dots", "space"]).default("line"),
});

export const SocialBlockConfigSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS, {
    errorMap: () => ({ message: "Invalid social platform" }),
  }),
  url: z
    .string()
    .min(1, "URL is required")
    .max(500, "URL is too long")
    .regex(HTTP_URL_REGEX, "Must be a valid HTTP or HTTPS URL"),
});

export const ImageBlockConfigSchema = z.object({
  media_id: z.string().length(26, "Media ID must be a 26-char ULID"),
  alt_text: z.string().max(255, "Alt text is too long").nullable().optional(),
  caption: z.string().max(255, "Caption is too long").nullable().optional(),
  link_url: z
    .string()
    .max(500, "Link URL is too long")
    .regex(HTTP_URL_REGEX, "Must be a valid HTTP or HTTPS URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  open_in_new_tab: z.boolean().default(true).optional(),
});

export const VideoBlockConfigSchema = z.object({
  provider: z.enum(["youtube", "vimeo"]),
  url: z
    .string()
    .min(1, "Video URL is required")
    .max(500, "Video URL is too long")
    .regex(HTTP_URL_REGEX, "Must be a valid HTTP or HTTPS URL"),
  title: z.string().max(120, "Title is too long").nullable().optional(),
});

export const MusicBlockConfigSchema = z.object({
  provider: z.enum(["spotify", "apple_music", "soundcloud"]),
  url: z
    .string()
    .min(1, "Music URL is required")
    .max(500, "Music URL is too long")
    .regex(HTTP_URL_REGEX, "Must be a valid HTTP or HTTPS URL"),
  title: z.string().max(120, "Title is too long").nullable().optional(),
});

export const MapBlockConfigSchema = z.object({
  label: z.string().max(120).nullable().optional(),
  address: z.string().max(255).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  map_provider: z.enum(["google_maps", "osm"]).default("google_maps").optional(),
  display_mode: z.enum(["card", "embed"]).default("card").optional(),
  open_in_new_tab: z.boolean().default(true).optional(),
});

export const ContactBlockConfigSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(300).nullable().optional(),
  name_enabled: z.boolean().default(true).optional(),
  email_enabled: z.boolean().default(true).optional(),
  phone_enabled: z.boolean().default(false).optional(),
  message_enabled: z.boolean().default(true).optional(),
  button_label: z.string().max(50).default("Send Message").optional(),
});

export const EmailBlockConfigSchema = z.object({
  label: z.string().min(1, "Label is required").max(100),
  email: z.string().email("Must be a valid email address").max(255),
  subject: z.string().max(200).nullable().optional(),
  body: z.string().max(1000).nullable().optional(),
});

export const PhoneBlockConfigSchema = z.object({
  label: z.string().min(1, "Label is required").max(100),
  phone: z.string().min(3, "Phone number is required").max(30),
});

export const WhatsAppBlockConfigSchema = z.object({
  label: z.string().min(1, "Label is required").max(100),
  phone: z.string().min(3, "Phone number is required").max(30),
  message: z.string().max(500).nullable().optional(),
});

export const BookingBlockConfigSchema = z.object({
  provider: z.enum(["calendly", "cal"]),
  url: z
    .string()
    .min(1, "Booking URL is required")
    .max(500)
    .regex(HTTP_URL_REGEX, "Must be a valid HTTP or HTTPS URL"),
  title: z.string().max(100).nullable().optional(),
  display_mode: z.enum(["button", "inline_embed"]).default("button").optional(),
});

export const FaqItemSchema = z.object({
  id: z.string().min(1).max(36),
  question: z.string().min(1, "Question is required").max(200),
  answer: z.string().min(1, "Answer is required").max(1000),
});

export const FaqBlockConfigSchema = z.object({
  title: z.string().max(120).nullable().optional(),
  items: z.array(FaqItemSchema).min(1, "At least one FAQ item is required").max(20),
});

export const GalleryBlockConfigSchema = z.object({
  layout: z.enum(["grid", "carousel", "masonry"]).default("grid").optional(),
  media_ids: z
    .array(z.string().length(26, "Each image must be a 26-char ULID"))
    .min(1, "At least one image is required")
    .max(20, "Maximum 20 images allowed")
    .refine((items) => new Set(items).size === items.length, {
      message: "Duplicate images are not allowed in the gallery",
    }),
});

export const CountdownBlockConfigSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  target_date: z.string().min(1, "Target date is required"),
  expired_message: z.string().max(200).nullable().optional(),
});

export const CtaBlockConfigSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(300).nullable().optional(),
  button_label: z.string().min(1, "Button label is required").max(60),
  url: z
    .string()
    .min(1, "URL is required")
    .max(500)
    .regex(HTTP_URL_REGEX, "Must be a valid HTTP or HTTPS URL"),
  style: z.enum(["primary", "secondary", "outline", "gradient"]).default("primary").optional(),
  size: z.enum(["small", "medium", "large"]).default("medium").optional(),
  open_in_new_tab: z.boolean().default(true).optional(),
});

export const BlockTypeSchema = z.enum([
  "link",
  "heading",
  "text",
  "divider",
  "social",
  "image",
  "video",
  "music",
  "map",
  "contact",
  "email",
  "phone",
  "whatsapp",
  "booking",
  "faq",
  "gallery",
  "countdown",
  "cta",
]);

export const CreateBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("link"), config: LinkBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("heading"), config: HeadingBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("text"), config: TextBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("divider"), config: DividerBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("social"), config: SocialBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("image"), config: ImageBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("video"), config: VideoBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("music"), config: MusicBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("map"), config: MapBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("contact"), config: ContactBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("email"), config: EmailBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("phone"), config: PhoneBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("whatsapp"), config: WhatsAppBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("booking"), config: BookingBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("faq"), config: FaqBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("gallery"), config: GalleryBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("countdown"), config: CountdownBlockConfigSchema, is_visible: z.boolean().optional() }),
  z.object({ type: z.literal("cta"), config: CtaBlockConfigSchema, is_visible: z.boolean().optional() }),
]);

export const UpdateBlockSchema = z.object({
  type: BlockTypeSchema.optional(),
  config: z.record(z.unknown()).optional(),
  is_visible: z.boolean().optional(),
  version: z.number().int().positive("Version must be a positive integer"),
});

export const BlockReorderSchema = z.object({
  version: z.number().int().positive("Version must be a positive integer"),
  ordered_ids: z
    .array(z.string().length(26, "Each ID must be a valid 26-char ULID"))
    .min(1, "At least one ID required")
    .refine((items) => new Set(items).size === items.length, {
      message: "Duplicate block IDs are not permitted",
    }),
});

export type LinkBlockConfig = z.infer<typeof LinkBlockConfigSchema>;
export type HeadingBlockConfig = z.infer<typeof HeadingBlockConfigSchema>;
export type TextBlockConfig = z.infer<typeof TextBlockConfigSchema>;
export type DividerBlockConfig = z.infer<typeof DividerBlockConfigSchema>;
export type SocialBlockConfig = z.infer<typeof SocialBlockConfigSchema>;
export type ImageBlockConfig = z.infer<typeof ImageBlockConfigSchema>;
export type VideoBlockConfig = z.infer<typeof VideoBlockConfigSchema>;
export type MusicBlockConfig = z.infer<typeof MusicBlockConfigSchema>;
export type MapBlockConfig = z.infer<typeof MapBlockConfigSchema>;
export type ContactBlockConfig = z.infer<typeof ContactBlockConfigSchema>;
export type EmailBlockConfig = z.infer<typeof EmailBlockConfigSchema>;
export type PhoneBlockConfig = z.infer<typeof PhoneBlockConfigSchema>;
export type WhatsAppBlockConfig = z.infer<typeof WhatsAppBlockConfigSchema>;
export type BookingBlockConfig = z.infer<typeof BookingBlockConfigSchema>;
export type FaqBlockConfig = z.infer<typeof FaqBlockConfigSchema>;
export type GalleryBlockConfig = z.infer<typeof GalleryBlockConfigSchema>;
export type CountdownBlockConfig = z.infer<typeof CountdownBlockConfigSchema>;
export type CtaBlockConfig = z.infer<typeof CtaBlockConfigSchema>;
export type CreateBlockPayload = z.infer<typeof CreateBlockSchema>;
export type UpdateBlockPayload = z.infer<typeof UpdateBlockSchema>;
export type BlockReorderPayload = z.infer<typeof BlockReorderSchema>;
