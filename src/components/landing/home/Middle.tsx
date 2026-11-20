"use client";

import * as React from "react";
import {
  Briefcase,
  CalendarCheck,
  Camera,
  Coffee,
  Dumbbell,
  Eye,
  Home,
  IndianRupee,
  MessageCircle,
  Scale,
  Scissors,
  ShoppingBag,
  Stethoscope,
  Store,
  UserPlus,
  Wrench,
} from "lucide-react";
import { TemplatePhone, type ExampleTemplate } from "@/components/marketing/TemplatePhone";
import { TEMPLATE_MANIFESTS } from "@/templates/manifests";
import { cn } from "@/lib/utils";
import { Reveal } from "./shared";
import { C, Pill, display } from "./Top";

// ── Analytics (lavender) ───────────────────────────────────────────────────────────

export function AnalyticsSection() {
  return (
    <section className="py-20 sm:py-32" style={{ background: C.lavender }}>
      <div className="mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <div aria-hidden="true" className="mx-auto grid max-w-[520px] grid-cols-5 gap-3">
            <div className="col-span-3 flex items-center gap-4 rounded-[28px] p-5" style={{ background: "#2E2563" }}>
              <svg viewBox="0 0 120 60" className="hidden h-16 w-28 shrink-0 sm:block">
                <polyline points="0,50 18,40 32,46 48,22 64,30 80,12 98,20 120,4" fill="none" stroke={C.lime} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-3xl font-extrabold tracking-tight" style={{ color: C.lime }}>
                  1,284
                </p>
                <p className="text-sm font-semibold text-white/80">Card views</p>
              </div>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center rounded-[28px] p-5 text-center" style={{ background: C.pink }}>
              <UserPlus className="h-7 w-7" style={{ color: C.plum }} />
              <p className="mt-2 text-3xl font-extrabold tracking-tight" style={{ color: C.plum }}>
                312
              </p>
              <p className="text-sm font-semibold" style={{ color: C.plum }}>
                Contacts saved
              </p>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center rounded-[28px] p-5 text-center" style={{ background: "#C026D3" }}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 text-white">
                <IndianRupee className="h-5 w-5" />
              </span>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">₹48k</p>
              <p className="text-sm font-semibold text-white/85">UPI payments</p>
            </div>
            <div className="col-span-3 flex items-center justify-between rounded-[28px] p-5" style={{ background: C.violet }}>
              <div className="grid grid-cols-6 gap-1.5">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i} className="h-3 w-3 rounded-full" style={{ background: i % 4 === 0 ? C.lime : "#ffffff40" }} />
                ))}
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold tracking-tight text-white">96</p>
                <p className="text-sm font-semibold text-white/85">WhatsApp taps</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs font-medium" style={{ color: "#6B6390" }}>
            Example numbers — your dashboard shows your own.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className={cn("text-[44px] sm:text-[64px]", display)} style={{ color: C.ink }}>
            See who&apos;s interested
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8" style={{ color: "#3F3B52" }}>
            Track views, saved contacts, WhatsApp taps and payments. Find out which flyer, post or event brought people in — and every
            enquiry lands in your inbox.
          </p>
          <Pill href="/register" className="mt-9" style={{ background: C.ink, color: "#fff" }}>
            Get started
          </Pill>
        </Reveal>
      </div>
    </section>
  );
}

// ── Made for (cream) ───────────────────────────────────────────────────────────────

const WORDS: { word: string; color: string }[] = [
  { word: "doctor", color: "#2F6BFF" },
  { word: "salon", color: "#D63AAE" },
  { word: "shop", color: "#1FAF5A" },
  { word: "consultant", color: "#5B3FE4" },
  { word: "restaurant", color: "#E8590C" },
];

const TILES: { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; fg: string; shape: string }[] = [
  { label: "Clinics", icon: Stethoscope, bg: "#2F6BFF", fg: "#fff", shape: "rounded-[36px]" },
  { label: "Salons & spas", icon: Scissors, bg: "#F6B6E6", fg: "#3D0C45", shape: "rounded-full" },
  { label: "Real estate", icon: Home, bg: "#1C1245", fg: "#DAF56B", shape: "rounded-[36px]" },
  { label: "Cafés", icon: Coffee, bg: "#E8590C", fg: "#fff", shape: "rounded-[120px_36px_120px_36px]" },
  { label: "Retail", icon: Store, bg: "#DAF56B", fg: "#1C1245", shape: "rounded-full" },
  { label: "Service centres", icon: Wrench, bg: "#5B3FE4", fg: "#fff", shape: "rounded-[36px]" },
  { label: "Lawyers", icon: Scale, bg: "#3D0C45", fg: "#F6B6E6", shape: "rounded-[36px_120px_36px_120px]" },
  { label: "Trainers", icon: Dumbbell, bg: "#1FAF5A", fg: "#fff", shape: "rounded-full" },
  { label: "Photographers", icon: Camera, bg: "#111015", fg: "#fff", shape: "rounded-[36px]" },
  { label: "Freelancers", icon: Briefcase, bg: "#ECE8FD", fg: "#1C1245", shape: "rounded-full" },
];

function RotatingWord() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2200);
    return () => window.clearInterval(t);
  }, []);
  const w = WORDS[i];
  return (
    <span key={w.word} className="inline-block motion-safe:animate-card-slide" style={{ color: w.color }}>
      {w.word}
    </span>
  );
}

export function MadeForSection() {
  const row = [...TILES, ...TILES];
  return (
    <section className="overflow-hidden pb-10 pt-20 sm:pt-32" style={{ background: C.cream }}>
      <h2 className={cn("mx-auto max-w-4xl px-4 text-center text-[40px] sm:text-[60px]", display)} style={{ color: C.ink }}>
        The smart business card for every <RotatingWord />
      </h2>
      <div className="mt-14 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
        <ul className="flex w-max gap-4 motion-safe:animate-marquee hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <li
              key={`${t.label}-${i}`}
              aria-hidden={i >= TILES.length}
              className={cn("flex h-[220px] w-[200px] shrink-0 flex-col items-center justify-center gap-4 sm:h-[260px] sm:w-[240px]", t.shape)}
              style={{ background: t.bg, color: t.fg }}
            >
              <t.icon className="h-12 w-12" />
              <span className="text-lg font-bold">{t.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Bento (cream) ──────────────────────────────────────────────────────────────────

export function BentoSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20" style={{ background: C.cream }}>
      <div className="mx-auto grid grid-cols-1 max-w-[1240px] gap-4 lg:grid-cols-2">
        <div className="grid gap-4">
          <Reveal>
            <div className="flex h-full flex-col justify-between gap-8 rounded-[32px] p-8" style={{ background: C.pink }}>
              <div aria-hidden="true" className="space-y-2.5">
                {[
                  ["TV repair", "From ₹499"],
                  ["AC service", "₹1,499"],
                  ["Home consultation", "₹2,500"],
                ].map(([name, price], i) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3" style={{ marginLeft: i * 18 }}>
                    <span className="flex items-center gap-2.5 font-semibold" style={{ color: C.plum }}>
                      <ShoppingBag className="h-4 w-4" />
                      {name}
                    </span>
                    <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: C.plum, color: C.pink }}>
                      {price}
                    </span>
                  </div>
                ))}
              </div>
              <h3 className="text-[26px] font-bold leading-tight tracking-[-0.02em]" style={{ color: C.plum }}>
                Show your services and products with prices
              </h3>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-[32px] p-8" style={{ background: C.lime }}>
              <div aria-hidden="true" className="flex items-center gap-4 rounded-3xl bg-white p-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: C.ink, color: C.lime }}>
                  <IndianRupee className="h-7 w-7" />
                </span>
                <div className="flex-1">
                  <p className="text-lg font-bold" style={{ color: C.ink }}>
                    Pay with UPI
                  </p>
                  <p className="text-sm text-[#6B6390]">GPay · PhonePe · Paytm · BHIM</p>
                </div>
              </div>
              <h3 className="text-[26px] font-bold leading-tight tracking-[-0.02em]" style={{ color: C.ink }}>
                Get paid on the spot, straight from your card
              </h3>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="flex h-full min-h-[520px] flex-col justify-between gap-8 overflow-hidden rounded-[32px] p-8" style={{ background: "#1B1F8F" }}>
            <div aria-hidden="true" className="relative mx-auto h-[360px] w-full max-w-[420px]">
              <div className="absolute left-0 top-0 w-[250px] rounded-[28px] bg-white p-5 shadow-2xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F8EE] text-[#16A34A]">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1C1245]">New enquiry</p>
                    <p className="text-xs text-[#6B6390]">via WhatsApp</p>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl bg-[#F4F2EC] p-3 text-sm text-[#3F3B52]">Hi! Is the TV repair available this Saturday?</p>
              </div>
              <div className="absolute bottom-0 right-0 w-[240px] rounded-[28px] p-5 shadow-2xl" style={{ background: C.lime }}>
                <CalendarCheck className="h-7 w-7" style={{ color: C.ink }} />
                <p className="mt-3 text-3xl font-extrabold tracking-tight" style={{ color: C.ink }}>
                  Book now
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: "#2E2563" }}>
                  Opens WhatsApp with your booking message
                </p>
              </div>
              <div className="absolute right-6 top-6 flex h-20 w-20 items-center justify-center rounded-full text-white" style={{ background: "#D63AAE" }}>
                <Eye className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-white">Bookings and enquiries come straight to your WhatsApp</h3>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Templates (cream) ──────────────────────────────────────────────────────────────

const TEMPLATE_TABS: { id: ExampleTemplate; color: string; best: string }[] = [
  { id: "vcard", color: "#0F766E", best: "Professionals & freelancers" },
  { id: "showcase", color: "#2F3A9E", best: "Shops, service centres & clinics" },
  { id: "botanical", color: "#2D6A4F", best: "Doctors, consultants & executives" },
];

export function TemplatesSection() {
  const [active, setActive] = React.useState<ExampleTemplate>("showcase");
  const tab = TEMPLATE_TABS.find((t) => t.id === active)!;
  const manifest = TEMPLATE_MANIFESTS[active];
  return (
    <section id="templates" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28" style={{ background: C.cream }}>
      <div className="mx-auto max-w-[1240px]">
        <h2 className={cn("mx-auto max-w-3xl text-center text-[40px] sm:text-[60px]", display)} style={{ color: C.ink }}>
          Pick a look. Switch any time.
        </h2>
        <div role="tablist" aria-label="Templates" className="mx-auto mt-10 flex w-fit flex-wrap justify-center gap-2">
          {TEMPLATE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn("h-12 rounded-full px-6 text-[15px] font-semibold transition-colors", active === t.id ? "text-white" : "bg-white text-[#1C1245] hover:bg-[#EAE8E1]")}
              style={active === t.id ? { background: C.ink } : undefined}
            >
              {TEMPLATE_MANIFESTS[t.id].name}
            </button>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 items-center gap-10 rounded-[40px] p-6 sm:p-12 lg:grid-cols-2" style={{ background: tab.color }}>
          <div className="mx-auto">
            <div key={active} className="motion-safe:animate-card-scale">
              <TemplatePhone template={active} width={290} className="shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">Best for {tab.best.toLowerCase()}</p>
            <h3 className={cn("mt-3 text-[44px] sm:text-[56px]", display)}>{manifest.name}</h3>
            <p className="mt-4 max-w-md text-lg leading-8 text-white/85">{manifest.description}</p>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Colour presets">
              {manifest.presets.map((p) => (
                <span key={p.id} title={p.name} className="h-8 w-8 rounded-full border-[3px] border-white/80" style={{ background: p.tokens.color_accent }} />
              ))}
            </div>
            <Pill href="/register" className="mt-8" style={{ background: "#fff", color: C.ink }}>
              Start with {manifest.name}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
