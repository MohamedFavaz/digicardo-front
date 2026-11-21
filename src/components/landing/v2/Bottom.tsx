"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Contact,
  IndianRupee,
  MapPin,
  MessageCircle,
  Nfc,
  Phone,
  Plus,
  QrCode,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import { DigicardoLogo, TapGlyph } from "@/components/ui/DigicardoLogo";
import { cn } from "@/lib/utils";
import { HOME_FAQS } from "@/lib/seo";
import { EASE, Eyebrow, Marquee, PillLink, V, WordReveal, heading } from "./primitives";
import { TEMPLATES } from "./Top";

const WA_TEXT = encodeURIComponent("Hi Digicardo, I'd like to know more about the digital business card.");
const WA_PARTNER = encodeURIComponent("Hi Digicardo, I'd like to become a Digicardo partner.");

// ── Templates: horizontal rail with progress bar ──────────────────────────────────

export function TemplatesSection() {
  const rail = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [edges, setEdges] = React.useState({ start: true, end: false });
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 });
  };
  React.useEffect(onScroll, []);
  const by = (d: number) => rail.current?.scrollBy({ left: d * 300, behavior: "smooth" });
  const reduce = useReducedMotion();

  return (
    <section id="templates" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <Eyebrow accent="style">Pick your</Eyebrow>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <div>
            <WordReveal text={"A template\nfor every style."} accent={{ style: V.violet }} className={cn("text-[40px] text-[#121018] sm:text-[60px]", heading)} />
            <p className="mt-4 max-w-[420px] text-[16px] leading-7 text-[#6B6779]">Switch any time — your details stay, only the look changes.</p>
          </div>
          <PillLink href="/register" tone="violet">
            Start with a template <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PillLink>
        </div>
      </div>

      <div
        ref={rail}
        onScroll={onScroll}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth scroll-pl-4 px-4 pb-4 sm:scroll-pl-6 sm:px-6 lg:scroll-pl-[max(24px,calc((100vw_-_1280px)/2_+_24px))] lg:px-[max(24px,calc((100vw_-_1280px)/2_+_24px))]"
      >
        {TEMPLATES.map((t, i) => (
          <motion.figure
            key={t.name}
            className="group w-[210px] shrink-0 snap-start"
            initial={reduce ? false : { opacity: 0, x: 40, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.12 }}
          >
            <div className="relative h-[440px] overflow-hidden rounded-[34px] border-[6px] border-[#121018] bg-[#121018] shadow-[0_40px_60px_-34px_rgba(18,16,24,0.6)]">
              <div className="relative h-full overflow-hidden rounded-[28px] bg-white">
                <Image
                  src={t.src}
                  alt={`${t.name} template — ${t.who}`}
                  width={780}
                  height={1688}
                  sizes="260px"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <span className="pointer-events-none absolute left-1/2 top-2 h-[18px] w-[70px] -translate-x-1/2 rounded-full bg-[#121018]" />
            </div>
            <figcaption className="mt-4 px-1">
              <p className="text-[16px] font-semibold text-[#121018]">{t.name}</p>
              <p className="text-[13px] text-[#6B6779]">{t.who}</p>
            </figcaption>
          </motion.figure>
        ))}
        <div className="flex h-[440px] w-[210px] shrink-0 snap-start flex-col justify-center rounded-[34px] border-2 border-dashed border-[#D9D6CE] p-7">
          <Sparkles className="h-7 w-7 text-[#5B3FE4]" aria-hidden="true" />
          <p className="mt-4 text-[22px] font-medium leading-tight tracking-[-0.02em] text-[#121018]">More styles inside your dashboard.</p>
          <p className="mt-2 text-[14px] text-[#6B6779]">Colours, fonts and layouts for every kind of business.</p>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1280px] items-center gap-5 px-4 sm:px-6">
        <div className="flex gap-2">
          <button type="button" onClick={() => by(-1)} disabled={edges.start} aria-label="Previous templates" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DEDBD3] bg-white text-[#121018] transition disabled:opacity-35">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => by(1)} disabled={edges.end} aria-label="Next templates" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DEDBD3] bg-white text-[#121018] transition disabled:opacity-35">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[#E4E2DB]" aria-hidden="true">
          <span className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-[#121018] transition-transform duration-150" style={{ transform: `translateX(${progress * 300}%)` }} />
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────────

const INCLUDED = ["Your own digital business card", "Every template and colour", "Share by link, QR code and NFC", "Edit any time — live instantly", "Visitor stats and enquiry inbox"];

export function PricingSection() {
  const reduce = useReducedMotion();
  const plans = [
    { id: "1year", name: "1 Year", price: "₹1,000", unit: "per year", note: "12 months of access", href: "/register?plan=1year", cta: "Choose 1 Year", hot: false },
    { id: "lifetime", name: "Lifelong", price: "₹4,000", unit: "one time", note: "Lifetime access + all future updates", href: "/register?plan=lifetime", cta: "Choose Lifelong", hot: true },
    { id: "team", name: "Teams", price: "Custom", unit: "", note: "Cards for your whole team, bulk NFC cards", href: "#contact", cta: "Talk to sales", hot: false },
  ];
  return (
    <section id="pricing" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#121018] text-[#DAF56B]">
            <IndianRupee className="h-5 w-5" aria-hidden="true" />
          </span>
          <WordReveal text={"Simple pricing.\nEvery feature."} className={cn("mt-6 text-[40px] text-[#121018] sm:text-[56px]", heading)} />
          <p className="mt-5 max-w-[400px] text-[16px] leading-7 text-[#6B6779]">Both plans include everything — choose how long you want your card.</p>
          <ul className="mt-8 space-y-3">
            {INCLUDED.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[15px] font-medium text-[#121018]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DAF56B]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
          {plans.map((pl, i) => (
            <motion.div
              key={pl.id}
              initial={reduce ? false : { opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: pl.hot ? -12 : 0, rotate: pl.hot ? -3 : 0 }}
              whileHover={reduce ? undefined : { rotate: 0, y: pl.hot ? -18 : -6 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-[26px] p-6",
                pl.hot ? "z-10 bg-[#5B3FE4] text-white shadow-[0_40px_70px_-30px_rgba(91,63,228,0.75)] sm:py-9" : "bg-white text-[#121018] shadow-[0_20px_40px_-30px_rgba(18,16,24,0.35)]",
              )}
            >
              <div className="flex items-center justify-between">
                <p className={cn("text-[15px] font-semibold", pl.hot ? "text-white/85" : "text-[#6B6779]")}>{pl.name}</p>
                {pl.hot && <span className="rounded-full bg-[#DAF56B] px-2.5 py-1 text-[11px] font-bold text-[#121018]">Best value</span>}
              </div>
              <p className="mt-5 text-[40px] font-semibold leading-none tracking-[-0.05em]">{pl.price}</p>
              <p className={cn("mt-1.5 h-5 text-[13px]", pl.hot ? "text-white/70" : "text-[#8D8998]")}>{pl.unit}</p>
              <p className={cn("mt-4 min-h-[40px] text-[13px] leading-5", pl.hot ? "text-white/85" : "text-[#6B6779]")}>{pl.note}</p>
              <PillLink href={pl.href} tone={pl.hot ? "lime" : "ink"} className="mt-6 h-11 w-full text-[14px]">
                {pl.cta}
              </PillLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Lime band: a giant marquee of what the card does ──────────────────────────────

const BAND = [
  { text: "Tap to share", img: "/landing/face-03.webp" },
  { text: "Scan the QR", img: "/landing/scene-cafe-pos.webp" },
  { text: "Save contact", img: "/landing/face-12.webp" },
  { text: "Pay by UPI", img: "/landing/scene-tap-pay.webp" },
  { text: "WhatsApp in one tap", img: "/landing/face-06.webp" },
];

const FLOATERS = [
  { icon: QrCode, x: "6%", y: "62%", r: -14 },
  { icon: Nfc, x: "16%", y: "78%", r: 10 },
  { icon: Contact, x: "29%", y: "60%", r: -6 },
  { icon: MessageCircle, x: "41%", y: "80%", r: 14 },
  { icon: IndianRupee, x: "54%", y: "64%", r: -10 },
  { icon: MapPin, x: "66%", y: "80%", r: 8 },
  { icon: Star, x: "78%", y: "62%", r: -12 },
  { icon: Share2, x: "90%", y: "78%", r: 12 },
  { icon: Phone, x: "84%", y: "46%", r: -4 },
];

function Floater({ f, i }: { f: (typeof FLOATERS)[number]; i: number }) {
  const reduce = useReducedMotion();
  const Icon = f.icon;
  // Icons drop in from above and bounce into a pile, like the reference band.
  return (
    <motion.span
      className="absolute flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-[#121018] bg-[#DAF56B] text-[#121018] sm:h-14 sm:w-14"
      style={{ left: f.x, top: f.y }}
      initial={reduce ? false : { y: -460, rotate: f.r - 120, opacity: 0 }}
      whileInView={{ y: 0, rotate: f.r, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 110, damping: 9, mass: 1.1, delay: 0.25 + i * 0.11, opacity: { duration: 0.15, delay: 0.25 + i * 0.11 } }}
      whileHover={{ y: -10, rotate: f.r + 25 }}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.6} aria-hidden="true" />
    </motion.span>
  );
}

export function LimeBand() {
  return (
    <section className="px-3 py-10 sm:px-5" aria-label="What your card does">
      <div className="relative mx-auto h-[420px] max-w-[1400px] overflow-hidden rounded-[32px] bg-[#DAF56B] sm:h-[500px] sm:rounded-[44px]">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-[20%] h-[640px] w-[640px] text-white/50">
          <path d="M3 11.5A9.5 9.5 0 0 1 12.5 21M3 3.5A17.5 17.5 0 0 1 20.5 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <div className="pt-10 sm:pt-14">
          <Marquee seconds={30} fade={false}>
            {BAND.map((b) => (
              <span key={b.text} className="mr-6 inline-flex items-center gap-6 whitespace-nowrap text-[52px] font-medium tracking-[-0.045em] text-[#121018] sm:mr-10 sm:gap-10 sm:text-[96px]">
                {b.text}
                <span className="relative inline-block h-[52px] w-[52px] overflow-hidden rounded-[14px] sm:h-[84px] sm:w-[84px] sm:rounded-[22px]">
                  <Image src={b.img} alt="" fill sizes="84px" className="object-cover" />
                </span>
              </span>
            ))}
          </Marquee>
        </div>
        {FLOATERS.map((f, i) => (
          <Floater key={i} f={f} i={i} />
        ))}
      </div>
    </section>
  );
}

// ── Two big call-to-action cards ──────────────────────────────────────────────────

function ClaimInline() {
  const router = useRouter();
  const [handle, setHandle] = React.useState("");
  const id = React.useId();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const clean = handle.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
        router.push(clean ? `/register?handle=${encodeURIComponent(clean)}` : "/register");
      }}
      className="flex w-full max-w-[440px] items-center gap-1 rounded-full bg-white p-1.5 pl-5"
    >
      <label htmlFor={id} className="flex min-w-0 flex-1 items-center text-[15px]">
        <span className="select-none text-[#8D8998]">digicardo.in/</span>
        <input
          id={id}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="yourname"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="Choose your card name"
          className="min-w-0 flex-1 bg-transparent font-semibold text-[#121018] outline-none placeholder:font-normal placeholder:text-[#C4C1CC]"
        />
      </label>
      <button type="submit" className="h-11 shrink-0 rounded-full bg-[#121018] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#2A2635]">
        Claim
      </button>
    </form>
  );
}

export function CtaCards() {
  const reduce = useReducedMotion();
  const card = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 60, scale: 0.97 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 1, ease: EASE, delay },
  });
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-[1280px] gap-4 md:grid-cols-2">
        <motion.article {...card(0)} className="group relative flex min-h-[520px] flex-col overflow-hidden rounded-[32px] bg-[#5B3FE4] text-white">
          <div className="relative m-3 mb-0 h-[248px] overflow-hidden rounded-[24px]">
            <Image src="/landing/scene-team.webp" alt="Two colleagues high-fiving at work" fill sizes="(min-width: 768px) 640px, 100vw" className="object-cover object-[40%_45%] transition-transform duration-[1.4s] group-hover:scale-105" />
          </div>
          <div className="flex flex-1 flex-col p-7 sm:p-9">
            <TapGlyph className="h-6 w-6" color="#DAF56B" />
            <h3 className={cn("mt-4 text-[40px] sm:text-[52px]", heading)}>
              Get your
              <br />
              card today.
            </h3>
            <p className="mt-3 max-w-[380px] text-[15px] leading-6 text-white/80">Claim your name before someone else does. We set it up and email your sign-in.</p>
            <div className="mt-auto pt-6">
              <ClaimInline />
            </div>
          </div>
        </motion.article>

        <motion.article {...card(0.12)} className="group relative flex min-h-[520px] flex-col overflow-hidden rounded-[32px] bg-white">
          <div className="relative m-3 mb-0 h-[248px] overflow-hidden rounded-[24px]">
            <Image src="/landing/scene-cowork.webp" alt="A small team working together in a café" fill sizes="(min-width: 768px) 640px, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
          </div>
          <div className="flex flex-1 flex-col p-7 sm:p-9">
            <Share2 className="h-6 w-6 text-[#121018]" aria-hidden="true" />
            <h3 className={cn("mt-4 text-[40px] text-[#121018] sm:text-[52px]", heading)}>
              Become a<br />
              partner.
            </h3>
            <p className="mt-3 max-w-[380px] text-[15px] leading-6 text-[#6B6779]">Sell Digicardo cards to businesses near you and manage all your clients from one partner portal.</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              <PillLink href={`https://wa.me/918593048536?text=${WA_PARTNER}`}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Apply on WhatsApp
              </PillLink>
              <Link href="/agent-login" className="inline-flex h-12 items-center rounded-full px-5 text-[15px] font-semibold text-[#121018] hover:bg-black/[0.04]">
                Partner log in
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

// ── FAQ + contact ─────────────────────────────────────────────────────────────────

const FAQS = HOME_FAQS;

const CONTACTS = [
  { label: "Support & custom cards", tel: "+918593048536", wa: "918593048536", display: "+91 85930 48536" },
  { label: "Sales & enquiries", tel: "+919526390381", wa: "919526390381", display: "+91 95263 90381" },
];

export function FaqSection() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="faqs" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow accent="answered">Questions</Eyebrow>
          <WordReveal text={"Questions?\nWe've got you."} className={cn("mt-5 text-[40px] text-[#121018] sm:text-[56px]", heading)} />
          <div id="contact" className="mt-10 scroll-mt-28 space-y-3">
            <p className="text-[15px] font-semibold text-[#121018]">Talk to a real person</p>
            {CONTACTS.map((c) => (
              <div key={c.wa} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-white p-4 pl-5">
                <div>
                  <p className="text-[13px] text-[#6B6779]">{c.label}</p>
                  <p className="text-[18px] font-semibold tracking-[-0.02em] text-[#121018]">{c.display}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${c.wa}?text=${WA_TEXT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${c.display}`}
                    className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#25D366] px-4 text-[14px] font-semibold text-white"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                  </a>
                  <a href={`tel:${c.tel}`} aria-label={`Call ${c.display}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F1F0EC] text-[#121018]">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={cn("overflow-hidden rounded-[22px] transition-colors", isOpen ? "bg-white" : "bg-white/60 hover:bg-white")}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[17px] font-medium tracking-[-0.01em] text-[#121018]"
                >
                  {f.q}
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300", isOpen ? "rotate-45 bg-[#121018] text-white" : "bg-[#F1F0EC] text-[#121018]")}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pr-16 text-[15px] leading-7 text-[#6B6779]">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────────

export function Footer() {
  const cols = [
    { title: "Product", links: [["Features", "#features"], ["How it works", "#how"], ["Templates", "#templates"], ["Pricing", "#pricing"]] },
    { title: "Support", links: [["FAQ", "#faqs"], ["Contact us", "#contact"], ["WhatsApp us", `https://wa.me/918593048536?text=${WA_TEXT}`]] },
    { title: "Accounts", links: [["Log in", "/login"], ["Partner log in", "/agent-login"], ["Get your card", "/register"]] },
  ];
  return (
    <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px] bg-[#ECEBE6] px-6 pb-8 pt-12 sm:rounded-[44px] sm:px-12 sm:pt-16">
        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <DigicardoLogo size="md" />
            <p className="mt-5 text-[22px] font-medium tracking-[-0.03em] text-[#121018]">Your card, your business.</p>
            <p className="mt-2 max-w-[300px] text-[14px] leading-6 text-[#6B6779]">Digital business cards and NFC cards for people who meet customers.</p>
          </div>
          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#121018]">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link href={href} className="text-[15px] text-[#5B5768] transition-colors hover:text-[#121018]">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-[15px] text-[#5B5768] transition-colors hover:text-[#121018]">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p aria-hidden="true" className="pointer-events-none mt-12 select-none text-center text-[18vw] font-semibold leading-[0.8] tracking-[-0.07em] text-[#121018]/[0.06] lg:text-[260px]">
          digicardo
        </p>
        <div className="relative mt-6 flex flex-col items-start justify-between gap-3 border-t border-[#121018]/10 pt-6 text-[13px] text-[#8D8998] sm:flex-row sm:items-center sm:pr-48">
          <span suppressHydrationWarning>© {new Date().getFullYear()} Digicardo. All rights reserved.</span>
          <span>Made in India · Share by link, QR &amp; NFC</span>
        </div>
      </div>
    </footer>
  );
}
