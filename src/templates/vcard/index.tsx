"use client";

/**
 * Classic card template (id "vcard"), redesigned for plan §3.6 / design canvas board 3.
 *
 * A template only lays out the typed card content (ADR-030): it never fetches data and
 * never shows placeholder text — every part hides itself when its data is empty.
 */

import * as React from "react";
import { Globe, Mail, MapPin, Phone, QrCode, Share2, UserPlus } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import type { TemplateProps } from "../types";
import { useCard, externalLinkProps, type CardModel } from "../shared/useCard";
import { BodySections, ExtraBlocks } from "../shared/sections";
import { CardSheets } from "../shared/CardSheets";
import { CardFonts } from "../shared/CardChrome";
import { SocialIcon, SOCIAL_LABELS, WhatsAppGlyph, type CardIcon } from "../shared/SocialIcon";
import { directionsHref, initials, mailHref, telHref, whatsappHref } from "../shared/actions";
import { entranceClass, primaryButtonClass } from "../shared/palette";
import type { AnalyticsEventType } from "@/types/analytics";

// ── Cover ──────────────────────────────────────────────────────────────────────────

function IllustratedCover() {
  return (
    <svg viewBox="0 0 390 190" aria-hidden="true" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
      <path d="M40 190 V96 a40 40 0 0 1 80 0 V190 Z" fill="var(--c-tint2)" />
      <rect x="150" y="54" width="104" height="136" fill="var(--c-tint1)" />
      <rect x="166" y="70" width="34" height="50" fill="var(--c-soft)" />
      <rect x="206" y="70" width="34" height="50" fill="var(--c-soft)" />
      <path d="M282 190 V120 a26 26 0 0 1 52 0 V190 Z" fill="var(--c-tint3)" />
      <circle cx="128" cy="34" r="14" fill="#FFFFFF" opacity="0.6" />
      <rect x="0" y="176" width="390" height="14" fill="var(--c-tint1)" />
    </svg>
  );
}

function Cover({ card }: { card: CardModel }) {
  const images = card.content.identity.cover_images;
  const slideshow = card.style.cover_slideshow !== false && images.length > 1;
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!slideshow) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % images.length), 4500);
    return () => window.clearInterval(timer);
  }, [slideshow, images.length]);

  const { actions } = card.content;
  const roundButton =
    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#18181B] shadow-sm backdrop-blur transition-colors hover:bg-white";

  return (
    <div data-edit="identity" className="relative h-[190px] shrink-0 overflow-hidden bg-[var(--c-soft)]">
      {images.length === 0 ? (
        <IllustratedCover />
      ) : (
        images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded cover photos
          <img
            key={src}
            src={resolveMediaUrl(src)}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === (slideshow ? index : 0) ? "opacity-100" : "opacity-0"
            }`}
          />
        ))
      )}
      {(actions.qr || actions.share) && (
        <div className="absolute right-3.5 top-3.5 flex gap-2">
          {actions.qr && (
            <button type="button" aria-label="Show QR code" onClick={() => card.setSheet({ kind: "qr" })} className={roundButton}>
              <QrCode className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          )}
          {actions.share && (
            <button type="button" aria-label="Share this card" onClick={card.shareCard} className={roundButton}>
              <Share2 className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Identity ───────────────────────────────────────────────────────────────────────

function VerifiedTick() {
  return (
    <svg role="img" aria-label="Verified" viewBox="0 0 24 24" className="h-[21px] w-[21px] shrink-0">
      <path
        d="M12 2l2.4 2.1 3.1-.4.9 3 2.8 1.6-1 3 1 3-2.8 1.6-.9 3-3.1-.4L12 22l-2.4-2.1-3.1.4-.9-3-2.8-1.6 1-3-1-3L5.6 7l.9-3 3.1.4z"
        fill="var(--c-accent)"
      />
      <path d="M8.5 12.2l2.3 2.3 4.7-4.7" fill="none" stroke="var(--c-on-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chip({ children, dot }: { children: React.ReactNode; dot?: boolean }) {
  return (
    <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] px-3 text-[13px] font-medium text-[var(--c-ink2)]">
      {dot && <span className="h-[7px] w-[7px] rounded-full bg-[#16A34A]" aria-hidden="true" />}
      {children}
    </span>
  );
}

function Identity({ card }: { card: CardModel }) {
  const { identity } = card.content;
  const subtitle = [identity.role, identity.company].filter(Boolean).join(" · ");
  const chips = [
    identity.hours ? { text: identity.hours, dot: true } : null,
    identity.category_label ? { text: identity.category_label, dot: false } : null,
    ...identity.badges.map((text) => ({ text, dot: false })),
  ].filter((c): c is { text: string; dot: boolean } => c !== null);

  return (
    <div data-edit="identity" className="relative -mt-[50px] flex flex-col items-center gap-1 px-6 text-center">
      {identity.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded avatar
        <img
          src={resolveMediaUrl(identity.avatar_url)}
          alt={identity.name}
          className="h-[100px] w-[100px] rounded-full border-4 border-[var(--c-bg)] bg-[var(--c-soft)] object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-4 border-[var(--c-bg)] bg-[var(--c-accent)] text-[32px] font-semibold text-[var(--c-on-accent)]"
        >
          {initials(identity.name)}
        </span>
      )}
      <h1 className="mt-2.5 flex items-center justify-center gap-1.5 text-[25px] font-bold leading-8 tracking-[-0.01em] text-[var(--c-ink)]">
        <span>{identity.name}</span>
        {identity.verified_badge && <VerifiedTick />}
      </h1>
      {subtitle && <div className="text-[15px] font-medium text-[var(--c-ink2)]">{subtitle}</div>}
      {identity.bio && <p className="mt-1.5 whitespace-pre-line text-[15px] leading-[22px] text-[var(--c-ink2)]">{identity.bio}</p>}
      {chips.length > 0 && (
        <div className="mt-2.5 flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <Chip key={chip.text} dot={chip.dot}>
              {chip.text}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Contact buttons ────────────────────────────────────────────────────────────────

interface ContactTile {
  key: string;
  label: string;
  href: string;
  Icon: CardIcon;
  event: AnalyticsEventType;
}

function contactTiles(card: CardModel): ContactTile[] {
  const { contact } = card.content;
  const tiles: ContactTile[] = [];
  const call = telHref(contact.phone);
  if (call) tiles.push({ key: "call", label: "Call", href: call, Icon: Phone, event: "phone_click" });
  const wa = whatsappHref(contact.whatsapp);
  if (wa) {
    tiles.push({
      key: "whatsapp",
      label: "WhatsApp",
      href: wa,
      Icon: WhatsAppGlyph,
      event: "whatsapp_click",
    });
  }
  const mail = mailHref(contact.email);
  if (mail) tiles.push({ key: "email", label: "Email", href: mail, Icon: Mail, event: "email_click" });
  const directions = directionsHref(contact);
  if (directions) tiles.push({ key: "directions", label: "Directions", href: directions, Icon: MapPin, event: "link_click" });
  if (tiles.length < 4 && contact.website) {
    tiles.push({ key: "website", label: "Website", href: contact.website, Icon: Globe, event: "link_click" });
  }
  return tiles.slice(0, 4);
}

const GRID_COLS = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"];

function ContactTiles({ card }: { card: CardModel }) {
  const tiles = contactTiles(card);
  if (tiles.length === 0) return null;
  return (
    <nav aria-label="Contact" data-edit="contact" className={`grid gap-2.5 px-5 pt-[22px] ${GRID_COLS[tiles.length]}`}>
      {tiles.map(({ key, label, href, Icon, event }) => (
        <a
          key={key}
          {...externalLinkProps(href)}
          onClick={() => card.track(event, { action: key })}
          className="flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-[var(--c-tile-r)] bg-[var(--c-soft)] text-[12px] font-semibold text-[var(--c-accent)] transition-transform active:scale-[0.97]"
        >
          <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
  );
}

function MainButtons({ card, buttonStyle }: { card: CardModel; buttonStyle: Parameters<typeof primaryButtonClass>[0] }) {
  const { save_contact, share } = card.content.actions;
  if (!save_contact && !share) return null;
  return (
    <div data-edit="actions" className="flex gap-2.5 px-5 pt-3">
      {save_contact && (
        <button
          type="button"
          onClick={card.saveContact}
          className={`flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[var(--c-btn-r)] text-[15px] font-semibold transition-opacity hover:opacity-95 ${primaryButtonClass(buttonStyle)}`}
        >
          <UserPlus className="h-5 w-5" aria-hidden="true" />
          Save contact
        </button>
      )}
      {share && (
        <button
          type="button"
          onClick={card.shareCard}
          className={`flex h-[50px] items-center justify-center gap-1.5 rounded-[var(--c-btn-r)] border border-[var(--c-border-strong)] bg-[var(--c-surface)] text-[15px] font-semibold text-[var(--c-ink)] ${
            save_contact ? "w-[112px] shrink-0" : "flex-1"
          }`}
        >
          <Share2 className="h-[18px] w-[18px]" aria-hidden="true" />
          Share
        </button>
      )}
    </div>
  );
}

function SocialRow({ card }: { card: CardModel }) {
  const { socials } = card.content;
  if (socials.length === 0) return null;
  return (
    <nav aria-label="Social links" data-edit="socials" className="flex flex-wrap justify-center gap-3 px-5 pt-5">
      {socials.map((social) => (
        <a
          key={social.id}
          {...externalLinkProps(social.url)}
          onClick={() => card.track("social_click", { provider: social.platform })}
          aria-label={SOCIAL_LABELS[social.platform]}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-ink)] transition-colors hover:border-[var(--c-border-strong)]"
        >
          <SocialIcon platform={social.platform} />
        </a>
      ))}
    </nav>
  );
}

// ── Template ───────────────────────────────────────────────────────────────────────

export function VCardTemplate(props: TemplateProps) {
  const card = useCard(props, "vcard");
  const { theme, profile, footer } = props;

  return (
    <div
      style={card.cssVars}
      className={`w-full bg-[var(--c-bg)] ${card.isPreview ? "" : "min-h-screen md:bg-[var(--c-border)] md:py-8"}`}
    >
      <CardFonts fonts={[theme.font_family]} />
      <article
        className={`relative mx-auto flex w-full max-w-[440px] flex-col bg-[var(--c-bg)] pb-2 text-[var(--c-ink)] [font-family:var(--c-font)] ${entranceClass(theme.animation)} ${
          card.isPreview ? "" : "min-h-screen md:min-h-0 md:overflow-hidden md:rounded-[28px] md:shadow-[0_12px_40px_rgba(16,24,40,0.12)]"
        }`}
      >
        <Cover card={card} />
        <Identity card={card} />
        <ContactTiles card={card} />
        <MainButtons card={card} buttonStyle={theme.button_style} />
        <SocialRow card={card} />
        <BodySections card={card} className="px-5 pt-8" />
        {card.extraBlocks.length > 0 && (
          <div className="px-5 pt-8">
            <ExtraBlocks card={card} username={profile.username} />
          </div>
        )}
        <div className="mt-auto">{footer}</div>
        <CardSheets card={card} />
      </article>
    </div>
  );
}

export default VCardTemplate;
