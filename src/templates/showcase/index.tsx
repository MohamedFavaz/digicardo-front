"use client";

/**
 * Showcase card template (id "showcase").
 *
 * Phone: dark header band, logo, name, a 2×2 grid of main buttons, a grid of round contact
 * icons, review + opening hours, a photo grid and a "share on WhatsApp" box.
 * Desktop (≥1024px, live card only): a three-column dashboard — profile on the left, photos and
 * contact icons in the middle, review / hours / quick actions / social share on the right.
 *
 * A floating menu (sticky at the bottom of the screen) has up to four icons - Home, Social, Gallery,
 * Products/Services - that jump to that part of the card. Owners can turn it off ("floating_nav").
 *
 * Like every template it only lays out the typed card content (ADR-030): nothing is fetched and
 * every part hides itself when its data is empty. Dashboard previews always show the phone layout.
 */

import * as React from "react";
import {
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  Globe,
  IndianRupee,
  Mail,
  MapPin,
  MousePointerClick,
  Phone,
  Plus,
  QrCode,
  ShoppingBag,
  Star,
  UserPlus,
  Zap,
  CalendarDays,
  Activity,
  AtSign,
  House,
  Images,
  type LucideIcon,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import type { PublicProfile } from "@/types/profile";
import type { AnalyticsEventType } from "@/types/analytics";
import type { SocialPlatform } from "@/lib/zod/content";
import type { TemplateProps } from "../types";
import { useCard, externalLinkProps, type CardModel } from "../shared/useCard";
import { BodySections, ExtraBlocks, QrSection } from "../shared/sections";
import { CardSheets } from "../shared/CardSheets";
import { CardFonts } from "../shared/CardChrome";
import { SocialIcon, SOCIAL_LABELS, WhatsAppGlyph, type CardIcon } from "../shared/SocialIcon";
import { directionsHref, enquiryNumber, initials, mailHref, telHref, upiHref, whatsappHref } from "../shared/actions";
import { entranceClass, mix } from "../shared/palette";
import { useOpenNow } from "../shared/hours";

// ── Helpers ────────────────────────────────────────────────────────────────────────

/** Is a body section switched on in the owner's layout? */
function sectionOn(card: CardModel, key: string): boolean {
  const entry = card.content.layout.find((e) => e.key === key);
  return entry ? entry.visible : true;
}

/** Scrolls to the copy of a section that is currently visible (phone and desktop each render one). */
function scrollToSection(id: string) {
  const target = [...document.querySelectorAll<HTMLElement>(`[id="${id}"]`)].find((el) => el.offsetParent !== null);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Colours for this template derived from the accent: gradient buttons, header band, headings. */
function useShowcaseColors(card: CardModel) {
  const accent = card.palette.accent;
  return React.useMemo(
    () =>
      ({
        "--sc-grad-from": mix(accent, "#05081A", 0.72),
        "--sc-grad-to": mix(accent, "#FFFFFF", 0.86),
        "--sc-band": mix(accent, "#0B1022", 0.22),
        "--sc-heading": card.palette.dark ? card.palette.ink : mix(accent, "#0B1022", 0.62),
        "--sc-shadow": card.palette.dark ? "0 1px 0 rgba(255,255,255,0.04)" : "0 6px 24px rgba(23, 30, 74, 0.07)",
      }) as React.CSSProperties,
    [accent, card.palette.dark, card.palette.ink]
  );
}

const panel = "rounded-[18px] border border-[var(--c-border)] bg-[var(--c-surface)] [box-shadow:var(--sc-shadow)]";
const gradientButton =
  "flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,var(--sc-grad-from),var(--sc-grad-to))] font-semibold text-[var(--c-on-accent)] shadow-[0_6px_16px_-6px_var(--sc-grad-from)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98]";

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 border-b border-[var(--c-border)] pb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sc-heading)]">
      {children}
    </h2>
  );
}

// ── Identity ───────────────────────────────────────────────────────────────────────

function VerifiedTick({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg role="img" aria-label="Verified" viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
      <path
        d="M12 2l2.4 2.1 3.1-.4.9 3 2.8 1.6-1 3 1 3-2.8 1.6-.9 3-3.1-.4L12 22l-2.4-2.1-3.1.4-.9-3-2.8-1.6 1-3-1-3L5.6 7l.9-3 3.1.4z"
        fill="var(--c-accent)"
      />
      <path d="M8.5 12.2l2.3 2.3 4.7-4.7" fill="none" stroke="var(--c-on-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Banner({ card, className }: { card: CardModel; className: string }) {
  const images = card.content.identity.cover_images;
  const slideshow = card.style.cover_slideshow !== false && images.length > 1;
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    if (!slideshow || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % images.length), 4500);
    return () => window.clearInterval(timer);
  }, [slideshow, images.length]);

  return (
    <div data-edit="identity" className={`relative overflow-hidden bg-[var(--sc-band)] ${className}`}>
      {images.length === 0 ? (
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_0%,var(--sc-grad-to)_0%,transparent_55%)] opacity-50" />
      ) : (
        images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded cover photos
          <img
            key={src}
            src={resolveMediaUrl(src)}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === (slideshow ? index : 0) ? "opacity-100" : "opacity-0"}`}
          />
        ))
      )}
    </div>
  );
}

function Logo({ card, size }: { card: CardModel; size: number }) {
  const { identity } = card.content;
  const src = identity.logo_url || identity.avatar_url;
  const style = { width: size, height: size };
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded logo
    <img
      src={resolveMediaUrl(src)}
      alt={identity.name}
      style={style}
      className="rounded-full border-[5px] border-[var(--c-surface)] bg-[var(--c-surface)] object-cover shadow-[0_8px_24px_rgba(15,20,50,0.18)]"
    />
  ) : (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: Math.round(size * 0.32) }}
      className="flex items-center justify-center rounded-full border-[5px] border-[var(--c-surface)] bg-[linear-gradient(135deg,var(--sc-grad-from),var(--sc-grad-to))] font-semibold text-[var(--c-on-accent)] shadow-[0_8px_24px_rgba(15,20,50,0.18)]"
    >
      {initials(identity.name)}
    </span>
  );
}

function NameBlock({ card }: { card: CardModel }) {
  const { identity } = card.content;
  const subtitle = [identity.role, identity.company].filter(Boolean).join(" · ");
  return (
    <div data-edit="identity" className="text-center">
      <h1 className="flex items-center justify-center gap-1.5 text-[21px] font-bold leading-7 tracking-[-0.01em] text-[var(--c-ink)]">
        <span>{identity.name}</span>
        {identity.verified_badge && <VerifiedTick />}
      </h1>
      {subtitle && <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--c-ink2)]">{subtitle}</p>}
    </div>
  );
}

/** Bio with a "Read more" toggle when it's long. */
function Bio({ card, lines, align }: { card: CardModel; lines: 2 | 4; align: "center" | "left" }) {
  const { bio } = card.content.identity;
  const [expanded, setExpanded] = React.useState(false);
  if (!bio) return null;
  const long = bio.length > (lines === 2 ? 110 : 190);
  return (
    <div data-edit="identity" className={align === "center" ? "text-center" : "text-left"}>
      <p className={`whitespace-pre-line text-[13.5px] leading-[21px] text-[var(--c-ink2)] ${!expanded && long ? (lines === 2 ? "line-clamp-2" : "line-clamp-4") : ""}`}>
        {bio}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold text-[var(--sc-heading)] hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Read less" : "Read more"}
          {align === "center" && <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

// ── Main buttons ───────────────────────────────────────────────────────────────────

interface MainAction {
  key: string;
  label: string;
  Icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  chevron?: boolean;
  event?: AnalyticsEventType;
}

function mainActions(card: CardModel): MainAction[] {
  const { catalog, actions, contact, payments, identity } = card.content;
  const out: MainAction[] = [];
  const hasCatalog =
    (catalog.services.length > 0 && sectionOn(card, "services")) || (catalog.products.length > 0 && sectionOn(card, "products"));
  if (hasCatalog) {
    out.push({
      key: "services",
      label: `Our ${catalog.services.length > 0 && sectionOn(card, "services") ? catalog.services_label || "Services" : catalog.products_label || "Products"}`,
      Icon: ShoppingBag,
      chevron: true,
      onClick: () => scrollToSection(catalog.services.length > 0 && sectionOn(card, "services") ? "card-services" : "card-products"),
    });
  }
  if (actions.save_contact) out.push({ key: "save", label: "Save Contact", Icon: UserPlus, onClick: card.saveContact });
  const directions = directionsHref(contact);
  if (directions) out.push({ key: "location", label: "Location", Icon: MapPin, href: directions, event: "link_click" });
  const bookingNumber = enquiryNumber(contact);
  if (actions.booking_message && bookingNumber) {
    const href = whatsappHref(bookingNumber, actions.booking_message);
    if (href) out.push({ key: "booking", label: "Book Appointment", Icon: CalendarCheck, href, event: "whatsapp_click" });
  }
  const hasPayments = Boolean(payments.upi_id || payments.payment_phone || payments.bank.account_number || payments.bank.ifsc);
  if (hasPayments && sectionOn(card, "payments")) {
    const upi = upiHref(payments.upi_id, payments.upi_name || identity.company || identity.name);
    out.push({
      key: "pay",
      label: "Pay Now",
      Icon: IndianRupee,
      // On a phone the UPI link opens the payment apps; otherwise jump to the payment details.
      onClick: () => (upi && /Android|iPhone|iPad/i.test(navigator.userAgent) ? window.location.assign(upi) : scrollToSection("card-payments")),
    });
  }
  return out;
}

function ActionButton({ action, card, className }: { action: MainAction; card: CardModel; className: string }) {
  const { Icon, label, chevron } = action;
  const body = (
    <>
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
      {chevron && <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-80" aria-hidden="true" />}
    </>
  );
  const onClick = () => {
    card.track(action.event ?? "cta_click", { action: action.key });
    action.onClick?.();
  };
  return action.href ? (
    <a {...externalLinkProps(action.href)} onClick={onClick} className={`${gradientButton} ${className}`}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={`${gradientButton} ${className}`}>
      {body}
    </button>
  );
}

// ── Round contact icons ────────────────────────────────────────────────────────────

interface Tile {
  key: string;
  label: string;
  Icon: CardIcon;
  /** [background, icon colour] */
  tone: [string, string];
  href?: string;
  onClick?: () => void;
  event?: AnalyticsEventType;
  platform?: SocialPlatform;
}

const TONES = {
  indigo: ["#EEF0FF", "#4F46E5"],
  green: ["#E7F8EE", "#16A34A"],
  rose: ["#FDECEE", "#E11D48"],
  sky: ["#E6F4FD", "#0284C7"],
  slate: ["#EEF1F6", "#334155"],
} satisfies Record<string, [string, string]>;

const SOCIAL_TONES: Partial<Record<SocialPlatform, [string, string]>> = {
  instagram: ["#FDEBF3", "#D62976"],
  facebook: ["#E7F0FE", "#1877F2"],
  linkedin: ["#E6F0FA", "#0A66C2"],
  x: ["#EEEEEE", "#111111"],
  youtube: ["#FDEAEA", "#FF0000"],
  whatsapp: ["#E7F8EE", "#16A34A"],
  whatsapp_channel: ["#E7F8EE", "#16A34A"],
  telegram: ["#E6F4FD", "#229ED9"],
  tiktok: ["#EEEEEE", "#111111"],
  threads: ["#EEEEEE", "#111111"],
  pinterest: ["#FDEAEA", "#E60023"],
  snapchat: ["#FFFBE0", "#B59A00"],
  github: ["#EEEEEE", "#181717"],
  google_business: ["#E8F0FE", "#4285F4"],
  spotify: ["#E7F8EE", "#1DB954"],
};

function contactTiles(card: CardModel, copied: boolean, copyLink: () => void): Tile[] {
  const { contact, socials, payments, actions } = card.content;
  const tiles: Tile[] = [];
  const call = telHref(contact.phone);
  if (call) tiles.push({ key: "phone", label: "Phone", Icon: Phone, tone: TONES.indigo, href: call, event: "phone_click" });
  const wa = whatsappHref(contact.whatsapp);
  if (wa) tiles.push({ key: "whatsapp", label: "WhatsApp", Icon: WhatsAppGlyph, tone: TONES.green, href: wa, event: "whatsapp_click" });
  const mail = mailHref(contact.email);
  if (mail) tiles.push({ key: "email", label: "Email", Icon: Mail, tone: TONES.rose, href: mail, event: "email_click" });
  if (contact.website) tiles.push({ key: "website", label: "Website", Icon: Globe, tone: TONES.sky, href: contact.website, event: "link_click" });
  if ((payments.bank.account_number || payments.bank.ifsc) && sectionOn(card, "payments")) {
    tiles.push({ key: "bank", label: "Bank", Icon: Building2, tone: TONES.slate, onClick: () => card.setSheet({ kind: "bank" }) });
  }
  const directions = directionsHref(contact);
  if (directions) tiles.push({ key: "address", label: "Address", Icon: MapPin, tone: TONES.indigo, href: directions, event: "link_click" });
  const bookingNumber = enquiryNumber(contact);
  if (actions.booking_message && bookingNumber) {
    const href = whatsappHref(bookingNumber, actions.booking_message);
    if (href) tiles.push({ key: "book", label: "Book Now", Icon: CalendarCheck, tone: TONES.green, href, event: "whatsapp_click" });
  }
  if (actions.share) tiles.push({ key: "copy", label: copied ? "Copied" : "Copy Link", Icon: copied ? Check : Copy, tone: TONES.slate, onClick: copyLink });
  for (const social of socials) {
    tiles.push({
      key: social.id,
      label: SOCIAL_LABELS[social.platform],
      Icon: ({ className }) => <SocialIcon platform={social.platform} className={className} />,
      tone: SOCIAL_TONES[social.platform] ?? TONES.slate,
      href: social.url,
      event: "social_click",
      platform: social.platform,
    });
  }
  if (actions.qr) tiles.push({ key: "qr", label: "QR Code", Icon: QrCode, tone: TONES.slate, onClick: () => card.setSheet({ kind: "qr" }) });
  return tiles;
}

function useCopyLink(card: CardModel) {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(async () => {
    card.track("cta_click", { action: "copy_link" });
    try {
      await navigator.clipboard.writeText(card.cardUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      card.setSheet({ kind: "share" });
    }
  }, [card]);
  return [copied, copy] as const;
}

function TileGrid({ card, size, className }: { card: CardModel; size: "sm" | "lg"; className: string }) {
  const [copied, copyLink] = useCopyLink(card);
  const tiles = contactTiles(card, copied, copyLink);
  if (tiles.length === 0) return null;
  const circle = size === "lg" ? "h-[52px] w-[52px]" : "h-[44px] w-[44px]";
  const icon = size === "lg" ? "h-[21px] w-[21px]" : "h-[19px] w-[19px]";
  return (
    <nav id="sc-social" aria-label="Contact and links" data-edit="contact" className={`grid scroll-mt-6 ${className}`}>
      {tiles.map((tile) => {
        const inner = (
          <>
            <span
              className={`flex ${circle} items-center justify-center rounded-full shadow-[0_4px_12px_-4px_rgba(23,30,74,0.25)] transition-transform group-hover:-translate-y-0.5`}
              style={{ background: tile.tone[0], color: tile.tone[1] }}
            >
              <tile.Icon className={icon} aria-hidden="true" />
            </span>
            <span className="max-w-full truncate text-[11px] font-semibold text-[var(--c-ink)]">{tile.label}</span>
          </>
        );
        const cls = "group flex min-w-0 flex-col items-center gap-2 py-1";
        const onClick = () => {
          if (tile.event) card.track(tile.event, tile.platform ? { provider: tile.platform } : { action: tile.key });
          tile.onClick?.();
        };
        return tile.href ? (
          <a key={tile.key} {...externalLinkProps(tile.href)} onClick={onClick} className={cls}>
            {inner}
          </a>
        ) : (
          <button key={tile.key} type="button" onClick={onClick} className={cls}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}

// ── Review + hours ─────────────────────────────────────────────────────────────────

function ReviewCard({ card }: { card: CardModel }) {
  const url = card.content.actions.review_url;
  if (!url || !sectionOn(card, "review")) return null;
  const isGoogle = /google\.|g\.page|goo\.gl/i.test(url);
  return (
    <a
      {...externalLinkProps(url)}
      data-edit="actions"
      aria-label={isGoogle ? "Leave a Google review" : "Leave a review"}
      onClick={() => card.track("cta_click", { action: "review" })}
      className={`${panel} flex items-center gap-3 px-4 py-3.5 transition-transform hover:-translate-y-0.5`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF4D6] text-[#F59E0B]">
        <Star className="h-4 w-4 fill-current" aria-hidden="true" />
      </span>
      <span className="flex-1 text-[13px] font-bold text-[var(--sc-heading)]">Review Us</span>
      <span className="flex items-center gap-1.5 text-[#F5B301]" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-[18px] w-[18px]" strokeWidth={2} />
        ))}
      </span>
    </a>
  );
}

function HoursCard({ card }: { card: CardModel }) {
  const { hours } = card.content.identity;
  const open = useOpenNow(hours);
  if (!hours) return null;
  return (
    <div data-edit="identity" className={`${panel} flex items-center gap-3 px-4 py-3.5`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--c-soft)] text-[var(--sc-heading)]">
        <Clock className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[var(--c-ink)]">{hours}</span>
      {open !== null && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${
            open ? "bg-[#E7F8EE] text-[#15803D]" : "bg-[#FDECEE] text-[#E11D48]"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-[#16A34A]" : "bg-[#E11D48]"}`} aria-hidden="true" />
          {open ? "Open" : "Closed"}
        </span>
      )}
    </div>
  );
}

// ── Gallery ────────────────────────────────────────────────────────────────────────

function GalleryStrip({ card }: { card: CardModel }) {
  const { images, title } = card.content.gallery;
  if (images.length === 0 || !sectionOn(card, "gallery")) return null;
  return (
    <section id="sc-gallery" data-edit="gallery" className={`${panel} scroll-mt-6 p-5`}>
      <PanelTitle>{title || "Gallery"}</PanelTitle>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              card.track("gallery_open", { image_index: index });
              card.setSheet({ kind: "gallery", index });
            }}
            className="h-[96px] w-[96px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--c-soft)] transition-transform hover:-translate-y-0.5"
            aria-label={`Open photo ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media */}
            <img src={resolveMediaUrl(src)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}

function GalleryGrid({ card }: { card: CardModel }) {
  const { images, title } = card.content.gallery;
  const [shown, setShown] = React.useState(6);
  if (images.length === 0 || !sectionOn(card, "gallery")) return null;
  return (
    <section id="sc-gallery" data-edit="gallery" aria-label={title || "Image gallery"} className="scroll-mt-6">
      <h2 className="mb-3 text-[16px] font-bold text-[var(--c-ink)]">{title || "Image Gallery"}</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {images.slice(0, shown).map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              card.track("gallery_open", { image_index: index });
              card.setSheet({ kind: "gallery", index });
            }}
            className="overflow-hidden rounded-[14px] bg-[var(--c-soft)]"
            aria-label={`Open photo ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media */}
            <img src={resolveMediaUrl(src)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
      {images.length > shown && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + 6)}
            className={`${panel} inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[12px] font-semibold text-[var(--c-ink)]`}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Load more images
          </button>
        </div>
      )}
    </section>
  );
}

// ── Sharing ────────────────────────────────────────────────────────────────────────

function SocialShare({ card }: { card: CardModel }) {
  if (!card.content.actions.share) return null;
  const url = encodeURIComponent(card.cardUrl);
  const text = encodeURIComponent(card.content.identity.name);
  const targets: { platform: SocialPlatform; href: string }[] = [
    { platform: "whatsapp", href: `https://wa.me/?text=${text}%20${url}` },
    { platform: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { platform: "linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { platform: "x", href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
  ];
  return (
    <section data-edit="actions" className={`${panel} p-5`}>
      <PanelTitle>Share this card</PanelTitle>
      <div className="flex items-center justify-between gap-2 px-1">
        {targets.map(({ platform, href }) => {
          const [bg, fg] = SOCIAL_TONES[platform] ?? TONES.slate;
          return (
            <a
              key={platform}
              {...externalLinkProps(href)}
              onClick={() => card.track("cta_click", { action: `share_${platform}` })}
              aria-label={`Share on ${SOCIAL_LABELS[platform]}`}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-full shadow-[0_4px_12px_-4px_rgba(23,30,74,0.25)] transition-transform hover:-translate-y-0.5"
              style={{ background: bg, color: fg }}
            >
              <SocialIcon platform={platform} className="h-[22px] w-[22px]" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

function WhatsAppShare({ card }: { card: CardModel }) {
  const [number, setNumber] = React.useState("");
  if (!card.content.actions.share) return null;
  const share = () => {
    card.track("cta_click", { action: "share_whatsapp" });
    const message = `${card.content.identity.name} — ${card.cardUrl}`;
    const href = whatsappHref(number, message) ?? `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };
  return (
    <section data-edit="actions" aria-label="Share this card on WhatsApp">
      <h2 className="mb-3 text-[16px] font-bold text-[var(--c-ink)]">Share this digital card</h2>
      <input
        type="tel"
        inputMode="tel"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="WhatsApp number (optional)"
        aria-label="WhatsApp number to share with (optional)"
        className="h-12 w-full rounded-[12px] border border-[var(--c-border)] bg-[var(--c-soft)] px-4 text-[15px] text-[var(--c-ink)] outline-none placeholder:text-[var(--c-ink3)] focus:border-[var(--c-accent)]"
      />
      <button
        type="button"
        onClick={share}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#25D366] text-[15px] font-semibold text-white shadow-[0_8px_18px_-8px_#25D366] transition-[filter] hover:brightness-105"
      >
        <WhatsAppGlyph className="h-5 w-5" aria-hidden="true" />
        Share on WhatsApp
      </button>
    </section>
  );
}

function Stats({ card, profile }: { card: CardModel; profile: TemplateProps["profile"] }) {
  const stats = (profile as PublicProfile).stats;
  if (card.isPreview || !stats) return null;
  const items: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: "Views", value: stats.views, Icon: Eye },
    { label: "Clicks", value: stats.clicks, Icon: MousePointerClick },
    { label: "Actions", value: stats.actions, Icon: Zap },
    { label: "Days live", value: stats.days_live, Icon: CalendarDays },
    { label: "Engagement", value: stats.engage, Icon: Activity },
  ];
  return (
    <div className={`${panel} grid grid-cols-5 gap-1 px-2 py-4`}>
      {items.map(({ label, value, Icon }) => (
        <div key={label} className="flex flex-col items-center gap-1 text-center">
          <Icon className="h-[18px] w-[18px] text-[var(--sc-heading)]" aria-hidden="true" />
          <span className="text-[14px] font-bold text-[var(--c-ink)]">{value.toLocaleString("en-IN")}</span>
          <span className="text-[10px] text-[var(--c-ink2)]">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Services, products, payments, links and documents in the owner's order, each in a panel. */
function MoreSections({ card, username }: { card: CardModel; username?: string }) {
  return (
    <>
      <BodySections card={card} exclude={["gallery", "review", "qr"]} className={`${panel} p-5`} qrColor={card.palette.accent} />
      {card.extraBlocks.length > 0 && (
        <div className={`${panel} p-5`}>
          <ExtraBlocks card={card} username={username} />
        </div>
      )}
    </>
  );
}

function QrPanel({ card }: { card: CardModel }) {
  if (!card.content.actions.qr || !sectionOn(card, "qr")) return null;
  return (
    <div className="[&_section>div]:rounded-[18px] [&_section>div]:[box-shadow:var(--sc-shadow)]">
      <QrSection card={card} color={card.palette.dark ? "#18181B" : mix(card.palette.accent, "#0B1022", 0.62)} />
    </div>
  );
}

// ── Floating section menu ──────────────────────────────────────────────────────────

interface MenuItem {
  key: string;
  /** Element id to jump to (the visible copy: phone and desktop layouts each render one). */
  target: string;
  label: string;
  Icon: LucideIcon;
}

/** Up to four shortcuts: top of the card, social & contact icons, photo gallery, products (or services). */
function menuItems(card: CardModel): MenuItem[] {
  const { contact, socials, gallery, catalog, actions } = card.content;
  const items: MenuItem[] = [{ key: "home", target: "sc-top", label: "Home", Icon: House }];
  const hasContactIcons = Boolean(socials.length || contact.phone || contact.whatsapp || contact.email || contact.website || actions.qr);
  if (hasContactIcons) items.push({ key: "social", target: "sc-social", label: "Social", Icon: AtSign });
  if (gallery.images.length > 0 && sectionOn(card, "gallery")) items.push({ key: "gallery", target: "sc-gallery", label: "Gallery", Icon: Images });
  if (catalog.products.length > 0 && sectionOn(card, "products")) {
    items.push({ key: "products", target: "card-products", label: catalog.products_label || "Products", Icon: ShoppingBag });
  } else if (catalog.services.length > 0 && sectionOn(card, "services")) {
    items.push({ key: "services", target: "card-services", label: catalog.services_label || "Services", Icon: ShoppingBag });
  }
  return items.slice(0, 4);
}

/** The nearest scrolling ancestor (the editor's phone frame), or null for the page itself. */
function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let node = el?.parentElement ?? null; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (/(auto|scroll)/.test(overflowY) && node.scrollHeight > node.clientHeight + 1) return node;
  }
  return null;
}

const visibleById = (id: string) => [...document.querySelectorAll<HTMLElement>(`[id="${id}"]`)].find((el) => el.offsetParent !== null);

/**
 * A floating menu (sticky at the bottom of the screen) with up to four icons; tapping one scrolls
 * to that part of the card, and the icon of the part on screen is highlighted while scrolling.
 * It is `sticky`, not `fixed`, so it also floats inside the editor's phone-frame preview.
 */
function FloatingNav({ card }: { card: CardModel }) {
  const items = menuItems(card);
  const ref = React.useRef<HTMLElement>(null);
  const [active, setActive] = React.useState("home");
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const keys = items.map((i) => `${i.key}:${i.target}`).join("|");
  const enabled = card.style.floating_nav !== false && items.length >= 2;
  // After a tap the tapped icon stays lit until the visitor scrolls by hand (short sections
  // next to each other would otherwise hand the highlight to a neighbour).
  const lockedRef = React.useRef(false);

  React.useEffect(() => {
    if (!enabled || !ref.current || ref.current.offsetParent === null) return;
    const scroller = scrollParent(ref.current);
    const source: HTMLElement | Window = scroller ?? window;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (lockedRef.current) return;
      const list = itemsRef.current;
      const box = scroller ? scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight };
      const line = box.top + Math.min(box.height * 0.35, 180);
      const atEnd = scroller
        ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      const scrolled = scroller ? scroller.scrollTop : window.scrollY;
      // The section whose heading most recently passed the line (layouts order sections differently).
      let current = list[0]?.key ?? "home";
      let best = -Infinity;
      for (const item of list) {
        const el = item.key === "home" ? null : visibleById(item.target);
        const top = el?.getBoundingClientRect().top;
        if (top !== undefined && top <= line && top > best) {
          best = top;
          current = item.key;
        }
      }
      if (scrolled < 8) current = "home";
      // A short last section may never reach the line: at the very bottom, light it up if it's on screen.
      if (atEnd && list.length > 1) {
        const last = list[list.length - 1];
        const el = visibleById(last.target);
        if (el && el.getBoundingClientRect().top < box.top + box.height) current = last.key;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Any hand scrolling releases the tap lock.
    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      onScroll();
    };
    const userInputs = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    update();
    source.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    for (const type of userInputs) window.addEventListener(type, unlock, { passive: true, capture: true });
    return () => {
      source.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const type of userInputs) window.removeEventListener(type, unlock, { capture: true });
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, keys]);

  if (!enabled) return null;

  const go = (item: MenuItem) => {
    lockedRef.current = true;
    setActive(item.key);
    card.track("cta_click", { action: `menu_${item.key}` });
    const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    visibleById(item.target)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  return (
    <div className="pointer-events-none sticky bottom-3 z-30 mt-4 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] [animation:sc-dock-in_.5s_cubic-bezier(.2,.8,.2,1)_both] motion-reduce:[animation:none]">
      <style>{`@keyframes sc-dock-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
      <nav
        ref={ref}
        aria-label="Card sections"
        className="pointer-events-auto flex w-full max-w-[340px] items-stretch gap-1 rounded-[22px] border border-[var(--c-border)] bg-[var(--c-surface)] p-1.5 shadow-[0_14px_40px_-12px_rgba(15,20,50,0.45)]"
      >
        {items.map((item) => {
          const on = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => go(item)}
              aria-current={on ? "true" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[16px] px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] ${
                on
                  ? "bg-[linear-gradient(135deg,var(--sc-grad-from),var(--sc-grad-to))] text-[var(--c-on-accent)] shadow-[0_6px_16px_-6px_var(--sc-grad-from)]"
                  : "text-[var(--c-ink2)] hover:bg-[var(--c-soft)] hover:text-[var(--c-ink)]"
              }`}
            >
              <item.Icon className="h-5 w-5" aria-hidden="true" />
              <span className="max-w-full truncate text-[10.5px] font-semibold leading-4">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ── Layouts ────────────────────────────────────────────────────────────────────────

const PHONE_ORDER = ["services", "save", "pay", "location", "booking"];

function PhoneLayout({ card, props }: { card: CardModel; props: TemplateProps }) {
  const actions = mainActions(card).sort((a, b) => PHONE_ORDER.indexOf(a.key) - PHONE_ORDER.indexOf(b.key));
  return (
    <div id="sc-top" className="mx-auto flex w-full max-w-[480px] flex-col bg-[var(--c-bg)]">
      <Banner card={card} className="h-[150px] shrink-0" />
      <div className="relative -mt-[52px] flex justify-center" data-edit="identity">
        <Logo card={card} size={104} />
      </div>
      <div className="flex flex-col gap-5 px-4 pb-4 pt-3">
        <div className="flex flex-col gap-2.5">
          <NameBlock card={card} />
          <Bio card={card} lines={2} align="center" />
        </div>

        {/* An odd last button (e.g. 3 or 1 shown) stretches across the row instead of leaving a gap. */}
        {actions.length > 0 && (
          <div data-edit="actions" className="grid grid-cols-2 gap-3 [&>*:last-child:nth-child(odd)]:col-span-2">
            {actions.slice(0, 4).map((action) => (
              <ActionButton key={action.key} action={{ ...action, chevron: false }} card={card} className="h-[48px] px-3 text-[14px]" />
            ))}
          </div>
        )}

        <TileGrid card={card} size="sm" className="grid-cols-4 gap-x-2 gap-y-4" />

        <div className="flex flex-col gap-3 empty:hidden">
          <ReviewCard card={card} />
          <HoursCard card={card} />
        </div>

        <GalleryGrid card={card} />
        <MoreSections card={card} username={props.profile.username} />
        <WhatsAppShare card={card} />
        <QrPanel card={card} />
        <Stats card={card} profile={props.profile} />
      </div>
      <div className="mt-auto">{props.footer}</div>
      <FloatingNav card={card} />
    </div>
  );
}

function DesktopLayout({ card, props }: { card: CardModel; props: TemplateProps }) {
  const actions = mainActions(card);
  const { identity } = card.content;
  const services = actions.find((a) => a.key === "services");
  return (
    <div id="sc-top" className="mx-auto w-full max-w-[1400px] px-6 py-8">
      <div className="rounded-[28px] border border-[var(--c-border)] bg-[color-mix(in_srgb,var(--c-bg)_70%,var(--c-surface))] p-5 [box-shadow:var(--sc-shadow)]">
        <div className="grid grid-cols-[minmax(300px,340px)_minmax(0,1fr)_minmax(320px,380px)] items-start gap-5">
          {/* Profile */}
          <aside className={`${panel} sticky top-6 overflow-hidden`}>
            <Banner card={card} className="h-[180px]" />
            <div className="relative -mt-[58px] flex justify-center" data-edit="identity">
              <Logo card={card} size={112} />
            </div>
            <div className="flex flex-col gap-4 px-5 pb-5 pt-3">
              <NameBlock card={card} />
              {identity.bio && (
                <div>
                  <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sc-heading)]">About</h2>
                  <Bio card={card} lines={4} align="left" />
                </div>
              )}
              {services && <ActionButton action={{ ...services, chevron: false }} card={card} className="h-[48px] text-[14px]" />}
            </div>
          </aside>

          {/* Photos, contact icons, everything else */}
          <main className="flex min-w-0 flex-col gap-5">
            <GalleryStrip card={card} />
            {contactTiles(card, false, () => undefined).length > 0 && (
              <section className={`${panel} p-5`}>
                <PanelTitle>Contact &amp; links</PanelTitle>
                <TileGrid card={card} size="lg" className="grid-cols-5 gap-x-3 gap-y-5" />
              </section>
            )}
            <MoreSections card={card} username={props.profile.username} />
          </main>

          {/* Review, hours, quick actions, sharing */}
          <aside className="flex flex-col gap-5">
            <ReviewCard card={card} />
            <HoursCard card={card} />
            {actions.length > 0 && (
              <section data-edit="actions" className={`${panel} p-5`}>
                <PanelTitle>Quick actions</PanelTitle>
                <div className="flex flex-col gap-3">
                  {actions.map((action) => (
                    <ActionButton key={action.key} action={action} card={card} className="relative h-[46px] px-4 text-[14px]" />
                  ))}
                </div>
              </section>
            )}
            <SocialShare card={card} />
            <QrPanel card={card} />
          </aside>
        </div>

        <footer className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--c-border)] px-2 pt-4 text-[12px] text-[var(--c-ink2)]">
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} {identity.company || identity.name}
          </span>
          <div className="[&>div]:p-0">{props.footer}</div>
        </footer>
      </div>
      <FloatingNav card={card} />
    </div>
  );
}

// ── Template ───────────────────────────────────────────────────────────────────────

export function ShowcaseTemplate(props: TemplateProps) {
  const card = useCard(props, "showcase");
  const colors = useShowcaseColors(card);
  const { theme } = props;

  return (
    <div
      style={{ ...card.cssVars, ...colors }}
      className={`w-full bg-[var(--c-bg)] text-[var(--c-ink)] [font-family:var(--c-font)] ${card.isPreview ? "" : "min-h-screen"} ${entranceClass(theme.animation)}`}
    >
      <CardFonts fonts={[theme.font_family]} />
      {/* Dashboard previews sit in a phone frame, so they always use the phone layout. */}
      <div className={card.isPreview ? "" : "lg:hidden"}>
        <PhoneLayout card={card} props={props} />
      </div>
      {!card.isPreview && (
        <div className="hidden lg:block">
          <DesktopLayout card={card} props={props} />
        </div>
      )}
      <CardSheets card={card} />
    </div>
  );
}

export default ShowcaseTemplate;
