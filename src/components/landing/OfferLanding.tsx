"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Link2, MapPin, MessageCircle, Pencil, Phone, Play, QrCode, Share2, Smartphone, Volume2, VolumeX } from "lucide-react";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { trackMeta } from "@/components/analytics/MetaPixel";
import { cn } from "@/lib/utils";

/**
 * Meta ad landing page (/offer): Malayalam, mobile-first, one goal — start a WhatsApp chat.
 * WhatsApp taps are reported to the Meta Pixel as "Contact" (and "Lead" for the main button).
 */

const WA_NUMBER = "918593048536";
const WA_TEXT = encodeURIComponent("Hi Digicardo 👋 എനിക്ക് ₹799 ഡിജിറ്റൽ വിസിറ്റിംഗ് കാർഡ് വേണം.");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`;
const EASE = [0.22, 1, 0.36, 1] as const;

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.09-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.08-.8.38-.27.3-1.05 1.03-1.05 2.51 0 1.48 1.08 2.91 1.23 3.11.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 1.89.52 3.66 1.44 5.17L2.05 21.66a.8.8 0 0 0 .99.99l4.57-1.38A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-8 10a8 8 0 1 1 14.32 4.91.8.8 0 0 0-.1.62l.85 2.8-2.84-.86a.8.8 0 0 0-.62.1A7.96 7.96 0 0 1 12 20a8 8 0 0 1-8-8z" />
    </svg>
  );
}

function WaButton({ children, className, place }: { children: React.ReactNode; className?: string; place: string }) {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackMeta("Contact", { content_name: "digital_card_799", placement: place });
        if (place === "hero" || place === "price") trackMeta("Lead", { content_name: "digital_card_799", value: 799, currency: "INR" });
      }}
      className={cn(
        "inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 text-[17px] font-bold text-white shadow-[0_18px_40px_-14px_rgba(37,211,102,.8)] transition-transform hover:-translate-y-0.5 active:translate-y-0",
        className,
      )}
    >
      <WhatsAppGlyph className="h-6 w-6" />
      {children}
    </a>
  );
}

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function AdVideo() {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = React.useState(true);
  const [playing, setPlaying] = React.useState(true);
  return (
    <div className="relative mx-auto w-[260px] sm:w-[290px]">
      <div className="rounded-[42px] bg-[#0b0b10] p-[9px] shadow-[0_50px_90px_-30px_rgba(0,0,0,.8),0_0_0_2px_#2a2a33_inset]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[34px] bg-black">
          <video
            ref={ref}
            src="/landing/ad-799.mp4"
            poster="/landing/ad-799-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="h-full w-full object-cover"
          />
          {!playing && (
            <button type="button" onClick={() => ref.current?.play()} aria-label="Play video" className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[#121018]">
                <Play className="ml-1 h-7 w-7" aria-hidden="true" />
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const v = ref.current;
              if (!v) return;
              v.muted = !v.muted;
              setMuted(v.muted);
              if (!v.muted) {
                v.currentTime = 0;
                void v.play();
              }
            }}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-2 text-[12px] font-semibold text-white backdrop-blur"
          >
            {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
            {muted ? "ശബ്ദം ഓൺ" : "ശബ്ദം ഓഫ്"}
          </button>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Phone, title: "ഒറ്റ ടാപ്പിൽ കോൾ", text: "നമ്പർ ടൈപ്പ് ചെയ്യേണ്ട" },
  { icon: MessageCircle, title: "WhatsApp", text: "നേരിട്ട് ചാറ്റ് ചെയ്യാം" },
  { icon: MapPin, title: "ലൊക്കേഷൻ", text: "Google Maps-ൽ വഴി" },
  { icon: Smartphone, title: "UPI പേയ്മെന്റ്", text: "കാർഡിൽ നിന്ന് തന്നെ പണം" },
  { icon: QrCode, title: "QR കോഡ്", text: "ഷോപ്പിൽ വെക്കാം, സ്കാൻ ചെയ്യാം" },
  { icon: Pencil, title: "എപ്പോഴും മാറ്റാം", text: "നമ്പർ മാറിയാലും പ്രിന്റിംഗ് വേണ്ട" },
];

const STEPS = [
  { n: "1", title: "WhatsApp ചെയ്യൂ", text: "നിങ്ങളുടെ പേര്, ബിസിനസ്, നമ്പർ അയക്കൂ." },
  { n: "2", title: "ഞങ്ങൾ കാർഡ് ഉണ്ടാക്കും", text: "സാധാരണ ഒരു പ്രവൃത്തി ദിവസത്തിനുള്ളിൽ റെഡി." },
  { n: "3", title: "ഷെയർ ചെയ്യൂ", text: "WhatsApp-ൽ ലിങ്ക് അയക്കാം, QR സ്കാൻ ചെയ്യിക്കാം." },
];

const INCLUDED = [
  "നിങ്ങളുടെ സ്വന്തം ഡിജിറ്റൽ വിസിറ്റിംഗ് കാർഡ്",
  "സ്വന്തം ലിങ്ക് + QR കോഡ്",
  "കോൾ, WhatsApp, ഇമെയിൽ, ലൊക്കേഷൻ, UPI ബട്ടണുകൾ",
  "സർവീസുകൾ, ഫോട്ടോ ഗാലറി, സോഷ്യൽ ലിങ്കുകൾ",
  "എപ്പോൾ വേണമെങ്കിലും എഡിറ്റ് ചെയ്യാം",
  "ആര് കാർഡ് കണ്ടു എന്ന് അറിയാം",
];

const FAQS = [
  { q: "കസ്റ്റമർക്ക് ആപ്പ് വേണോ?", a: "വേണ്ട. ഏത് ഫോണിലും ബ്രൗസറിൽ കാർഡ് തുറക്കും." },
  { q: "പിന്നീട് വിവരങ്ങൾ മാറ്റാമോ?", a: "മാറ്റാം. ഡാഷ്ബോർഡിൽ എഡിറ്റ് ചെയ്താൽ ഉടൻ കാർഡിൽ വരും. ലിങ്കും QR-ഉം മാറില്ല." },
  { q: "എങ്ങനെ ഷെയർ ചെയ്യാം?", a: "ലിങ്ക് WhatsApp-ൽ അയക്കാം, QR കോഡ് ഷോപ്പിലോ ബില്ലിലോ വെക്കാം." },
  { q: "എങ്ങനെ ഓർഡർ ചെയ്യാം?", a: "താഴെയുള്ള WhatsApp ബട്ടൺ അമർത്തി മെസേജ് അയക്കൂ. ഞങ്ങൾ സഹായിക്കും." },
];

const TEMPLATES = ["tpl-classic", "tpl-showcase", "tpl-botanical", "tpl-motion"];

export function OfferLanding() {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState<number | null>(0);
  const [showBar, setShowBar] = React.useState(false);
  React.useEffect(() => {
    const on = () => setShowBar(window.scrollY > 520);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div lang="ml" className="min-h-screen overflow-x-clip bg-[#0E0B1F] font-sans text-white antialiased">
      {/* top bar */}
      <header className="mx-auto flex max-w-[1100px] items-center justify-between px-5 pt-5">
        <Link href="/" aria-label="Digicardo home">
          <DigicardoLogo size="md" wordmarkClassName="text-white" />
        </Link>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackMeta("Contact", { placement: "header" })} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-4 text-[14px] font-semibold ring-1 ring-white/15">
          <WhatsAppGlyph className="h-4 w-4 text-[#25D366]" /> ചാറ്റ്
        </a>
      </header>

      {/* hero */}
      <section className="relative mx-auto grid max-w-[1100px] items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#5B3FE4]/35 blur-[120px]" />
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="relative text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#DAF56B] px-3.5 py-1.5 text-[13px] font-bold text-[#121018]">🔥 ഓഫർ · വെറും ₹799</span>
          <h1 className="mt-5 text-[38px] font-bold leading-[1.2] sm:text-[52px]">
            ഇപ്പോഴും <span className="text-[#FF5A64] line-through decoration-[3px]">പേപ്പർ കാർഡ്</span> ആണോ?
            <br />
            ഇനി <span className="text-[#DAF56B]">ഡിജിറ്റൽ</span> ആവാം!
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-8 text-white/75 lg:mx-0">
            ഒരു ലിങ്കിൽ നിങ്ങളുടെ ബിസിനസ് മുഴുവൻ — കോൾ, WhatsApp, ലൊക്കേഷൻ, UPI. ആപ്പ് വേണ്ട, പ്രിന്റിംഗ് വേണ്ട.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <WaButton place="hero">ഇപ്പോൾ WhatsApp ചെയ്യൂ</WaButton>
            <a href="#demo" className="inline-flex h-14 items-center rounded-full px-6 text-[16px] font-semibold text-white/85 ring-1 ring-white/20 hover:bg-white/5">
              ഡെമോ കാണൂ ↓
            </a>
          </div>
          <p className="mt-4 text-[13px] text-white/55">💬 WhatsApp: 85930 48536</p>
        </motion.div>
        <motion.div id="demo" initial={reduce ? false : { opacity: 0, y: 40, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.15 }} className="relative scroll-mt-6">
          <AdVideo />
        </motion.div>
      </section>

      {/* features */}
      <section className="bg-[#F6F6F3] px-5 py-16 text-[#121018] sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <h2 className="text-center text-[30px] font-bold leading-tight sm:text-[40px]">
              എല്ലാം <span className="text-[#5B3FE4]">ഒറ്റ പേജിൽ</span> ✨
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-[16px] text-[#6B6779]">കസ്റ്റമർക്ക് വേണ്ടതെല്ലാം ഒരു ടാപ്പ് അകലെ.</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <div className="h-full rounded-[22px] bg-white p-5 shadow-[0_10px_30px_-20px_rgba(18,16,24,.35)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5B3FE4]/10 text-[#5B3FE4]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-[16px] font-bold">{title}</p>
                  <p className="mt-1 text-[13.5px] leading-5 text-[#6B6779]">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* templates */}
      <section className="bg-[#F6F6F3] pb-16 text-[#121018] sm:pb-20">
        <Reveal className="px-5">
          <h2 className="text-center text-[28px] font-bold sm:text-[36px]">നിങ്ങൾക്ക് ഇഷ്ടമുള്ള ഡിസൈൻ</h2>
        </Reveal>
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:justify-center">
          {TEMPLATES.map((t, i) => (
            <Reveal key={t} delay={i * 0.08} className="shrink-0 snap-center">
              <div className="w-[180px] overflow-hidden rounded-[28px] border-[5px] border-[#121018] bg-white shadow-[0_30px_50px_-30px_rgba(18,16,24,.6)] sm:w-[200px]">
                <Image src={`/landing/${t}.webp`} alt="Digicardo card template" width={780} height={1688} sizes="200px" className="h-[340px] w-full object-cover object-top sm:h-[380px]" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <Reveal>
            <h2 className="text-center text-[30px] font-bold sm:text-[40px]">
              വെറും <span className="text-[#DAF56B]">3 സ്റ്റെപ്പ്</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="h-full rounded-[22px] bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DAF56B] text-[18px] font-bold text-[#121018]">{s.n}</span>
                  <p className="mt-4 text-[18px] font-bold">{s.title}</p>
                  <p className="mt-1.5 text-[14px] leading-6 text-white/70">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* price */}
      <section className="px-5 pb-16 sm:pb-20">
        <Reveal className="mx-auto max-w-[460px]">
          <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#6E52F5,#4B30D6_55%,#2A1690)] p-7 text-center shadow-[0_40px_80px_-40px_rgba(91,63,228,.9)] sm:p-9">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold">ഡിജിറ്റൽ വിസിറ്റിംഗ് കാർഡ്</span>
            <p className="mt-4 text-[18px] text-white/80">വെറും</p>
            <p className="font-sans text-[84px] font-extrabold leading-none tracking-[-0.05em] text-[#DAF56B]">₹799</p>
            <p className="mt-1 text-[18px] font-bold">മാത്രം! 🔥</p>
            <ul className="mt-6 space-y-2.5 text-left">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15px]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DAF56B] text-[#121018]">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <WaButton place="price" className="mt-8 w-full">
              ₹799 കാർഡ് ഓർഡർ ചെയ്യൂ
            </WaButton>
          </div>
        </Reveal>
      </section>

      {/* faq */}
      <section className="bg-[#F6F6F3] px-5 py-16 text-[#121018] sm:py-20">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-center text-[28px] font-bold sm:text-[36px]">സംശയങ്ങൾ</h2>
          <div className="mt-8 space-y-2.5">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="overflow-hidden rounded-[20px] bg-white">
                  <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-bold">
                    {f.q}
                    <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                  <div className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[15px] leading-7 text-[#6B6779]">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* final cta */}
      <section className="px-5 pb-32 pt-16 text-center sm:pb-24">
        <Reveal>
          <h2 className="text-[30px] font-bold leading-tight sm:text-[40px]">
            ഇന്ന് തന്നെ <span className="text-[#DAF56B]">ഡിജിറ്റൽ</span> ആവൂ!
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-white/70">ഒരു മെസേജ് മതി. ബാക്കി ഞങ്ങൾ ചെയ്യാം.</p>
          <div className="mt-7 flex flex-col items-center gap-3">
            <WaButton place="final">WhatsApp ചെയ്യൂ</WaButton>
            <a href="tel:+918593048536" onClick={() => trackMeta("Contact", { placement: "call" })} className="inline-flex items-center gap-2 text-[15px] font-semibold text-white/80">
              <Phone className="h-4 w-4" aria-hidden="true" /> അല്ലെങ്കിൽ വിളിക്കൂ: 85930 48536
            </a>
          </div>
          <div className="mt-10 flex items-center justify-center gap-4 text-[13px] text-white/45">
            <span className="inline-flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" aria-hidden="true" /> ലിങ്ക്</span>
            <span className="inline-flex items-center gap-1.5"><QrCode className="h-3.5 w-3.5" aria-hidden="true" /> QR</span>
            <span className="inline-flex items-center gap-1.5"><Share2 className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp</span>
          </div>
        </Reveal>
      </section>

      {/* sticky mobile bar */}
      <div className={cn("fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0E0B1F]/95 p-3 backdrop-blur transition-transform duration-300 sm:hidden", showBar ? "translate-y-0" : "translate-y-full")}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-white/60">ഡിജിറ്റൽ കാർഡ്</p>
            <p className="font-sans text-[22px] font-extrabold leading-none text-[#DAF56B]">₹799</p>
          </div>
          <WaButton place="sticky" className="h-12 px-5 text-[15px]">
            WhatsApp ചെയ്യൂ
          </WaButton>
        </div>
      </div>
    </div>
  );
}
