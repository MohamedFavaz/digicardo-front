import { describe, it, expect } from "vitest";
import {
  CreateBlockSchema,
  VideoBlockConfigSchema,
  MusicBlockConfigSchema,
  GalleryBlockConfigSchema,
  ContactBlockConfigSchema,
  CountdownBlockConfigSchema,
  CtaBlockConfigSchema,
} from "@/lib/validation/blocks";
import { BLOCK_DEFINITIONS, BLOCK_CATEGORIES } from "@/lib/blocks/registry";

describe("Block Registry & Zod Schemas", () => {
  it("defines all 18 standard and advanced block types in registry", () => {
    const definedTypes = Object.keys(BLOCK_DEFINITIONS);
    expect(definedTypes).toHaveLength(18);
    expect(BLOCK_CATEGORIES).toHaveLength(5);
  });

  it("validates VideoBlockConfigSchema and rejects dangerous javascript: URLs", () => {
    const valid = VideoBlockConfigSchema.safeParse({
      provider: "youtube",
      url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Video",
    });
    expect(valid.success).toBe(true);

    const validMusic = MusicBlockConfigSchema.safeParse({
      provider: "spotify",
      url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
    });
    expect(validMusic.success).toBe(true);

    const validContact = ContactBlockConfigSchema.safeParse({
      title: "Send Message",
      button_label: "Submit",
    });
    expect(validContact.success).toBe(true);

    const malicious = VideoBlockConfigSchema.safeParse({
      provider: "youtube",
      url: "javascript:alert(1)",
    });
    expect(malicious.success).toBe(false);
  });

  it("validates GalleryBlockConfigSchema and rejects duplicate media IDs", () => {
    const valid = GalleryBlockConfigSchema.safeParse({
      layout: "grid",
      media_ids: ["01J5K2MEDIA000000000000001", "01J5K2MEDIA000000000000002"],
    });
    expect(valid.success).toBe(true);

    const duplicate = GalleryBlockConfigSchema.safeParse({
      layout: "grid",
      media_ids: ["01J5K2MEDIA000000000000001", "01J5K2MEDIA000000000000001"],
    });
    expect(duplicate.success).toBe(false);
  });

  it("validates Countdown and CTA block schemas", () => {
    const validCountdown = CountdownBlockConfigSchema.safeParse({
      title: "Launch",
      target_date: "2026-12-31T23:59:59Z",
    });
    expect(validCountdown.success).toBe(true);

    const validCta = CtaBlockConfigSchema.safeParse({
      title: "Join",
      button_label: "Click Here",
      url: "https://Digicardo.app",
    });
    expect(validCta.success).toBe(true);
  });

  it("CreateBlockSchema discriminated union works for all block types", () => {
    const videoBlock = CreateBlockSchema.safeParse({
      type: "video",
      config: {
        provider: "vimeo",
        url: "https://vimeo.com/76979871",
      },
    });
    expect(videoBlock.success).toBe(true);

    const contactBlock = CreateBlockSchema.safeParse({
      type: "contact",
      config: {
        title: "Contact",
      },
    });
    expect(contactBlock.success).toBe(true);
  });
});
