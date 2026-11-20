"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { ListEditor, newId, Switch, TextAreaField, TextField, UrlField } from "@/components/card-editor/fields";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { PARTNER_PRESETS, type PartnerCard, type PartnerContent, type PartnerFaq, type PartnerPackage, type PartnerPreset, type PartnerStat, type PartnerStep, type PartnerTestimonial } from "@/lib/partner/types";
import { PartnerImageField } from "./PartnerImageField";

type Set = <K extends keyof PartnerContent>(key: K, value: PartnerContent[K]) => void;

const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);

export function BrandForm({ content, set }: { content: PartnerContent; set: Set }) {
  const b = content.brand;
  const t = content.theme;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField id="lp-brand" label="Brand name" value={b.name} maxLength={60} onChange={(name) => set("brand", { ...b, name })} />
        <TextField id="lp-tagline" label="Tagline" optional value={b.tagline} maxLength={80} onChange={(tagline) => set("brand", { ...b, tagline })} />
      </div>
      <PartnerImageField id="lp-logo" label="Logo" hint="Square logos look best. You can crop it." shape="square" crop value={b.logo_url} onChange={(logo_url) => set("brand", { ...b, logo_url })} />
      <div>
        <p className="text-sm font-medium text-foreground">Design</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(PARTNER_PRESETS) as PartnerPreset[]).map((id) => {
            const p = PARTNER_PRESETS[id];
            const on = t.preset === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => set("theme", { ...t, preset: id })}
                aria-pressed={on}
                className={cn("overflow-hidden rounded-2xl border text-left transition", on ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-[#C9CABF]")}
              >
                <span className="flex h-14 items-end gap-1 p-2" style={{ background: p.vars["--lp-bg"] }}>
                  <span className="h-6 flex-1 rounded-md" style={{ background: p.vars["--lp-band"] }} />
                  <span className="h-9 flex-1 rounded-md" style={{ background: p.vars["--lp-tint"] }} />
                  <span className="h-4 flex-1 rounded-md" style={{ background: p.vars["--lp-accent"] }} />
                </span>
                <span className="flex items-center justify-between px-2.5 py-1.5 text-[13px] font-medium">
                  {p.label}
                  {on && <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="lp-accent" className="text-sm font-medium text-foreground">
          Button colour
        </label>
        <input
          id="lp-accent"
          type="color"
          value={t.accent || PARTNER_PRESETS[t.preset].vars["--lp-accent"]}
          onChange={(e) => set("theme", { ...t, accent: e.target.value.toUpperCase() })}
          className="h-9 w-14 cursor-pointer rounded-lg border border-input bg-card p-1"
        />
        {t.accent && (
          <button type="button" onClick={() => set("theme", { ...t, accent: "" })} className="text-[13px] font-medium text-muted-foreground hover:text-foreground">
            Use design colour
          </button>
        )}
      </div>
    </div>
  );
}

export function HeroForm({ content, set }: { content: PartnerContent; set: Set }) {
  const h = content.hero;
  const patch = (p: Partial<typeof h>) => set("hero", { ...h, ...p });
  return (
    <div className="space-y-4">
      <TextField id="lp-eyebrow" label="Small label above the title" optional value={h.eyebrow} maxLength={40} onChange={(eyebrow) => patch({ eyebrow })} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_180px]">
        <TextField id="lp-title" label="Headline" value={h.title} maxLength={80} onChange={(title) => patch({ title })} />
        <TextField id="lp-highlight" label="Highlighted word" optional hint="Shown in elegant italics." value={h.highlight} maxLength={40} onChange={(highlight) => patch({ highlight })} />
      </div>
      <TextAreaField id="lp-subtitle" label="Intro" value={h.subtitle} maxLength={240} rows={3} onChange={(subtitle) => patch({ subtitle })} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField id="lp-cta" label="Main button" value={h.cta_label} maxLength={30} onChange={(cta_label) => patch({ cta_label })} />
        <TextField id="lp-cta2" label="Second button" optional hint="Scrolls to your examples." value={h.secondary_label} maxLength={30} onChange={(secondary_label) => patch({ secondary_label })} />
      </div>
      <PartnerImageField id="lp-hero" label="Big photo" hint="Optional. Without one, your cards are shown on phones." value={h.image_url} onChange={(image_url) => patch({ image_url })} />
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Numbers under the buttons</p>
        <ListEditor<PartnerStat>
          items={content.stats}
          onChange={(stats) => set("stats", stats)}
          max={4}
          addLabel="Add a number"
          emptyText="No numbers. Add things like “500+ cards made”."
          newItem={() => ({ id: newId("s"), value: "", label: "" })}
          itemTitle={(s, i) => (s.value ? `${s.value} ${s.label}` : `Number ${i + 1}`)}
          renderItem={(s, update) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
              <TextField id={`lp-stat-v-${s.id}`} label="Value" value={s.value} maxLength={12} placeholder="500+" onChange={(value) => update({ value })} />
              <TextField id={`lp-stat-l-${s.id}`} label="Label" value={s.label} maxLength={30} placeholder="Cards created" onChange={(label) => update({ label })} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

export function AboutForm({ content, set }: { content: PartnerContent; set: Set }) {
  const a = content.about;
  const patch = (p: Partial<typeof a>) => set("about", { ...a, ...p });
  return (
    <div className="space-y-4">
      <TextField id="lp-about-title" label="Title" value={a.title} maxLength={80} onChange={(title) => patch({ title })} />
      <TextAreaField id="lp-about-text" label="Text" value={a.text} maxLength={800} rows={4} onChange={(text) => patch({ text })} />
      <TextAreaField id="lp-about-points" label="Highlights" hint="One per line (up to 6)." value={a.points.join("\n")} rows={4} onChange={(v) => patch({ points: lines(v).slice(0, 6) })} />
      <PartnerImageField id="lp-about-img" label="Photo" hint="Optional — your shop, team or work." value={a.image_url} onChange={(image_url) => patch({ image_url })} />
    </div>
  );
}

export function PackagesForm({ content, set }: { content: PartnerContent; set: Set }) {
  const p = content.packages;
  const patch = (x: Partial<typeof p>) => set("packages", { ...p, ...x });
  return (
    <div className="space-y-4">
      <TextField id="lp-pk-title" label="Title" value={p.title} maxLength={80} onChange={(title) => patch({ title })} />
      <TextField id="lp-pk-sub" label="Subtitle" optional value={p.subtitle} maxLength={160} onChange={(subtitle) => patch({ subtitle })} />
      <ListEditor<PartnerPackage>
        items={p.items}
        onChange={(items) => patch({ items })}
        max={4}
        addLabel="Add a package"
        emptyText="No packages yet."
        newItem={() => ({ id: newId("p"), name: "", price: "", period: "/ year", description: "", features: [], featured: false })}
        itemTitle={(x, i) => (x.name ? `${x.name}${x.price ? ` · ${x.price}` : ""}${x.featured ? " ★" : ""}` : `Package ${i + 1}`)}
        renderItem={(x, update) => (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <TextField id={`lp-pk-n-${x.id}`} label="Name" value={x.name} maxLength={40} onChange={(name) => update({ name })} />
              <TextField id={`lp-pk-p-${x.id}`} label="Price" value={x.price} maxLength={20} placeholder="₹999" onChange={(price) => update({ price })} />
              <TextField id={`lp-pk-per-${x.id}`} label="Per" optional value={x.period} maxLength={20} placeholder="/ year" onChange={(period) => update({ period })} />
            </div>
            <TextField id={`lp-pk-d-${x.id}`} label="Short description" optional value={x.description} maxLength={120} onChange={(description) => update({ description })} />
            <TextAreaField id={`lp-pk-f-${x.id}`} label="What’s included" hint="One per line." value={x.features.join("\n")} rows={4} onChange={(v) => update({ features: lines(v).slice(0, 8) })} />
            <label className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
              <span className="text-sm">Highlight as “Most popular”</span>
              <Switch label="Most popular" checked={x.featured} onChange={(featured) => onFeature(p.items, x.id, featured, (items) => patch({ items }))} />
            </label>
          </div>
        )}
      />
    </div>
  );
}

function onFeature(items: PartnerPackage[], id: string, featured: boolean, apply: (items: PartnerPackage[]) => void) {
  apply(items.map((i) => ({ ...i, featured: i.id === id ? featured : featured ? false : i.featured })));
}

export function ShowcaseForm({ content, set, customers }: { content: PartnerContent; set: Set; customers: PartnerCard[] }) {
  const s = content.showcase;
  const patch = (x: Partial<typeof s>) => set("showcase", { ...s, ...x });
  const toggle = (id: string) =>
    patch({ profile_ids: s.profile_ids.includes(id) ? s.profile_ids.filter((x) => x !== id) : [...s.profile_ids, id].slice(0, 8) });
  return (
    <div className="space-y-4">
      <TextField id="lp-sc-title" label="Title" value={s.title} maxLength={80} onChange={(title) => patch({ title })} />
      <TextField id="lp-sc-sub" label="Subtitle" optional value={s.subtitle} maxLength={160} onChange={(subtitle) => patch({ subtitle })} />
      <div>
        <p className="text-sm font-medium text-foreground">Cards to show ({s.profile_ids.length}/8)</p>
        <p className="text-[13px] text-muted-foreground">Pick your customers’ cards. Visitors can tap to open them. Until you pick some, sample designs are shown.</p>
        {customers.length === 0 ? (
          <p className="mt-2 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">You haven’t created any customer cards yet.</p>
        ) : (
          <ul className="mt-2 max-h-72 space-y-1.5 overflow-y-auto">
            {customers.map((c) => {
              const on = s.profile_ids.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => toggle(c.id)}
                    aria-pressed={on}
                    disabled={!on && s.profile_ids.length >= 8}
                    className={cn("flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors disabled:opacity-50", on ? "border-primary bg-[#EEF2E4]" : "border-border hover:bg-muted/60")}
                  >
                    {c.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- card avatar
                      <img src={resolveMediaUrl(c.avatar_url)} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">{c.name.slice(0, 1).toUpperCase()}</span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{c.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        /{c.username}
                        {!c.is_public && " · hidden card (won’t show)"}
                      </span>
                    </span>
                    <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border", on ? "border-primary bg-primary text-white" : "border-input")}>
                      {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function StepsForm({ content, set }: { content: PartnerContent; set: Set }) {
  const s = content.steps;
  return (
    <div className="space-y-4">
      <TextField id="lp-st-title" label="Title" value={s.title} maxLength={80} onChange={(title) => set("steps", { ...s, title })} />
      <ListEditor<PartnerStep>
        items={s.items}
        onChange={(items) => set("steps", { ...s, items })}
        max={4}
        addLabel="Add a step"
        emptyText="No steps yet."
        newItem={() => ({ id: newId("t"), title: "", text: "" })}
        itemTitle={(x, i) => x.title || `Step ${i + 1}`}
        renderItem={(x, update) => (
          <div className="space-y-3">
            <TextField id={`lp-st-t-${x.id}`} label="Step" value={x.title} maxLength={50} onChange={(title) => update({ title })} />
            <TextAreaField id={`lp-st-x-${x.id}`} label="Details" optional value={x.text} maxLength={160} rows={2} onChange={(text) => update({ text })} />
          </div>
        )}
      />
    </div>
  );
}

export function TestimonialsForm({ content, set }: { content: PartnerContent; set: Set }) {
  const s = content.testimonials;
  return (
    <div className="space-y-4">
      <TextField id="lp-te-title" label="Title" value={s.title} maxLength={80} onChange={(title) => set("testimonials", { ...s, title })} />
      <ListEditor<PartnerTestimonial>
        items={s.items}
        onChange={(items) => set("testimonials", { ...s, items })}
        max={6}
        addLabel="Add a review"
        emptyText="No reviews yet."
        newItem={() => ({ id: newId("r"), name: "", role: "", quote: "" })}
        itemTitle={(x, i) => x.name || `Review ${i + 1}`}
        renderItem={(x, update) => (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField id={`lp-te-n-${x.id}`} label="Name" value={x.name} maxLength={50} onChange={(name) => update({ name })} />
              <TextField id={`lp-te-r-${x.id}`} label="Business / role" optional value={x.role} maxLength={60} onChange={(role) => update({ role })} />
            </div>
            <TextAreaField id={`lp-te-q-${x.id}`} label="What they said" value={x.quote} maxLength={300} rows={3} onChange={(quote) => update({ quote })} />
          </div>
        )}
      />
    </div>
  );
}

export function FaqForm({ content, set }: { content: PartnerContent; set: Set }) {
  const s = content.faq;
  return (
    <div className="space-y-4">
      <TextField id="lp-fq-title" label="Title" value={s.title} maxLength={80} onChange={(title) => set("faq", { ...s, title })} />
      <ListEditor<PartnerFaq>
        items={s.items}
        onChange={(items) => set("faq", { ...s, items })}
        max={10}
        addLabel="Add a question"
        emptyText="No questions yet."
        newItem={() => ({ id: newId("q"), q: "", a: "" })}
        itemTitle={(x, i) => x.q || `Question ${i + 1}`}
        renderItem={(x, update) => (
          <div className="space-y-3">
            <TextField id={`lp-fq-q-${x.id}`} label="Question" value={x.q} maxLength={120} onChange={(q) => update({ q })} />
            <TextAreaField id={`lp-fq-a-${x.id}`} label="Answer" value={x.a} maxLength={500} rows={3} onChange={(a) => update({ a })} />
          </div>
        )}
      />
    </div>
  );
}

export function ContactForm({ content, set }: { content: PartnerContent; set: Set }) {
  const c = content.contact;
  const l = content.lead_form;
  const patch = (x: Partial<typeof c>) => set("contact", { ...c, ...x });
  return (
    <div className="space-y-4">
      <TextField id="lp-ct-title" label="Title" value={c.title} maxLength={80} onChange={(title) => patch({ title })} />
      <TextAreaField id="lp-ct-text" label="Text" optional value={c.text} maxLength={200} rows={2} onChange={(text) => patch({ text })} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField id="lp-ct-wa" label="WhatsApp" optional type="tel" inputMode="tel" value={c.whatsapp} maxLength={24} placeholder="+91 98765 43210" onChange={(whatsapp) => patch({ whatsapp })} />
        <TextField id="lp-ct-ph" label="Phone" optional type="tel" inputMode="tel" value={c.phone} maxLength={24} onChange={(phone) => patch({ phone })} />
        <TextField id="lp-ct-em" label="Email" optional type="email" value={c.email} maxLength={120} onChange={(email) => patch({ email })} />
        <TextField id="lp-ct-ad" label="Address" optional value={c.address} maxLength={200} onChange={(address) => patch({ address })} />
        <UrlField id="lp-ct-map" label="Google Maps link" optional value={c.map_url} onChange={(map_url) => patch({ map_url })} />
        <UrlField id="lp-ct-web" label="Website" optional value={c.website} onChange={(website) => patch({ website })} />
        <UrlField id="lp-ct-ig" label="Instagram" optional value={c.instagram} onChange={(instagram) => patch({ instagram })} />
        <UrlField id="lp-ct-fb" label="Facebook" optional value={c.facebook} onChange={(facebook) => patch({ facebook })} />
      </div>
      <div className="rounded-2xl border border-border p-4">
        <label className="flex items-center justify-between gap-3">
          <span>
            <span className="block text-sm font-medium">Enquiry form</span>
            <span className="block text-[13px] text-muted-foreground">Requests arrive in Leads, with a notification.</span>
          </span>
          <Switch label="Enquiry form" checked={l.enabled} onChange={(enabled) => set("lead_form", { ...l, enabled })} />
        </label>
        {l.enabled && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField id="lp-lf-t" label="Form title" value={l.title} maxLength={60} onChange={(title) => set("lead_form", { ...l, title })} />
            <TextField id="lp-lf-b" label="Button" value={l.button_label} maxLength={30} onChange={(button_label) => set("lead_form", { ...l, button_label })} />
          </div>
        )}
      </div>
    </div>
  );
}

export function SeoForm({ content, set }: { content: PartnerContent; set: Set }) {
  const s = content.seo;
  return (
    <div className="space-y-4">
      <TextField id="lp-seo-t" label="Google title" optional hint="Leave empty to use your brand and tagline." value={s.title} maxLength={70} onChange={(title) => set("seo", { ...s, title })} />
      <TextAreaField id="lp-seo-d" label="Google description" optional hint="Leave empty to use your intro." value={s.description} maxLength={160} rows={2} onChange={(description) => set("seo", { ...s, description })} />
    </div>
  );
}
