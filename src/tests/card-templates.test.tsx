import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { VCardTemplate } from "@/templates/vcard";
import { BotanicalTemplate } from "@/templates/botanical";
import { ShowcaseTemplate } from "@/templates/showcase";
import { PosterTemplate } from "@/templates/poster";
import { MotionTemplate } from "@/templates/motion";
import { TEMPLATE_MANIFESTS } from "@/templates/manifests";
import { emptyCardContent, type CardContent } from "@/lib/zod/content";
import { buildVCard } from "@/templates/shared/vcf";
import type { PublicProfile, ThemeTokens } from "@/types/profile";
import type { TemplateProps } from "@/templates/types";

const TEMPLATES: [string, (p: TemplateProps) => React.ReactNode][] = [
  ["vcard", VCardTemplate],
  ["botanical", BotanicalTemplate],
  ["showcase", ShowcaseTemplate],
  ["poster", PosterTemplate],
  ["motion", MotionTemplate],
];

/** Strings the old templates showed when a field was empty (plan §2.2, S5). */
const PLACEHOLDERS = [
  "9876543210",
  "8593048536",
  "janaseva",
  "JANASEVA",
  "Nexus Global",
  "5.0 Rated",
  "Welcome to my",
  "example.com",
  "unsplash.com",
  "placeholder-avatar",
];

function render(templateId: string, Template: (p: TemplateProps) => React.ReactNode, content: CardContent) {
  const profile: PublicProfile = { id: "p1", username: "aisha", template_id: templateId, content };
  const theme = { ...TEMPLATE_MANIFESTS[templateId].default_theme } as ThemeTokens;
  return renderToStaticMarkup(<Template profile={profile} blocks={[]} theme={theme} mode="public" />);
}

function fullContent(): CardContent {
  const c = emptyCardContent();
  c.identity = { ...c.identity, name: "Aisha Rahman", role: "Interior Designer", company: "Studio Noor", bio: "Calm homes.", verified_badge: true, category_label: "Interior design", hours: "Mon–Sat · 10–7", badges: ["Since 2015"] };
  c.contact = { phone: "+91 98450 12345", whatsapp: "+91 98450 12345", email: "hi@noor.in", website: "https://noor.in", address: "12 MG Road", map_url: "" };
  c.socials = [{ id: "s1", platform: "instagram", url: "https://instagram.com/noor" }];
  c.catalog.services = [{ id: "a", name: "Home consultation", description: "", price: "From ₹2,500", duration: "", image_url: "" }];
  c.payments.upi_id = "noor@okhdfc";
  c.links = [{ id: "l1", title: "Book a consultation", description: "", url: "https://cal.com/noor", icon: "calendar", featured: true }];
  c.actions.review_url = "https://g.page/r/noor/review";
  return c;
}

describe.each(TEMPLATES)("%s template", (templateId, Template) => {
  it("shows no placeholder data and no empty buttons when the card is empty", () => {
    const content = emptyCardContent();
    content.identity.name = "Aisha Rahman";
    content.actions = { save_contact: false, share: false, qr: false, review_url: "", booking_message: "" };
    const html = render(templateId, Template, content);

    expect(html).toContain("Aisha Rahman");
    for (const text of PLACEHOLDERS) expect(html).not.toContain(text);
    for (const label of ["Call", "WhatsApp", "Directions", "Enquire", "Pay with UPI", "Save contact", "Scan to save"]) {
      expect(html).not.toContain(`>${label}<`);
    }
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("wa.me");
  });

  it("renders every filled section with app-built, safe links", () => {
    const html = render(templateId, Template, fullContent());

    expect(html).toContain('href="tel:+919845012345"');
    expect(html).toContain('href="https://wa.me/919845012345"');
    expect(html).toContain('href="mailto:hi@noor.in"');
    expect(html).toContain("Home consultation");
    expect(html).toContain("Pay with UPI");
    expect(html).toContain("upi://pay?pa=noor@okhdfc&amp;pn=Studio%20Noor&amp;cu=INR");
    expect(html).toContain("Book a consultation");
    expect(html).toContain("Leave a Google review");
    expect(html).toContain('aria-label="QR code for this card"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain("javascript:");
  });

  it("respects hidden sections", () => {
    const content = fullContent();
    content.layout = content.layout.map((e) => (e.key === "services" ? { ...e, visible: false } : e));
    expect(render(templateId, Template, content)).not.toContain("Home consultation");
  });
});

describe("save contact (.vcf)", () => {
  it("escapes values and includes only filled fields", () => {
    const c = emptyCardContent();
    c.identity.name = "Aisha Rahman";
    c.identity.company = "Noor; Studio, Ltd";
    c.contact.phone = "+91 98450 12345";
    const vcf = buildVCard(c, "https://digicardo.app/aisha");
    expect(vcf).toContain("FN:Aisha Rahman\r\nN:Rahman;Aisha;;;");
    expect(vcf).toContain("ORG:Noor\\; Studio\\, Ltd");
    expect(vcf).toContain("TEL;TYPE=CELL,VOICE:+919845012345");
    expect(vcf).not.toContain("EMAIL");
    expect(vcf).toContain("URL;TYPE=CARD:https://digicardo.app/aisha");
  });
});
