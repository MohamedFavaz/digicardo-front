"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, easeInOut, motion, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, ArrowUpRight, CalendarCheck, Contact, Images, IndianRupee, MapPin, MessageCircle, Phone, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE, Eyebrow, Handle, PillLink, ScrollWords, V, WordReveal, heading, useMedia, useSectionProgress } from "./primitives";
import { Hero, ShowcaseSection, TEMPLATES } from "./Top";
import { FeaturesSection, StatementSection } from "./Middle";

/*
 * Pinned "story" scenes modelled on the reference video: the same cards travel from one
 * section to the next while the page is pinned. Desktop only — phones and reduced-motion
 * visitors get the plain sections.
 */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function useViewport() {
  const [vp, setVp] = React.useState({ w: 1440, h: 900 });
  React.useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

type Pose = { x: number; y: number; r: number; s: number };

/** One card whose centre follows a list of poses at given scroll stops. */
function Traveller({
  p,
  stops,
  poses,
  w,
  h,
  z,
  lag = 0,
  children,
}: {
  p: MotionValue<number>;
  stops: number[];
  /** Start each move a little later than the card before it, so the deck flows instead of moving as one block. */
  lag?: number;
  poses: Pose[];
  w: number;
  h: number;
  z: number;
  children: React.ReactNode;
}) {
  const at = stops.map((v, k) => (k === 0 || k === stops.length - 1 ? v : Math.min(0.98, v + lag)));
  // Ease in and out of every move, so cards accelerate and settle gently instead of travelling at a flat speed.
  const opts = { ease: easeInOut };
  const x = useTransform(p, at, poses.map((q) => q.x - w / 2), opts);
  const y = useTransform(p, at, poses.map((q) => q.y - h / 2), opts);
  const rotate = useTransform(p, at, poses.map((q) => q.r), opts);
  const scale = useTransform(p, at, poses.map((q) => q.s), opts);
  return (
    <motion.div className="absolute left-0 top-0 [backface-visibility:hidden] [will-change:transform]" style={{ x, y, rotate, scale, width: w, height: h, zIndex: z }}>
      {children}
    </motion.div>
  );
}

// ── Scene 1: hero fan → stack → showcase cascade ──────────────────────────────────

const FAN_R = [-10, -3.5, 3.5, 10];
const FAN_DY = [26, 4, 4, 26];
const fanOffset = (i: number) => i - (TEMPLATES.length - 1) / 2;
/** The card that flies in first and the others slide out from. */
const LEAD = 1;

function TemplateCard({ i, priority }: { i: number; priority?: boolean }) {
  const t = TEMPLATES[i];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-white shadow-[0_20px_40px_-20px_rgba(18,16,24,0.45),0_0_0_1px_rgba(18,16,24,0.06)]">
      <Image src={t.src} alt={`${t.name} template — ${t.who}`} fill sizes="240px" className="object-cover object-top" priority={priority} />
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.3),transparent_40%)]" />
    </div>
  );
}

function HeroShowcaseDesktop() {
  const ref = React.useRef<HTMLElement>(null);
  const { w, h } = useViewport();
  const p = useSectionProgress(ref, ["start start", "end end"]);
  const [phase, setPhase] = React.useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const next = v > 0.56 ? 1 : 0;
    setPhase((cur) => (cur === next ? cur : next));
  });

  // Sizes from the window so every scene fits on a laptop screen as well as a big monitor.
  // Matches the heading classes below: 56px, 76px from 1280px, 84px from 1536px wide.
  const fs = w >= 1536 ? 84 : w >= 1280 ? 76 : 56;
  const W = Math.round(clamp(Math.min(w * 0.13, (h - 500) / 1.45), 120, 210));
  const H = Math.round((W * 4) / 3);
  const headTop = 96;
  const fanY = headTop + fs * 2.1 + 56 + H / 2;
  const subTop = fanY + H / 2 + 56;

  const posesFor = (i: number): Pose[] => {
    const off = fanOffset(i);
    const fan = { x: w / 2 + off * W * 0.82, y: fanY + FAN_DY[i] * (W / 190), r: FAN_R[i], s: 1 };
    const stack = { x: w / 2 + off * 3, y: h * 0.56, r: off * 2.5, s: 0.9 };
    const cascade = { x: w * 0.5 + W * 0.6 + i * W * 0.56, y: h * 0.34 + i * h * 0.075, r: 0, s: 1.08 };
    return [fan, fan, stack, stack, cascade, cascade];
  };
  const stops = [0, 0.12, 0.34, 0.42, 0.68, 1];

  const heroOpacity = useTransform(p, [0.06, 0.2], [1, 0]);
  const heroY = useTransform(p, [0.06, 0.22], [0, -h * 0.16]);
  const showOpacity = useTransform(p, [0.5, 0.62], [0, 1]);

  return (
    <section ref={ref} className="relative h-[420vh]" aria-label="Digicardo">
      <div id="features" className="absolute top-[58%] h-px w-px" aria-hidden="true" />
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* soft backdrop waves */}
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[620px] w-[620px] text-[#5B3FE4]/[0.07]">
          <path d="M3 11.5A9.5 9.5 0 0 1 12.5 21M3 3.5A17.5 17.5 0 0 1 20.5 21" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>

        {/* Hero copy */}
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-x-0 top-0 z-30" aria-hidden={phase === 1}>
          <div className="relative mx-auto max-w-[980px] px-6 text-center" style={{ paddingTop: headTop }}>
            <WordReveal
              as="h1"
              text={"A smart card for\nevery business."}
              accent={{ smart: V.violet }}
              delay={0.1}
              className={cn("text-[56px] text-[#121018] xl:text-[76px] 2xl:text-[84px]", heading)}
            />
            <Handle name="meera.dental" tone="violet" className="left-[2%] top-[62%]" delay={1.3} />
            <Handle name="rahul.designs" tone="green" tail="right" className="right-[4%] top-[72px]" delay={1.5} />
          </div>
        </motion.div>
        <motion.div style={{ opacity: heroOpacity, top: subTop }} className="absolute inset-x-0 z-30 flex flex-col items-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.6 }}
            className="max-w-[560px] text-[17px] leading-7 text-[#6B6779]"
          >
            Your contact, WhatsApp, services, location and UPI on one beautiful page. Share it by link, QR code or a tap of an NFC card.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.85 }}
            className="mt-6 flex items-center gap-3"
            style={{ pointerEvents: phase === 1 ? "none" : "auto" }}
          >
            <PillLink href="/register">
              Get your card <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </PillLink>
            <a href="#templates" className="inline-flex h-12 items-center rounded-full px-5 text-[15px] font-semibold text-[#121018] hover:bg-black/[0.04]">
              See templates
            </a>
          </motion.div>
        </motion.div>

        {/* Showcase copy */}
        <motion.div
          style={{ opacity: showOpacity, pointerEvents: phase === 1 ? "auto" : "none" }}
          className="absolute left-[6%] top-1/2 z-30 w-[40%] max-w-[520px] -translate-y-1/2"
          aria-hidden={phase === 0}
        >
          <Eyebrow accent="card">Your digital business</Eyebrow>
          <WordReveal
            show={phase === 1}
            text={"Share, save\n& get found\nby customers."}
            accent={{ "&": V.violet, get: V.violet, found: V.violet }}
            className={cn("mt-5 text-[52px] text-[#121018] xl:text-[64px]", heading)}
          />
          <motion.div
            animate={phase === 1 ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 14, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: EASE, delay: phase === 1 ? 0.5 : 0 }}
          >
            <p className="mt-6 max-w-[420px] text-[16px] leading-7 text-[#6B6779]">
              One link that does what a paper card never could — customers save your number in one tap, message you on WhatsApp, open your location and
              pay you by UPI.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <PillLink href="/register">Get your card</PillLink>
              <a href="#how" className="inline-flex h-12 items-center gap-1 rounded-full px-4 text-[15px] font-semibold text-[#121018] hover:bg-black/[0.04]">
                How it works <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* The travelling cards */}
        {TEMPLATES.map((t, i) => {
          const off = fanOffset(i);
          const lead = i === LEAD;
          const z = phase === 1 ? 10 + i : lead ? 16 : Math.round(15 - Math.abs(off) * 2);
          return (
            <Traveller key={t.name} p={p} stops={stops} poses={posesFor(i)} w={W} h={H} z={z} lag={i * 0.018}>
              <motion.div
                className="h-full w-full"
                // Intro: the middle card flies in, then the others slide out from behind it.
                initial={
                  lead
                    ? { x: w * 0.32, y: h * 0.45, rotate: 28, opacity: 0 }
                    : { x: -off * W * 0.82, y: -FAN_DY[i] * (W / 190), rotate: -FAN_R[i], opacity: 0 }
                }
                animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                transition={
                  lead
                    ? { type: "spring", stiffness: 55, damping: 14, delay: 0.15 }
                    : { type: "spring", stiffness: 80, damping: 15, delay: 1.0 + Math.abs(off) * 0.12, opacity: { duration: 0.2, delay: 0.95 + Math.abs(off) * 0.12 } }
                }
                whileHover={{ y: -12, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              >
                <TemplateCard i={i} priority={lead} />
              </motion.div>
            </Traveller>
          );
        })}
      </div>
    </section>
  );
}

export function HeroShowcase() {
  const wide = useMedia("(min-width: 1024px)");
  const reduce = useReducedMotion();
  if (!wide || reduce) {
    return (
      <>
        <Hero />
        <ShowcaseSection />
      </>
    );
  }
  return <HeroShowcaseDesktop />;
}

// ── Scene 2: sentence + stack → diagonal deal → grid inside the tab panel ─────────

const STATEMENT =
  "Whether you run a café, a clinic or a sales team, Digicardo puts your contact, services and payments in one card your customers keep.";

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

function FeatureStoryDesktop() {
  const ref = React.useRef<HTMLElement>(null);
  const { w, h } = useViewport();
  const p = useSectionProgress(ref, ["start start", "end end"]);
  const [phase, setPhase] = React.useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const next = v > 0.76 ? 2 : v > 0.34 ? 1 : 0;
    setPhase((cur) => (cur === next ? cur : next));
  });
  const [tab, setTab] = React.useState<TabKey>("Business");

  // Grid geometry (right half of the screen, below the menu).
  const gap = 14;
  const bar = 58;
  const Wg = Math.round(Math.min((w * 0.44 - gap * 2) / 3, ((h - 230) / 2) * 0.8));
  const Hg = Math.round(Wg * 1.25);
  const gridX = w * 0.52;
  const panelH = bar + Hg * 2 + gap + 14;
  const gridTop = Math.max(92, (h - panelH) / 2 + 24);

  const posesFor = (i: number): Pose[] => {
    const k = i - 2.5;
    const stack = { x: w / 2 + k * 3, y: h * 0.25, r: k * 1.5, s: 0.5 };
    const fanned = { x: w / 2 + k * 12, y: h * 0.25, r: k * 6, s: 0.52 };
    const deal = { x: w * 0.17 + i * ((w * 0.66) / 5), y: h * 0.3 + i * ((h * 0.4) / 5), r: -4, s: 0.82 };
    const c = i % 3;
    const r = Math.floor(i / 3);
    const grid = { x: gridX + 12 + c * (Wg + gap) + Wg / 2, y: gridTop + bar + r * (Hg + gap) + Hg / 2, r: 0, s: 1 };
    return [stack, fanned, deal, deal, grid, grid];
  };
  const stops = [0, 0.26, 0.42, 0.5, 0.7, 1];

  const textOpacity = useTransform(p, [0.28, 0.4], [1, 0]);
  const textY = useTransform(p, [0.28, 0.42], [0, -h * 0.2]);
  const panelOpacity = useTransform(p, [0.7, 0.8], [0, 1]);
  const panelScale = useTransform(p, [0.7, 0.82], [0.94, 1]);

  return (
    <section ref={ref} className="relative h-[480vh]" aria-label="What Digicardo does">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Sentence */}
        <motion.div style={{ opacity: textOpacity, y: textY, top: h * 0.42 }} className="absolute inset-x-0 z-20 px-6" aria-hidden={phase > 0}>
          <ScrollWords
            text={STATEMENT}
            accent={{ café: V.violet, clinic: V.violet, team: V.violet, keep: V.violet }}
            progress={p}
            range={[0.02, 0.24]}
            className={cn("mx-auto max-w-[1000px] text-center text-[40px] text-[#121018] xl:text-[50px]", heading, "leading-[1.15]")}
          />
        </motion.div>

        {/* Features copy (left) */}
        <div className="absolute left-[6%] top-1/2 z-20 w-[40%] max-w-[500px] -translate-y-1/2" style={{ pointerEvents: phase === 2 ? "auto" : "none" }} aria-hidden={phase < 2}>
          <motion.div animate={{ opacity: phase === 2 ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <Eyebrow accent="tap">Everything in one</Eyebrow>
          </motion.div>
          <WordReveal show={phase === 2} text={"Everything your\ncustomers need."} className={cn("mt-5 text-[46px] text-[#121018] xl:text-[56px]", heading)} />
          <motion.p
            animate={phase === 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: EASE, delay: phase === 2 ? 0.4 : 0 }}
            className="mt-5 max-w-[420px] text-[16px] leading-7 text-[#6B6779]"
          >
            Every button on your card does one useful thing. Pick the ones your business needs.
          </motion.p>
          <ul className="mt-9 grid max-w-[440px] grid-cols-4 gap-x-3 gap-y-5">
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <motion.li
                key={label}
                className="group flex flex-col items-center gap-2 text-center"
                animate={phase === 2 ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -20 }}
                transition={phase === 2 ? { type: "spring", stiffness: 240, damping: 15, delay: 0.5 + i * 0.05 } : { duration: 0.15 }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E2E0D9] bg-white text-[#121018] transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-[-6deg] group-hover:border-transparent group-hover:bg-[#121018] group-hover:text-[#DAF56B]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="text-[12px] font-medium leading-tight text-[#3B3747]">{label}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Dark tab panel that grows around the grid */}
        <motion.div
          style={{ opacity: panelOpacity, scale: panelScale, left: gridX, top: gridTop, width: Wg * 3 + gap * 2 + 24, height: panelH, pointerEvents: phase === 2 ? "auto" : "none" }}
          className="absolute z-10 origin-center rounded-[28px] bg-[#121018]"
        >
          <div role="tablist" aria-label="Card types" className="flex h-[58px] items-center gap-1.5 px-3">
            {(Object.keys(TABS) as TabKey[]).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={k === tab}
                onClick={() => setTab(k)}
                className={cn("rounded-full px-4 py-2 text-[14px] font-semibold transition-colors", k === tab ? "bg-white text-[#121018]" : "text-white/60 hover:text-white")}
              >
                {k}
              </button>
            ))}
            <Link href="/register" className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#DAF56B] px-3.5 py-1.5 text-[13px] font-semibold text-[#121018]">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Create
            </Link>
          </div>
        </motion.div>

        {/* Travelling photo cards */}
        {TABS.Business.map((_, i) => (
          <Traveller key={i} p={p} stops={stops} poses={posesFor(i)} w={Wg} h={Hg} z={20 + i} lag={i * 0.014}>
            <div className="group relative h-full w-full overflow-hidden rounded-[20px] bg-[#2A2635] shadow-[0_24px_50px_-24px_rgba(18,16,24,0.55)]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={TABS[tab][i].src}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                >
                  <Image src={TABS[tab][i].src} alt={TABS[tab][i].label} fill sizes="260px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </motion.div>
              </AnimatePresence>
            </div>
          </Traveller>
        ))}
      </div>
    </section>
  );
}

export function FeatureStory() {
  const wide = useMedia("(min-width: 1024px)");
  const reduce = useReducedMotion();
  if (!wide || reduce) {
    return (
      <>
        <StatementSection />
        <FeaturesSection />
      </>
    );
  }
  return <FeatureStoryDesktop />;
}
