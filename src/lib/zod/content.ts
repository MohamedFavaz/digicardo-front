import { z } from "zod";

/**
 * Typed card content (ADR-030). One shape for every template; empty strings mean "not set"
 * and are hidden on the card. Mirrors backend/app/Services/CardContentSchema.php and
 * UpdateProfileContentRequest.php — keep them in sync (AGENTS.md rule 12).
 */

export const CONTENT_SCHEMA_VERSION = 1;

export const CONTENT_PARTS = [
  "identity",
  "contact",
  "socials",
  "catalog",
  "payments",
  "gallery",
  "links",
  "documents",
  "actions",
  "layout",
] as const;
export type ContentPart = (typeof CONTENT_PARTS)[number];

/** Card sections whose order and visibility the owner controls. */
export const SECTION_KEYS = [
  "services",
  "products",
  "payments",
  "gallery",
  "links",
  "documents",
  "review",
  "qr",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "x",
  "youtube",
  "tiktok",
  "whatsapp",
  "telegram",
  "github",
  "snapchat",
  "pinterest",
  "threads",
  "discord",
  "twitch",
  "spotify",
  "whatsapp_channel",
  "behance",
  "dribbble",
  "medium",
  "reddit",
  "google_business",
  "website",
  "other",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const CONTENT_LIMITS = {
  cover_images: 6,
  badges: 4,
  socials: 25,
  services: 50,
  products: 50,
  gallery: 30,
  links: 30,
  documents: 10,
} as const;

export const UPI_REGEX = /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ITEM_ID_REGEX = /^[A-Za-z0-9_-]{1,40}$/;

const text = (max: number) => z.string().trim().max(max);

/** Absolute http(s) URL; "" means not set. */
export const webUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => v === "" || /^https?:\/\/[^\s/$.?#][^\s]*$/i.test(v), {
    message: "Enter a full web address that starts with https://",
  });

/** Image: http(s) URL or a site-relative storage path; ownership is checked by the server. */
export const imageUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => v === "" || /^https?:\/\//i.test(v) || (v.startsWith("/") && !v.startsWith("//")), {
    message: "Upload this image to your card first, then pick it here.",
  });

export const phoneSchema = z
  .string()
  .trim()
  .max(24)
  .refine(
    (v) => {
      if (v === "") return true;
      const digits = v.replace(/\D/g, "");
      return /^\+?[0-9 ()-]{7,24}$/.test(v) && digits.length >= 7 && digits.length <= 15;
    },
    { message: "Enter a phone number with country code, like +91 98765 43210." }
  );

const itemId = z.string().regex(ITEM_ID_REGEX);

export const identitySchema = z.object({
  name: text(100).min(1, "Add your name or business name."),
  role: text(100),
  company: text(100),
  bio: text(500),
  avatar_url: imageUrlSchema,
  logo_url: imageUrlSchema,
  cover_images: z.array(imageUrlSchema).max(CONTENT_LIMITS.cover_images),
  category_label: text(60),
  hours: text(80),
  badges: z.array(text(40)).max(CONTENT_LIMITS.badges),
  verified_badge: z.boolean(),
});

export const contactSchema = z.object({
  phone: phoneSchema,
  whatsapp: phoneSchema,
  email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Enter an email address like name@example.com.",
    }),
  website: webUrlSchema,
  address: text(300),
  map_url: webUrlSchema,
});

export const socialLinkSchema = z.object({
  id: itemId,
  platform: z.enum(SOCIAL_PLATFORMS),
  url: webUrlSchema.refine((v) => v !== "", { message: "Add the link." }),
});

export const serviceSchema = z.object({
  id: itemId,
  name: text(100).min(1, "Add a name."),
  description: text(300),
  price: text(40),
  duration: text(40),
  image_url: imageUrlSchema,
});

export const productSchema = z.object({
  id: itemId,
  name: text(100).min(1, "Add a name."),
  description: text(300),
  price: text(40),
  image_url: imageUrlSchema,
  buy_url: webUrlSchema,
});

export const catalogSchema = z.object({
  services_label: text(40),
  products_label: text(40),
  services: z.array(serviceSchema).max(CONTENT_LIMITS.services),
  products: z.array(productSchema).max(CONTENT_LIMITS.products),
  enquiry_message: text(300),
});

export const paymentsSchema = z.object({
  upi_id: z
    .string()
    .trim()
    .refine((v) => v === "" || UPI_REGEX.test(v), { message: "Enter a UPI ID like name@bank." }),
  upi_name: text(100),
  payment_phone: phoneSchema,
  bank: z.object({
    holder: text(100),
    bank_name: text(100),
    account_number: z
      .string()
      .trim()
      .refine((v) => v === "" || /^[0-9A-Za-z]{4,34}$/.test(v), {
        message: "Use only letters and numbers (4–34 characters).",
      }),
    ifsc: z
      .string()
      .trim()
      .transform((v) => v.toUpperCase())
      .refine((v) => v === "" || IFSC_REGEX.test(v), {
        message: "Enter an 11-character IFSC code like HDFC0001234.",
      }),
  }),
});

export const gallerySchema = z.object({
  title: text(60),
  images: z.array(imageUrlSchema).max(CONTENT_LIMITS.gallery),
});

export const linkSchema = z.object({
  id: itemId,
  title: text(100).min(1, "Add a title."),
  description: text(200),
  url: webUrlSchema.refine((v) => v !== "", { message: "Add the link." }),
  icon: z.string().regex(/^[a-z_]{0,30}$/),
  featured: z.boolean(),
});

export const documentSchema = z.object({
  id: itemId,
  title: text(100).min(1, "Add a title."),
  description: text(200),
  url: webUrlSchema.refine((v) => v !== "", { message: "Add the file link." }),
  file_name: text(200),
  size_label: text(20),
});

export const actionsSchema = z.object({
  save_contact: z.boolean(),
  share: z.boolean(),
  qr: z.boolean(),
  review_url: webUrlSchema,
  booking_message: text(300),
});

export const layoutSchema = z
  .array(z.object({ key: z.enum(SECTION_KEYS), visible: z.boolean() }))
  .max(SECTION_KEYS.length);

export const cardContentSchema = z.object({
  schema_version: z.literal(CONTENT_SCHEMA_VERSION),
  identity: identitySchema,
  contact: contactSchema,
  socials: z.array(socialLinkSchema).max(CONTENT_LIMITS.socials),
  catalog: catalogSchema,
  payments: paymentsSchema,
  gallery: gallerySchema,
  links: z.array(linkSchema).max(CONTENT_LIMITS.links),
  documents: z.array(documentSchema).max(CONTENT_LIMITS.documents),
  actions: actionsSchema,
  layout: layoutSchema,
});

export type CardContent = z.infer<typeof cardContentSchema>;
export type CardIdentity = CardContent["identity"];
export type CardContact = CardContent["contact"];
export type CardSocialLink = CardContent["socials"][number];
export type CardService = CardContent["catalog"]["services"][number];
export type CardProduct = CardContent["catalog"]["products"][number];
export type CardLink = CardContent["links"][number];
export type CardDocument = CardContent["documents"][number];
export type CardLayoutEntry = CardContent["layout"][number];

/** PATCH /profile/content body. */
export const updateContentRequestSchema = z.object({
  version: z.number().int().min(1),
  sections: cardContentSchema
    .omit({ schema_version: true })
    .partial()
    .refine((s) => Object.keys(s).length > 0, { message: "Send at least one part." }),
});
export type UpdateContentRequest = z.infer<typeof updateContentRequestSchema>;

export function defaultLayout(): CardLayoutEntry[] {
  return SECTION_KEYS.map((key) => ({ key, visible: true }));
}

/** A complete, empty content document (same as CardContentSchema::empty()). */
export function emptyCardContent(): CardContent {
  return {
    schema_version: CONTENT_SCHEMA_VERSION,
    identity: {
      name: "",
      role: "",
      company: "",
      bio: "",
      avatar_url: "",
      logo_url: "",
      cover_images: [],
      category_label: "",
      hours: "",
      badges: [],
      verified_badge: false,
    },
    contact: { phone: "", whatsapp: "", email: "", website: "", address: "", map_url: "" },
    socials: [],
    catalog: { services_label: "Services", products_label: "Products", services: [], products: [], enquiry_message: "" },
    payments: {
      upi_id: "",
      upi_name: "",
      payment_phone: "",
      bank: { holder: "", bank_name: "", account_number: "", ifsc: "" },
    },
    gallery: { title: "", images: [] },
    links: [],
    documents: [],
    actions: { save_contact: true, share: true, qr: true, review_url: "", booking_message: "" },
    layout: defaultLayout(),
  };
}

/** Keeps known section keys once each, then appends missing ones (visible). */
export function normalizeLayout(layout: unknown): CardLayoutEntry[] {
  const out: CardLayoutEntry[] = [];
  const seen = new Set<SectionKey>();
  if (Array.isArray(layout)) {
    for (const entry of layout) {
      const key = (entry as { key?: unknown } | null)?.key;
      if (typeof key === "string" && (SECTION_KEYS as readonly string[]).includes(key) && !seen.has(key as SectionKey)) {
        seen.add(key as SectionKey);
        out.push({ key: key as SectionKey, visible: (entry as { visible?: unknown }).visible !== false });
      }
    }
  }
  for (const key of SECTION_KEYS) {
    if (!seen.has(key)) out.push({ key, visible: true });
  }
  return out;
}

type Loose = Record<string, unknown>;

const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const strList = (v: unknown, max: number): string[] =>
  Array.isArray(v) ? [...new Set(v.map(str).filter(Boolean))].slice(0, max) : [];

function objList<T extends Record<string, string | boolean>>(v: unknown, shape: T, max: number): T[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter(isObj)
    .slice(0, max)
    .map((item, index) => {
      const row = {} as Record<string, string | boolean>;
      for (const [key, def] of Object.entries(shape)) {
        row[key] = typeof def === "boolean" ? Boolean(item[key] ?? def) : str(item[key]) || (def as string);
      }
      if ("id" in shape && !ITEM_ID_REGEX.test(String(row.id))) row.id = `item-${index + 1}`;
      return row as T;
    });
}

/**
 * Fills a possibly partial content object (e.g. from the API) into the full shape, the same
 * way CardContentSchema::normalize() does. Unknown keys are dropped; values are not validated.
 */
export function normalizeCardContent(input: unknown): CardContent {
  const base = emptyCardContent();
  if (!isObj(input)) return base;

  const pick = <T extends Loose>(defaults: T, value: unknown): T => {
    if (!isObj(value)) return { ...defaults };
    const out = {} as Loose;
    for (const [key, def] of Object.entries(defaults)) {
      const v = value[key];
      if (typeof def === "string") out[key] = typeof v === "string" || typeof v === "number" ? String(v).trim() : def;
      else if (typeof def === "boolean") out[key] = typeof v === "boolean" ? v : v === undefined || v === null ? def : Boolean(v);
      else out[key] = v ?? def;
    }
    return out as T;
  };

  const identity = pick(base.identity, input.identity);
  identity.cover_images = strList(identity.cover_images, CONTENT_LIMITS.cover_images);
  identity.badges = strList(identity.badges, CONTENT_LIMITS.badges);

  const catalogIn = isObj(input.catalog) ? input.catalog : {};
  const paymentsIn = isObj(input.payments) ? input.payments : {};
  const galleryIn = isObj(input.gallery) ? input.gallery : {};

  return {
    schema_version: CONTENT_SCHEMA_VERSION,
    identity,
    contact: pick(base.contact, input.contact),
    socials: objList(input.socials, { id: "", platform: "other", url: "" }, CONTENT_LIMITS.socials).map((s) => ({
      ...s,
      platform: (SOCIAL_PLATFORMS as readonly string[]).includes(s.platform) ? (s.platform as SocialPlatform) : "other",
    })),
    catalog: {
      ...pick(
        { services_label: base.catalog.services_label, products_label: base.catalog.products_label, enquiry_message: "" },
        catalogIn
      ),
      services: objList(catalogIn.services, { id: "", name: "", description: "", price: "", duration: "", image_url: "" }, CONTENT_LIMITS.services),
      products: objList(
        catalogIn.products,
        { id: "", name: "", description: "", price: "", image_url: "", buy_url: "" },
        CONTENT_LIMITS.products
      ),
    },
    payments: {
      ...pick({ upi_id: "", upi_name: "", payment_phone: "" }, paymentsIn),
      bank: pick(base.payments.bank, paymentsIn.bank),
    },
    gallery: { title: str(galleryIn.title), images: strList(galleryIn.images, CONTENT_LIMITS.gallery) },
    links: objList(
      input.links,
      { id: "", title: "", description: "", url: "", icon: "", featured: false },
      CONTENT_LIMITS.links
    ),
    documents: objList(
      input.documents,
      { id: "", title: "", description: "", url: "", file_name: "", size_label: "" },
      CONTENT_LIMITS.documents
    ),
    actions: pick(base.actions, input.actions),
    layout: normalizeLayout(input.layout),
  };
}
