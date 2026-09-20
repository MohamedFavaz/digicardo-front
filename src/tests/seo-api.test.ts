import { describe, it, expect, vi, beforeEach } from "vitest";
import { seoApi } from "@/lib/api/seo";
import { apiClient } from "@/lib/api/client";
import type { ProfileSeoData } from "@/types/seo";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("seoApi Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches authenticated profile SEO configuration", async () => {
    const mockSeo: ProfileSeoData = {
      seo_title: "My Portfolio",
      seo_description: "Creative links and works.",
      seo_keywords: ["art", "design"],
      og_title: "My Social Card",
      og_description: "Check out my profile.",
      og_image_media_id: "01M0MED123",
      og_image_url: "https://Digicardo.app/media/og.png",
      indexable: true,
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockSeo);

    const res = await seoApi.get();

    expect(apiClient.get).toHaveBeenCalledWith("/profile/seo");
    expect(res.seo_title).toBe("My Portfolio");
    expect(res.seo_keywords).toEqual(["art", "design"]);
  });

  it("updates profile SEO configuration", async () => {
    const updatedSeo: ProfileSeoData = {
      seo_title: "Updated Title",
      seo_description: "Updated Description",
      seo_keywords: ["tech"],
      og_title: "Updated OG",
      og_description: "Updated OG Desc",
      og_image_media_id: null,
      og_image_url: null,
      indexable: false,
    };

    vi.mocked(apiClient.patch).mockResolvedValue(updatedSeo);

    const res = await seoApi.update({
      seo_title: "Updated Title",
      seo_description: "Updated Description",
      seo_keywords: ["tech"],
      indexable: false,
    });

    expect(apiClient.patch).toHaveBeenCalledWith("/profile/seo", {
      seo_title: "Updated Title",
      seo_description: "Updated Description",
      seo_keywords: ["tech"],
      indexable: false,
    });
    expect(res.indexable).toBe(false);
  });
});
