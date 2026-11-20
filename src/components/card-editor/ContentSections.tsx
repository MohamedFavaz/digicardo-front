"use client";

import * as React from "react";
import { FileUp, Loader2 } from "lucide-react";
import { mediaApi } from "@/lib/api/media";
import { useCardEditor } from "@/lib/editor/store";
import { detectSocialPlatform } from "@/lib/content/legacy";
import {
  CONTENT_LIMITS,
  IFSC_REGEX,
  SOCIAL_PLATFORMS,
  UPI_REGEX,
  type CardContent,
  type CardDocument,
  type CardLink,
  type CardProduct,
  type CardService,
  type CardSocialLink,
  type SocialPlatform,
} from "@/lib/zod/content";
import { SOCIAL_LABELS } from "@/templates/shared/SocialIcon";
import { Field, ImageField, ImageListField, ListEditor, PhoneField, TextAreaField, TextField, ToggleRow, UrlField, inputClass, newId } from "./fields";

/** Small helper: the current value of a part plus a setter that records undo + autosave. */
function usePart<K extends keyof CardContent & string>(part: K) {
  const value = useCardEditor((s) => s.content[part]);
  const setPart = useCardEditor((s) => s.setPart);
  const set = React.useCallback(
    (next: CardContent[K], key?: string) => setPart(part as never, next as never, key),
    [part, setPart]
  );
  return [value, set] as const;
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

// ── Business details ───────────────────────────────────────────────────────────────

export function IdentityForm() {
  const [identity, set] = usePart("identity");
  const templateId = useCardEditor((s) => s.templateId);
  const patch = (p: Partial<typeof identity>, key: string) => set({ ...identity, ...p }, key);
  const [badgesText, setBadgesText] = React.useState(identity.badges.join(", "));
  React.useEffect(() => setBadgesText(identity.badges.join(", ")), [identity.badges]);

  return (
    <div className="space-y-5">
      <ImageField id="f-avatar" label="Profile photo" hint="A clear face or logo. You can crop it after choosing." crop value={identity.avatar_url} onChange={(v) => patch({ avatar_url: v }, "avatar")} />
      <ImageListField
        id="f-covers"
        label="Cover photos"
        hint={templateId === "vcard" ? "Up to 6. They slide on your card. Without photos, a drawing in your colour is shown." : "Shown on the Classic template."}
        values={identity.cover_images}
        max={CONTENT_LIMITS.cover_images}
        onChange={(v) => patch({ cover_images: v }, "covers")}
      />
      <Grid>
        <TextField id="f-name" label="Full name" value={identity.name} maxLength={100} onChange={(v) => patch({ name: v }, "name")} placeholder="Rahul Verma" />
        <TextField id="f-role" label="What you do" optional value={identity.role} maxLength={100} onChange={(v) => patch({ role: v }, "role")} placeholder="Interior Designer" />
        <TextField id="f-company" label="Business name" optional value={identity.company} maxLength={100} onChange={(v) => patch({ company: v }, "company")} placeholder="Verma Interiors" />
        <TextField id="f-category" label="Category" optional value={identity.category_label} maxLength={60} onChange={(v) => patch({ category_label: v }, "category")} placeholder="Interior design" />
      </Grid>
      <TextAreaField id="f-bio" label="Short bio" optional value={identity.bio} maxLength={300} onChange={(v) => patch({ bio: v }, "bio")} placeholder="One or two lines about what you offer." />
      <Grid>
        <TextField id="f-hours" label="Opening hours" optional value={identity.hours} maxLength={80} onChange={(v) => patch({ hours: v }, "hours")} placeholder="Mon–Sat · 10:00–19:00" />
        <TextField
          id="f-badges"
          label="Highlights"
          optional
          value={badgesText}
          hint="Up to 4, separated by commas. Shown as small tags."
          onChange={(v) => {
            setBadgesText(v);
            patch({ badges: v.split(",").map((b) => b.trim().slice(0, 40)).filter(Boolean).slice(0, CONTENT_LIMITS.badges) }, "badges");
          }}
          placeholder="Since 2015, Mumbai · Pune"
        />
      </Grid>
      <ImageField id="f-logo" label="Business logo" shape="square" crop hint="Crop it to a square after choosing. Shown on templates that use a logo." value={identity.logo_url} onChange={(v) => patch({ logo_url: v }, "logo")} />
      <ToggleRow label="Show verified tick" description="A small tick next to your name." checked={identity.verified_badge} onChange={(v) => patch({ verified_badge: v }, "verified")} />
    </div>
  );
}

// ── Contact buttons ────────────────────────────────────────────────────────────────

export function ContactForm() {
  const [contact, set] = usePart("contact");
  const patch = (p: Partial<typeof contact>, key: string) => set({ ...contact, ...p }, key);
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-muted-foreground">Each filled field becomes a big button on your card. Empty ones are hidden.</p>
      <Grid>
        <PhoneField id="f-phone" label="Phone (Call button)" value={contact.phone} onChange={(v) => patch({ phone: v }, "phone")} />
        <div className="space-y-1.5">
          <PhoneField id="f-whatsapp" label="WhatsApp" value={contact.whatsapp} onChange={(v) => patch({ whatsapp: v }, "whatsapp")} hint="Enquiries and bookings go here." />
          {contact.phone && contact.whatsapp !== contact.phone && (
            <button type="button" onClick={() => patch({ whatsapp: contact.phone }, "whatsapp")} className="text-[13px] font-semibold text-primary hover:underline">
              Use my phone number
            </button>
          )}
        </div>
        <TextField id="f-email" label="Email" type="email" inputMode="email" autoComplete="email" value={contact.email} onChange={(v) => patch({ email: v.trim() }, "email")} placeholder="hello@studio.in" />
        <UrlField id="f-website" label="Website" value={contact.website} onChange={(v) => patch({ website: v }, "website")} placeholder="studio.in" />
      </Grid>
      <TextAreaField id="f-address" label="Address (Directions button)" optional rows={2} value={contact.address} maxLength={300} onChange={(v) => patch({ address: v }, "address")} placeholder="12 MG Road, Bengaluru" />
      <UrlField id="f-map" label="Google Maps link" optional value={contact.map_url} onChange={(v) => patch({ map_url: v }, "map")} hint="Optional. Without it, directions use your address." placeholder="https://maps.app.goo.gl/…" />
    </div>
  );
}

// ── Social links ───────────────────────────────────────────────────────────────────

export function SocialsForm() {
  const [socials, set] = usePart("socials");
  return (
    <ListEditor<CardSocialLink>
      items={socials}
      onChange={(items) => set(items, "list")}
      max={CONTENT_LIMITS.socials}
      addLabel="Add a social link"
      emptyText="No social links yet. Paste a profile link — we'll recognise the app."
      newItem={() => ({ id: newId("s"), platform: "instagram", url: "" })}
      itemTitle={(item) => `${SOCIAL_LABELS[item.platform]}${item.url ? ` · ${item.url.replace(/^https?:\/\/(www\.)?/, "")}` : ""}`}
      renderItem={(item, update) => (
        <>
          <UrlField
            id={`f-social-${item.id}`}
            label="Profile link"
            value={item.url}
            placeholder="instagram.com/yourname"
            onChange={(url) => {
              const detected = detectSocialPlatform("", url.includes("://") ? url : `https://${url}`);
              update({ url, ...(detected !== "other" && detected !== "website" ? { platform: detected } : {}) });
            }}
          />
          <Field id={`f-platform-${item.id}`} label="App">
            <select id={`f-platform-${item.id}`} value={item.platform} onChange={(e) => update({ platform: e.target.value as SocialPlatform })} className={`${inputClass} h-11 sm:h-10`}>
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>{SOCIAL_LABELS[p]}</option>
              ))}
            </select>
          </Field>
        </>
      )}
    />
  );
}

// ── Services & products ────────────────────────────────────────────────────────────

export function CatalogForm() {
  const [catalog, set] = usePart("catalog");
  const patch = (p: Partial<typeof catalog>, key: string) => set({ ...catalog, ...p }, key);
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <TextField id="f-services-label" label="Services heading" value={catalog.services_label} maxLength={40} onChange={(v) => patch({ services_label: v }, "slabel")} placeholder="Services" />
        <ListEditor<CardService>
          items={catalog.services}
          onChange={(services) => patch({ services }, "services")}
          max={CONTENT_LIMITS.services}
          addLabel="Add a service"
          emptyText="No services yet. Each one can have a photo and gets an Enquire button that opens WhatsApp."
          newItem={() => ({ id: newId("svc"), name: "", description: "", price: "", duration: "", image_url: "" })}
          itemTitle={(item, i) => item.name || `Service ${i + 1}`}
          renderItem={(item, update) => (
            <>
              <ImageField id={`f-svc-img-${item.id}`} label="Photo" shape="square" crop hint="Optional. Shown next to the service." value={item.image_url} onChange={(image_url) => update({ image_url })} />
              <TextField id={`f-svc-name-${item.id}`} label="Name" value={item.name} maxLength={100} onChange={(name) => update({ name })} placeholder="Home consultation" />
              <TextAreaField id={`f-svc-desc-${item.id}`} label="Description" optional rows={2} value={item.description} maxLength={300} onChange={(description) => update({ description })} />
              <Grid>
                <TextField id={`f-svc-price-${item.id}`} label="Price" optional value={item.price} maxLength={40} onChange={(price) => update({ price })} placeholder="From ₹2,500" />
                <TextField id={`f-svc-dur-${item.id}`} label="Duration" optional value={item.duration} maxLength={40} onChange={(duration) => update({ duration })} placeholder="90 min" />
              </Grid>
            </>
          )}
        />
      </div>
      <div className="space-y-3 border-t border-border pt-5">
        <TextField id="f-products-label" label="Products heading" value={catalog.products_label} maxLength={40} onChange={(v) => patch({ products_label: v }, "plabel")} placeholder="Shop" />
        <ListEditor<CardProduct>
          items={catalog.products}
          onChange={(products) => patch({ products }, "products")}
          max={CONTENT_LIMITS.products}
          addLabel="Add a product"
          emptyText="No products yet. Add a photo, price and an optional buy link."
          newItem={() => ({ id: newId("prd"), name: "", description: "", price: "", image_url: "", buy_url: "" })}
          itemTitle={(item, i) => item.name || `Product ${i + 1}`}
          renderItem={(item, update) => (
            <>
              <ImageField id={`f-prd-img-${item.id}`} label="Photo" shape="square" crop value={item.image_url} onChange={(image_url) => update({ image_url })} />
              <Grid>
                <TextField id={`f-prd-name-${item.id}`} label="Name" value={item.name} maxLength={100} onChange={(name) => update({ name })} />
                <TextField id={`f-prd-price-${item.id}`} label="Price" optional value={item.price} maxLength={40} onChange={(price) => update({ price })} placeholder="₹1,800" />
              </Grid>
              <UrlField id={`f-prd-buy-${item.id}`} label="Buy link" optional value={item.buy_url} onChange={(buy_url) => update({ buy_url })} hint="Without a link, the button opens a WhatsApp enquiry." />
            </>
          )}
        />
      </div>
      <TextAreaField
        id="f-enquiry"
        label="Enquiry message"
        optional
        rows={2}
        value={catalog.enquiry_message}
        maxLength={300}
        onChange={(v) => patch({ enquiry_message: v }, "enquiry")}
        hint="Sent on WhatsApp when someone taps Enquire. {item} becomes the service or product name."
        placeholder="Hello! I'm interested in {item}."
      />
    </div>
  );
}

// ── Payments ───────────────────────────────────────────────────────────────────────

export function PaymentsForm() {
  const [payments, set] = usePart("payments");
  const patch = (p: Partial<typeof payments>, key: string) => set({ ...payments, ...p }, key);
  const bank = (p: Partial<typeof payments.bank>, key: string) => patch({ bank: { ...payments.bank, ...p } }, key);
  const upiError = payments.upi_id && !UPI_REGEX.test(payments.upi_id) ? "Enter a UPI ID like name@bank." : null;
  const ifscError = payments.bank.ifsc && !IFSC_REGEX.test(payments.bank.ifsc) ? "Enter an 11-character IFSC code like HDFC0001234." : null;
  return (
    <div className="space-y-4">
      <Grid>
        <TextField id="f-upi" label="UPI ID" value={payments.upi_id} error={upiError} onChange={(v) => patch({ upi_id: v.trim() }, "upi")} placeholder="yourname@okhdfc" hint="Adds a “Pay with UPI” button." />
        <TextField id="f-upi-name" label="Pay to (name)" optional value={payments.upi_name} maxLength={100} onChange={(v) => patch({ upi_name: v }, "upiname")} placeholder="Verma Interiors" />
      </Grid>
      <PhoneField id="f-pay-phone" label="UPI phone number" optional value={payments.payment_phone} onChange={(v) => patch({ payment_phone: v }, "payphone")} />
      <div className="space-y-3 border-t border-border pt-4">
        <div className="text-sm font-semibold">Bank transfer details <span className="font-normal text-muted-foreground">(optional)</span></div>
        <Grid>
          <TextField id="f-bank-holder" label="Account name" value={payments.bank.holder} maxLength={100} onChange={(v) => bank({ holder: v }, "holder")} />
          <TextField id="f-bank-name" label="Bank" value={payments.bank.bank_name} maxLength={100} onChange={(v) => bank({ bank_name: v }, "bankname")} />
          <TextField id="f-bank-acc" label="Account number" inputMode="numeric" value={payments.bank.account_number} onChange={(v) => bank({ account_number: v.replace(/\s/g, "") }, "acc")} />
          <TextField id="f-bank-ifsc" label="IFSC" value={payments.bank.ifsc} error={ifscError} onChange={(v) => bank({ ifsc: v.toUpperCase().trim() }, "ifsc")} placeholder="HDFC0001234" />
        </Grid>
      </div>
    </div>
  );
}

// ── Photos ─────────────────────────────────────────────────────────────────────────

export function GalleryForm() {
  const [gallery, set] = usePart("gallery");
  return (
    <div className="space-y-4">
      <TextField id="f-gallery-title" label="Heading" value={gallery.title} maxLength={60} onChange={(title) => set({ ...gallery, title }, "title")} placeholder="Recent work" />
      <ImageListField id="f-gallery" label="Photos" values={gallery.images} max={CONTENT_LIMITS.gallery} onChange={(images) => set({ ...gallery, images }, "images")} hint="Visitors can tap a photo to see it full size." />
    </div>
  );
}

// ── Links & booking ────────────────────────────────────────────────────────────────

const LINK_ICONS = [
  ["link", "Link"], ["calendar", "Calendar"], ["services", "Briefcase"], ["office", "Location"],
  ["document", "Document"], ["folder", "Folder"], ["shop", "Shop"], ["video", "Video"], ["star", "Star"], ["globe", "Globe"],
] as const;

export function LinksForm() {
  const [links, set] = usePart("links");
  const [actions, setActions] = usePart("actions");
  return (
    <div className="space-y-5">
      <ListEditor<CardLink>
        items={links}
        onChange={(items) => set(items, "list")}
        max={CONTENT_LIMITS.links}
        addLabel="Add a link"
        emptyText="No links yet. Add your booking page, menu, portfolio or anything else."
        newItem={() => ({ id: newId("lnk"), title: "", description: "", url: "", icon: "link", featured: false })}
        itemTitle={(item, i) => item.title || `Link ${i + 1}`}
        renderItem={(item, update) => (
          <>
            <TextField id={`f-link-title-${item.id}`} label="Title" value={item.title} maxLength={100} onChange={(title) => update({ title })} placeholder="Book a consultation" />
            <TextField id={`f-link-desc-${item.id}`} label="Subtitle" optional value={item.description} maxLength={200} onChange={(description) => update({ description })} placeholder="30-minute video call" />
            <UrlField id={`f-link-url-${item.id}`} label="Link" value={item.url} onChange={(url) => update({ url })} placeholder="cal.com/yourname" />
            <Field id={`f-link-icon-${item.id}`} label="Icon">
              <select id={`f-link-icon-${item.id}`} value={item.icon || "link"} onChange={(e) => update({ icon: e.target.value })} className={`${inputClass} h-11 sm:h-10`}>
                {LINK_ICONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <ToggleRow label="Highlight this link" description="Shown as a big coloured button." checked={item.featured} onChange={(featured) => update({ featured })} />
          </>
        )}
      />
      <div className="border-t border-border pt-4">
        <TextAreaField
          id="f-booking"
          label="WhatsApp booking button"
          optional
          rows={2}
          value={actions.booking_message}
          maxLength={300}
          onChange={(v) => setActions({ ...actions, booking_message: v }, "booking")}
          hint="Write the message visitors send you. Leave empty to hide the “Book an appointment” button."
          placeholder="Hi! I'd like to book an appointment."
        />
      </div>
    </div>
  );
}

// ── Documents ──────────────────────────────────────────────────────────────────────

export function DocumentsForm() {
  const [documents, set] = usePart("documents");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("This file is larger than 10 MB.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const media = await mediaApi.uploadDocument(file, file.name);
      const mb = file.size / 1048576;
      set([
        ...documents,
        {
          id: newId("doc"),
          title: file.name.replace(/\.[^.]+$/, "").slice(0, 100),
          description: "",
          url: media.url,
          file_name: file.name.slice(0, 200),
          size_label: mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`,
        },
      ], "upload");
    } catch {
      setError("Upload failed. PDFs up to 10 MB work best.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <ListEditor<CardDocument>
        items={documents}
        onChange={(items) => set(items, "list")}
        max={CONTENT_LIMITS.documents}
        addLabel="Add a link to a file"
        emptyText="No documents yet. Upload a brochure, menu or price list."
        newItem={() => ({ id: newId("doc"), title: "", description: "", url: "", file_name: "", size_label: "" })}
        itemTitle={(item, i) => item.title || `Document ${i + 1}`}
        renderItem={(item, update) => (
          <>
            <TextField id={`f-doc-title-${item.id}`} label="Title" value={item.title} maxLength={100} onChange={(title) => update({ title })} placeholder="Company profile" />
            <TextField id={`f-doc-desc-${item.id}`} label="Subtitle" optional value={item.description} maxLength={200} onChange={(description) => update({ description })} placeholder="PDF · 2 pages" />
            <UrlField id={`f-doc-url-${item.id}`} label="File link" value={item.url} onChange={(url) => update({ url })} />
          </>
        )}
      />
      {documents.length < CONTENT_LIMITS.documents && (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#EFECFD] px-3.5 text-sm font-semibold text-[#3D2AAD] hover:bg-[#E4DFFB] disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileUp className="h-4 w-4" aria-hidden="true" />}
          {busy ? "Uploading…" : "Upload a PDF"}
        </button>
      )}
      {error && <p className="text-[13px] text-destructive">{error}</p>}
      <input ref={inputRef} type="file" accept="application/pdf,.pdf,.doc,.docx,.ppt,.pptx" className="sr-only" onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}

// ── Buttons on the card ────────────────────────────────────────────────────────────

export function ActionsForm() {
  const [actions, set] = usePart("actions");
  const patch = (p: Partial<typeof actions>, key: string) => set({ ...actions, ...p }, key);
  return (
    <div className="space-y-3">
      <ToggleRow label="Save contact" description="Visitors download your details to their phone." checked={actions.save_contact} onChange={(v) => patch({ save_contact: v }, "save")} />
      <ToggleRow label="Share" description="Lets visitors send your card to others." checked={actions.share} onChange={(v) => patch({ share: v }, "share")} />
      <ToggleRow label="QR code" description="A code people can scan to open your card." checked={actions.qr} onChange={(v) => patch({ qr: v }, "qr")} />
      <div className="border-t border-border pt-4">
        <UrlField id="f-review" label="Review link" optional value={actions.review_url} onChange={(v) => patch({ review_url: v }, "review")} hint="Your Google review link. Adds a “Leave a review” prompt." placeholder="g.page/r/…/review" />
      </div>
    </div>
  );
}

// ── Summaries shown on each collapsed section ──────────────────────────────────────

export function sectionSummary(key: string, c: CardContent): { text: string; filled: boolean } {
  switch (key) {
    case "identity": {
      const n = [c.identity.name, c.identity.role, c.identity.bio, c.identity.avatar_url].filter(Boolean).length;
      return n === 4 ? { text: "Complete", filled: true } : { text: `${n} of 4 filled`, filled: n > 0 };
    }
    case "contact": {
      const n = [c.contact.phone, c.contact.whatsapp, c.contact.email, c.contact.website, c.contact.address].filter(Boolean).length;
      return { text: n === 0 ? "Empty — add at least a phone or WhatsApp" : `${n} of 5 filled`, filled: n > 0 };
    }
    case "socials":
      return { text: c.socials.length ? `${c.socials.length} link${c.socials.length === 1 ? "" : "s"}` : "Empty", filled: c.socials.length > 0 };
    case "catalog": {
      const s = c.catalog.services.length;
      const p = c.catalog.products.length;
      return { text: s || p ? `${s} service${s === 1 ? "" : "s"} · ${p} product${p === 1 ? "" : "s"}` : "Empty", filled: s + p > 0 };
    }
    case "payments": {
      const parts = [c.payments.upi_id && "UPI added", c.payments.bank.account_number && "bank details added"].filter(Boolean);
      return { text: parts.length ? parts.join(" · ") : "Empty", filled: parts.length > 0 };
    }
    case "gallery":
      return { text: c.gallery.images.length ? `${c.gallery.images.length} photos` : "Empty", filled: c.gallery.images.length > 0 };
    case "links": {
      const n = c.links.length + (c.actions.booking_message ? 1 : 0);
      return { text: n ? `${c.links.length} link${c.links.length === 1 ? "" : "s"}${c.actions.booking_message ? " · booking on" : ""}` : "Empty", filled: n > 0 };
    }
    case "documents":
      return { text: c.documents.length ? `${c.documents.length} file${c.documents.length === 1 ? "" : "s"}` : "Empty — hidden until you add one", filled: c.documents.length > 0 };
    case "actions": {
      const on = [c.actions.save_contact && "Save", c.actions.share && "Share", c.actions.qr && "QR", c.actions.review_url && "Review"].filter(Boolean);
      return { text: on.length ? on.join(" · ") : "All off", filled: on.length > 0 };
    }
    default:
      return { text: "", filled: false };
  }
}
