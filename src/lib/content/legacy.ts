import type { ProfileBlock, PublicProfileBlock } from "@/types/blocks";
import {
  CONTENT_LIMITS,
  defaultLayout,
  emptyCardContent,
  normalizeCardContent,
  type CardContent,
  type CardLink,
  type SocialPlatform,
} from "@/lib/zod/content";

/**
 * Legacy `theme_tokens.custom_options` (+ contact blocks) → typed card content.
 *
 * Mirror of backend/app/Services/LegacyContentMapper.php. It is used while a profile has no
 * `content` yet (until `profiles:migrate-content` runs at cutover), so the redesigned
 * templates and the old editor keep working on the same data. Keep the two in sync; the
 * shared fixtures live in LegacyContentMapperTest.php and content-legacy.test.ts.
 */

type Loose = Record<string, unknown>;
type AnyBlock = ProfileBlock | PublicProfileBlock;

export interface LegacyProfileFields {
  username?: string | null;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  template_id?: string | null;
}

export interface LegacyMapResult {
  content: CardContent;
  /** Blocks whose data was lifted into `contact`/`socials`; templates skip them in "More". */
  liftedBlockIds: string[];
  /** Style values that move to theme_tokens.template_style. */
  templateStyle: Record<string, string | boolean>;
}

export const PLACEHOLDER_BIOS = ["Welcome to my page!", "Welcome to my LinkForge page!"];

export const PALETTE_ALIASES: Record<string, string> = {
  "executive-forest": "sage",
  "enterprise-navy": "navy",
  "noir-gold": "gold",
  "terracotta-clay": "terracotta",
  "charcoal-minimal": "charcoal",
};

const VCARD_SOCIAL_KEYS = [
  "instagram", "facebook", "linkedin", "twitter", "youtube", "tiktok", "telegram",
  "github", "snapchat", "pinterest", "threads", "discord", "twitch", "spotify",
  "whatsapp_channel", "behance", "dribbble",
];

const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string =>
  typeof v === "string" ? v.trim() : typeof v === "number" || typeof v === "boolean" ? String(v) : "";
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const isHidden = (v: unknown) => [false, "false", 0, "0", "off", "hide", "hidden"].includes(v as never);
const truthy = (v: unknown) => v === true || v === "true" || v === 1 || v === "1";
const cut = (v: string, max: number) => v.slice(0, max);

/** http(s) URL, with https:// added to bare domains; anything else becomes "". */
export function legacyWebUrl(value: unknown): string {
  let url = str(value);
  if (!url) return "";
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url) && /^[\w-]+(\.[\w-]+)+([/?#:].*)?$/u.test(url)) {
    url = `https://${url.replace(/^\/+/, "")}`;
  }
  return /^https?:\/\/[^\s/$.?#][^\s]*$/i.test(url) ? cut(url, 2048) : "";
}

function imageUrl(value: unknown): string {
  const url = str(value);
  if (url.startsWith("/") && !url.startsWith("//")) return cut(url, 2048);
  return legacyWebUrl(url);
}

const ITEM_ID = /^[A-Za-z0-9_-]{1,40}$/;
const itemId = (id: unknown, prefix: string, index: number) => {
  const candidate = str(id);
  return ITEM_ID.test(candidate) ? candidate : `${prefix}-${index + 1}`;
};

function sizeLabel(bytes: unknown): string {
  const n = typeof bytes === "number" ? bytes : Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return "";
  return n >= 1048576 ? `${Math.round((n / 1048576) * 10) / 10} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

const BY_NAME: [SocialPlatform, string[]][] = [
  ["instagram", ["insta", "ig"]], ["facebook", ["facebook", "fb"]], ["linkedin", ["linkedin"]],
  ["x", ["twitter", "x"]], ["youtube", ["youtube", "yt"]], ["tiktok", ["tiktok"]],
  ["whatsapp_channel", ["whatsappchannel"]], ["whatsapp", ["whatsapp", "wa"]],
  ["telegram", ["telegram", "tg"]], ["github", ["github"]], ["snapchat", ["snap"]],
  ["pinterest", ["pinterest", "pin"]], ["threads", ["thread"]], ["discord", ["discord"]],
  ["twitch", ["twitch"]], ["spotify", ["spotify"]], ["behance", ["behance"]],
  ["dribbble", ["dribbble", "drib"]], ["medium", ["medium"]], ["reddit", ["reddit"]],
  ["google_business", ["googlebusiness", "googlebiz", "google", "review"]],
];

const BY_HOST: [SocialPlatform, string[]][] = [
  ["instagram", ["instagram.com", "instagr.am"]], ["facebook", ["facebook.com", "fb.com", "fb.me"]],
  ["linkedin", ["linkedin.com"]], ["x", ["twitter.com", "x.com"]], ["youtube", ["youtube.com", "youtu.be"]],
  ["tiktok", ["tiktok.com"]], ["whatsapp_channel", ["whatsapp.com/channel"]], ["whatsapp", ["wa.me", "whatsapp.com"]],
  ["telegram", ["t.me", "telegram.me"]], ["github", ["github.com"]], ["snapchat", ["snapchat.com"]],
  ["pinterest", ["pinterest.com", "pin.it"]], ["threads", ["threads.net"]], ["discord", ["discord.gg", "discord.com"]],
  ["twitch", ["twitch.tv"]], ["spotify", ["spotify.com"]], ["behance", ["behance.net"]],
  ["dribbble", ["dribbble.com"]], ["medium", ["medium.com"]], ["reddit", ["reddit.com"]],
  ["google_business", ["g.page", "business.google.com"]],
];

export function detectSocialPlatform(platform: string, url: string): SocialPlatform {
  const p = platform.toLowerCase().replace(/[-_ ]/g, "");
  const u = url.toLowerCase();
  if (p && !["custom", "website", "link", "url", "other", "site", "web"].includes(p)) {
    for (const [id, needles] of BY_NAME) {
      if (needles.some((n) => p === n || (n.length > 2 && p.includes(n)))) return id;
    }
  }
  for (const [id, needles] of BY_HOST) {
    if (needles.some((n) => u.includes(`//${n}`) || u.includes(`.${n}`))) return id;
  }
  return ["website", "web", "site", "link", "url"].includes(p) ? "website" : "other";
}

const cfg = (b: AnyBlock): Loose => (isObj(b.config) ? (b.config as Loose) : {});
const blockVisible = (b: AnyBlock) => (b as { is_visible?: boolean }).is_visible !== false;

export function legacyToCardContent(
  profile: LegacyProfileFields,
  customOptions: unknown,
  blocks: AnyBlock[] = []
): LegacyMapResult {
  const co: Loose = isObj(customOptions) ? customOptions : {};
  const isBotanical = profile.template_id === "botanical";
  const visible = blocks.filter(blockVisible);
  const first = (type: string) => visible.find((b) => b.type === type);
  const lifted: string[] = [];
  const content = emptyCardContent();

  // ── identity ──────────────────────────────────────────────────────────────────
  let bio = str(co.bio_override) || str(co.tagline_override) || str(profile.bio);
  if (PLACEHOLDER_BIOS.includes(bio) || isHidden(co.show_bio)) bio = "";

  let avatar = "";
  if (!truthy(co.remove_avatar)) {
    const keys = isBotanical ? ["profile_image_url", "custom_avatar_url"] : ["custom_avatar_url", "profile_image_url"];
    for (const key of keys) avatar = avatar || imageUrl(co[key]);
    avatar = avatar || imageUrl(profile.avatar_url);
  }

  const covers: string[] = [];
  const bannerOne = imageUrl(co.banner_image_url);
  if (bannerOne) covers.push(bannerOne);
  for (const url of list(co.banner_images)) {
    const clean = imageUrl(url);
    if (clean) covers.push(clean);
  }
  if (covers.length === 0 && imageUrl(profile.cover_url)) covers.push(imageUrl(profile.cover_url));

  const badges = list(co.trust_badges)
    .filter((b): b is Loose => isObj(b) && b.enabled !== false && str(b.text) !== "")
    .map((b) => cut(str(b.text), 40));

  content.identity = {
    name: cut(str(co.display_name_override) || str(profile.display_name) || str(profile.username), 100),
    role: isHidden(co.show_executive_role) ? "" : cut(str(co.executive_role), 100),
    company: isHidden(co.show_company_name) ? "" : cut(str(co.company_name), 100),
    bio: cut(bio, 500),
    avatar_url: avatar,
    logo_url: imageUrl(co.company_logo_url),
    cover_images: [...new Set(covers)].slice(0, CONTENT_LIMITS.cover_images),
    category_label: cut(str(co.category_badge_text), 60),
    hours: "",
    badges: badges.slice(0, CONTENT_LIMITS.badges),
    verified_badge: (isBotanical ? co.verified_badge : co.show_meta_verified) !== false,
  };

  // ── contact ───────────────────────────────────────────────────────────────────
  const qa: Loose = isObj(co.quick_actions) ? co.quick_actions : {};
  const qaItem = (key: string): Loose => (isObj(qa[key]) ? (qa[key] as Loose) : {});
  const qaOff = (show: string, item: string) => qa[show] === false || qaItem(item).enabled === false;

  const phoneBlock = first("phone");
  let phone = str(qaItem("phone").number) || str(co.phone);
  if (!phone && phoneBlock) {
    phone = str(cfg(phoneBlock).phone);
    if (phone) lifted.push(phoneBlock.id);
  }
  phone = phone || str(co.payment_phone);
  if (qaOff("show_call", "phone")) phone = "";

  const waBlock = first("whatsapp");
  let whatsapp = str(co.whatsapp_number) || str(qaItem("whatsapp").number) || str(co.whatsapp);
  if (!whatsapp && waBlock) {
    whatsapp = str(cfg(waBlock).phone);
    if (whatsapp) lifted.push(waBlock.id);
  }
  // The old VCard always offered WhatsApp on the main phone number.
  if (!whatsapp && !isBotanical) whatsapp = phone;
  if (qaOff("show_whatsapp", "whatsapp")) whatsapp = "";

  const emailBlock = first("email");
  let email = str(qaItem("email").address) || str(co.email);
  if (!email && emailBlock) {
    email = str(cfg(emailBlock).email);
    if (email) lifted.push(emailBlock.id);
  }
  if (qaOff("show_email", "email")) email = "";

  const socialUrls: Loose = isObj(co.social_urls) ? co.social_urls : {};
  let website =
    legacyWebUrl(socialUrls.website) || legacyWebUrl(co.website_url) || legacyWebUrl(qaItem("website").url) || legacyWebUrl(co.website);
  if (qaOff("show_website", "website")) website = "";

  const mapBlock = first("map");
  let address = str(co.address_text);
  if (!address && mapBlock) {
    address = str(cfg(mapBlock).address);
    if (address) lifted.push(mapBlock.id);
  }

  content.contact = {
    phone: cut(phone, 24),
    whatsapp: cut(whatsapp, 24),
    email: cut(email, 254),
    website,
    address: cut(address, 300),
    map_url: legacyWebUrl(co.map_url),
  };

  // ── socials ───────────────────────────────────────────────────────────────────
  const socials: { platform: SocialPlatform; url: string }[] = [];
  const toggles: Loose = isObj(co.active_action_icons) ? co.active_action_icons : {};
  for (const key of VCARD_SOCIAL_KEYS) {
    const url = legacyWebUrl(socialUrls[key]);
    if (url && toggles[key] !== false) socials.push({ platform: (key === "twitter" ? "x" : key) as SocialPlatform, url });
  }
  for (const link of list(co.social_links)) {
    if (!isObj(link) || link.enabled === false || link.is_active === false) continue;
    const url = legacyWebUrl(link.url);
    if (url) socials.push({ platform: detectSocialPlatform(str(link.platform), url), url });
  }
  if (socials.length === 0) {
    for (const block of visible.filter((b) => b.type === "social")) {
      const url = legacyWebUrl(cfg(block).url);
      if (url) {
        socials.push({ platform: detectSocialPlatform(str(cfg(block).platform), url), url });
        lifted.push(block.id);
      }
    }
  }
  const seen = new Set<string>();
  content.socials = [];
  for (const social of socials) {
    if (seen.has(social.url) || content.socials.length >= CONTENT_LIMITS.socials) continue;
    seen.add(social.url);
    content.socials.push({ id: `s${content.socials.length + 1}`, ...social });
  }

  // ── catalog ───────────────────────────────────────────────────────────────────
  const services = list(co.services).flatMap((svc, i) => {
    if (!isObj(svc)) return [];
    const name = str(svc.name ?? svc.title);
    if (!name) return [];
    return [{
      id: itemId(svc.id, "svc", i),
      name: cut(name, 100),
      description: cut(str(svc.description), 300),
      price: cut(str(svc.price), 40),
      duration: cut(str(svc.duration), 40),
      image_url: "",
    }];
  });
  const products = list(co.products).flatMap((prod, i) => {
    if (!isObj(prod)) return [];
    const name = str(prod.name ?? prod.title);
    if (!name) return [];
    return [{
      id: itemId(prod.id, "prd", i),
      name: cut(name, 100),
      description: cut(str(prod.description), 300),
      price: cut(str(prod.price), 40),
      image_url: imageUrl(prod.image_url),
      buy_url: legacyWebUrl(prod.buy_url),
    }];
  });
  const enquiry = str(co.services_enquiry_template) || str(co.products_enquiry_template);
  content.catalog = {
    services_label: "Services",
    products_label: "Products",
    services: services.slice(0, CONTENT_LIMITS.services),
    products: products.slice(0, CONTENT_LIMITS.products),
    enquiry_message: cut(enquiry.replace(/\{service\}|\{product\}/g, "{item}"), 300),
  };

  // ── payments ──────────────────────────────────────────────────────────────────
  content.payments = {
    upi_id: str(co.upi_id),
    upi_name: cut(str(co.bank_holder_name), 100),
    payment_phone: cut(str(co.payment_phone) || str(co.upi_number), 24),
    bank: {
      holder: cut(str(co.bank_holder_name), 100),
      bank_name: cut(str(co.bank_name), 100),
      account_number: str(co.bank_account_number),
      ifsc: str(co.bank_ifsc).toUpperCase(),
    },
  };

  // ── gallery ───────────────────────────────────────────────────────────────────
  content.gallery = {
    title: cut(str(co.gallery_title), 60),
    images: [...new Set(list(co.gallery_images).map(imageUrl).filter(Boolean))].slice(0, CONTENT_LIMITS.gallery),
  };

  // ── links & documents ─────────────────────────────────────────────────────────
  const links: CardLink[] = [];
  list(co.content_links).forEach((link, i) => {
    if (!isObj(link) || link.enabled === false || link.is_active === false) return;
    const url = legacyWebUrl(link.url);
    if (!url) return;
    links.push({
      id: itemId(link.id, "lnk", i),
      title: cut(str(link.headline) || str(link.title) || "Link", 100),
      description: cut(str(link.description), 200),
      url,
      icon: cut(str(link.icon).replace(/[^a-z_]/gi, "").toLowerCase(), 30),
      featured: Boolean(link.featured ?? link.is_featured ?? false),
    });
  });
  const drive = isObj(co.drive_block) ? co.drive_block : null;
  const driveUrl = drive && drive.enabled !== false ? legacyWebUrl(drive.url) : "";
  if (drive && driveUrl) {
    links.push({
      id: "drive",
      title: cut(str(drive.title) || "Shared files", 100),
      description: cut(str(drive.description), 200),
      url: driveUrl,
      icon: "folder",
      featured: false,
    });
  }
  const productsUrl = co.view_products_btn_enabled === true ? legacyWebUrl(co.products_url) : "";
  if (productsUrl) {
    links.push({
      id: "products-link",
      title: cut(str(co.products_button_text) || "View products", 100),
      description: "",
      url: productsUrl,
      icon: "shop",
      featured: false,
    });
  }
  content.links = links.slice(0, CONTENT_LIMITS.links);

  const doc = isObj(co.document_block) ? co.document_block : null;
  const docUrl = doc && doc.enabled !== false ? legacyWebUrl(doc.file_url) : "";
  content.documents =
    doc && docUrl
      ? [{
          id: "doc-1",
          title: cut(str(doc.title) || "Document", 100),
          description: cut(str(doc.description), 200),
          url: docUrl,
          file_name: cut(str(doc.file_name), 200),
          size_label: sizeLabel(doc.file_size),
        }]
      : [];

  // ── actions & layout ──────────────────────────────────────────────────────────
  const iconOn = (key: string) => toggles[key] !== false;
  let booking = "";
  if (co.booking_enabled === true || str(co.booking_whatsapp_message)) {
    booking = str(co.booking_whatsapp_message) || "Hi! I would like to book an appointment.";
  }
  content.actions = {
    save_contact: co.show_save_contact !== false && co.save_contact_enabled !== false && iconOn("save_contact"),
    share: co.show_share !== false && co.share_profile_enabled !== false,
    qr: co.show_qr !== false && co.qr_code_enabled !== false && iconOn("qr"),
    review_url: legacyWebUrl(co.google_review_url),
    booking_message: cut(booking, 300),
  };

  const hidden: Partial<Record<string, boolean>> = {
    services: co.view_service_btn_enabled === false,
    payments: co.pay_now_btn_enabled === false || co.pay_now_enabled === false,
    gallery: co.gallery_enabled === false,
    review: co.review_btn_enabled === false,
  };
  content.layout = defaultLayout().map((entry) => ({ ...entry, visible: !hidden[entry.key] }));

  // ── style ─────────────────────────────────────────────────────────────────────
  const templateStyle: Record<string, string | boolean> = {};
  if (isBotanical) {
    const palette = str(co.color_palette) || str(co.palette);
    templateStyle.palette = PALETTE_ALIASES[palette] ?? (palette || "sage");
    templateStyle.background = str(co.bg_style).replace(/^bg-/, "") || "botanical";
  } else {
    templateStyle.cover_slideshow = co.banner_transition !== false;
  }

  return {
    content: normalizeCardContent(content),
    liftedBlockIds: [...new Set(lifted)],
    templateStyle,
  };
}
