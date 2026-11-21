"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Camera,
  Dumbbell,
  GraduationCap,
  Home,
  Menu,
  Scale,
  Scissors,
  ShoppingBag,
  Stethoscope,
  Utensils,
  Wrench,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { cn } from "@/lib/utils";
import { EASE, Eyebrow, Handle, Marquee, PillLink, V, WordReveal, heading, useMedia, useSectionProgress } from "./primitives";

// ── Navigation ─────────────────────────────────────────────────────────────────────

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      setScrolled((cur) => (cur === next ? cur : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const signedIn = mounted && isAuthenticated;
  const dashboardHref = user?.role === "admin" ? "/admin/dashboard" : user?.role === "agent" ? "/agent/dashboard" : "/dashboard";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 rounded-full pl-4 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-300 sm:h-16 sm:pl-6",
          scrolled || open ? "bg-white/95 shadow-[0_8px_30px_-14px_rgba(18,16,24,0.25)]" : "bg-transparent",
        )}
      >
        <Link href="/" aria-label="Digicardo home" onClick={() => setOpen(false)}>
          <DigicardoLogo size="sm" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-[14px] font-medium text-[#3B3747] transition-colors hover:bg-black/[0.04] hover:text-[#121018]">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5" suppressHydrationWarning>
          {signedIn ? (
            <PillLink href={dashboardHref} className="h-10 px-5 text-[14px] sm:h-11">
              Dashboard
            </PillLink>
          ) : (
            <>
              <Link href="/login" className="hidden h-11 items-center rounded-full px-4 text-[14px] font-semibold text-[#121018] hover:bg-black/[0.04] sm:inline-flex">
                Log in
              </Link>
              <PillLink href="/register" className="h-10 px-5 text-[14px] sm:h-11">
                Get your card
              </PillLink>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#121018] hover:bg-black/[0.05] lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mx-auto mt-2 max-w-[1280px] rounded-[28px] bg-white p-3 shadow-[0_24px_60px_-24px_rgba(18,16,24,0.35)] lg:hidden"
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium text-[#121018] hover:bg-[#F6F6F3]">
                {l.label}
                <ArrowRight className="h-5 w-5 text-[#A9A6B3]" aria-hidden="true" />
              </a>
            ))}
            {!signedIn && (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#EFEEE9] pt-3">
                <Link href="/login" className="flex h-12 items-center justify-center rounded-full bg-[#F1F0EC] font-semibold text-[#121018]">
                  Log in
                </Link>
                <Link href="/agent-login" className="flex h-12 items-center justify-center rounded-full bg-[#F1F0EC] font-semibold text-[#121018]">
                  Partner log in
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Hero: heading + a fan of real templates ───────────────────────────────────────

export const TEMPLATES = [
  { src: "/landing/tpl-poster.webp", name: "Poster", who: "Scoops & Smiles · Ice cream parlour" },
  { src: "/landing/tpl-classic.webp", name: "Classic", who: "Rahul Verma · Interior designer" },
  { src: "/landing/tpl-showcase.webp", name: "Showcase", who: "Brightline Core · Electronics" },
  { src: "/landing/tpl-botanical.webp", name: "Botanical", who: "Dr. Meera Nair · Dental clinic" },
  { src: "/landing/tpl-motion.webp", name: "Motion", who: "Smile Studio · Family dentistry" },
] as const;

const FAN = [
  { r: -16, y: 58 },
  { r: -8, y: 16 },
  { r: 0, y: 0 },
  { r: 8, y: 16 },
  { r: 16, y: 58 },
];

function FanCard({ i, wide, progress }: { i: number; wide: boolean; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const t = TEMPLATES[i];
  const off = i - 2;
  const gap = wide ? 172 : 58;
  const f = FAN[i];
  // While the hero scrolls away the fan opens up a little more.
  const spread = useTransform(progress, [0, 1], [0, off * (wide ? 70 : 24)]);
  const lift = useTransform(progress, [0, 1], [0, -Math.abs(off) * 30]);
  return (
    <motion.div className="absolute left-1/2 top-0" style={{ x: spread, y: lift, zIndex: 10 - Math.abs(off) }}>
      <motion.div
        className="group relative -ml-[var(--w)] w-[calc(var(--w)*2)] [--w:62px] sm:[--w:104px]"
        initial={reduce ? false : { x: 0, y: 160, rotate: 0, opacity: 0, scale: 0.7 }}
        animate={{ x: off * gap, y: f.y * (wide ? 1 : 0.5), rotate: f.r, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 14, mass: 0.9, delay: 0.35 + Math.abs(off) * 0.12 + (off < 0 ? 0.05 : 0) }}
        whileHover={reduce ? undefined : { y: f.y * (wide ? 1 : 0.5) - 22, rotate: f.r * 0.4, scale: 1.04, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-white shadow-[0_30px_60px_-24px_rgba(18,16,24,0.45),0_0_0_1px_rgba(18,16,24,0.06)] sm:rounded-[26px]">
          <Image src={t.src} alt={`${t.name} template — ${t.who}`} fill sizes="(min-width: 640px) 208px, 124px" className="object-cover object-top" priority={i === 2} />
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_40%)]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Faint contactless waves from the logo, drawn huge behind the hero. */
function BackdropWaves({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      <path d="M3 11.5A9.5 9.5 0 0 1 12.5 21M3 3.5A17.5 17.5 0 0 1 20.5 21" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const wide = useMedia("(min-width: 640px)");
  const smooth = useSectionProgress(ref, ["start start", "end start"]);
  const textY = useTransform(smooth, [0, 1], [0, -80]);
  const textOpacity = useTransform(smooth, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
      <BackdropWaves className="-left-40 top-10 h-[620px] w-[620px] text-[#5B3FE4]/[0.07]" />
      <BackdropWaves className="-right-56 bottom-0 h-[720px] w-[720px] -scale-x-100 text-[#121018]/[0.05]" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative mx-auto max-w-[980px] text-center">
        <h1 className="mb-4 inline-flex items-center rounded-full bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5B3FE4] ring-1 ring-[#5B3FE4]/15 sm:text-[12px]">
          Digital business card &amp; NFC visiting card
        </h1>
        <WordReveal
          as="p"
          text={"A smart card for\nevery business."}
          accent={{ smart: V.violet }}
          delay={0.1}
          className={cn("text-[44px] text-[#121018] sm:text-[68px] lg:text-[80px]", heading)}
        />
        <Handle name="meera.dental" tone="violet" className="left-0 top-[52%] hidden sm:block lg:left-[2%]" delay={1.1} />
        <Handle name="rahul.designs" tone="green" tail="right" className="right-0 top-[-14%] hidden sm:block lg:right-[4%]" delay={1.3} />
      </motion.div>

      <div className="relative mx-auto mt-10 h-[230px] max-w-[1100px] sm:mt-12 sm:h-[330px]">
        {TEMPLATES.map((t, i) => (
          <FanCard key={t.name} i={i} wide={wide} progress={smooth} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
        className="relative mx-auto mt-10 flex max-w-[560px] flex-col items-center text-center sm:mt-6"
      >
        <p className="text-[16px] leading-7 text-[#6B6779] sm:text-[18px]">
          Your contact, WhatsApp, services, location and UPI on one beautiful page. Share it by link, QR code or a tap of an NFC card.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <PillLink href="/register">
            Get your card <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PillLink>
          <a href="#templates" className="inline-flex h-12 items-center gap-1.5 rounded-full px-5 text-[15px] font-semibold text-[#121018] transition-colors hover:bg-black/[0.04]">
            See templates
          </a>
        </div>
        <p className="mt-5 text-[13px] text-[#8D8998]">From ₹1,000 a year · No app needed for your customers</p>
      </motion.div>
    </section>
  );
}

// ── Showcase: a stack of people's cards that fans out ─────────────────────────────

export const PEOPLE = [
  { src: "/landing/face-08.webp", name: "Arjun Mehta", role: "Real estate advisor", handle: "arjun.homes" },
  { src: "/landing/face-02.webp", name: "Priya Nair", role: "Makeup artist", handle: "priya.glam" },
  { src: "/landing/face-16.webp", name: "Vikram Shah", role: "Chartered accountant", handle: "vikramshah.ca" },
  { src: "/landing/face-17.webp", name: "Neha Kapoor", role: "Salon owner", handle: "neha.salon" },
  { src: "/landing/face-10.webp", name: "Rohan Das", role: "Photographer", handle: "rohan.clicks" },
];

function PersonCard({ p, className, front }: { p: (typeof PEOPLE)[number]; className?: string; front?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[22px] bg-white shadow-[0_30px_60px_-28px_rgba(18,16,24,0.5),0_0_0_1px_rgba(18,16,24,0.05)]", className)}>
      <Image src={p.src} alt={`${p.name}, ${p.role}`} fill sizes="240px" className="object-cover" />
      {front && <span className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />}
      <div className={cn("absolute inset-x-0 bottom-0 p-4 text-white", !front && "hidden")}>
        <p className="text-[15px] font-semibold leading-tight">{p.name}</p>
        <p className="text-[12px] text-white/75">{p.role}</p>
      </div>
    </div>
  );
}

export function ShowcaseSection() {
  const ref = React.useRef<HTMLElement>(null);
  const wide = useMedia("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const p = useSectionProgress(ref, ["start end", "center center"]);

  return (
    <section ref={ref} id="features" className="relative scroll-mt-24 overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow accent="card">Your digital business</Eyebrow>
          <WordReveal
            text={"Share, save\n& get found\nby customers."}
            accent={{ "&": V.violet, get: V.violet, found: V.violet }}
            className={cn("mt-5 text-[42px] text-[#121018] sm:text-[60px] lg:text-[68px]", heading)}
          />
          <p className="mt-6 max-w-[440px] text-[16px] leading-7 text-[#6B6779]">
            One link that does what a paper card never could — customers save your number in one tap, message you on WhatsApp, open your location and
            pay you by UPI.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PillLink href="/register">Get your card</PillLink>
            <a href="#how" className="inline-flex h-12 items-center gap-1 rounded-full px-4 text-[15px] font-semibold text-[#121018] hover:bg-black/[0.04]">
              How it works <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative h-[380px] sm:h-[460px]">
          {PEOPLE.map((person, i) => (
            <CascadeCard key={person.handle} i={i} p={p} wide={wide} reduce={!!reduce}>
              <PersonCard p={person} className="h-full w-full" front={i === PEOPLE.length - 1} />
            </CascadeCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function CascadeCard({ i, p, wide, reduce, children }: { i: number; p: MotionValue<number>; wide: boolean; reduce: boolean; children: React.ReactNode }) {
  const n = PEOPLE.length - 1;
  const endX = wide ? i * 104 : i * 42;
  const endY = wide ? i * 44 : i * 30;
  const x = useTransform(p, [0, 1], reduce ? [endX, endX] : [n * (wide ? 50 : 22), endX]);
  const y = useTransform(p, [0, 1], reduce ? [endY, endY] : [n * 18, endY]);
  const rotate = useTransform(p, [0, 1], reduce ? [0, 0] : [(i - 2) * 5, 0]);
  return (
    <motion.div
      className="absolute left-0 top-0 h-[236px] w-[170px] sm:h-[290px] sm:w-[214px]"
      style={{ x, y, rotate, zIndex: i + 1 }}
      whileHover={reduce ? undefined : { y: endY - 18, transition: { type: "spring", stiffness: 300, damping: 20 } }}
    >
      {children}
    </motion.div>
  );
}

// ── Big photo carousel + "every kind of business" strip ───────────────────────────

const SLIDES = [
  { src: "/landing/scene-restaurant.webp", tag: "Restaurants & cafés", text: "Menu, table booking and Google reviews — one scan away.", pos: "object-[60%_40%]" },
  { src: "/landing/scene-cafe-pos.webp", tag: "Shops & counters", text: "Put your QR at the counter. Customers save you and pay by UPI.", pos: "object-center" },
  { src: "/landing/scene-shop-counter.webp", tag: "Retail & services", text: "Hand over a tap-to-share NFC card instead of paper.", pos: "object-center" },
  { src: "/landing/scene-cowork.webp", tag: "Teams & consultants", text: "Every person on your team, one consistent brand.", pos: "object-center" },
];

const CATEGORIES = [
  { icon: Utensils, label: "Restaurants" },
  { icon: Stethoscope, label: "Clinics" },
  { icon: Scissors, label: "Salons" },
  { icon: Home, label: "Real estate" },
  { icon: ShoppingBag, label: "Retail" },
  { icon: Briefcase, label: "Consultants" },
  { icon: Dumbbell, label: "Gyms" },
  { icon: Camera, label: "Photographers" },
  { icon: Scale, label: "Lawyers" },
  { icon: GraduationCap, label: "Tutors" },
  { icon: Wrench, label: "Repairs" },
];

export function CarouselSection() {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const go = React.useCallback((d: number) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length), []);
  React.useEffect(() => {
    if (paused || reduce) return;
    const t = window.setTimeout(() => go(1), 5500);
    return () => window.clearTimeout(t);
  }, [index, paused, reduce, go]);
  const s = SLIDES[index];

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24" aria-roledescription="carousel" aria-label="Who uses Digicardo">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow accent="business owners">Made for</Eyebrow>
            <WordReveal text={"Made for people\nwho meet customers."} className={cn("mt-5 text-[38px] text-[#121018] sm:text-[56px] lg:text-[64px]", heading)} />
          </div>
        </div>

        <div
          className="relative mt-10 overflow-hidden rounded-[28px] bg-[#E9E7E1] sm:mt-12 sm:rounded-[36px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            className="relative aspect-[4/5] sm:aspect-[16/8] lg:aspect-[16/7]"
            initial={reduce ? false : { clipPath: "inset(12% 8% 12% 8% round 36px)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={s.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.9, ease: "easeOut" }, scale: { duration: 6.5, ease: "linear" } }}
              >
                <Image src={s.src} alt={s.tag} fill sizes="(min-width: 1280px) 1280px, 100vw" className={cn("object-cover", s.pos)} priority={index === 0} />
              </motion.div>
            </AnimatePresence>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />

            <div className="absolute left-4 top-4 flex gap-1.5 sm:left-6 sm:top-6">
              {SLIDES.map((sl, i) => (
                <button
                  key={sl.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show slide ${i + 1}: ${sl.tag}`}
                  aria-current={i === index}
                  className="relative h-1.5 w-8 overflow-hidden rounded-full bg-white/40 sm:w-10"
                >
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-white"
                      initial={{ width: paused || reduce ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: paused || reduce ? 0 : 5.5, ease: "linear" }}
                    />
                  )}
                  {i < index && <span className="absolute inset-0 rounded-full bg-white" />}
                </button>
              ))}
            </div>

            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.tag}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="max-w-[460px] text-white"
                  aria-live="polite"
                >
                  <p className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-[#121018] backdrop-blur">{s.tag}</p>
                  <p className="mt-3 hidden text-[18px] font-medium leading-7 text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] sm:block">{s.text}</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#121018] transition-transform hover:scale-105">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next slide" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#121018] transition-transform hover:scale-105">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid items-center gap-6 sm:mt-20 lg:grid-cols-[300px_1fr]">
          <div>
            <WordReveal text="Trusted by every kind of business." accent={{ every: V.violet, kind: V.violet }} as="h3" className={cn("text-[26px] text-[#121018]", heading)} />
            <p className="mt-2 text-[14px] text-[#6B6779]">From one-person studios to teams of fifty.</p>
          </div>
          <Marquee seconds={36}>
            {CATEGORIES.map(({ icon: Icon, label }) => (
              <span key={label} className="mr-10 inline-flex items-center gap-2 whitespace-nowrap text-[17px] font-semibold text-[#A3A0AD] transition-colors hover:text-[#121018]">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
