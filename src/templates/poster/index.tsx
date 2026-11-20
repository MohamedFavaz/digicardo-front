"use client";

/**
 * Poster card template (id "poster") — a bold, full-screen shop poster for any kind of shop.
 *
 * - Two-colour background with a wave (background colour on top, accent colour below).
 * - A big picture in the middle: the owner's product photo (first cover photo; a cut-out PNG looks
 *   best) or one of 14 ready-made pictures (public/poster-art: shoes, burger, pizza, coffee, …).
 * - The shop name in giant letters behind it, and a small script title from the business
 *   category (e.g. "Ice cream", "Bakery").
 * - Glossy app-icon buttons on a dashed arc: phone, WhatsApp, socials, links (delivery apps get
 *   their name in brand colours), email and website. Directions sit top-right.
 * Below the poster come the usual sections (services, payments, gallery, links, review, QR).
 *
 * Like every template it only lays out the typed card content (ADR-030) and hides empty parts.
 */

import * as React from "react";
import { Globe, Heart, Mail, MapPin, Phone, Pointer, Share2, UserPlus, type LucideIcon } from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import type { SocialPlatform } from "@/lib/zod/content";
import type { AnalyticsEventType } from "@/types/analytics";
import type { TemplateProps } from "../types";
import { useCard, externalLinkProps, type CardModel } from "../shared/useCard";
import { BodySections, ExtraBlocks, linkIcon } from "../shared/sections";
import { CardSheets } from "../shared/CardSheets";
import { CardFonts } from "../shared/CardChrome";
import { SocialIcon, SOCIAL_LABELS, WhatsAppGlyph } from "../shared/SocialIcon";
import { directionsHref, initials, mailHref, telHref, whatsappHref } from "../shared/actions";
import { entranceClass, mix, onColor, primaryButtonClass } from "../shared/palette";

// ── Tiles ──────────────────────────────────────────────────────────────────────────

interface Tile {
  key: string;
  label: string;
  href: string;
  event: AnalyticsEventType;
  meta?: Record<string, string>;
  /** Icon in a colour, or a short word mark (delivery apps). */
  render: (size: string) => React.ReactNode;
}

const SOCIAL_COLORS: Partial<Record<SocialPlatform, string>> = {
  instagram: "#D62976",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  x: "#111111",
  youtube: "#FF0000",
  whatsapp: "#25D366",
  whatsapp_channel: "#25D366",
  telegram: "#229ED9",
  tiktok: "#111111",
  threads: "#111111",
  pinterest: "#E60023",
  snapchat: "#C7A600",
  google_business: "#4285F4",
  spotify: "#1DB954",
};

/** Food / grocery delivery apps people often link to: shown as their name in their colour. */
const DELIVERY: { match: RegExp; name: string; color: string }[] = [
  { match: /swiggy\./i, name: "Swiggy", color: "#FC8019" },
  { match: /zomato\./i, name: "zomato", color: "#E23744" },
  { match: /ubereats\.|uber\.com\/.*eats/i, name: "Uber Eats", color: "#06C167" },
  { match: /zepto/i, name: "Zepto", color: "#5B1E8F" },
  { match: /blinkit\./i, name: "blinkit", color: "#0C831F" },
  { match: /dunzo\./i, name: "Dunzo", color: "#00D290" },
  { match: /bigbasket\./i, name: "bigbasket", color: "#84C225" },
  { match: /amazon\./i, name: "amazon", color: "#FF9900" },
  { match: /flipkart\./i, name: "Flipkart", color: "#2874F0" },
];

function iconNode(Icon: LucideIcon | React.ComponentType<{ className?: string; style?: React.CSSProperties }>, color: string) {
  return function IconTile(size: string) {
    return <Icon className="shrink-0" style={{ width: size, height: "auto", aspectRatio: "1", color }} aria-hidden={true} />;
  };
}

function buildTiles(card: CardModel): Tile[] {
  const { contact, socials, links } = card.content;
  const accent = card.palette.accent;
  const tiles: Tile[] = [];
  const wa = whatsappHref(contact.whatsapp);
  if (wa) {
    tiles.push({
      key: "whatsapp",
      label: "WhatsApp",
      href: wa,
      event: "whatsapp_click",
      render: (size) => (
        <span className="flex shrink-0 items-center justify-center text-[#25D366] [&>svg]:h-full [&>svg]:w-full" style={{ width: size, aspectRatio: "1" }}>
          <WhatsAppGlyph />
        </span>
      ),
    });
  }
  const call = telHref(contact.phone);
  if (call) tiles.push({ key: "phone", label: "Call", href: call, event: "phone_click", render: iconNode(Phone, accent) });
  for (const s of socials) {
    const color = SOCIAL_COLORS[s.platform] ?? accent;
    tiles.push({
      key: s.id,
      label: SOCIAL_LABELS[s.platform],
      href: s.url,
      event: "social_click",
      meta: { provider: s.platform },
      render: (size) => (
        <span style={{ color, width: size, aspectRatio: "1" }} className="flex items-center justify-center">
          <SocialIcon platform={s.platform} className="h-full w-full" />
        </span>
      ),
    });
  }
  if (card.content.layout.find((e) => e.key === "links")?.visible !== false) {
    for (const l of links) {
      const brand = DELIVERY.find((d) => d.match.test(l.url));
      tiles.push({
        key: l.id,
        label: l.title,
        href: l.url,
        event: "link_click",
        render: brand
          ? () => (
              <span
                className="flex aspect-square w-[80%] items-center justify-center rounded-full px-1 text-center font-extrabold leading-none tracking-tight text-white"
                style={{ background: brand.color, fontSize: `${Math.min(3.4, 17 / brand.name.length)}cqw` }}
              >
                {brand.name}
              </span>
            )
          : iconNode(linkIcon(l.icon), accent),
      });
    }
  }
  const mail = mailHref(contact.email);
  if (mail) tiles.push({ key: "email", label: "Email", href: mail, event: "email_click", render: iconNode(Mail, accent) });
  if (contact.website) tiles.push({ key: "website", label: "Website", href: contact.website, event: "link_click", render: iconNode(Globe, accent) });
  return tiles;
}

/** A glossy app-icon button: gradient frame, white face, coloured icon. */
function GlossyTile({ tile, card, className, style }: { tile: Tile; card: CardModel; className?: string; style?: React.CSSProperties }) {
  return (
    <a
      {...externalLinkProps(tile.href)}
      onClick={() => card.track(tile.event, tile.meta ?? { action: tile.key })}
      aria-label={tile.label}
      title={tile.label}
      className={cn(
        "group relative block aspect-square rounded-[26%] shadow-[0_10px_22px_-8px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 active:scale-95",
        className
      )}
      style={{ background: "linear-gradient(150deg, var(--p-frame-from), var(--p-frame-to))", ...style }}
    >
      <span className="absolute inset-[10%] flex items-center justify-center rounded-[22%] bg-[linear-gradient(160deg,#FFFFFF_0%,#EEEEF2_100%)] shadow-[inset_0_-3px_6px_rgba(0,0,0,0.08),inset_0_2px_0_rgba(255,255,255,0.9)]">
        {tile.render("50%")}
      </span>
    </a>
  );
}

// ── Poster ─────────────────────────────────────────────────────────────────────────

/** Positions along the lower part of an ellipse, left-top → bottom → right-top (percent). */
function arcPositions(n: number): { x: number; y: number }[] {
  if (n === 0) return [];
  if (n === 1) return [{ x: 50, y: 86 }];
  const start = 168;
  const end = 12;
  return Array.from({ length: n }, (_, i) => {
    const a = ((start - ((start - end) * i) / (n - 1)) * Math.PI) / 180;
    return { x: 50 + 40 * Math.cos(a), y: 67 + 20 * Math.sin(a) };
  });
}

const ARC_MAX = 7;

/**
 * "Curtain" reveal: the poster sits in a sticky, screen-tall frame; while the visitor scrolls
 * through a short distance, the top layer (picture, name) slides up and the bottom layer (wave,
 * icons) slides down, uncovering the shop details behind them. Works in the page and inside the
 * editor's scrolling phone preview. Off for reduced motion or when the owner switches it off.
 */
function useCurtain(enabled: boolean, isPreview: boolean) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLElement>(null);
  const [viewH, setViewH] = React.useState<number | null>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    // Off in thumbnails (template pickers, landing page phones are `inert`) and for reduced motion.
    if (!enabled || !wrap || !stage || wrap.closest("[inert]") || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setActive(false);
      return;
    }
    // Nearest ancestor that really scrolls (the editor's phone frame), else the window. An element
    // with only overflow-x hidden reports overflow-y "auto" too, so it must also have content to scroll.
    let scroller: HTMLElement | null = wrap.parentElement;
    while (
      scroller &&
      scroller !== document.body &&
      !(/(auto|scroll)/.test(getComputedStyle(scroller).overflowY) && scroller.scrollHeight > scroller.clientHeight + 1)
    ) {
      scroller = scroller.parentElement;
    }
    if (scroller === document.body || scroller === document.documentElement) scroller = null;
    const measure = () => (scroller ? scroller.clientHeight : window.innerHeight);
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = Math.max(520, measure());
      const top = wrap.getBoundingClientRect().top - (scroller ? scroller.getBoundingClientRect().top : 0);
      const distance = Math.max(1, wrap.offsetHeight - h);
      const p = Math.min(1, Math.max(0, -top / distance));
      const eased = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      stage.style.setProperty("--curtain", eased.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      setViewH(measure());
      onScroll();
    };
    setViewH(measure());
    setActive(true);
    const target: HTMLElement | Window = scroller ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    requestAnimationFrame(update);
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, isPreview]);

  return { wrapRef, stageRef, viewH, active };
}

function MainButtons({ card, buttonStyle, className }: { card: CardModel; buttonStyle: TemplateProps["theme"]["button_style"]; className?: string }) {
  const { actions } = card.content;
  if (!actions.save_contact && !actions.share) return null;
  return (
    <div data-edit="actions" className={cn("flex gap-2.5", className)}>
      {actions.save_contact && (
        <button
          type="button"
          onClick={card.saveContact}
          className={`flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[var(--c-btn-r)] text-[15px] font-semibold shadow-[0_10px_20px_-10px_var(--c-accent)] ${primaryButtonClass(buttonStyle)}`}
        >
          <UserPlus className="h-5 w-5" aria-hidden="true" />
          Save contact
        </button>
      )}
      {actions.share && (
        <button
          type="button"
          onClick={card.shareCard}
          className={`flex h-[52px] items-center justify-center gap-1.5 rounded-[var(--c-btn-r)] border border-[var(--c-border-strong)] bg-[var(--c-surface)] text-[15px] font-semibold text-[var(--c-ink)] ${actions.save_contact ? "w-[112px] shrink-0" : "flex-1"}`}
        >
          <Share2 className="h-[18px] w-[18px]" aria-hidden="true" />
          Share
        </button>
      )}
    </div>
  );
}

/** The shop details uncovered when the poster opens. */
function DetailsPanel({ card, theme }: { card: CardModel; theme: TemplateProps["theme"] }) {
  const { identity, contact } = card.content;
  const logo = identity.logo_url || identity.avatar_url;
  const subtitle = identity.category_label || identity.role;
  const chip = "rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-1 text-[13px] font-medium text-[var(--c-ink2)]";
  return (
    <div
      data-edit="identity"
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden px-7 text-center"
      style={{ background: "radial-gradient(120% 70% at 50% 0%, var(--p-soft), var(--c-surface) 70%)" }}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded logo
        <img src={resolveMediaUrl(logo)} alt="" className="h-24 w-24 rounded-full border-4 border-[var(--c-surface)] object-cover shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)]" />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-24 w-24 items-center justify-center rounded-full text-[34px] font-extrabold shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)]"
          style={{ background: "linear-gradient(150deg, var(--p-frame-from), var(--p-frame-to))", color: "var(--c-accent)" }}
        >
          {initials(identity.name)}
        </span>
      )}
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[var(--c-ink)]">{identity.name}</h1>
        {subtitle && (
          <p className="mt-1 text-[17px] font-bold italic text-[var(--c-accent)]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {subtitle}
          </p>
        )}
      </div>
      {identity.bio && <p className="line-clamp-4 max-w-[34ch] whitespace-pre-line text-[15px] leading-[22px] text-[var(--c-ink2)]">{identity.bio}</p>}
      {(identity.hours || contact.address || identity.badges.length > 0) && (
        <div className="flex flex-wrap justify-center gap-2">
          {identity.hours && <span className={chip}>{identity.hours}</span>}
          {contact.address && (
            <span className={`${chip} inline-flex items-center gap-1`}>
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {contact.address}
            </span>
          )}
          {identity.badges.map((b) => (
            <span key={b} className={chip}>
              {b}
            </span>
          ))}
        </div>
      )}
      <MainButtons card={card} buttonStyle={theme.button_style} className="w-full max-w-[340px]" />
      <p className="absolute inset-x-0 bottom-5 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--c-ink3)]">Scroll for more ↓</p>
    </div>
  );
}

/** Upper fill shaped by the same wave as the lower colour, so the two halves meet exactly. */
const WAVE_LOWER = "M0 34 C 70 0, 130 66, 210 30 C 290 -6, 340 -4, 400 30 V300 H0 Z";
const WAVE_UPPER = "M0 0 H400 V30 C 340 -4, 290 -6, 210 30 C 130 66, 70 0, 0 34 Z";

function Poster({ card, theme, curtainOn }: { card: CardModel; theme: TemplateProps["theme"]; curtainOn: boolean }) {
  const { identity, contact } = card.content;
  const style = card.style;
  const tiles = buildTiles(card);
  const onArc = tiles.slice(0, ARC_MAX);
  const positions = arcPositions(onArc.length);
  // "Poster picture": the owner's own photo (first cover photo) or one of the ready-made pictures.
  const art = String(style.art || "photo");
  const hero = art !== "photo" && /^[a-z-]+$/.test(art) ? `/poster-art/${art}.svg` : identity.cover_images[0] || identity.logo_url || identity.avatar_url;
  const title = identity.category_label || identity.role;
  const words = identity.name.trim().split(/\s+/).filter(Boolean).slice(0, 4);
  const longest = Math.max(4, ...words.map((w) => w.length));
  // Longest word must fit across the poster (≈0.62 em per letter in the display weight).
  const nameSize = Math.min(28, 128 / longest);
  const directions = directionsHref(contact);
  const wave = style.wave !== false;
  const onAccent = card.palette.onAccent;

  const { wrapRef, stageRef, viewH, active } = useCurtain(curtainOn, card.isPreview);
  const stagePx = active && viewH ? Math.max(520, viewH) : null;
  const stageH = stagePx ? `${stagePx}px` : card.isPreview ? "760px" : "max(680px, min(100svh, 900px))";
  const up: React.CSSProperties | undefined = active ? { transform: "translate3d(0, calc(var(--curtain, 0) * -100%), 0)" } : undefined;
  const down: React.CSSProperties | undefined = active ? { transform: "translate3d(0, calc(var(--curtain, 0) * 100%), 0)" } : undefined;

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: stagePx ? `${Math.round(stagePx * 1.85)}px` : undefined }}>
      <section
        ref={stageRef}
        aria-label={identity.name}
        data-edit="identity"
        className={cn("relative w-full overflow-hidden", active && "sticky top-0")}
        style={{ containerType: "inline-size", height: stageH }}
      >
        {/* Behind the curtain: shop details */}
        {active && <DetailsPanel card={card} theme={theme} />}

        {/* Bottom layer — colour + wave (slides down) */}
        <div aria-hidden="true" className="absolute inset-0 z-10 will-change-transform" style={down}>
          {wave && (
            <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[44%] w-full">
              <path d={WAVE_LOWER} fill="var(--c-accent)" />
            </svg>
          )}
          {onArc.length > 1 && (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <ellipse cx="50" cy="67" rx="40" ry="20" fill="none" stroke={wave ? "#FFFFFF" : "var(--c-accent)"} strokeOpacity="0.75" strokeWidth="0.45" strokeDasharray="1.6 1.6" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
        </div>

        {/* Top layer — background, title, giant name, bubbles, picture (slides up) */}
        <div className="absolute inset-0 z-20 will-change-transform" style={up}>
          {wave ? (
            <>
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[56.5%] bg-[var(--c-bg)]" />
              <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[44%] w-full">
                <path d={WAVE_UPPER} fill="var(--c-bg)" />
              </svg>
            </>
          ) : (
            <div aria-hidden="true" className="absolute inset-0 bg-[var(--c-bg)]" />
          )}

          {title && (
            <p
              className="absolute inset-x-0 top-[5.5%] z-20 px-[16%] text-center font-bold italic leading-[0.95] text-[var(--c-accent)] [text-shadow:0_2px_0_rgba(255,255,255,0.6)]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: `${Math.min(12, 70 / Math.max(6, title.length))}cqw` }}
            >
              {title}
            </p>
          )}

          {style.big_name !== false && words.length > 0 && (
            <div aria-hidden="true" className="absolute inset-x-[6%] top-[22%] z-0 flex flex-col font-medium leading-[0.86] tracking-[-0.04em] text-[var(--c-accent)]" style={{ fontSize: `${nameSize}cqw` }}>
              {words.map((w, i) => (
                <span key={`${w}-${i}`} className={i % 2 === 0 ? "self-start" : "self-end"}>
                  {w}
                </span>
              ))}
            </div>
          )}

          {style.bubbles !== false && (
            <>
              <span aria-hidden="true" className="absolute right-[13%] top-[14%] z-10 flex h-[19cqw] w-[19cqw] items-center justify-center rounded-full shadow-[inset_-6px_-8px_14px_rgba(0,0,0,0.18),inset_6px_6px_12px_rgba(255,255,255,0.6),0_10px_20px_-8px_rgba(0,0,0,0.35)] motion-safe:animate-float" style={{ background: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, var(--p-frame-from) 38%, var(--p-frame-to) 100%)" }}>
                <Heart className="h-[45%] w-[45%] fill-white text-white drop-shadow" />
              </span>
              <span aria-hidden="true" className="absolute right-[6%] top-[27%] z-10 flex h-[11cqw] w-[11cqw] items-center justify-center rounded-full shadow-[inset_-4px_-5px_10px_rgba(0,0,0,0.18),inset_4px_4px_8px_rgba(255,255,255,0.6)] motion-safe:animate-float [animation-delay:1.2s]" style={{ background: "radial-gradient(circle at 30% 28%, #FFFFFF 0%, var(--p-frame-from) 38%, var(--p-frame-to) 100%)" }}>
                <Heart className="h-[45%] w-[45%] fill-white text-white" />
              </span>
            </>
          )}

          <div className="absolute inset-x-0 top-[13%] z-10 flex h-[62%] justify-center">
            {hero ? (
              // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded product photo
              <img src={resolveMediaUrl(hero)} alt="" className="h-full w-[74%] object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)] motion-safe:animate-card-scale" />
            ) : (
              <span className="mt-[22%] flex h-[44cqw] w-[44cqw] items-center justify-center rounded-full bg-[var(--c-surface)] text-[16cqw] font-extrabold text-[var(--c-accent)] shadow-[0_24px_40px_-16px_rgba(0,0,0,0.4)]">
                {initials(identity.name)}
              </span>
            )}
          </div>

          {directions && (
            <div className="absolute right-[5%] top-[3%] z-30 w-[17cqw] max-w-[78px]">
              <GlossyTile card={card} tile={{ key: "directions", label: "Directions", href: directions, event: "link_click", render: iconNode(MapPin, card.palette.accent) }} />
            </div>
          )}
        </div>

        {/* Icons + hint (slide down with the bottom layer, above the picture) */}
        <div className="pointer-events-none absolute inset-0 z-30 will-change-transform" style={down}>
          <nav aria-label="Contact and links" data-edit="contact" className="absolute inset-0">
            {onArc.map((tile, i) => (
              <GlossyTile
                key={tile.key}
                tile={tile}
                card={card}
                className="pointer-events-auto absolute w-[17cqw] max-w-[80px] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
              />
            ))}
          </nav>
          {onArc.length > 0 && (
            <p className="absolute inset-x-0 bottom-[2.6%] flex items-center justify-center gap-2 text-[13px] font-medium uppercase tracking-[0.04em]" style={{ color: wave ? onAccent : "var(--c-ink)" }}>
              <Pointer className="h-4 w-4" aria-hidden="true" />
              {active ? "Scroll to open · tap the icons" : "Tap the icons for more"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

// ── Template ───────────────────────────────────────────────────────────────────────

export function PosterTemplate(props: TemplateProps) {
  const card = useCard(props, "poster");
  const { theme, profile, footer } = props;
  const { identity } = card.content;
  const extraTiles = buildTiles(card).slice(ARC_MAX);
  // "Open like a curtain" (style control). The poster turns it off itself for reduced motion.
  const curtainOn = card.style.curtain !== false;
  const frameFrom = String(card.style.frame_from || "#FFE45C");
  const frameTo = String(card.style.frame_to || "#FF8A1F");
  const vars = {
    ...card.cssVars,
    "--p-frame-from": frameFrom,
    "--p-frame-to": frameTo,
    "--p-soft": mix(card.palette.accent, card.palette.bg, 0.08),
  } as React.CSSProperties;

  return (
    <div style={vars} className={`w-full bg-[var(--c-bg)] ${card.isPreview ? "" : "min-h-screen md:bg-[var(--p-soft)] md:py-8"}`}>
      <CardFonts fonts={[theme.font_family, "playfair-display"]} />
      <article
        className={`relative mx-auto flex w-full max-w-[480px] flex-col bg-[var(--c-bg)] text-[var(--c-ink)] [font-family:var(--c-font)] ${entranceClass(theme.animation)} ${
          card.isPreview ? "" : "min-h-screen md:min-h-0 md:overflow-clip md:rounded-[32px] md:shadow-[0_24px_60px_rgba(16,24,40,0.18)]"
        }`}
      >
        <Poster card={card} theme={theme} curtainOn={curtainOn} />

        <div className="flex flex-col gap-6 bg-[var(--c-bg)] px-5 pb-4 pt-7">
          {!curtainOn && (identity.bio || identity.hours || identity.badges.length > 0) && (
            <section data-edit="identity" className="text-center">
              <h1 className="text-[24px] font-bold leading-tight tracking-[-0.01em] text-[var(--c-ink)]">{identity.name}</h1>
              {identity.bio && <p className="mt-2 whitespace-pre-line text-[15px] leading-[22px] text-[var(--c-ink2)]">{identity.bio}</p>}
              {(identity.hours || identity.badges.length > 0) && (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {[identity.hours, ...identity.badges].filter(Boolean).map((chip) => (
                    <span key={chip} className="rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] px-3 py-1 text-[13px] font-medium text-[var(--c-ink2)]">
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {!curtainOn && <MainButtons card={card} buttonStyle={theme.button_style} />}

          {extraTiles.length > 0 && (
            <nav aria-label="More links" className="grid grid-cols-4 gap-3" style={{ containerType: "inline-size" }}>
              {extraTiles.map((tile) => (
                <GlossyTile key={tile.key} tile={tile} card={card} />
              ))}
            </nav>
          )}

          <BodySections card={card} className="" qrColor={mix(card.palette.accent, "#000000", 0.75)} />
          {card.extraBlocks.length > 0 && <ExtraBlocks card={card} username={profile.username} />}
        </div>
        <div className="mt-auto" style={{ color: onColor(card.palette.bg) }}>
          {footer}
        </div>
        <CardSheets card={card} />
      </article>
    </div>
  );
}

export default PosterTemplate;
