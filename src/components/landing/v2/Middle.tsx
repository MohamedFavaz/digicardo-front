"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import {
  BarChart3,
  CalendarCheck,
  Contact,
  Images,
  IndianRupee,
  Link2,
  MapPin,
  MessageCircle,
  Nfc,
  Phone,
  Plus,
  QrCode,
  Star,
} from "lucide-react";
import { DigicardoLogo, TapGlyph } from "@/components/ui/DigicardoLogo";
import { cn } from "@/lib/utils";
import { EASE, Eyebrow, Marquee, ScrollWords, V, WordReveal, heading, useMedia, useSectionProgress } from "./primitives";
import { TEMPLATES } from "./Top";

// ── Scroll statement: words light up, then a stack of cards deals out into a row ─

const STATEMENT =
  "Whether you run a café, a clinic or a sales team, Digicardo puts your contact, services and payments in one card your customers keep.";
const STATEMENT_ACCENT = { café: V.violet, clinic: V.violet, team: V.violet, keep: V.violet } as Record<string, string>;
// Small icons that sit after a word (keys are the word without punctuation).
const STATEMENT_ICON_KEYS: Record<string, React.ReactNode> = {
  café: <Dot icon={<MessageCircle className="h-[0.42em] w-[0.42em]" />} bg={V.lime} />,
  payments: <Dot icon={<IndianRupee className="h-[0.42em] w-[0.42em]" />} bg={V.pink} />,
};

function Dot({ icon, bg }: { icon: React.ReactNode; bg: string }) {
  return (
    <span className="inline-flex h-[0.8em] w-[0.8em] items-center justify-center rounded-full text-[#121018]" style={{ background: bg }} aria-hidden="true">
      {icon}
    </span>
  );
}

function InfoCard() {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[22px] bg-white p-4 shadow-[0_30px_60px_-28px_rgba(18,16,24,0.45),0_0_0_1px_rgba(18,16,24,0.06)]">
      <div>
        <TapGlyph className="h-6 w-6" />
        <p className="mt-4 text-[17px] font-semibold leading-tight tracking-[-0.02em] text-[#121018]">
          One card.
          <br />
          Every way to share.
        </p>
        <p className="mt-2 text-[12px] leading-5 text-[#6B6779]">Link, QR code, NFC tap or WhatsApp — it&apos;s the same live card.</p>
      </div>
      <div className="flex gap-1.5">
        {[QrCode, Nfc, Link2].map((I, k) => (
          <span key={k} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1F0EC] text-[#121018]">
            <I className="h-4 w-4" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

function TemplateShot({ i, sizes = "180px" }: { i: number; sizes?: string }) {
  const t = TEMPLATES[i];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-white shadow-[0_30px_60px_-28px_rgba(18,16,24,0.45),0_0_0_1px_rgba(18,16,24,0.06)]">
      <Image src={t.src} alt={`${t.name} template — ${t.who}`} fill sizes={sizes} className="object-cover object-top" />
    </div>
  );
}

const FAN_ROT = [-10, -5, 0, 5, 10, 14];

/**
 * A sentence that lights up word by word as it scrolls past, then the deck below it deals out:
 * the cards start as a tilted stack and spread into a clean row when the row comes into view.
 */
export function StatementSection() {
  const reduce = useReducedMotion();
  const wide = useMedia("(min-width: 1024px)", true);
  const cards = [<InfoCard key="info" />, ...TEMPLATES.map((t, i) => <TemplateShot key={t.name} i={i} />)];
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-[1040px]">
        <ScrollWords
          text={STATEMENT}
          accent={STATEMENT_ACCENT}
          inline={STATEMENT_ICON_KEYS}
          className={cn("text-center text-[30px] text-[#121018] sm:text-[44px] xl:text-[52px]", heading, "leading-[1.16]")}
        />
      </div>

      <motion.ul
        className="mx-auto mt-14 grid max-w-[1180px] grid-cols-3 gap-3 sm:mt-20 sm:gap-4 lg:grid-cols-6"
        initial={reduce ? false : "stack"}
        whileInView="row"
        viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      >
        {cards.map((card, i) => {
          // In the stack every card sits on top of the middle column, slightly fanned.
          const centre = wide ? 2.5 : 1;
          const col = wide ? i : i - 1;
          const shift = (centre - col) * 100;
          return (
            <motion.li
              key={i}
              className={cn("aspect-[780/1688]", (i === 0 || i > 3) && "hidden lg:block")}
              style={{ zIndex: 10 - Math.abs(Math.round(centre - col)) }}
              variants={{
                stack: { x: `${shift}%`, y: wide ? 40 : 20, rotate: FAN_ROT[i] / 1.4, scale: 0.86, opacity: 1 },
                row: { x: "0%", y: 0, rotate: 0, scale: 1, opacity: 1, transition: { type: "spring", stiffness: 70, damping: 15, delay: 0.1 + i * 0.07 } },
              }}
              whileHover={reduce ? undefined : { y: -14, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            >
              {card}
            </motion.li>
          );
        })}
      </motion.ul>
      <p className="mt-8 text-center text-[14px] text-[#8D8998]">Real cards, made with Digicardo templates.</p>
    </section>
  );
}

// ── Features: icon cloud + Business / Personal tabs ───────────────────────────────

const FEATURES = [
  { icon: Contact, label: "Save contact" },
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Phone, label: "One-tap call" },
  { icon: IndianRupee, label: "UPI payments" },
  { icon: MapPin, label: "Directions" },
  { icon: Images, label: "Gallery" },
  { icon: CalendarCheck, label: "Enquiries" },
  { icon: Star, label: "Google reviews" },
];

const TABS = {
  Business: [
    { src: "/landing/scene-restaurant.webp", label: "Restaurant" },
    { src: "/landing/scene-cafe-pos.webp", label: "Café" },
    { src: "/landing/scene-shop-counter.webp", label: "Store" },
    { src: "/landing/scene-tap-pay.webp", label: "Payments" },
    { src: "/landing/scene-team.webp", label: "Agency" },
    { src: "/landing/scene-phone-laptop.webp", label: "Startup" },
  ],
  Personal: [
    { src: "/landing/face-13.webp", label: "Doctor" },
    { src: "/landing/face-04.webp", label: "Lawyer" },
    { src: "/landing/face-03.webp", label: "Designer" },
    { src: "/landing/face-06.webp", label: "Fitness coach" },
    { src: "/landing/face-11.webp", label: "Architect" },
    { src: "/landing/face-14.webp", label: "Photographer" },
  ],
} as const;

type TabKey = keyof typeof TABS;

export function FeaturesSection() {
  const [tab, setTab] = React.useState<TabKey>("Business");
  const reduce = useReducedMotion();
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow accent="tap">Everything in one</Eyebrow>
          <WordReveal text={"Everything your\ncustomers need."} className={cn("mt-5 text-[40px] text-[#121018] sm:text-[56px]", heading)} />
          <p className="mt-5 max-w-[420px] text-[16px] leading-7 text-[#6B6779]">Every button on your card does one useful thing. Pick the ones your business needs.</p>
          <ul className="mt-10 grid max-w-[460px] grid-cols-4 gap-x-3 gap-y-6">
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <motion.li
                key={label}
                className="group flex flex-col items-center gap-2 text-center"
                initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -12 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.06 }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E2E0D9] bg-white text-[#121018] transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-[-6deg] group-hover:border-transparent group-hover:bg-[#121018] group-hover:text-[#DAF56B]">
                  <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="text-[12px] font-medium leading-tight text-[#3B3747]">{label}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative"
        >
          <div role="tablist" aria-label="Card types" className="relative z-10 flex items-end gap-1 pl-2">
            {(Object.keys(TABS) as TabKey[]).map((k) => {
              const active = k === tab;
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(k)}
                  className={cn(
                    "relative rounded-t-[18px] px-6 pb-3 pt-3 text-[15px] font-semibold transition-colors",
                    active ? "bg-[#121018] text-white" : "bg-[#E9E7E1] text-[#5B5768] hover:text-[#121018]",
                  )}
                >
                  {k}
                </button>
              );
            })}
            <Link href="/register" className="mb-2 ml-auto mr-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#121018] shadow-sm">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Create
            </Link>
          </div>
          <div role="tabpanel" aria-label={tab} className="rounded-[28px] rounded-tl-none bg-[#121018] p-3 sm:p-4">
            <AnimatePresence mode="wait">
              <motion.ul key={tab} className="grid grid-cols-2 gap-3 sm:grid-cols-3" initial="hide" animate="show" exit="hide">
                {TABS[tab].map((it, i) => (
                  <motion.li
                    key={it.src}
                    variants={{
                      hide: { opacity: 0, y: 18, scale: 0.96, transition: { duration: 0.2 } },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE, delay: i * 0.05 } },
                    }}
                    className="group relative aspect-square overflow-hidden rounded-[18px] bg-[#2A2635]"
                  >
                    <Image src={it.src} alt={it.label} fill sizes="(min-width: 1024px) 220px, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── "You'll find yourself among us" — drifting wall of faces ──────────────────────

const FACES = Array.from({ length: 18 }, (_, i) => `/landing/face-${String(i + 1).padStart(2, "0")}.webp`);
const OFFSETS = [0, 28, 8, 40, 14, 0, 34, 10, 26];
const SIZES = [76, 64, 84, 68, 78, 62, 80, 70, 66];

function FaceRow({ faces, reverse, y }: { faces: string[]; reverse?: boolean; y: MotionValue<string> }) {
  // Repeat the photos so one copy of the strip is always wider than the screen (up to ~2600px);
  // otherwise the loop runs out and leaves an empty gap on wide monitors.
  const strip = [...faces, ...faces, ...faces];
  return (
    <motion.div style={{ y }}>
      <Marquee seconds={90} reverse={reverse} fade={false} className="py-6">
        {strip.map((src, i) => {
          const size = SIZES[i % SIZES.length];
          return (
            <span key={`${src}-${i}`} className="mr-5 block self-start sm:mr-8" style={{ marginTop: OFFSETS[i % OFFSETS.length] }}>
              <span
                className="relative block overflow-hidden rounded-[22px] shadow-[0_14px_30px_-16px_rgba(18,16,24,0.5)] transition-transform duration-300 hover:-rotate-6 hover:scale-110"
                style={{ width: size, height: size }}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </span>
            </span>
          );
        })}
      </Marquee>
    </motion.div>
  );
}

export function PeopleWall() {
  const ref = React.useRef<HTMLElement>(null);
  const progress = useSectionProgress(ref, ["start end", "end start"]);
  const topY = useTransform(progress, [0, 1], ["40px", "-40px"]);
  const bottomY = useTransform(progress, [0, 1], ["-40px", "40px"]);
  return (
    <section ref={ref} className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="people-title">
      <FaceRow faces={FACES.slice(0, 9)} y={topY} />
      <div className="relative mx-auto my-12 max-w-[640px] px-4 text-center sm:my-16">
        <TapGlyph className="mx-auto h-7 w-7" />
        <WordReveal id="people-title" text={"You'll find yourself\namong us."} className={cn("mt-5 text-[40px] text-[#121018] sm:text-[60px]", heading)} />
        <p className="mx-auto mt-5 max-w-[420px] text-[16px] leading-7 text-[#6B6779]">
          Doctors, designers, shop owners and sales teams use Digicardo to be remembered after the first hello.
        </p>
      </div>
      <FaceRow faces={FACES.slice(9)} reverse y={bottomY} />
    </section>
  );
}

// ── Bento: how it works ───────────────────────────────────────────────────────────

function NfcCard() {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });
  const shine = useTransform(sry, [-18, 18], ["0%", "100%"]);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 30);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 24);
  };
  return (
    <div className="flex h-full items-center justify-center [perspective:900px]" onPointerMove={onMove} onPointerLeave={() => (rx.set(0), ry.set(0))}>
      <motion.div
        style={{ rotateX: srx, rotateY: sry }}
        className="relative aspect-[1.586] animate-float motion-reduce:animate-none w-full max-w-[320px] overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#1E1A2B_0%,#0B0A10_60%,#2A2140_100%)] p-5 shadow-[0_40px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.14)_45%,transparent_60%)] bg-[length:250%_100%]"
          style={{ backgroundPositionX: shine }}
        />
        <div className="flex items-start justify-between">
          <DigicardoLogo size="xs" wordmarkClassName="text-white" />
          <Nfc className="h-6 w-6 text-white/80" aria-hidden="true" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <div>
            <p className="text-[15px] font-semibold text-white">Arjun Mehta</p>
            <p className="text-[11px] text-white/60">Real estate advisor</p>
          </div>
          <span className="rounded-md bg-white p-1">
            <QrCode className="h-7 w-7 text-[#121018]" aria-hidden="true" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

const BARS = [38, 52, 44, 70, 58, 86, 74];

function Analytics() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-semibold text-[#121018]/70">Card views · this week</p>
        <BarChart3 className="h-5 w-5 text-[#121018]" aria-hidden="true" />
      </div>
      <div className="mt-auto flex h-[120px] items-end gap-2 pt-4">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className={cn("flex-1 rounded-t-[8px] rounded-b-[4px]", i === 5 ? "bg-[#121018]" : "bg-[#121018]/20")}
            initial={reduce ? false : { height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.06 }}
            style={reduce ? { height: `${h}%` } : undefined}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-[#121018]/50">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="flex-1 text-center">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

function BentoCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className={className}>
      <motion.div
        className="h-full"
        initial={reduce ? false : { opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function PhotoPanel({ src, alt, pos = "object-center" }: { src: string; alt: string; pos?: string }) {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-[20px]">
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 640px, 100vw" className={cn("object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105", pos)} />
    </div>
  );
}

const STEPS = [
  {
    n: "01",
    kicker: "Tap or scan",
    title: "Your card opens instantly.",
    text: "Customers tap your NFC card or scan your QR. No app, no typing.",
    src: "/landing/scene-tap-pay.webp",
    alt: "A customer tapping a phone at a shop counter",
    pos: "object-[50%_60%]",
  },
  {
    n: "02",
    kicker: "Save & connect",
    title: "Saved to their phone in one tap.",
    text: "Call, WhatsApp, directions and UPI — every button does one useful thing.",
    src: "/landing/scene-phone.webp",
    alt: "A smartphone home screen",
    pos: "object-center",
  },
  {
    n: "03",
    kicker: "Edit any time",
    title: "Change it once, live everywhere.",
    text: "Update from your dashboard. Your link, QR and NFC card stay the same.",
    src: "/landing/scene-phone-laptop.webp",
    alt: "Someone updating their card on a phone and laptop",
    pos: "object-center",
  },
];

export function BentoSection() {
  return (
    <section id="how" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <Eyebrow accent="works">How it</Eyebrow>
          <WordReveal text={"Every tap\ntells your story."} accent={{ story: V.violet }} className={cn("mt-5 text-[40px] text-[#121018] sm:text-[60px]", heading)} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((st, i) => (
            <BentoCard key={st.n} delay={i * 0.1}>
              <article className="group flex h-full flex-col rounded-[28px] bg-white p-3">
                <div className="h-[230px]">
                  <PhotoPanel src={st.src} alt={st.alt} pos={st.pos} />
                </div>
                <div className="flex-1 p-4 pt-5">
                  <p className="text-[13px] font-semibold text-[#5B3FE4]">
                    {st.n} · {st.kicker}
                  </p>
                  <h3 className="mt-1.5 text-[21px] font-medium leading-snug tracking-[-0.02em] text-[#121018]">{st.title}</h3>
                  <p className="mt-2 text-[15px] leading-6 text-[#6B6779]">{st.text}</p>
                </div>
              </article>
            </BentoCard>
          ))}

          <BentoCard className="md:col-span-3 lg:col-span-1" delay={0.05}>
            <article className="flex h-full min-h-[340px] flex-col rounded-[28px] bg-[#121018] p-7 text-white">
              <p className="text-[13px] font-semibold text-[#DAF56B]">NFC card</p>
              <h3 className="mt-1.5 text-[21px] font-medium tracking-[-0.02em]">A card worth handing over.</h3>
              <div className="mt-6 flex-1">
                <NfcCard />
              </div>
            </article>
          </BentoCard>

          <BentoCard className="md:col-span-3 lg:col-span-2" delay={0.12}>
            <article className="grid h-full min-h-[340px] gap-6 rounded-[28px] bg-[#DAF56B] p-7 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
              <div>
                <p className="text-[13px] font-semibold text-[#121018]/60">Insights</p>
                <h3 className="mt-1.5 text-[28px] font-medium leading-tight tracking-[-0.03em] text-[#121018]">See who&apos;s looking.</h3>
                <p className="mt-3 text-[15px] leading-6 text-[#121018]/70">Views, taps and enquiries for your card — so you know which share worked.</p>
              </div>
              <div className="h-[220px] rounded-[20px] bg-white/60 p-5">
                <Analytics />
              </div>
            </article>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
