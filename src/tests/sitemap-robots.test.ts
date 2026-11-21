import { describe, it, expect, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/seo";

describe("Robots & Sitemap Generation", () => {
  it("generates robots.txt disallowing private dashboard and auth paths", () => {
    const res = robots();

    expect(res.rules).toBeDefined();
    expect(res.sitemap).toBe(`${SITE_URL}/sitemap.xml`);

    const disallow = Array.isArray(res.rules)
      ? res.rules[0]?.disallow
      : (res.rules as { disallow?: string[] })?.disallow;

    // Exact-path rules: the page itself, with a query string, and its sub-pages.
    for (const path of ["/dashboard", "/api", "/login", "/admin"]) {
      expect(disallow).toContain(`${path}$`);
      expect(disallow).toContain(`${path}/`);
    }
    // Next's own CSS/JS must stay crawlable so Google can render the pages.
    expect(disallow).not.toContain("/_next/");
    // Card addresses that only start with a blocked word are not caught.
    expect(disallow).not.toContain("/admin");
  });

  it("generates sitemap without duplicate URLs for custom domains", async () => {
    // Mock fetch for sitemap profile querying
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            username: "user_custom",
            primary_custom_domain: "customdomain.com",
            updated_at: "2026-08-15T00:00:00Z",
          },
          {
            username: "user_standard",
            primary_custom_domain: null,
            updated_at: "2026-08-15T00:00:00Z",
          },
        ],
      }),
    });

    globalThis.fetch = mockFetch;

    const items = await sitemap();

    expect(items.length).toBe(3); // Homepage + 2 profiles
    expect(items.some((i) => i.url === "https://customdomain.com/")).toBe(true);
    expect(items.some((i) => i.url === `${SITE_URL}/user_standard`)).toBe(true);
    expect(items.some((i) => i.url === `${SITE_URL}/user_custom`)).toBe(false); // Duplication prevented
  });
});
