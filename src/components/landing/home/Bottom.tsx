"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown, MessageCircle, Phone } from "lucide-react";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { cn } from "@/lib/utils";
import { Reveal } from "./shared";
import { C, ClaimForm, Pill, display } from "./Top";

// ── Pricing (white) ────────────────────────────────────────────────────────────────

const FEATURES = [
  "Your own digital business card",
  "Every template and colour",
  "Share by link, QR code and NFC",
  "Edit any time — live instantly",
  "Visitor stats and enquiry inbox",
];

export function PricingSection() {
  const plans = [
    { id: "1year", name: "1 Year", price: "₹1,000", unit: "per year", extra: "12 months of access", bg: "#fff", fg: C.ink, accent: C.violet, button: { background: C.ink, color: "#fff" }, ring: true },
    { id: "lifetime", name: "Lifelong", price: "₹4,000", unit: "one time", extra: "Lifetime access + all future updates", bg: C.violet, fg: "#fff", accent: C.lime, button: { background: C.lime, color: C.ink }, ring: false },
  ];
  return (
    <section id="pricing" className="scroll-mt-28 bg-white px-4 py-20 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[1240px]">
        <h2 className={cn("mx-auto max-w-3xl text-center text-[40px] sm:text-[60px]", display)} style={{ color: C.ink }}>
          Simple pricing. Every feature.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-lg" style={{ color: "#3F3B52" }}>
          Both plans include everything — choose how long you want your card.
        </p>
        <div className="mx-auto mt-14 grid grid-cols-1 max-w-4xl gap-5 md:grid-cols-2">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <div className={cn("relative flex h-full flex-col rounded-[36px] p-8 sm:p-10", p.ring && "ring-2 ring-[#ECE8FD]")} style={{ background: p.bg, color: p.fg }}>
                {p.id === "lifetime" && (
                  <span className="absolute right-6 top-6 rounded-full px-3 py-1 text-sm font-bold" style={{ background: C.lime, color: C.ink }}>
                    Best value
                  </span>
                )}
                <p className="text-xl font-bold">{p.name}</p>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-6xl font-extrabold tracking-[-0.05em]">{p.price}</span>
                  <span className="text-base font-medium opacity-70">{p.unit}</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3.5">
                  {[...FEATURES, p.extra].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[16px] font-medium">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: p.accent, color: p.id === "lifetime" ? C.ink : "#fff" }}>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Pill href={`/register?plan=${p.id}`} className="mt-10 w-full" style={p.button}>
                  Get the {p.name} plan
                </Pill>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ (dark) ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How does Digicardo work?",
    a: "You get a digital business card with its own link and QR code. When someone opens it — from the link, the QR code or an NFC card — they can save your contact, call or WhatsApp you, see your services and pay you.",
  },
  { q: "Do my customers need an app?", a: "No. Your card opens in the web browser on any phone, tablet or computer." },
  {
    q: "Can I change my details after I've shared my card?",
    a: "Yes. Edit anything from your dashboard and it updates on your live card straight away. Your link and QR code stay the same, so there's nothing to reprint.",
  },
  {
    q: "What's the difference between the 1 Year and Lifelong plans?",
    a: "They include the same features. The 1 Year plan is ₹1,000 for 12 months; the Lifelong plan is a one-time ₹4,000 with all future updates included.",
  },
  {
    q: "Can I use a physical NFC card?",
    a: "Yes. Your card's link can be written to any standard NFC card or tag, so a tap on a phone opens your card. Contact us for custom-printed NFC cards.",
  },
  { q: "Can I switch templates later?", a: "Any time. All templates show the same details, so switching only changes the look — nothing needs retyping." },
];

export function FaqSection() {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <section id="faqs" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-32" style={{ background: C.plum }}>
      <h2 className={cn("text-center text-[44px] sm:text-[64px]", display)} style={{ color: C.pink }}>
        Questions? Answered
      </h2>
      <div className="mx-auto mt-12 max-w-[820px] space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="overflow-hidden rounded-[24px]" style={{ background: "#2A0830" }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left text-[17px] font-semibold sm:px-8"
                style={{ color: C.pink }}
              >
                {f.q}
                <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
              </button>
              <div className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-[16px] leading-7 text-white/80 sm:px-8">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Contact (lime) ─────────────────────────────────────────────────────────────────

const WA_TEXT = encodeURIComponent("Hi Digicardo, I'd like to know more about the digital business card.");
const CONTACTS = [
  { label: "Support & custom cards", text: "Card setup, NFC card orders and help.", tel: "+918593048536", wa: "918593048536", display: "+91 85930 48536" },
  { label: "Sales & enquiries", text: "Plans, team and bulk orders.", tel: "+919526390381", wa: "919526390381", display: "+91 95263 90381" },
];

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28" style={{ background: C.lime }}>
      <div className="mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className={cn("text-[44px] sm:text-[64px]", display)} style={{ color: C.ink }}>
            Talk to a real person
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8" style={{ color: "#2E2563" }}>
            Message us on WhatsApp or call. We&apos;ll help you pick a plan, set up your card or order NFC cards for your team.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CONTACTS.map((c) => (
            <div key={c.wa} className="flex flex-col rounded-[32px] bg-white p-7">
              <p className="text-lg font-bold" style={{ color: C.ink }}>
                {c.label}
              </p>
              <p className="mt-1 text-[15px] text-[#5B5670]">{c.text}</p>
              <p className="mt-6 text-[26px] font-extrabold tracking-[-0.03em]" style={{ color: C.ink }}>
                {c.display}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${c.wa}?text=${WA_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
                <a href={`tel:${c.tel}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#EFEEE9] font-semibold" style={{ color: C.ink }}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final call to action + footer (violet) ─────────────────────────────────────────

export function FinalSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-24 sm:px-6 sm:pt-32" style={{ background: C.violet }}>
      <div aria-hidden="true" className="absolute -left-24 top-16 hidden h-80 w-80 rounded-full sm:block" style={{ background: "#7B61FF" }} />
      <div aria-hidden="true" className="absolute -right-20 top-40 hidden h-56 w-56 rotate-12 rounded-[48px] sm:block" style={{ background: C.pink }} />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className={cn("text-[44px] sm:text-[72px]", display)} style={{ color: C.lime }}>
          Start sharing smarter today
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">Claim your card name before someone else does. It takes about a minute.</p>
        <ClaimForm className="mx-auto mt-9" buttonStyle={{ background: C.lime, color: C.ink }} />
      </div>

      <footer className="relative mx-auto mt-24 max-w-[1240px] rounded-[36px] bg-white p-8 sm:p-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <DigicardoLogo size="md" />
            <p className="mt-4 max-w-xs text-[15px] leading-6 text-[#5B5670]">Digital business cards and NFC cards for people who meet customers.</p>
          </div>
          {[
            { title: "Product", links: [["Features", "#features"], ["Templates", "#templates"], ["Pricing", "#pricing"]] },
            { title: "Support", links: [["FAQ", "#faqs"], ["Contact us", "#contact"], ["WhatsApp us", `https://wa.me/918593048536?text=${WA_TEXT}`]] },
            { title: "Accounts", links: [["Log in", "/login"], ["Agent log in", "/agent-login"], ["Get your card", "/register"]] },
          ].map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[15px] font-bold" style={{ color: C.ink }}>
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link href={href} className="text-[15px] text-[#5B5670] hover:text-[#1C1245]">
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-[15px] text-[#5B5670] hover:text-[#1C1245]"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[#EFEEE9] pt-6 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <Link href="/login" className="inline-flex h-11 items-center rounded-xl bg-[#EFEEE9] px-5 text-[15px] font-semibold" style={{ color: C.ink }}>
              Log in
            </Link>
            <Link href="/register" className="inline-flex h-11 items-center rounded-full px-5 text-[15px] font-semibold" style={{ background: C.lime, color: C.ink }}>
              Get your card
            </Link>
          </div>
          <span suppressHydrationWarning className="text-sm text-[#8C879C]">
            © {new Date().getFullYear()} Digicardo. All rights reserved.
          </span>
        </div>
      </footer>
    </section>
  );
}
