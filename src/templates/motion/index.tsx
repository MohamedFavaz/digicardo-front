"use client";

/**
 * Motion card template (id "motion") — a modern card that reacts to scrolling and tapping.
 *
 * - Intro: the logo pops in inside a spinning colour ring, the name rises word by word, a soft
 *   "aurora" glow drifts behind the top (control `aurora`).
 * - Scrolling: the cover photo moves slower than the page (parallax), the top fades away, a
 *   glass top bar with Save slides in, a thin bar shows how far down you are, and every part
 *   glides / zooms / pops in the first time it comes on screen.
 * - Tapping: a 3D business card flips to its QR code (control `flip_card`; it tilts under a
 *   mouse), services open like an accordion, products slide in a swipeable carousel with dots,
 *   buttons ripple from the finger, Save contact bursts, and a floating button fans out
 *   Call / WhatsApp / Email / Save / Share (control `quick_menu`).
 * - "Animation" control: Lively (all of the above) or Subtle (fades only).
 *
 * Like every template it only lays out the typed card content (ADR-030): nothing is fetched and
 * every part hides itself when its data is empty. With reduced motion, without JavaScript and in
 * `inert` thumbnails everything is simply shown. Dashboard previews always use the phone layout;
 * the live card gets a two-column layout on desktop.
 */

import * as React from "react";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Globe,
  Mail,
  MapPin,
  MousePointerClick,
  CalendarDays,
  Phone,
  Plus,
  RotateCw,
  Share2,
  ShoppingBag,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import type { PublicProfile } from "@/types/profile";
import type { AnalyticsEventType } from "@/types/analytics";
import type { SectionKey, SocialPlatform } from "@/lib/zod/content";
import type { TemplateProps } from "../types";
import { useCard, externalLinkProps, type CardModel } from "../shared/useCard";
import { BodySection, ExtraBlocks } from "../shared/sections";
import { CardSheets } from "../shared/CardSheets";
import { CardFonts } from "../shared/CardChrome";
import { CardQr, downloadQrPng } from "../shared/CardQr";
import { SocialIcon, SOCIAL_LABELS, WhatsAppGlyph, type CardIcon } from "../shared/SocialIcon";
import { directionsHref, enquiryMessage, enquiryNumber, firstName, initials, mailHref, telHref, whatsappHref } from "../shared/actions";
import { mix, onColor, withAlpha } from "../shared/palette";
import { useOpenNow } from "../shared/hours";
import { prefersReducedMotion, rippleFrom, tiltHandlers, useInView, useMotionAllowed, useReveal, useScrollFx } from "./fx";
import { MOTION_CSS } from "./styles";

// ── Helpers ────────────────────────────────────────────────────────────────────────

/** Is a body section switched on in the owner's layout? */
function sectionOn(card: CardModel, key: SectionKey): boolean {
  const entry = card.content.layout.find((e) => e.key === key);
  return entry ? entry.visible : true;
}

/** Stagger index for reveal / intro delays. */
const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

const smoothBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");

/** Colours this template derives from the accent: a second and third glow colour, glass, card faces. */
function useMotionColors(card: CardModel): React.CSSProperties {
  const { accent, surface, ink, dark } = card.palette;
  return React.useMemo(() => {
    const a2 = mix(accent, "#FF4FB8", 0.52);
    const a3 = mix(accent, "#2DD4FF", 0.48);
    const from = mix(accent, "#05050A", 0.6);
    const to = mix(a2, "#05050A", 0.8);
    return {
      "--mo-a2": a2,
      "--mo-a3": a3,
      "--mo-a3-soft": withAlpha(a3, 0.5),
      "--mo-glass": withAlpha(surface, dark ? 0.66 : 0.84),
      "--mo-line": dark ? "rgba(255, 255, 255, 0.09)" : withAlpha(ink, 0.08),
      "--mo-shadow": dark ? "0 24px 60px -30px rgba(0, 0, 0, 0.9)" : "0 22px 50px -32px rgba(15, 23, 42, 0.38)",
      "--mo-glow": withAlpha(accent, dark ? 0.6 : 0.45),
      "--mo-blob-o": dark ? "0.55" : "0.32",
      "--mo-card-from": from,
      "--mo-card-to": to,
      "--mo-card-ink": onColor(mix(from, to, 0.5)),
    } as React.CSSProperties;
  }, [accent, surface, ink, dark]);
}

interface ContactAction {
  key: string;
  label: string;
  Icon: CardIcon;
  href?: string;
  onClick?: () => void;
  event?: AnalyticsEventType;
}

/** Call, WhatsApp, Email, Directions, Website — only the ones the owner filled in. */
function contactActions(card: CardModel): ContactAction[] {
  const { contact } = card.content;
  const out: ContactAction[] = [];
  const call = telHref(contact.phone);
  if (call) out.push({ key: "call", label: "Call", Icon: Phone, href: call, event: "phone_click" });
  const wa = whatsappHref(contact.whatsapp);
  if (wa) out.push({ key: "whatsapp", label: "WhatsApp", Icon: WhatsAppGlyph, href: wa, event: "whatsapp_click" });
  const mail = mailHref(contact.email);
  if (mail) out.push({ key: "email", label: "Email", Icon: Mail, href: mail, event: "email_click" });
  const directions = directionsHref(contact);
  if (directions) out.push({ key: "directions", label: "Directions", Icon: MapPin, href: directions, event: "link_click" });
  if (contact.website) out.push({ key: "website", label: "Website", Icon: Globe, href: contact.website, event: "link_click" });
  return out;
}

const BRAND: Partial<Record<SocialPlatform, string>> = {
  instagram: "#E1306C",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  x: "#111111",
  youtube: "#FF0000",
  tiktok: "#111111",
  whatsapp: "#25D366",
  whatsapp_channel: "#25D366",
  telegram: "#229ED9",
  github: "#181717",
  pinterest: "#E60023",
  threads: "#111111",
  discord: "#5865F2",
  twitch: "#9146FF",
  spotify: "#1DB954",
  behance: "#1769FF",
  dribbble: "#EA4C89",
  medium: "#111111",
  reddit: "#FF4500",
  google_business: "#4285F4",
};

function VerifiedTick() {
  return (
    <svg role="img" aria-label="Verified" viewBox="0 0 24 24" className="ml-2 inline-block h-[0.62em] w-[0.62em] -translate-y-[0.06em] align-middle">
      <path
        d="M12 2l2.4 2.1 3.1-.4.9 3 2.8 1.6-1 3 1 3-2.8 1.6-.9 3-3.1-.4L12 22l-2.4-2.1-3.1.4-.9-3-2.8-1.6 1-3-1-3L5.6 7l.9-3 3.1.4z"
        fill="var(--c-accent)"
      />
      <path d="M8.5 12.2l2.3 2.3 4.7-4.7" fill="none" stroke="var(--c-on-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHead({ id, kicker, title, action, edit }: { id: string; kicker: string; title: string; action?: React.ReactNode; edit?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div data-edit={edit} className="min-w-0">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--c-accent)]">
          <span aria-hidden="true" className="mo-rule h-px w-7 bg-[var(--c-accent)]" />
          {kicker}
        </p>
        <h2 id={id} className="mt-1.5 text-[22px] font-semibold leading-7 tracking-[-0.015em] text-[var(--c-ink)]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

// ── Top bar (appears once the hero has scrolled away) ─────────────────────────────

function TopBar({ card, compact, wide }: { card: CardModel; compact: boolean; wide: boolean }) {
  const { identity, actions } = card.content;
  const logo = identity.logo_url || identity.avatar_url;
  return (
    <div className="pointer-events-none sticky top-0 z-40 h-0">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left bg-[linear-gradient(90deg,var(--c-accent),var(--mo-a2),var(--mo-a3))]"
        style={{ transform: "scaleX(var(--mo-progress, 0))" }}
      />
      <div inert={!compact} className={`mo-bar absolute inset-x-0 top-0 px-3 pt-2.5 ${compact ? "translate-y-0 opacity-100" : "-translate-y-[130%] opacity-0"}`}>
        <div className={`mo-glass mo-blur pointer-events-auto mx-auto flex h-[58px] max-w-[456px] items-center gap-3 rounded-[20px] pl-2 pr-2 ${wide ? "lg:max-w-[1100px]" : ""}`}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded logo
            <img src={resolveMediaUrl(logo)} alt="" className="h-10 w-10 shrink-0 rounded-[13px] object-cover" />
          ) : (
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[linear-gradient(135deg,var(--c-accent),var(--mo-a2))] text-[13px] font-semibold text-[var(--c-on-accent)]">
              {initials(identity.name)}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold leading-5 text-[var(--c-ink)]">{identity.name}</span>
            {(identity.role || identity.company) && (
              <span className="block truncate text-[12px] text-[var(--c-ink2)]">{identity.role || identity.company}</span>
            )}
          </span>
          {actions.save_contact ? (
            <button
              type="button"
              data-ripple
              onClick={card.saveContact}
              className="mo-press flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[var(--c-accent)] px-4 text-[13px] font-semibold text-[var(--c-on-accent)]"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Save
            </button>
          ) : actions.share ? (
            <button
              type="button"
              data-ripple
              onClick={() => void card.shareCard()}
              aria-label="Share this card"
              className="mo-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--c-accent)] text-[var(--c-on-accent)]"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────────

function Hero({ card, heroRef, wide }: { card: CardModel; heroRef: React.RefObject<HTMLElement | null>; wide: boolean }) {
  const { identity } = card.content;
  const cover = identity.cover_images[0];
  const logo = identity.logo_url || identity.avatar_url;
  const open = useOpenNow(identity.hours);
  const words = identity.name.trim().split(/\s+/).filter(Boolean);
  const subtitle = [identity.role, identity.company].filter(Boolean).join(" · ");
  const aurora = card.style.aurora !== false;

  return (
    <header
      ref={heroRef}
      id="mo-home"
      data-edit="identity"
      className={`relative isolate flex flex-col justify-end overflow-hidden px-6 pb-10 pt-14 ${cover ? "min-h-[440px]" : ""} ${
        wide ? "lg:min-h-[420px] lg:rounded-[36px] lg:px-12 lg:pb-14" : ""
      }`}
    >
      {/* Background: cover photo and / or drifting glow, moving slower than the page. */}
      <div aria-hidden="true" className="mo-parallax absolute inset-0 -z-10">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded cover photo
          <img src={resolveMediaUrl(cover)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {aurora && (
          <div className="absolute inset-0" style={{ opacity: "var(--mo-blob-o)" }}>
            <span className="mo-blob absolute -left-[22%] -top-[28%] h-[78%] w-[78%] rounded-full bg-[var(--c-accent)] blur-[64px]" />
            <span className="mo-blob absolute -right-[26%] top-[4%] h-[72%] w-[72%] rounded-full bg-[var(--mo-a2)] blur-[72px]" />
            <span className="mo-blob absolute -bottom-[34%] left-[14%] h-[72%] w-[72%] rounded-full bg-[var(--mo-a3)] blur-[72px]" />
          </div>
        )}
        {!cover && <div className="mo-grid absolute inset-0" />}
        <div
          className="absolute inset-0"
          style={{
            background: cover
              ? "linear-gradient(180deg, color-mix(in srgb, var(--c-bg) 15%, transparent) 0%, color-mix(in srgb, var(--c-bg) 45%, transparent) 30%, color-mix(in srgb, var(--c-bg) 86%, transparent) 56%, var(--c-bg) 80%)"
              : "linear-gradient(180deg, transparent 50%, var(--c-bg) 100%)",
          }}
        />
      </div>

      <div className="mo-hero-content flex flex-col items-center text-center">
        <div className="mo-logo relative h-[112px] w-[112px] shrink-0">
          <span aria-hidden="true" className="mo-ring absolute -inset-[5px] rounded-full bg-[conic-gradient(from_0deg,var(--c-accent),var(--mo-a2),var(--mo-a3),var(--c-accent))] opacity-70 blur-[16px]" />
          <span aria-hidden="true" className="mo-ring absolute -inset-[4px] rounded-full bg-[conic-gradient(from_0deg,var(--c-accent),var(--mo-a2),var(--mo-a3),var(--c-accent))]" />
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded logo
            <img
              src={resolveMediaUrl(logo)}
              alt={identity.name}
              className="relative h-full w-full rounded-full border-[4px] border-[var(--c-bg)] bg-[var(--c-surface)] object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="relative flex h-full w-full items-center justify-center rounded-full border-[4px] border-[var(--c-bg)] bg-[var(--c-surface)] text-[34px] font-semibold text-[var(--c-ink)]"
            >
              {initials(identity.name)}
            </span>
          )}
        </div>

        {identity.category_label && (
          <span
            style={stagger(1)}
            className="mo-intro mo-blur mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--mo-line)] bg-[var(--mo-glass)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--c-ink2)]"
          >
            <span aria-hidden="true" className="mo-ping relative h-1.5 w-1.5 rounded-full bg-[var(--c-accent)]" />
            {identity.category_label}
          </span>
        )}

        <h1
          className={`mt-4 max-w-full break-words text-[36px] font-semibold leading-[1.04] tracking-[-0.035em] text-[var(--c-ink)] ${wide ? "lg:text-[56px]" : ""}`}
        >
          <span className="sr-only">{identity.name}</span>
          <span aria-hidden="true">
            {words.map((word, i) => (
              <React.Fragment key={`${word}-${i}`}>
                {i > 0 && " "}
                <span className="mo-word" style={stagger(i)}>
                  {word}
                </span>
              </React.Fragment>
            ))}
          </span>
          {identity.verified_badge && <VerifiedTick />}
        </h1>

        {subtitle && (
          <p style={stagger(3)} className={`mo-intro mt-3 text-[15.5px] text-[var(--c-ink2)] ${wide ? "lg:text-[17px]" : ""}`}>
            {subtitle}
          </p>
        )}

        {identity.hours && open !== null && (
          <span
            style={stagger(4)}
            className="mo-intro mo-blur mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--mo-line)] bg-[var(--mo-glass)] px-3.5 py-1.5 text-[12.5px] text-[var(--c-ink2)]"
          >
            <span aria-hidden="true" className={`mo-ping relative h-2 w-2 shrink-0 rounded-full ${open ? "bg-[#22C55E]" : "bg-[#F43F5E]"}`} />
            <span className="font-semibold text-[var(--c-ink)]">{open ? "Open now" : "Closed now"}</span>
            <span className="truncate">· {identity.hours}</span>
          </span>
        )}
      </div>
    </header>
  );
}

// ── Contact row + main buttons ─────────────────────────────────────────────────────

function QuickActions({ card }: { card: CardModel }) {
  const shown = contactActions(card).slice(0, 4);
  if (shown.length === 0) return null;
  return (
    <nav aria-label="Contact" data-edit="contact" className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }}>
      {shown.map((action, i) => (
        <a
          key={action.key}
          {...externalLinkProps(action.href ?? "#")}
          data-reveal="pop"
          data-ripple
          style={stagger(i)}
          onClick={() => card.track(action.event ?? "cta_click", { action: action.key })}
          className="mo-glass mo-press group flex min-w-0 flex-col items-center gap-2 rounded-[22px] px-1 pb-3 pt-3.5 text-[var(--c-ink)]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[linear-gradient(135deg,var(--c-accent),var(--mo-a2))] text-[var(--c-on-accent)] shadow-[0_10px_22px_-10px_var(--mo-glow)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]">
            <action.Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="max-w-full truncate text-[12.5px] font-medium">{action.label}</span>
        </a>
      ))}
    </nav>
  );
}

const BURST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

function MainButtons({ card, fx }: { card: CardModel; fx: boolean }) {
  const { save_contact, share } = card.content.actions;
  const [bursts, setBursts] = React.useState(0);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2400);
    return () => window.clearTimeout(timer);
  }, [saved, bursts]);

  if (!save_contact && !share) return null;

  const save = () => {
    card.saveContact();
    setBursts((n) => n + 1);
    setSaved(true);
  };

  return (
    <div data-edit="actions" data-reveal style={stagger(2)} className={`grid gap-2.5 ${save_contact && share ? "grid-cols-[minmax(0,1fr)_auto]" : ""}`}>
      {save_contact && (
        <div className="relative">
          <button
            type="button"
            data-ripple
            onClick={save}
            className="mo-press mo-shimmer flex h-[56px] w-full items-center justify-center gap-2.5 rounded-[var(--c-btn-r)] bg-[linear-gradient(120deg,var(--c-accent),var(--mo-a2))] px-5 text-[15.5px] font-semibold text-[var(--c-on-accent)] shadow-[0_18px_36px_-16px_var(--mo-glow)]"
          >
            {saved ? <Check key="done" className="mo-pop-in h-5 w-5" aria-hidden="true" /> : <UserPlus className="h-5 w-5" aria-hidden="true" />}
            <span aria-live="polite">{saved ? "Saved!" : "Save contact"}</span>
          </button>
          {fx && bursts > 0 && (
            <span key={bursts} aria-hidden="true" className="mo-burst pointer-events-none absolute left-1/2 top-1/2">
              {BURST_ANGLES.map((angle, i) => (
                <span
                  key={angle}
                  className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full"
                  style={{ "--a": `${angle}deg`, background: i % 2 ? "var(--mo-a3)" : "var(--c-accent)" } as React.CSSProperties}
                />
              ))}
            </span>
          )}
        </div>
      )}
      {share && (
        <button
          type="button"
          data-ripple
          onClick={() => void card.shareCard()}
          aria-label={save_contact ? "Share this card" : undefined}
          className={`mo-glass mo-press flex h-[56px] items-center justify-center gap-2 rounded-[var(--c-btn-r)] text-[15px] font-semibold text-[var(--c-ink)] ${save_contact ? "w-[56px]" : "w-full px-5"}`}
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
          {!save_contact && "Share this card"}
        </button>
      )}
    </div>
  );
}

// ── Flip card ──────────────────────────────────────────────────────────────────────

function ChipArt() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 30" className="h-[30px] w-[40px]">
      <rect x="0.5" y="0.5" width="39" height="29" rx="6" fill="#E9C46A" stroke="#B88A2B" />
      <path d="M0.5 10.5h12m15 0h12M0.5 19.5h12m15 0h12M12.5 0.5v29M27.5 0.5v29M12.5 15h15" stroke="#B88A2B" fill="none" />
    </svg>
  );
}

function WavesArt() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M8.5 7.5a6 6 0 010 9M12 5a9.5 9.5 0 010 14M15.5 2.5a13 13 0 010 19" />
    </svg>
  );
}

/** Whether the flip card carries the QR code (then the separate QR section isn't repeated). */
function flipShowsQr(card: CardModel): boolean {
  return card.style.flip_card !== false && card.content.actions.qr && sectionOn(card, "qr");
}

function FlipCard({ card, fx, lively }: { card: CardModel; fx: boolean; lively: boolean }) {
  const [flipped, setFlipped] = React.useState(false);
  const { identity, contact } = card.content;
  const qr = flipShowsQr(card);
  const lines = [
    contact.phone && { Icon: Phone, text: contact.phone },
    contact.email && { Icon: Mail, text: contact.email },
    contact.website && { Icon: Globe, text: contact.website.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "") },
    contact.address && { Icon: MapPin, text: contact.address },
  ].filter(Boolean) as { Icon: CardIcon; text: string }[];

  if (card.style.flip_card === false || (!qr && lines.length === 0)) return null;

  const logo = identity.logo_url || identity.avatar_url;
  const subtitle = [identity.role, identity.company].filter(Boolean).join(" · ");
  const shortUrl = card.cardUrl.replace(/^https?:\/\//, "");

  return (
    <section aria-label="Business card" data-reveal style={stagger(3)} className="flex flex-col items-center gap-3 pt-2">
      <div className="w-full [perspective:1400px]">
        <div className="mo-peek mo-3d">
          <button
            type="button"
            onClick={() => {
              setFlipped((f) => !f);
              card.track("cta_click", { action: "flip_card" });
            }}
            aria-pressed={flipped}
            aria-label={flipped ? "Flip the card back to the front" : qr ? "Flip the card to show the QR code" : "Flip the card to show contact details"}
            {...tiltHandlers(fx && lively)}
            className="mo-tilt mo-3d block w-full rounded-[22px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--c-bg)]"
          >
            <span data-flipped={flipped ? "" : undefined} className="mo-flip mo-3d relative block aspect-[1.586/1] w-full">
              {/* Front */}
              <span
                className="mo-face absolute inset-0 block overflow-hidden rounded-[22px] text-[var(--mo-card-ink)] shadow-[0_34px_60px_-30px_var(--mo-glow)]"
                style={{ background: "radial-gradient(120% 90% at 100% 0%, var(--mo-a3-soft), transparent 52%), linear-gradient(135deg, var(--mo-card-from), var(--mo-card-to))" }}
              >
                <span aria-hidden="true" className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/15" />
                <span aria-hidden="true" className="absolute -right-4 -top-4 h-28 w-28 rounded-full border border-white/10" />
                <span aria-hidden="true" className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-white/[0.06]" />
                <span className="absolute left-5 top-5 flex max-w-[70%] items-center gap-2.5">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded logo
                    <img src={resolveMediaUrl(logo)} alt="" className="h-9 w-9 shrink-0 rounded-[11px] bg-white object-cover" />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/20 text-[12px] font-semibold">{initials(identity.name)}</span>
                  )}
                  <span className="truncate text-[11.5px] font-semibold uppercase tracking-[0.16em] opacity-90">
                    {identity.company || identity.category_label || "Digital card"}
                  </span>
                </span>
                <span className="absolute right-5 top-5">
                  <WavesArt />
                </span>
                <span className="absolute left-5 top-[42%]">
                  <ChipArt />
                </span>
                <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-[21px] font-semibold leading-tight tracking-[-0.01em]">{identity.name}</span>
                    {subtitle && <span className="mt-0.5 block truncate text-[12px] opacity-80">{subtitle}</span>}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em]">
                    <RotateCw className="h-3 w-3" aria-hidden="true" /> Flip
                  </span>
                </span>
                <span aria-hidden="true" className="mo-glare absolute inset-0" />
              </span>

              {/* Back */}
              <span className="mo-face absolute inset-0 block overflow-hidden rounded-[22px] border border-[var(--mo-line)] bg-[var(--c-surface)] text-[var(--c-ink)] shadow-[0_34px_60px_-30px_var(--mo-glow)] [transform:rotateY(180deg)]">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--c-accent),var(--mo-a2),var(--mo-a3))]" />
                {qr ? (
                  <span className="flex h-full items-center gap-4 p-5">
                    <span className="shrink-0 rounded-[16px] bg-white p-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]">
                      <CardQr value={card.cardUrl} size={108} color="#111118" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--c-accent)]">Scan me</span>
                      <span className="mt-1 block text-[17px] font-semibold leading-snug">Save {firstName(identity.name)} on your phone</span>
                      <span className="mt-1.5 block truncate text-[12px] text-[var(--c-ink3)]">{shortUrl}</span>
                    </span>
                  </span>
                ) : (
                  <span className="flex h-full flex-col justify-center gap-2.5 px-5">
                    {lines.slice(0, 4).map(({ Icon, text }) => (
                      <span key={text} className="flex min-w-0 items-center gap-3 text-[14px]">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--c-soft)] text-[var(--c-accent)]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="truncate">{text}</span>
                      </span>
                    ))}
                  </span>
                )}
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[12.5px] text-[var(--c-ink3)]">
        <span className="inline-flex items-center gap-1.5">
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" /> Tap the card to flip it
        </span>
        {qr && (
          <button
            type="button"
            onClick={() => downloadQrPng(card.cardUrl, identity.name || "card", "#111118")}
            className="inline-flex items-center gap-1.5 font-semibold text-[var(--c-ink)] underline-offset-4 hover:underline"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download QR
          </button>
        )}
      </div>
    </section>
  );
}

// ── About + socials ────────────────────────────────────────────────────────────────

function About({ card }: { card: CardModel }) {
  const { identity, contact } = card.content;
  const open = useOpenNow(identity.hours);
  const [more, setMore] = React.useState(false);
  const directions = directionsHref(contact);
  if (!identity.bio && !identity.hours && !contact.address && identity.badges.length === 0) return null;
  const long = identity.bio.length > 170;

  return (
    <section aria-labelledby="mo-about" data-reveal className="scroll-mt-24 mo-glass rounded-[26px] p-5">
      <SectionHead id="mo-about" kicker="About" title={identity.company || identity.name} edit="identity" />
      {identity.bio && (
        <div>
          <p className={`whitespace-pre-line text-[14.5px] leading-[23px] text-[var(--c-ink2)] ${!more && long ? "line-clamp-4" : ""}`}>{identity.bio}</p>
          {long && (
            <button
              type="button"
              onClick={() => setMore((m) => !m)}
              aria-expanded={more}
              className="mt-1.5 text-[13px] font-semibold text-[var(--c-accent)] underline-offset-4 hover:underline"
            >
              {more ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}
      {identity.badges.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {identity.badges.map((badge, i) => (
            <li
              key={badge}
              data-reveal="pop"
              style={stagger(i)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--mo-line)] bg-[var(--c-soft)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--c-ink)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--c-accent)]" aria-hidden="true" />
              {badge}
            </li>
          ))}
        </ul>
      )}
      {(identity.hours || contact.address) && (
        <ul className="mt-4 flex flex-col divide-y divide-[var(--mo-line)] border-t border-[var(--mo-line)]">
          {identity.hours && (
            <li className="flex items-center gap-3 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--c-soft)] text-[var(--c-accent)]">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 text-[14px] text-[var(--c-ink)]">{identity.hours}</span>
              {open !== null && (
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${open ? "bg-[#22C55E]/15 text-[#16A34A]" : "bg-[#F43F5E]/15 text-[#E11D48]"}`}>
                  {open ? "Open" : "Closed"}
                </span>
              )}
            </li>
          )}
          {contact.address && (
            <li className="flex items-center gap-3 pt-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--c-soft)] text-[var(--c-accent)]">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 text-[14px] leading-5 text-[var(--c-ink)]">{contact.address}</span>
              {directions && (
                <a
                  {...externalLinkProps(directions)}
                  onClick={() => card.track("link_click", { action: "directions" })}
                  aria-label="Get directions"
                  className="mo-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--c-accent)] text-[var(--c-on-accent)]"
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

function Socials({ card }: { card: CardModel }) {
  const { socials } = card.content;
  if (socials.length === 0) return null;
  return (
    <section aria-labelledby="mo-socials" data-reveal className="scroll-mt-24 mo-glass rounded-[26px] p-5">
      <SectionHead id="mo-socials" kicker="Connect" title="Find me online" edit="socials" />
      <ul className="grid grid-cols-4 gap-x-2 gap-y-4">
        {socials.map((social, i) => (
          <li key={social.id} data-reveal="pop" style={stagger(i)}>
            <a
              {...externalLinkProps(social.url)}
              onClick={() => card.track("social_click", { provider: social.platform })}
              className="group flex flex-col items-center gap-1.5"
            >
              <span
                data-ripple
                className="mo-press flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border border-[var(--mo-line)] bg-[var(--c-soft)] text-[var(--c-ink)] transition-colors duration-300 group-hover:text-white"
                style={{ "--brand": BRAND[social.platform] ?? "var(--c-accent)" } as React.CSSProperties}
              >
                <span aria-hidden="true" className="absolute inset-0 -z-10 translate-y-full bg-[var(--brand)] transition-transform duration-300 group-hover:translate-y-0" />
                <SocialIcon platform={social.platform} className="h-[21px] w-[21px]" />
              </span>
              <span className="max-w-full truncate text-[11.5px] text-[var(--c-ink2)]">{SOCIAL_LABELS[social.platform]}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Stats ──────────────────────────────────────────────────────────────────────────

function CountUp({ value }: { value: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [shown, setShown] = React.useState(value);
  const animate = React.useRef(false);

  React.useEffect(() => {
    // Start from zero (while still off screen) when animation is welcome.
    if (!prefersReducedMotion() && value > 1 && !ref.current?.closest("[inert]")) {
      animate.current = true;
      setShown(0);
    }
  }, [value, ref]);

  React.useEffect(() => {
    if (!seen) return;
    if (!animate.current) return setShown(value);
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setShown(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value]);

  return <span ref={ref}>{shown.toLocaleString("en-IN")}</span>;
}

function Stats({ card, profile }: { card: CardModel; profile: TemplateProps["profile"] }) {
  const stats = (profile as PublicProfile).stats;
  if (card.isPreview || !stats) return null;
  const items = [
    { label: "Views", value: stats.views, Icon: Eye },
    { label: "Taps", value: stats.clicks, Icon: MousePointerClick },
    { label: "Days live", value: stats.days_live, Icon: CalendarDays },
  ];
  return (
    <section aria-label="Card stats" className="grid grid-cols-3 gap-2.5">
      {items.map(({ label, value, Icon }, i) => (
        <div key={label} data-reveal="pop" style={stagger(i)} className="mo-glass flex flex-col gap-1 rounded-[22px] p-4">
          <Icon className="h-4 w-4 text-[var(--c-accent)]" aria-hidden="true" />
          <span className="mt-1 text-[22px] font-semibold leading-none tracking-[-0.02em] text-[var(--c-ink)]">
            <CountUp value={value} />
          </span>
          <span className="text-[12px] text-[var(--c-ink2)]">{label}</span>
        </div>
      ))}
    </section>
  );
}

// ── Services (accordion) ───────────────────────────────────────────────────────────

function enquiryLink(card: CardModel, item: string): { href: string; whatsapp: boolean } | null {
  const message = enquiryMessage(card.content.catalog.enquiry_message, item);
  const number = enquiryNumber(card.content.contact);
  const wa = number ? whatsappHref(number, message) : null;
  if (wa) return { href: wa, whatsapp: true };
  const mail = mailHref(card.content.contact.email);
  return mail ? { href: `${mail}?subject=${encodeURIComponent(item)}&body=${encodeURIComponent(message)}`, whatsapp: false } : null;
}

function Services({ card }: { card: CardModel }) {
  const { services, services_label } = card.content.catalog;
  const [open, setOpen] = React.useState<string | null>(services[0]?.id ?? null);
  if (services.length === 0) return null;

  return (
    <section aria-labelledby="card-services" data-reveal className="scroll-mt-24">
      <SectionHead id="card-services" kicker="What we offer" title={services_label || "Services"} edit="catalog" />
      <ul className="flex flex-col gap-2.5">
        {services.map((service, i) => {
          const isOpen = open === service.id;
          const meta = [service.price, service.duration].filter(Boolean).join(" · ");
          const enquiry = enquiryLink(card, service.name);
          const hasDetails = Boolean(service.description || service.image_url || enquiry);
          const head = (
            <>
              {service.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
                <img src={resolveMediaUrl(service.image_url)} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-[14px] bg-[var(--c-soft)] object-cover" />
              ) : (
                <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--c-soft)] text-[13px] font-semibold text-[var(--c-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[15.5px] font-semibold leading-5 text-[var(--c-ink)]">{service.name}</span>
                {meta && <span className="mt-0.5 block text-[13px] text-[var(--c-ink2)]">{meta}</span>}
              </span>
            </>
          );
          return (
            <li key={service.id} data-reveal style={stagger(i)} className="mo-glass overflow-hidden rounded-[22px]">
              {hasDetails ? (
                <>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`mo-svc-${service.id}`}
                    onClick={() => setOpen(isOpen ? null : service.id)}
                    className="flex w-full items-center gap-3.5 p-3.5 text-left"
                  >
                    {head}
                    <span
                      aria-hidden="true"
                      className={`mo-plus flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isOpen ? "rotate-45 bg-[var(--c-accent)] text-[var(--c-on-accent)]" : "bg-[var(--c-soft)] text-[var(--c-accent)]"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <div id={`mo-svc-${service.id}`} className="mo-collapse" data-open={isOpen ? "" : undefined} inert={!isOpen}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="flex flex-col gap-3 px-4 pb-4">
                        {service.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
                          <img src={resolveMediaUrl(service.image_url)} alt={service.name} loading="lazy" className="aspect-[16/9] w-full rounded-[16px] bg-[var(--c-soft)] object-cover" />
                        )}
                        {service.description && <p className="text-[14px] leading-[22px] text-[var(--c-ink2)]">{service.description}</p>}
                        {enquiry && (
                          <a
                            {...externalLinkProps(enquiry.href)}
                            data-ripple
                            onClick={() => card.track(enquiry.whatsapp ? "whatsapp_click" : "email_click", { action: "enquire" })}
                            aria-label={`Enquire about ${service.name}`}
                            className="mo-press flex h-11 items-center justify-center gap-2 rounded-[var(--c-btn-r)] bg-[var(--c-accent)] text-[14px] font-semibold text-[var(--c-on-accent)]"
                          >
                            {enquiry.whatsapp ? <WhatsAppGlyph className="h-4 w-4" /> : <Mail className="h-4 w-4" aria-hidden="true" />}
                            Enquire
                            <ArrowUpRight className="mo-arrow h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3.5 p-3.5">{head}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ── Products (swipeable carousel) ──────────────────────────────────────────────────

function Products({ card, wide }: { card: CardModel; wide: boolean }) {
  const { products, products_label } = card.content.catalog;
  const trackRef = React.useRef<HTMLUListElement>(null);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = track.getBoundingClientRect();
      const mid = box.left + box.width / 2;
      let best = 0;
      let bestDistance = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const r = child.getBoundingClientRect();
        const distance = Math.abs(r.left + r.width / 2 - mid);
        (child as HTMLElement).style.setProperty("--d", Math.min(1, distance / Math.max(1, r.width)).toFixed(3));
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [products.length]);

  if (products.length === 0) return null;

  const go = (index: number) => {
    const track = trackRef.current;
    const child = track?.children[Math.max(0, Math.min(products.length - 1, index))] as HTMLElement | undefined;
    if (!track || !child) return;
    track.scrollTo({ left: child.offsetLeft - (track.clientWidth - child.clientWidth) / 2, behavior: smoothBehavior() });
  };

  const arrows =
    products.length > 1 ? (
      <div className="flex shrink-0 gap-2">
        {[
          { label: "Previous", Icon: ChevronLeft, to: active - 1, disabled: active === 0 },
          { label: "Next", Icon: ChevronRight, to: active + 1, disabled: active === products.length - 1 },
        ].map(({ label, Icon, to, disabled }) => (
          <button
            key={label}
            type="button"
            onClick={() => go(to)}
            disabled={disabled}
            aria-label={`${label} item`}
            className="mo-glass mo-press flex h-9 w-9 items-center justify-center rounded-full text-[var(--c-ink)] disabled:opacity-35"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>
    ) : undefined;

  return (
    <section aria-labelledby="card-products" data-reveal className="scroll-mt-24">
      <SectionHead id="card-products" kicker="Shop" title={products_label || "Products"} action={arrows} edit="catalog" />
      <ul
        ref={trackRef}
        className={`mo-scrollbar-none relative -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pt-1 [container-type:inline-size] before:block before:w-[calc(14cqw-0.75rem)] before:shrink-0 before:content-[''] after:block after:w-[calc(14cqw-0.75rem)] after:shrink-0 after:content-[''] ${
          wide ? "lg:mx-0 lg:before:hidden lg:after:hidden" : ""
        }`}
      >
        {products.map((product) => {
          const href = product.buy_url || enquiryLink(card, product.name)?.href;
          return (
            <li key={product.id} className={`mo-prod w-[72cqw] shrink-0 snap-center ${wide ? "lg:w-[calc((100cqw-1.5rem)/3)] lg:snap-start lg:![opacity:1] lg:![transform:none]" : ""}`}>
              <article className="mo-glass mo-zoom flex h-full flex-col overflow-hidden rounded-[24px]">
                <div className="relative aspect-square overflow-hidden bg-[var(--c-soft)]">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
                    <img src={resolveMediaUrl(product.image_url)} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[var(--c-accent)]">
                      <ShoppingBag className="h-9 w-9" aria-hidden="true" />
                    </span>
                  )}
                  {product.price && (
                    <span className="mo-blur absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[12.5px] font-semibold text-white">{product.price}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <h3 className="text-[15.5px] font-semibold leading-5 text-[var(--c-ink)]">{product.name}</h3>
                  {href && (
                    <a
                      {...externalLinkProps(href)}
                      data-ripple
                      onClick={() => card.track(product.buy_url ? "link_click" : "whatsapp_click", { action: "product" })}
                      aria-label={`${product.buy_url ? "Buy" : "Enquire about"} ${product.name}`}
                      className="mo-press mt-auto flex h-10 items-center justify-center gap-1.5 rounded-[var(--c-btn-r)] bg-[var(--c-soft)] text-[13.5px] font-semibold text-[var(--c-accent)]"
                    >
                      {product.buy_url ? "Buy now" : "Enquire"}
                      <ArrowUpRight className="mo-arrow h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      {products.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${product.name}`}
              aria-current={i === active ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-[var(--c-accent)]" : "w-1.5 bg-[var(--c-ink3)] opacity-50 hover:opacity-90"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Gallery (bento grid) ───────────────────────────────────────────────────────────

function galleryTileClass(i: number, n: number): string {
  if (n === 1) return "col-span-3 row-span-2";
  if (i === 0) return "col-span-2 row-span-2";
  if (n === 2) return "row-span-2";
  const rest = n - 3; // tiles after the big one and the two beside it
  if (i === n - 1 && rest > 0 && rest % 3 === 1) return "col-span-3";
  if (i === n - 1 && rest > 0 && rest % 3 === 2) return "col-span-2";
  return "";
}

function Gallery({ card, wide }: { card: CardModel; wide: boolean }) {
  const { images, title } = card.content.gallery;
  if (images.length === 0) return null;
  const shown = images.slice(0, 6);
  const extra = images.length - shown.length;
  const openAt = (index: number) => {
    card.track("gallery_open", { image_index: index });
    card.setSheet({ kind: "gallery", index });
  };

  return (
    <section aria-labelledby="card-gallery" data-reveal className="scroll-mt-24">
      <SectionHead
        id="card-gallery"
        kicker="Gallery"
        title={title || "Photos"}
        edit="gallery"
        action={
          images.length > 1 ? (
            <button type="button" onClick={() => openAt(0)} className="mo-glass mo-press shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-semibold text-[var(--c-ink)]">
              See all {images.length}
            </button>
          ) : undefined
        }
      />
      <div className={`grid auto-rows-[96px] grid-cols-3 gap-2 ${wide ? "lg:auto-rows-[170px] lg:gap-3" : ""}`}>
        {shown.map((src, i) => {
          const more = i === shown.length - 1 && extra > 0;
          return (
            <button
              key={src}
              type="button"
              data-reveal="clip"
              style={stagger(i)}
              onClick={() => openAt(i)}
              aria-label={more ? `Open photo ${i + 1} (${extra} more)` : `Open photo ${i + 1}`}
              className={`mo-zoom relative overflow-hidden rounded-[18px] bg-[var(--c-soft)] ${galleryTileClass(i, shown.length)}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media */}
              <img src={resolveMediaUrl(src)} alt="" loading="lazy" className="h-full w-full object-cover" />
              {more && <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[20px] font-semibold text-white">+{extra}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ── Body sections in the owner's order ─────────────────────────────────────────────

function Sections({ card, wide }: { card: CardModel; wide: boolean }) {
  const supported = new Set(card.manifest.sections);
  const qrOnCard = flipShowsQr(card);
  const entries = card.content.layout.filter((e) => e.visible && supported.has(e.key) && !(e.key === "qr" && qrOnCard));
  return (
    <>
      {entries.map((entry) => {
        switch (entry.key) {
          case "services":
            return <Services key={entry.key} card={card} />;
          case "products":
            return <Products key={entry.key} card={card} wide={wide} />;
          case "gallery":
            return <Gallery key={entry.key} card={card} wide={wide} />;
          default:
            return (
              <div key={entry.key} data-reveal className="empty:hidden">
                <BodySection card={card} sectionKey={entry.key} qrColor="#111118" />
              </div>
            );
        }
      })}
    </>
  );
}

// ── Floating quick-contact button ──────────────────────────────────────────────────

function QuickMenu({ card }: { card: CardModel }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items: ContactAction[] = contactActions(card).filter((a) => a.key !== "website" && a.key !== "directions");
  if (card.content.actions.save_contact) items.push({ key: "save", label: "Save contact", Icon: UserPlus, onClick: card.saveContact });
  if (card.content.actions.share) items.push({ key: "share", label: "Share card", Icon: Share2, onClick: () => void card.shareCard() });

  if (card.style.quick_menu === false || items.length < 2) return null;

  return (
    <div className="pointer-events-none sticky bottom-0 z-40 h-0">
      <div ref={ref} className="mo-dock absolute bottom-4 right-4 flex flex-col items-end gap-2.5">
        <ul id="mo-dial" inert={!open} className="flex flex-col items-end gap-2.5">
          {items.map((item, i) => {
            const inner = (
              <>
                <span className="mo-glass mo-blur rounded-full px-3.5 py-1.5 text-[13px] font-medium text-[var(--c-ink)]">{item.label}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--mo-line)] bg-[var(--c-surface)] text-[var(--c-accent)] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)]">
                  <item.Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </>
            );
            const onClick = () => {
              card.track(item.event ?? "cta_click", { action: `quick_${item.key}` });
              item.onClick?.();
              setOpen(false);
            };
            return (
              <li key={item.key} data-closed={open ? undefined : ""} style={stagger(items.length - 1 - i)} className="mo-dial-item pointer-events-auto">
                {item.href ? (
                  <a {...externalLinkProps(item.href)} onClick={onClick} className="mo-press flex items-center gap-2.5">
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={onClick} className="mo-press flex items-center gap-2.5">
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <div className="pointer-events-auto relative h-14 w-14">
          <span aria-hidden="true" className="mo-fab-ring absolute inset-0 rounded-full bg-[var(--c-accent)] opacity-0" />
          <button
            type="button"
            data-ripple
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mo-dial"
            aria-label={open ? "Close quick contact" : "Quick contact"}
            className="mo-press relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--c-accent),var(--mo-a2))] text-[var(--c-on-accent)] shadow-[0_18px_36px_-12px_var(--mo-glow)]"
          >
            <Plus className={`mo-plus h-6 w-6 ${open ? "rotate-[135deg]" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Template ───────────────────────────────────────────────────────────────────────

export function MotionTemplate(props: TemplateProps) {
  const card = useCard(props, "motion");
  const colors = useMotionColors(card);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const heroRef = React.useRef<HTMLElement>(null);
  const fx = useMotionAllowed(rootRef);
  const lively = card.style.motion !== "subtle";
  useReveal(rootRef, fx);
  const compact = useScrollFx(rootRef, heroRef);
  // Dashboard previews sit in a phone frame, so only the live card gets the desktop layout.
  const wide = !card.isPreview;
  const quickMenu = card.style.quick_menu !== false;

  return (
    <div
      ref={rootRef}
      style={{ ...card.cssVars, ...colors }}
      onPointerDown={fx ? (e) => rippleFrom(e, rootRef.current) : undefined}
      className={`mo-root relative w-full overflow-x-clip bg-[var(--c-bg)] text-[var(--c-ink)] antialiased [font-family:var(--c-font)] ${lively ? "mo-lively" : ""} ${
        card.isPreview ? "" : "min-h-screen"
      }`}
    >
      <style>{MOTION_CSS}</style>
      <CardFonts fonts={[props.theme.font_family]} />
      <TopBar card={card} compact={compact} wide={wide} />

      <div className={`mx-auto w-full max-w-[480px] ${wide ? "lg:max-w-[1160px] lg:px-8 lg:pt-8" : ""}`}>
        <Hero card={card} heroRef={heroRef} wide={wide} />

        <div className={`relative z-10 flex flex-col gap-6 px-5 ${wide ? "lg:mt-10 lg:grid lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-0" : ""}`}>
          <div className="flex flex-col gap-4">
            <QuickActions card={card} />
            <MainButtons card={card} fx={fx} />
            <FlipCard card={card} fx={fx} lively={lively} />
            <About card={card} />
            <Socials card={card} />
          </div>
          <div className="flex min-w-0 flex-col gap-8">
            <Stats card={card} profile={props.profile} />
            <Sections card={card} wide={wide} />
            {card.extraBlocks.length > 0 && (
              <div data-reveal className="mo-glass rounded-[26px] p-5">
                <ExtraBlocks card={card} username={props.profile.username} />
              </div>
            )}
          </div>
        </div>

        <div className={`mt-10 ${quickMenu ? "pb-20" : "pb-2"}`}>{props.footer}</div>
      </div>

      <QuickMenu card={card} />
      <CardSheets card={card} />
    </div>
  );
}

export default MotionTemplate;
