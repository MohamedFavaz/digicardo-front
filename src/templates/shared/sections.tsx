"use client";

import * as React from "react";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Folder,
  Globe,
  Link2,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  ShoppingBag,
  Star,
  type LucideIcon,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { SectionKey } from "@/lib/zod/content";
import { CardQr, downloadQrPng } from "./CardQr";
import { enquiryMessage, enquiryNumber, firstName, mailHref, upiHref, whatsappHref } from "./actions";
import { externalLinkProps, type CardModel } from "./useCard";

const LINK_ICONS: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  booking: CalendarDays,
  services: Briefcase,
  briefcase: Briefcase,
  office: MapPin,
  map: MapPin,
  location: MapPin,
  document: FileText,
  pdf: FileText,
  file: FileText,
  folder: Folder,
  drive: Folder,
  shop: ShoppingBag,
  store: ShoppingBag,
  cart: ShoppingBag,
  video: PlayCircle,
  youtube: PlayCircle,
  star: Star,
  review: Star,
  phone: Phone,
  mail: Mail,
  email: Mail,
  globe: Globe,
  website: Globe,
};

export const linkIcon = (key: string): LucideIcon => LINK_ICONS[key] ?? Link2;

const cardBox = "rounded-[16px] border border-[var(--c-border)] bg-[var(--c-surface)]";

export function SectionTitle({ id, children, action }: { id: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 id={id} className="text-[18px] font-bold leading-6 text-[var(--c-ink)]">
        {children}
      </h2>
      {action}
    </div>
  );
}

function enquiryHref(card: CardModel, item: string): string | null {
  const message = enquiryMessage(card.content.catalog.enquiry_message, item);
  const number = enquiryNumber(card.content.contact);
  if (number) return whatsappHref(number, message);
  const mail = mailHref(card.content.contact.email);
  return mail ? `${mail}?subject=${encodeURIComponent(item)}&body=${encodeURIComponent(message)}` : null;
}

function ServicesSection({ card }: { card: CardModel }) {
  const { services, services_label } = card.content.catalog;
  if (services.length === 0) return null;
  return (
    <section aria-labelledby="card-services" data-edit="catalog">
      <SectionTitle id="card-services">{services_label || "Services"}</SectionTitle>
      <ul className="flex flex-col gap-2.5">
        {services.map((service) => {
          const href = enquiryHref(card, service.name);
          const meta = [service.price, service.duration].filter(Boolean).join(" · ");
          return (
            <li key={service.id} className={`${cardBox} flex items-center gap-3 px-4 py-3.5`}>
              {service.image_url && (
                // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
                <img
                  src={resolveMediaUrl(service.image_url)}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-[12px] bg-[var(--c-soft)] object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold text-[var(--c-ink)]">{service.name}</div>
                {service.description && (
                  <p className="mt-0.5 text-[13px] leading-[19px] text-[var(--c-ink2)]">{service.description}</p>
                )}
                {meta && <div className="mt-1.5 text-[13px] font-semibold text-[var(--c-ink)]">{meta}</div>}
              </div>
              {href && (
                <a
                  {...externalLinkProps(href)}
                  onClick={() => card.track("whatsapp_click", { action: "enquire" })}
                  className="inline-flex h-9 shrink-0 items-center rounded-[var(--c-btn-r)] bg-[var(--c-soft)] px-3.5 text-[13px] font-bold text-[var(--c-accent)]"
                  aria-label={`Enquire about ${service.name}`}
                >
                  Enquire
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ProductsSection({ card }: { card: CardModel }) {
  const { products, products_label } = card.content.catalog;
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="card-products" data-edit="catalog">
      <SectionTitle id="card-products">{products_label || "Shop"}</SectionTitle>
      <ul className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const href = product.buy_url || enquiryHref(card, product.name);
          return (
            <li key={product.id} className={`${cardBox} flex flex-col overflow-hidden`}>
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media of any size
                <img
                  src={resolveMediaUrl(product.image_url)}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-[var(--c-soft)] object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--c-soft)] text-[var(--c-accent)]">
                  <ShoppingBag className="h-7 w-7" aria-hidden="true" />
                </div>
              )}
              <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
                <div className="text-[14px] font-semibold leading-5 text-[var(--c-ink)]">{product.name}</div>
                {product.price && <div className="mt-0.5 text-[13px] text-[var(--c-ink2)]">{product.price}</div>}
                {href && (
                  <a
                    {...externalLinkProps(href)}
                    onClick={() => card.track(product.buy_url ? "link_click" : "whatsapp_click", { action: "product" })}
                    className="mt-2 inline-flex h-9 items-center justify-center rounded-[var(--c-btn-r)] bg-[var(--c-soft)] text-[13px] font-bold text-[var(--c-accent)]"
                    aria-label={`${product.buy_url ? "Buy" : "Enquire about"} ${product.name}`}
                  >
                    {product.buy_url ? "Buy" : "Enquire"}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PaymentsSection({ card }: { card: CardModel }) {
  const { payments, identity } = card.content;
  const hasBank = Boolean(payments.bank.account_number || payments.bank.ifsc);
  if (!payments.upi_id && !payments.payment_phone && !hasBank) return null;
  const payee = payments.upi_name || identity.company || identity.name;
  const upi = upiHref(payments.upi_id, payee);
  return (
    <section aria-labelledby="card-payments" data-edit="payments">
      <div className={`${cardBox} flex flex-col gap-3.5 rounded-[18px] p-[18px]`}>
        <div className="flex items-center gap-3">
          <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--c-soft)] text-[var(--c-accent)]">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <h2 id="card-payments" className="text-[16px] font-bold text-[var(--c-ink)]">
              Pay {payee}
            </h2>
            <span className="text-[13px] text-[var(--c-ink2)]">
              {upi ? "Use any UPI app on your phone." : "Bank transfer details are below."}
            </span>
          </span>
        </div>
        {upi && (
          <a
            href={upi}
            onClick={() => card.track("cta_click", { action: "pay_upi" })}
            className="flex h-12 items-center justify-center rounded-[var(--c-btn-r)] bg-[var(--c-accent)] text-[15px] font-semibold text-[var(--c-on-accent)]"
          >
            Pay with UPI
          </a>
        )}
        <button
          type="button"
          onClick={() => card.setSheet({ kind: "bank" })}
          className="text-center text-[14px] font-semibold text-[var(--c-ink)] underline-offset-4 hover:underline"
        >
          {hasBank ? "Bank transfer details" : "Show UPI ID"}
        </button>
      </div>
    </section>
  );
}

function GallerySection({ card }: { card: CardModel }) {
  const { images, title } = card.content.gallery;
  if (images.length === 0) return null;
  const shown = images.slice(0, 6);
  return (
    <section aria-labelledby="card-gallery" data-edit="gallery">
      <SectionTitle
        id="card-gallery"
        action={
          images.length > 1 ? (
            <button
              type="button"
              onClick={() => card.setSheet({ kind: "gallery", index: 0 })}
              className="text-[14px] font-semibold text-[var(--c-ink)] underline-offset-4 hover:underline"
            >
              See all {images.length}
            </button>
          ) : undefined
        }
      >
        {title || "Photos"}
      </SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {shown.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              card.track("gallery_open", { image_index: index });
              card.setSheet({ kind: "gallery", index });
            }}
            className="overflow-hidden rounded-[12px] bg-[var(--c-soft)]"
            aria-label={`Open photo ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media of any size */}
            <img src={resolveMediaUrl(src)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}

function LinksSection({ card }: { card: CardModel }) {
  const { links, actions, contact } = card.content;
  const bookingNumber = enquiryNumber(contact);
  const booking = actions.booking_message && bookingNumber ? whatsappHref(bookingNumber, actions.booking_message) : null;
  if (links.length === 0 && !booking) return null;

  const featured = (title: string, description: string, href: string, Icon: LucideIcon, key: string, event: () => void) => (
    <li key={key}>
      <a
        {...externalLinkProps(href)}
        onClick={event}
        className="flex items-center gap-3.5 rounded-[16px] bg-[var(--c-accent)] p-4 text-[var(--c-on-accent)] shadow-[0_8px_20px_rgba(16,24,40,0.12)]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-white/15">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] font-semibold">{title}</span>
          {description && <span className="block text-[13px] opacity-85">{description}</span>}
        </span>
        <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
      </a>
    </li>
  );

  return (
    <section aria-label="Links" data-edit="links">
      <ul className="flex flex-col gap-2.5">
        {booking &&
          featured("Book an appointment", "Opens WhatsApp with a message", booking, CalendarDays, "booking", () =>
            card.track("booking_click")
          )}
        {links.map((link) => {
          const Icon = linkIcon(link.icon);
          const onClick = () => card.track("link_click", { action: link.id });
          if (link.featured) return featured(link.title, link.description, link.url, Icon, link.id, onClick);
          return (
            <li key={link.id}>
              <a
                {...externalLinkProps(link.url)}
                onClick={onClick}
                className={`${cardBox} flex items-center gap-3.5 px-4 py-3.5 text-[var(--c-ink)]`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--c-soft)] text-[var(--c-accent)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">{link.title}</span>
                  {link.description && <span className="block truncate text-[13px] text-[var(--c-ink2)]">{link.description}</span>}
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-[var(--c-ink3)]" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function DocumentsSection({ card }: { card: CardModel }) {
  const { documents } = card.content;
  if (documents.length === 0) return null;
  return (
    <section aria-label="Documents" data-edit="documents">
      <ul className="flex flex-col gap-2.5">
        {documents.map((doc) => (
          <li key={doc.id}>
            <a
              {...externalLinkProps(doc.url)}
              onClick={() => card.track("link_click", { action: "document" })}
              className={`${cardBox} flex items-center gap-3.5 px-4 py-3.5 text-[var(--c-ink)]`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--c-soft)] text-[var(--c-accent)]">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{doc.title}</span>
                <span className="block truncate text-[13px] text-[var(--c-ink2)]">
                  {doc.description || ["Document", doc.size_label].filter(Boolean).join(" · ")}
                </span>
              </span>
              <Download className="h-5 w-5 shrink-0 text-[var(--c-accent)]" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewSection({ card }: { card: CardModel }) {
  const url = card.content.actions.review_url;
  if (!url) return null;
  const isGoogle = /google\.|g\.page|goo\.gl/i.test(url);
  return (
    <section aria-label="Review" data-edit="actions">
      <a
        {...externalLinkProps(url)}
        onClick={() => card.track("cta_click", { action: "review" })}
        className={`${cardBox} flex items-center gap-3 px-4 py-3.5 text-[var(--c-ink)]`}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold">Worked with {firstName(card.content.identity.name)}?</span>
          <span className="mt-1 flex items-center gap-0.5 text-[#D97706]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4 w-4" aria-hidden="true" />
            ))}
            <span className="ml-1.5 text-[13px] text-[var(--c-ink2)]">
              {isGoogle ? "Leave a Google review" : "Leave a review"}
            </span>
          </span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-[var(--c-ink3)]" aria-hidden="true" />
      </a>
    </section>
  );
}

function QrSection({ card, color }: { card: CardModel; color?: string }) {
  if (!card.content.actions.qr) return null;
  return (
    <section aria-label="QR code" data-edit="actions">
      <div className={`${cardBox} flex items-center gap-4 p-4`}>
        <span className="rounded-[8px] bg-white p-1">
          <CardQr value={card.cardUrl} size={88} color={color ?? "#18181B"} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-[var(--c-ink)]">Scan to save this card</span>
          <span className="mt-0.5 block text-[13px] leading-[19px] text-[var(--c-ink2)]">Point a phone camera at the code.</span>
          <button
            type="button"
            onClick={() => downloadQrPng(card.cardUrl, card.content.identity.name || "card", color)}
            className="mt-2 text-[14px] font-semibold text-[var(--c-ink)] underline-offset-4 hover:underline"
          >
            Download QR
          </button>
        </span>
      </div>
    </section>
  );
}

/** Blocks the owner added on top of the card content (always last, never hidden). */
export function ExtraBlocks({ card, username }: { card: CardModel; username?: string }) {
  if (card.extraBlocks.length === 0) return null;
  return (
    <section aria-label="More" data-edit="blocks" className="flex flex-col gap-3">
      {card.extraBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} username={username} />
      ))}
    </section>
  );
}

const SECTION_COMPONENTS: Record<SectionKey, (props: { card: CardModel; qrColor?: string }) => React.ReactNode> = {
  services: ServicesSection,
  products: ProductsSection,
  payments: PaymentsSection,
  gallery: GallerySection,
  links: LinksSection,
  documents: DocumentsSection,
  review: ReviewSection,
  qr: ({ card, qrColor }) => <QrSection card={card} color={qrColor} />,
};

/**
 * The owner-ordered body sections this template supports, skipping hidden and empty ones.
 * `exclude` lets a template place a section somewhere else (e.g. Botanical's QR card).
 */
export function BodySections({
  card,
  className,
  exclude = [],
  qrColor,
}: {
  card: CardModel;
  className?: string;
  exclude?: SectionKey[];
  qrColor?: string;
}) {
  const supported = new Set(card.manifest.sections);
  const entries = card.content.layout.filter(
    (entry) => entry.visible && supported.has(entry.key) && !exclude.includes(entry.key)
  );
  return (
    <>
      {entries.map((entry) => {
        const Component = SECTION_COMPONENTS[entry.key];
        const node = <Component card={card} qrColor={qrColor} />;
        return (
          <SectionSlot key={entry.key} className={className}>
            {node}
          </SectionSlot>
        );
      })}
    </>
  );
}

/** One body section by key (for templates that interleave their own sections in the owner's order). */
export function BodySection({ card, sectionKey, qrColor }: { card: CardModel; sectionKey: SectionKey; qrColor?: string }) {
  const Component = SECTION_COMPONENTS[sectionKey];
  return <Component card={card} qrColor={qrColor} />;
}

/** Wraps a section in the template's spacing, rendering nothing when the section is empty. */
function SectionSlot({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`${className ?? ""} empty:hidden`}>{children}</div>;
}

export { QrSection };
