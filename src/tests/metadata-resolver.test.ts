import { describe, it, expect } from "vitest";
import { resolveProfileMetadata } from "@/lib/seo/metadata-resolver";
import type { PublicProfile } from "@/types/profile";

describe("Metadata Fallback Resolver", () => {
  it("resolves full custom SEO and Open Graph metadata when present", () => {
    const profile: PublicProfile = {
      username: "designer",
      display_name: "Jane Designer",
      bio: "Crafting digital experiences.",
      avatar_url: "https://Digicardo.app/media/avatar.png",
      template_id: "vcard",
      seo_title: "Jane Designer | UI/UX Portfolio",
      seo_description: "Explore selected design works and case studies.",
      seo_keywords: ["ui", "ux", "portfolio"],
      og_title: "Jane Designer Projects",
      og_description: "Curated design systems and interactions.",
      og_image_url: "https://Digicardo.app/media/custom-og.jpg",
      primary_custom_domain: "janedesign.com",
      indexable: true,
    };

    const meta = resolveProfileMetadata(profile);

    expect(meta.title).toBe("Jane Designer | UI/UX Portfolio");
    expect(meta.description).toBe("Explore selected design works and case studies.");
    expect(meta.keywords).toEqual(["ui", "ux", "portfolio"]);
    expect(meta.ogTitle).toBe("Jane Designer Projects");
    expect(meta.ogDescription).toBe("Curated design systems and interactions.");
    expect(meta.ogImage).toBe("https://Digicardo.app/media/custom-og.jpg");
    expect(meta.canonicalUrl).toBe("https://janedesign.com/");
    expect(meta.isIndexable).toBe(true);
  });

  it("applies 5-tier fallback cascade when SEO fields are empty", () => {
    const profile: PublicProfile = {
      username: "developer",
      display_name: "Dev Alex",
      bio: "Full stack TypeScript & PHP engineer.",
      avatar_url: "https://Digicardo.app/media/alex.png",
      template_id: "vcard",
      seo_title: null,
      seo_description: null,
      seo_keywords: null,
      og_title: null,
      og_description: null,
      og_image_url: null,
      primary_custom_domain: null,
      indexable: true,
    };

    const meta = resolveProfileMetadata(profile);

    expect(meta.title).toBe("Dev Alex (@developer) — Digicardo");
    expect(meta.description).toBe("Full stack TypeScript & PHP engineer.");
    expect(meta.ogTitle).toBe("Dev Alex");
    expect(meta.ogDescription).toBe("Full stack TypeScript & PHP engineer.");
    expect(meta.ogImage).toBe("https://Digicardo.app/media/alex.png");
    expect(meta.canonicalUrl).toBe("https://Digicardo.app/developer");
  });

  it("falls back to dynamic OG image generator when no image media exists", () => {
    const profile: PublicProfile = {
      username: "minimalist",
      display_name: null,
      bio: null,
      avatar_url: null,
      cover_url: null,
      template_id: "vcard",
    };

    const meta = resolveProfileMetadata(profile);

    expect(meta.title).toBe("@minimalist — Digicardo");
    expect(meta.description).toBe("Find all links and content from @minimalist on Digicardo.");
    expect(meta.ogImage).toBe("https://Digicardo.app/api/og/minimalist");
    expect(meta.canonicalUrl).toBe("https://Digicardo.app/minimalist");
  });

  it("respects indexable false flag for search robots", () => {
    const profile: PublicProfile = {
      username: "stealth",
      display_name: "Stealth Mode",
      bio: "Private founder.",
      avatar_url: null,
      template_id: "vcard",
      indexable: false,
    };

    const meta = resolveProfileMetadata(profile);
    expect(meta.isIndexable).toBe(false);
  });
});
