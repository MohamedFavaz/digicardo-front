"use client";

import * as React from "react";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import { TEMPLATE_MANIFESTS } from "@/templates/manifests";
import { emptyCardContent, type CardContent } from "@/lib/zod/content";
import type { ThemeTokens } from "@/types/profile";

/**
 * Example cards for marketing pages. Fictional people and businesses only — never real
 * profiles. Their photos are local files in public/examples (nothing external is loaded):
 * the designer portrait and the repair logo are AI-generated, the other photos are from
 * Unsplash (free licence).
 */
export type ExampleTemplate = "vcard" | "showcase" | "botanical";

export function exampleContent(template: ExampleTemplate): CardContent {
  const c = emptyCardContent();
  c.actions.qr = false;
  if (template === "vcard") {
    c.identity = {
      ...c.identity,
      name: "Rahul Verma",
      role: "Interior Designer",
      company: "Verma Interiors",
      bio: "Calm, practical homes and workspaces.",
      avatar_url: "/examples/designer-avatar.webp",
      cover_images: ["/examples/interior-cover.webp"],
      hours: "Open today · 10:00–19:00",
      verified_badge: true,
    };
    c.contact = { ...c.contact, phone: "+91 90000 00000", whatsapp: "+91 90000 00000", email: "hello@vermainteriors.example", address: "Bengaluru" };
    c.socials = [
      { id: "s1", platform: "instagram", url: "https://instagram.com" },
      { id: "s2", platform: "linkedin", url: "https://linkedin.com" },
      { id: "s3", platform: "youtube", url: "https://youtube.com" },
    ];
    c.catalog.services = [
      { id: "a", name: "Home consultation", description: "A 90-minute visit to plan your space.", price: "From ₹2,500", duration: "", image_url: "" },
      { id: "b", name: "Full-room design", description: "Layout, materials and a shopping list.", price: "From ₹18,000", duration: "", image_url: "" },
    ];
  } else if (template === "showcase") {
    c.identity = {
      ...c.identity,
      name: "Brightline Care",
      role: "Electronics service centre",
      bio: "Multi-brand repairs for TVs, washing machines, ACs and fridges. Doorstep pickup and a 90-day warranty on every repair.",
      logo_url: "/examples/repair-logo.webp",
      cover_images: ["/examples/repair-cover.webp"],
      hours: "09:00 AM – 06:00 PM",
      verified_badge: true,
    };
    c.contact = { ...c.contact, phone: "+91 90000 00001", whatsapp: "+91 90000 00001", email: "help@brightline.example", website: "https://brightline.example", address: "Palakkad" };
    c.socials = [
      { id: "s1", platform: "facebook", url: "https://facebook.com" },
      { id: "s2", platform: "instagram", url: "https://instagram.com" },
    ];
    c.catalog.services = [{ id: "a", name: "TV repair", description: "", price: "From ₹499", duration: "", image_url: "" }];
    c.payments.upi_id = "brightline@upi";
    c.actions.review_url = "https://g.page/r/example/review";
    c.actions.booking_message = "Hello! I'd like to book a service visit.";
  } else {
    c.identity = {
      ...c.identity,
      name: "Dr. Meera Nair",
      role: "Dental Surgeon",
      company: "Lotus Dental Clinic",
      bio: "Gentle, pain-free dental care for the whole family.",
      avatar_url: "/examples/dentist-avatar.webp",
      cover_images: ["/examples/clinic-cover.webp"],
      hours: "Mon–Sat · 9:00–14:00",
      verified_badge: true,
    };
    c.contact = { ...c.contact, phone: "+91 90000 00002", whatsapp: "+91 90000 00002", email: "care@lotus.example", website: "https://lotus.example" };
    c.links = [
      { id: "l1", title: "Book an appointment", description: "Pick a time that suits you", url: "https://lotus.example/book", icon: "calendar", featured: true },
      { id: "l2", title: "Clinic directions", description: "", url: "https://maps.google.com", icon: "map", featured: false },
    ];
  }
  return c;
}

/**
 * A phone frame showing a live template preview with example content.
 * `width` is the outer frame width; the card is laid out at 375px and scaled down to fit.
 */
export function TemplatePhone({
  template = "vcard",
  width = 300,
  className = "",
}: {
  template?: ExampleTemplate;
  width?: number;
  className?: string;
}) {
  const content = React.useMemo(() => exampleContent(template), [template]);
  const border = width >= 260 ? 8 : 6;
  const inner = width - border * 2;
  const scale = inner / 375;
  const height = Math.round(width * 1.87);
  return (
    <div
      className={`shrink-0 overflow-hidden bg-white shadow-[0_24px_60px_rgba(16,24,40,0.18)] ${className}`}
      style={{ width, height, borderWidth: border, borderColor: "#18181B", borderStyle: "solid", borderRadius: Math.round(width * 0.135) }}
      aria-hidden="true"
      inert
    >
      {/* The card gets its own clipping box at full (unscaled) screen height, so floating bars
          that stick to the bottom of the screen sit at the bottom of the phone, not mid-way. */}
      <div
        className="pointer-events-none w-[375px] origin-top-left overflow-hidden"
        style={{ transform: `scale(${scale})`, height: Math.ceil((height - border * 2) / scale) }}
      >
        <ProfileRenderer
          mode="preview"
          profile={{ username: "example", template_id: template, content, show_branding: false }}
          blocks={[]}
          templateId={template}
          themeTokens={TEMPLATE_MANIFESTS[template].default_theme as ThemeTokens}
        />
      </div>
    </div>
  );
}
