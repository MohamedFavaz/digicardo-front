"use client";

/**
 * Botanical card template, redesigned for plan §3.6 / design canvas board 3: soft line art,
 * a serif name, round contact buttons, link cards and one of five palettes.
 *
 * A template only lays out the typed card content (ADR-030): it never fetches data and
 * never shows placeholder text — every part hides itself when its data is empty.
 */

import * as React from "react";
import { Building2, Check, Clock, Globe, Mail, MapPin, Phone, Share2, ShieldCheck, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import type { TemplateProps } from "../types";
import { useCard, externalLinkProps, type CardModel } from "../shared/useCard";
import { BodySections, ExtraBlocks, QrSection } from "../shared/sections";
import { CardSheets } from "../shared/CardSheets";
import { CardFonts } from "../shared/CardChrome";
import { SocialIcon, SOCIAL_LABELS, WhatsAppGlyph, type CardIcon } from "../shared/SocialIcon";
import { directionsHref, initials, mailHref, telHref, whatsappHref } from "../shared/actions";
import { entranceClass, mix } from "../shared/palette";
import type { AnalyticsEventType } from "@/types/analytics";
import { BotanicalBackground } from "./backgrounds";
import { BOTANICAL_PALETTES } from "./constants";

export { BOTANICAL_PALETTES };

/** Display font for the name and monogram (loaded by CardFonts). */
const SERIF = "[font-family:var(--b-serif)]";

function TopBar({ card }: { card: CardModel }) {
  const { identity, actions } = card.content;
  if (!identity.company && !identity.logo_url && !actions.share) return null;
  return (
    <div data-edit="identity" className="relative flex items-center gap-2.5 px-5 py-[18px]">
      {identity.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded logo
        <img src={resolveMediaUrl(identity.logo_url)} alt="" className="h-[38px] w-[38px] rounded-[10px] bg-white object-contain" />
      ) : identity.company ? (
        <span
          aria-hidden="true"
          className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[var(--c-ink)] text-[15px] font-bold text-[var(--c-surface)] ${SERIF}`}
        >
          {initials(identity.company)}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--c-ink)]">{identity.company}</span>
      {actions.share && (
        <button
          type="button"
          aria-label="Share this card"
          onClick={card.shareCard}
          className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-ink)]"
        >
          <Share2 className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function Identity({ card }: { card: CardModel }) {
  const { identity } = card.content;
  const chips: { text: string; Icon: LucideIcon }[] = [
    ...identity.badges.map((text) => ({ text, Icon: ShieldCheck })),
    ...(identity.hours ? [{ text: identity.hours, Icon: Clock }] : []),
  ];

  return (
    <div data-edit="identity" className="relative flex flex-col items-center gap-1 px-7 pt-2.5 text-center">
      <span className="relative h-[116px] w-[116px]">
        {identity.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded avatar
          <img
            src={resolveMediaUrl(identity.avatar_url)}
            alt={identity.name}
            className="h-[116px] w-[116px] rounded-full border-4 border-[var(--c-surface)] bg-[var(--c-soft)] object-cover shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`flex h-[116px] w-[116px] items-center justify-center rounded-full border-4 border-[var(--c-surface)] bg-[var(--c-accent)] text-[38px] font-bold text-[var(--c-on-accent)] shadow-[0_8px_24px_rgba(16,24,40,0.12)] ${SERIF}`}
          >
            {initials(identity.name)}
          </span>
        )}
        {identity.verified_badge && (
          <span
            role="img"
            aria-label="Verified"
            className="absolute bottom-1 right-0.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--c-surface)] text-[var(--c-accent)]"
          >
            <Check className="h-[18px] w-[18px]" strokeWidth={2.6} aria-hidden="true" />
          </span>
        )}
      </span>

      <h1 className={`mt-3.5 text-[32px] font-bold leading-[38px] text-[var(--c-ink)] ${SERIF}`}>{identity.name}</h1>
      {identity.role && <div className="text-[15px] font-semibold text-[var(--b-secondary)]">{identity.role}</div>}
      {identity.company && (
        <div className="flex items-center gap-1.5 text-[14px] text-[var(--c-ink2)]">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          {identity.company}
        </div>
      )}
      {identity.category_label && (
        <div className="mt-3 flex w-full items-center gap-2.5">
          <span className="h-px flex-1 bg-[var(--c-line)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--b-secondary)]">
            {identity.category_label}
          </span>
          <span className="h-px flex-1 bg-[var(--c-line)]" />
        </div>
      )}
      {identity.bio && (
        <p className="mt-2.5 whitespace-pre-line text-[15px] leading-[23px] text-[var(--c-ink2)]">{identity.bio}</p>
      )}
      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {chips.map(({ text, Icon }) => (
            <span
              key={text}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] px-3 text-[13px] font-medium text-[var(--c-ink)]"
            >
              <Icon className="h-[15px] w-[15px]" aria-hidden="true" />
              {text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface RoundAction {
  key: string;
  label: string;
  href: string;
  Icon: CardIcon;
  event: AnalyticsEventType;
}

function roundActions(card: CardModel): RoundAction[] {
  const { contact } = card.content;
  const out: RoundAction[] = [];
  const call = telHref(contact.phone);
  if (call) out.push({ key: "call", label: "Call", href: call, Icon: Phone, event: "phone_click" });
  const wa = whatsappHref(contact.whatsapp);
  if (wa) {
    out.push({
      key: "whatsapp",
      label: "WhatsApp",
      href: wa,
      Icon: WhatsAppGlyph,
      event: "whatsapp_click",
    });
  }
  const mail = mailHref(contact.email);
  if (mail) out.push({ key: "email", label: "Email", href: mail, Icon: Mail, event: "email_click" });
  if (contact.website) out.push({ key: "website", label: "Website", href: contact.website, Icon: Globe, event: "link_click" });
  const directions = directionsHref(contact);
  if (directions && out.length < 4) out.push({ key: "directions", label: "Directions", href: directions, Icon: MapPin, event: "link_click" });
  return out.slice(0, 4);
}

const GRID_COLS = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"];

function RoundActions({ card }: { card: CardModel }) {
  const actions = roundActions(card);
  if (actions.length === 0) return null;
  return (
    <nav aria-label="Contact" data-edit="contact" className={`relative grid gap-2 px-[22px] pt-6 ${GRID_COLS[actions.length]}`}>
      {actions.map(({ key, label, href, Icon, event }) => (
        <a
          key={key}
          {...externalLinkProps(href)}
          onClick={() => card.track(event, { action: key })}
          className="flex flex-col items-center gap-1.5 text-[12px] font-semibold text-[var(--c-ink)]"
        >
          <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-accent)] transition-transform active:scale-95">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          {label}
        </a>
      ))}
    </nav>
  );
}

function Socials({ card }: { card: CardModel }) {
  const { socials } = card.content;
  if (socials.length === 0) return null;
  return (
    <nav aria-label="Social links" data-edit="socials" className="relative flex flex-wrap justify-center gap-3 px-5 pt-6">
      {socials.map((social) => (
        <a
          key={social.id}
          {...externalLinkProps(social.url)}
          onClick={() => card.track("social_click", { provider: social.platform })}
          aria-label={SOCIAL_LABELS[social.platform]}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-ink)]"
        >
          <SocialIcon platform={social.platform} />
        </a>
      ))}
    </nav>
  );
}

function SaveShare({ card }: { card: CardModel }) {
  const { save_contact, share } = card.content.actions;
  if (!save_contact && !share) return null;
  return (
    <div data-edit="actions" className="relative flex gap-2.5 px-5 pt-6">
      {save_contact && (
        <button
          type="button"
          onClick={card.saveContact}
          className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[var(--c-btn-r)] bg-[var(--c-ink)] text-[15px] font-semibold text-[var(--c-surface)]"
        >
          <UserPlus className="h-5 w-5" aria-hidden="true" />
          Save contact
        </button>
      )}
      {share && (
        <button
          type="button"
          onClick={card.shareCard}
          className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[var(--c-btn-r)] border border-[var(--c-border-strong)] bg-[var(--c-surface)] text-[15px] font-semibold text-[var(--c-ink)]"
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
          Share card
        </button>
      )}
    </div>
  );
}

export function BotanicalTemplate(props: TemplateProps) {
  const card = useCard(props, "botanical");
  const { theme, profile, footer } = props;
  const { palette } = card;

  // Body text is a softened primary colour; role and category use the palette's second colour.
  const vars = React.useMemo(
    () =>
      ({
        ...card.cssVars,
        "--c-ink2": mix(palette.ink, palette.bg, 0.78),
        "--b-secondary": palette.ink2,
        "--b-serif": "'Playfair Display', Georgia, serif",
      }) as React.CSSProperties,
    [card.cssVars, palette]
  );

  const showQr = card.content.layout.some((e) => e.key === "qr" && e.visible);

  return (
    <div
      style={vars}
      className={`w-full bg-[var(--c-bg)] ${card.isPreview ? "" : "min-h-screen md:bg-[var(--c-border)] md:py-8"}`}
    >
      <CardFonts fonts={["playfair-display", theme.font_family]} />
      <article
        className={`relative mx-auto flex w-full max-w-[440px] flex-col bg-[var(--c-bg)] pb-2 text-[var(--c-ink)] [font-family:var(--c-font)] ${entranceClass(theme.animation)} ${
          card.isPreview ? "" : "min-h-screen overflow-hidden md:min-h-0 md:rounded-[28px] md:shadow-[0_12px_40px_rgba(16,24,40,0.12)]"
        }`}
      >
        <BotanicalBackground variant={String(card.style.background ?? "botanical")} />
        <TopBar card={card} />
        {!card.content.identity.company && !card.content.identity.logo_url && !card.content.actions.share && <div className="h-8" />}
        <Identity card={card} />
        <RoundActions card={card} />
        <BodySections card={card} className="relative px-5 pt-[26px]" exclude={["qr"]} />
        <Socials card={card} />
        <SaveShare card={card} />
        {showQr && (
          <div className="relative px-5 pt-4 empty:hidden">
            <QrSection card={card} color={palette.ink} />
          </div>
        )}
        {card.extraBlocks.length > 0 && (
          <div className="relative px-5 pt-7">
            <ExtraBlocks card={card} username={profile.username} />
          </div>
        )}
        <div className="relative mt-auto">{footer}</div>
        <CardSheets card={card} />
      </article>
    </div>
  );
}

export default BotanicalTemplate;
