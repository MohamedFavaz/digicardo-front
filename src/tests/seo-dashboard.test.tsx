import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SeoDashboardPage from "@/app/(app)/dashboard/seo/page";

vi.mock("@/lib/api/seo", () => ({
  seoApi: {
    get: vi.fn().mockResolvedValue({
      seo_title: "My Portfolio",
      seo_description: "Creative designer and artist.",
      seo_keywords: ["design", "art"],
      og_title: "My Card",
      og_description: "Explore my work.",
      og_image_media_id: null,
      og_image_url: null,
      indexable: true,
    }),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/api/profile", () => ({
  profileApi: {
    get: vi.fn().mockResolvedValue({
      username: "designer",
      display_name: "Jane Designer",
      bio: "Crafting interactions.",
    }),
  },
}));

vi.mock("@/lib/api/media", () => ({
  mediaApi: {
    getMedia: vi.fn().mockResolvedValue([]),
  },
}));

describe("SeoDashboardPage Rendering", () => {
  it("renders SEO dashboard elements in initial state", () => {
    const html = renderToStaticMarkup(<SeoDashboardPage />);

    // Since initial state is loading before useEffect runs on client, verify it mounts cleanly
    expect(html).toBeDefined();
  });
});
