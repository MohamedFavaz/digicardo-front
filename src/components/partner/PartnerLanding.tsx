import * as React from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Quote,
  Sparkles,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import { partnerThemeVars, whatsappLink, type PartnerCard, type PartnerContent, type PartnerSectionKey } from "@/lib/partner/types";
import { PartnerPhone, SAMPLE_CARDS } from "./PartnerPhone";
import { PartnerLeadForm } from "./PartnerLeadForm";

/**
 * An agent's landing page. Pure presentation of `content` (+ the cards it showcases), styled by
 * one of four designs through --lp-* variables. Used by the public page and the editor preview.
 */

const wrap = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";
const section = "py-[clamp(72px,9vw,128px)]";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lp-line)] bg-[var(--lp-surface)] px-3 py-1 text-[12px] font-medium text-[var(--lp-ink2)]">
      <Sparkles className="h-3.5 w-3.5 text-[var(--lp-accent)]" aria-hidden="true" />
      {children}
    </span>
  );
}

function SectionHead({ eyebrow, title, subtitle, center }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-[clamp(30px,4.2vw,52px)] font-light leading-[1.08] tracking-[-0.02em] text-[var(--lp-ink)]">{title}</h2>
      {subtitle && <p className="mt-4 text-[17px] leading-relaxed text-[var(--lp-ink2)]">{subtitle}</p>}
    </div>
  );
}

/** Primary pill button with the white arrow circle (Nestly style). */
function PillCta({ href, children, newTab }: { href: string; children: React.ReactNode; newTab?: boolean }) {
  return (
    <a
      href={href}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--lp-accent)] pl-6 pr-2 text-[15px] font-medium text-[var(--lp-accent-ink)] shadow-[0_16px_30px_-16px_var(--lp-accent)] transition-transform hover:scale-[1.02]"
    >
      {children}
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lp-accent-ink)] text-[var(--lp-accent)] transition-transform group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </a>
  );
}

function GhostCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex h-14 items-center gap-2 rounded-full border border-[var(--lp-line)] bg-[var(--lp-surface)] px-6 text-[15px] font-medium text-[var(--lp-ink)] transition-colors hover:border-[var(--lp-ink2)]"
    >
      {children}
      <ArrowDown className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function BrandMark({ content, size = 36 }: { content: PartnerContent; size?: number }) {
  const logo = content.brand.logo_url ? resolveMediaUrl(content.brand.logo_url) : null;
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element -- agent logo
    return <img src={logo} alt="" style={{ width: size, height: size }} className="rounded-xl object-cover" />;
  }
  return (
    <span style={{ width: size, height: size }} className="flex items-center justify-center rounded-xl bg-[var(--lp-accent)] text-[15px] font-semibold text-[var(--lp-accent-ink)]">
      {content.brand.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

const NAV_LABELS: Partial<Record<PartnerSectionKey, [string, string]>> = {
  about: ["about", "About"],
  packages: ["pricing", "Pricing"],
  showcase: ["work", "Our work"],
  faq: ["faq", "FAQ"],
};

export function PartnerLanding({
  content,
  showcase,
  slug,
  preview = false,
}: {
  content: PartnerContent;
  showcase: PartnerCard[];
  slug: string;
  preview?: boolean;
}) {
  const vars = partnerThemeVars(content.theme) as React.CSSProperties;
  const wa = whatsappLink(content.contact.whatsapp, `Hi ${content.brand.name}, I'd like a digital card.`);
  const ctaHref = content.contact.enabled || content.lead_form.enabled ? "#contact" : wa ?? "#";
  const cards = showcase.length > 0 ? showcase : SAMPLE_CARDS;
  const isSample = showcase.length === 0;
  // Decorative phones (hero / about): real cards first, topped up with sample designs so the
  // same card never repeats.
  const heroCards = [...showcase, ...SAMPLE_CARDS].slice(0, 3);
  const heroImage = content.hero.image_url ? resolveMediaUrl(content.hero.image_url) : null;
  const year = new Date().getFullYear();

  const enabled = (k: PartnerSectionKey) => {
    const part = content[k] as { enabled?: boolean };
    if (!part?.enabled) return false;
    if (k === "packages") return content.packages.items.length > 0;
    if (k === "steps") return content.steps.items.length > 0;
    if (k === "testimonials") return content.testimonials.items.length > 0;
    if (k === "faq") return content.faq.items.length > 0;
    return true;
  };
  const navLinks = content.layout.filter((k) => enabled(k) && NAV_LABELS[k]).map((k) => NAV_LABELS[k] as [string, string]);

  const sections: Record<PartnerSectionKey, () => React.ReactNode> = {
    about: () => (
      <section id="about" key="about" className={section}>
        <div className={wrap}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="flex flex-col justify-between rounded-[32px] bg-[var(--lp-surface)] p-7 sm:p-10 lg:col-span-7">
              <SectionHead eyebrow="About us" title={content.about.title} />
              {content.about.text && <p className="mt-6 max-w-xl whitespace-pre-line text-[17px] leading-relaxed text-[var(--lp-ink2)]">{content.about.text}</p>}
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,var(--lp-glow),var(--lp-tint))] lg:col-span-5">
              {content.about.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- agent photo
                <img src={resolveMediaUrl(content.about.image_url)} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-end justify-center gap-3 overflow-hidden pt-10">
                  <PartnerPhone card={heroCards[1]} index={1} className="h-[300px] w-[150px] translate-y-10 -rotate-6" />
                  <PartnerPhone card={heroCards[2]} index={2} className="h-[320px] w-[160px] translate-y-4 rotate-3" />
                </div>
              )}
            </div>
            {content.about.points.map((p, i) => (
              <div key={p + i} className="flex items-start gap-3 rounded-[24px] border border-[var(--lp-line)] bg-[var(--lp-surface)] p-5 sm:col-span-1 lg:col-span-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--lp-soft)] text-[var(--lp-accent)]">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="pt-1.5 text-[15px] font-medium text-[var(--lp-ink)]">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    packages: () => {
      const items = content.packages.items;
      const lead = items.find((p) => p.featured) ?? items[Math.min(1, items.length - 1)];
      return (
        <section id="pricing" key="packages" className={section}>
          <div className={wrap}>
            <SectionHead eyebrow="Pricing" title={content.packages.title} subtitle={content.packages.subtitle} center />
            <div className={`mt-12 grid grid-cols-1 gap-5 ${items.length >= 3 ? "lg:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "mx-auto max-w-md"}`}>
              {items.map((p) => {
                const isLead = p === lead;
                return (
                  <div
                    key={p.id}
                    className={`relative flex flex-col rounded-[32px] p-7 sm:p-8 ${
                      isLead
                        ? "bg-[var(--lp-band)] text-[var(--lp-band-ink)] shadow-[0_40px_70px_-40px_rgba(0,0,0,0.6)] lg:-my-4 lg:py-12"
                        : "border border-[var(--lp-line)] bg-[var(--lp-surface)] text-[var(--lp-ink)]"
                    }`}
                  >
                    {isLead && (
                      <span className="absolute right-6 top-6 rounded-full bg-[var(--lp-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--lp-accent-ink)]">
                        Most popular
                      </span>
                    )}
                    <p className="text-lg font-medium">{p.name}</p>
                    {p.description && <p className={`mt-1 text-sm ${isLead ? "opacity-75" : "text-[var(--lp-ink2)]"}`}>{p.description}</p>}
                    <p className="mt-6 flex items-baseline gap-1.5">
                      <span className="text-[44px] font-light leading-none tracking-tight">{p.price}</span>
                      {p.period && <span className={`text-sm ${isLead ? "opacity-70" : "text-[var(--lp-muted)]"}`}>{p.period}</span>}
                    </p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {p.features.map((f, i) => (
                        <li key={f + i} className="flex items-start gap-2.5 text-[15px]">
                          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isLead ? "bg-[var(--lp-accent)] text-[var(--lp-accent-ink)]" : "bg-[var(--lp-soft)] text-[var(--lp-accent)]"}`}>
                            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                          </span>
                          <span className={isLead ? "" : "text-[var(--lp-ink2)]"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={ctaHref}
                      className={`mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-medium transition-transform hover:scale-[1.02] ${
                        isLead ? "bg-[var(--lp-accent)] text-[var(--lp-accent-ink)]" : "border border-[var(--lp-line)] text-[var(--lp-ink)]"
                      }`}
                    >
                      Choose {p.name || "plan"} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    },

    showcase: () => (
      <section id="work" key="showcase" className={section}>
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Our work" title={content.showcase.title} subtitle={content.showcase.subtitle} />
            {isSample && <span className="rounded-full bg-[var(--lp-soft)] px-3 py-1 text-xs text-[var(--lp-ink2)]">Sample cards</span>}
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.slice(0, 6).map((c, i) => {
              const inner = (
                <>
                  <div className="relative h-[340px] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,var(--lp-glow),var(--lp-soft))]">
                    <div className="absolute inset-x-0 top-8 flex justify-center transition-transform duration-500 group-hover:-translate-y-2">
                      <PartnerPhone card={c} index={i} className="h-[380px] w-[200px]" />
                    </div>
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-[20px] border border-white/40 bg-white/60 p-3 pl-4 backdrop-blur-md">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-medium text-[#121212]">{c.name}</p>
                        <p className="truncate text-xs text-[#5E6054]">{c.role || (c.username ? `/${c.username}` : "")}</p>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#121212]">
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </>
              );
              return c.url && !isSample ? (
                <a key={c.id} href={c.url} target="_blank" rel="noopener" className="group block" aria-label={`Open ${c.name}'s card`}>
                  {inner}
                </a>
              ) : (
                <div key={c.id} className="group">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),

    steps: () => (
      <section id="how" key="steps" className="px-3 sm:px-5">
        <div className="rounded-[40px] bg-[var(--lp-band)] py-[clamp(72px,9vw,120px)] text-[var(--lp-band-ink)]">
          <div className={wrap}>
            <h2 className="max-w-2xl text-[clamp(30px,4.2vw,52px)] font-light leading-[1.08] tracking-[-0.02em]">{content.steps.title}</h2>
            <div className={`mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 ${content.steps.items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {content.steps.items.map((s, i) => (
                <div key={s.id} className="rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur">
                  <span className="text-[56px] font-light leading-none text-[var(--lp-tint)]">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-6 text-xl font-normal">{s.title}</p>
                  {s.text && <p className="mt-2 text-[15px] leading-relaxed opacity-75">{s.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),

    testimonials: () => (
      <section id="reviews" key="testimonials" className={section}>
        <div className={wrap}>
          <SectionHead eyebrow="Reviews" title={content.testimonials.title} center />
          <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {content.testimonials.items.map((t) => (
              <figure key={t.id} className="mb-5 break-inside-avoid rounded-[28px] border border-[var(--lp-line)] bg-[var(--lp-surface)] p-7">
                <Quote className="h-6 w-6 text-[var(--lp-tint)]" aria-hidden="true" />
                <blockquote className="mt-3 text-[17px] leading-relaxed text-[var(--lp-ink)]">{t.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lp-soft)] text-sm font-semibold text-[var(--lp-accent)]">
                    {(t.name || "·").slice(0, 1).toUpperCase()}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-[var(--lp-ink)]">{t.name}</span>
                    {t.role && <span className="block text-xs text-[var(--lp-muted)]">{t.role}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    ),

    faq: () => (
      <section id="faq" key="faq" className={section}>
        <div className={`${wrap} grid grid-cols-1 gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <SectionHead eyebrow="FAQ" title={content.faq.title} />
          </div>
          <div className="space-y-3 lg:col-span-7">
            {content.faq.items.map((q, i) => (
              <details key={q.id} className="group rounded-[24px] border border-[var(--lp-line)] bg-[var(--lp-surface)] px-6 py-5" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-[var(--lp-ink)] [&::-webkit-details-marker]:hidden">
                  {q.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--lp-soft)] text-[var(--lp-accent)] transition-transform group-open:rotate-45">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--lp-ink2)]">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),

    contact: () => {
      const c = content.contact;
      const rows = [
        c.whatsapp && wa ? { icon: MessageCircle, label: "WhatsApp", value: c.whatsapp, href: wa } : null,
        c.phone ? { icon: Phone, label: "Call", value: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, "")}` } : null,
        c.email ? { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` } : null,
        c.address ? { icon: MapPin, label: "Visit", value: c.address, href: c.map_url || `https://maps.google.com/?q=${encodeURIComponent(c.address)}` } : null,
      ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string }[];
      const socials = [
        c.instagram ? { icon: Instagram, href: c.instagram, label: "Instagram" } : null,
        c.facebook ? { icon: Facebook, href: c.facebook, label: "Facebook" } : null,
        c.website ? { icon: Globe, href: c.website, label: "Website" } : null,
      ].filter(Boolean) as { icon: typeof Globe; href: string; label: string }[];
      return (
        <section id="contact" key="contact" className={section}>
          <div className={`${wrap} grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14`}>
            <div>
              <SectionHead eyebrow="Contact" title={c.title} subtitle={c.text} />
              <ul className="mt-8 space-y-3">
                {rows.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-[22px] border border-[var(--lp-line)] bg-[var(--lp-surface)] p-4 transition-colors hover:border-[var(--lp-ink2)]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--lp-soft)] text-[var(--lp-accent)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-[var(--lp-muted)]">{label}</span>
                        <span className="block truncate text-[15px] font-medium text-[var(--lp-ink)]">{value}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[var(--lp-muted)]" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              {socials.length > 0 && (
                <div className="mt-5 flex gap-2">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--lp-line)] bg-[var(--lp-surface)] text-[var(--lp-ink)] hover:border-[var(--lp-ink2)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            {content.lead_form.enabled && <PartnerLeadForm slug={slug} content={content} preview={preview} />}
          </div>
        </section>
      );
    },
  };

  return (
    <div style={vars} className="min-h-screen bg-[var(--lp-bg)] text-[var(--lp-ink)] antialiased [font-family:var(--font-nestly),system-ui,sans-serif]">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 rounded-full border border-[var(--lp-line)] bg-[color-mix(in_srgb,var(--lp-surface)_78%,transparent)] pl-3 pr-2 backdrop-blur-xl">
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <BrandMark content={content} />
            <span className="truncate text-[17px] font-medium tracking-tight">{content.brand.name}</span>
          </a>
          <nav aria-label="Page" className="hidden items-center gap-1 rounded-full bg-[var(--lp-bg)] p-1 md:flex">
            {navLinks.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="rounded-full px-4 py-1.5 text-sm text-[var(--lp-ink2)] transition-colors hover:bg-[var(--lp-surface)] hover:text-[var(--lp-ink)]">
                {label}
              </a>
            ))}
          </nav>
          <a href={ctaHref} className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--lp-accent)] pl-4 pr-1.5 text-sm font-medium text-[var(--lp-accent-ink)]">
            <span className="hidden sm:inline">{content.hero.cta_label}</span>
            <span className="sm:hidden">Contact</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lp-accent-ink)] text-[var(--lp-accent)]">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="top" className="relative -mt-[76px] overflow-hidden pt-[76px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(900px_420px_at_20%_0%,var(--lp-glow),transparent_70%),radial-gradient(700px_380px_at_90%_10%,color-mix(in_srgb,var(--lp-tint)_55%,transparent),transparent_70%)] opacity-90" />
        <div className={`${wrap} relative grid min-h-[min(760px,calc(100svh-76px))] grid-cols-1 items-center gap-12 py-12 lg:grid-cols-12 lg:py-16`}>
          <div className="lg:col-span-6">
            {content.hero.eyebrow && <Eyebrow>{content.hero.eyebrow}</Eyebrow>}
            <h1 className="mt-5 text-[clamp(42px,6.4vw,84px)] font-light leading-[0.98] tracking-[-0.035em]">
              {content.hero.title}{" "}
              {content.hero.highlight && <em className="font-normal italic text-[var(--lp-accent)] [font-family:var(--font-nestly-serif),Georgia,serif]">{content.hero.highlight}</em>}
            </h1>
            {content.hero.subtitle && <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-[var(--lp-ink2)]">{content.hero.subtitle}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <PillCta href={ctaHref}>{content.hero.cta_label}</PillCta>
              {content.hero.secondary_label && enabled("showcase") && <GhostCta href="#work">{content.hero.secondary_label}</GhostCta>}
            </div>
            {content.stats.length > 0 && (
              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[var(--lp-line)] pt-6">
                {content.stats.map((s) => (
                  <div key={s.id}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-[30px] font-light leading-none tracking-tight text-[var(--lp-ink)]">{s.value}</dd>
                    <dd className="mt-1.5 text-[13px] text-[var(--lp-ink2)]">{s.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="relative lg:col-span-6">
            {heroImage ? (
              <div className="relative h-[clamp(380px,48vw,600px)] overflow-hidden rounded-[36px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- agent hero photo */}
                <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-[24px] border border-white/40 bg-white/55 p-4 backdrop-blur-md">
                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-medium text-[#121212]">{content.brand.name}</p>
                    <p className="truncate text-xs text-[#5E6054]">{content.brand.tagline}</p>
                  </div>
                  <a href={ctaHref} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#121212] text-white" aria-label={content.hero.cta_label}>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="relative mx-auto flex h-[clamp(420px,46vw,580px)] max-w-[560px] items-center justify-center">
                <div aria-hidden="true" className="absolute inset-6 rounded-[48px] bg-[linear-gradient(160deg,var(--lp-soft),color-mix(in_srgb,var(--lp-tint)_60%,transparent))]" />
                <PartnerPhone card={heroCards[1]} index={1} className="absolute left-[4%] top-[16%] h-[62%] w-[34%] -rotate-[8deg] opacity-95" />
                <PartnerPhone card={heroCards[2]} index={2} className="absolute right-[4%] top-[18%] h-[60%] w-[33%] rotate-[8deg] opacity-95" />
                <PartnerPhone card={heroCards[0]} index={0} className="relative z-10 h-[82%] w-[44%]" />
                <div className="absolute bottom-[6%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-[var(--lp-line)] bg-[var(--lp-surface)] px-4 py-2 text-sm text-[var(--lp-ink)] shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#22A55A]" aria-hidden="true" /> Live on every phone
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {content.layout.filter(enabled).map((k) => sections[k]())}

      {/* ── Footer ── */}
      <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="relative overflow-hidden rounded-[40px] bg-[var(--lp-band)] text-[var(--lp-band-ink)]">
          <div className={`${wrap} relative z-10 flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between`}>
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <BrandMark content={content} />
                <span className="text-xl font-medium">{content.brand.name}</span>
              </div>
              {content.brand.tagline && <p className="mt-3 text-[15px] opacity-75">{content.brand.tagline}</p>}
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
              {navLinks.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="opacity-75 hover:opacity-100">
                  {label}
                </a>
              ))}
              {enabled("contact") && (
                <a href="#contact" className="opacity-75 hover:opacity-100">
                  Contact
                </a>
              )}
            </div>
          </div>
          <div className={`${wrap} relative z-10 flex flex-wrap justify-between gap-2 border-t border-white/10 py-5 text-xs opacity-60`}>
            <span suppressHydrationWarning>© {year} {content.brand.name}</span>
            <span>Digital business cards</span>
          </div>
          <p aria-hidden="true" className="pointer-events-none select-none whitespace-nowrap px-4 pb-2 text-[clamp(64px,15vw,220px)] font-medium leading-[0.8] tracking-[-0.05em] opacity-[0.08]">
            {content.brand.name}
          </p>
        </div>
      </footer>

      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_30px_-12px_rgba(37,211,102,0.8)] transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
