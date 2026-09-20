import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { VideoBlock } from "@/components/blocks/VideoBlock";
import { MusicBlock } from "@/components/blocks/MusicBlock";
import { MapBlock } from "@/components/blocks/MapBlock";
import { EmailBlock } from "@/components/blocks/EmailBlock";
import { PhoneBlock } from "@/components/blocks/PhoneBlock";
import { WhatsAppBlock } from "@/components/blocks/WhatsAppBlock";
import { BookingBlock } from "@/components/blocks/BookingBlock";
import { FaqBlock } from "@/components/blocks/FaqBlock";
import { GalleryBlock } from "@/components/blocks/GalleryBlock";
import { CountdownBlock } from "@/components/blocks/CountdownBlock";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

describe("Phase 8 Advanced Block Components", () => {
  it("renders VideoBlock with iframe embed", () => {
    const html = renderToStaticMarkup(
      <VideoBlock
        block={{
          id: "01J5K2VIDEO0000000000000001",
          type: "video",
          sort_order: 0,
          config: {
            provider: "youtube",
            url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
            title: "Featured Video",
            embed_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
          },
        }}
      />
    );

    expect(html).toContain("Featured Video");
    expect(html).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("renders MusicBlock with Spotify embed", () => {
    const html = renderToStaticMarkup(
      <MusicBlock
        block={{
          id: "01J5K2MUSIC0000000000000001",
          type: "music",
          sort_order: 1,
          config: {
            provider: "spotify",
            url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
            title: "Favorite Song",
            embed_url: "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT",
          },
        }}
      />
    );

    expect(html).toContain("Favorite Song");
    expect(html).toContain("https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT");
  });

  it("renders MapBlock with address card", () => {
    const html = renderToStaticMarkup(
      <MapBlock
        block={{
          id: "01J5K2MAP000000000000000001",
          type: "map",
          sort_order: 2,
          config: {
            label: "HQ Studio",
            address: "100 Market St, San Francisco, CA",
          },
        }}
      />
    );

    expect(html).toContain("HQ Studio");
    expect(html).toContain("100 Market St, San Francisco, CA");
    expect(html).toContain("google.com/maps");
  });

  it("renders Email, Phone, and WhatsApp blocks with valid action URLs", () => {
    const emailHtml = renderToStaticMarkup(
      <EmailBlock
        block={{
          id: "01J5K2EMAIL0000000000000001",
          type: "email",
          sort_order: 3,
          config: { label: "Contact Email", email: "test@example.com", subject: "Hello" },
        }}
      />
    );
    expect(emailHtml).toContain("Contact Email");
    expect(emailHtml).toContain("mailto:test%40example.com?subject=Hello");

    const phoneHtml = renderToStaticMarkup(
      <PhoneBlock
        block={{
          id: "01J5K2PHONE0000000000000001",
          type: "phone",
          sort_order: 4,
          config: { label: "Call Us", phone: "+1 (555) 123-4567" },
        }}
      />
    );
    expect(phoneHtml).toContain("Call Us");
    expect(phoneHtml).toContain("tel:+15551234567");

    const waHtml = renderToStaticMarkup(
      <WhatsAppBlock
        block={{
          id: "01J5K2WHATS0000000000000001",
          type: "whatsapp",
          sort_order: 5,
          config: { label: "WhatsApp Chat", phone: "+15551234567", message: "Hi!" },
        }}
      />
    );
    expect(waHtml).toContain("WhatsApp Chat");
    expect(waHtml).toContain("wa.me/15551234567?text=Hi");
  });

  it("renders BookingBlock with Calendly link", () => {
    const html = renderToStaticMarkup(
      <BookingBlock
        block={{
          id: "01J5K2BOOK000000000000000001",
          type: "booking",
          sort_order: 6,
          config: {
            provider: "calendly",
            url: "https://calendly.com/user/30min",
            title: "Schedule Consultation",
          },
        }}
      />
    );

    expect(html).toContain("Schedule Consultation");
    expect(html).toContain("https://calendly.com/user/30min");
  });

  it("renders FaqBlock with accordion items", () => {
    const html = renderToStaticMarkup(
      <FaqBlock
        block={{
          id: "01J5K2FAQ0000000000000000001",
          type: "faq",
          sort_order: 7,
          config: {
            title: "Frequently Asked Questions",
            items: [
              { id: "q1", question: "What is Digicardo?", answer: "A profile platform." },
            ],
          },
        }}
      />
    );

    expect(html).toContain("Frequently Asked Questions");
    expect(html).toContain("What is Digicardo?");
  });

  it("renders GalleryBlock with image grid", () => {
    const html = renderToStaticMarkup(
      <GalleryBlock
        block={{
          id: "01J5K2GALLERY00000000000001",
          type: "gallery",
          sort_order: 8,
          config: {
            layout: "grid",
            media_ids: ["01J5K2MEDIA000000000000001"],
            images: [
              {
                id: "01J5K2MEDIA000000000000001",
                url: "https://example.com/gallery.jpg",
                alt_text: "Gallery Item",
              },
            ],
          },
        }}
      />
    );

    expect(html).toContain("https://example.com/gallery.jpg");
    expect(html).toContain("Gallery Item");
  });

  it("renders CountdownBlock and CtaBlock", () => {
    const countdownHtml = renderToStaticMarkup(
      <CountdownBlock
        block={{
          id: "01J5K2COUNT0000000000000001",
          type: "countdown",
          sort_order: 9,
          config: {
            title: "Product Launch",
            target_date: "2027-01-01T00:00:00Z",
          },
        }}
      />
    );
    expect(countdownHtml).toContain("Product Launch");

    const ctaHtml = renderToStaticMarkup(
      <CtaBlock
        block={{
          id: "01J5K2CTA000000000000000001",
          type: "cta",
          sort_order: 10,
          config: {
            title: "Exclusive Masterclass",
            description: "Join over 10,000 creators today.",
            button_label: "Enroll Now",
            url: "https://example.com/join",
            style: "primary",
          },
        }}
      />
    );
    expect(ctaHtml).toContain("Exclusive Masterclass");
    expect(ctaHtml).toContain("Enroll Now");
  });

  it("BlockRenderer polymorphically renders all blocks and ignores unknown block types gracefully", () => {
    const element = BlockRenderer({
      block: {
        id: "01J5K2UNK000000000000000001",
        // @ts-expect-error test unknown block
        type: "unknown_custom_embed",
        sort_order: 0,
        config: {},
      },
    });

    expect(element).toBeNull();
  });
});
