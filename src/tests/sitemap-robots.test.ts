import { describe, it, expect, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("Robots & Sitemap Generation", () => {
  it("generates robots.txt disallowing private dashboard and auth paths", () => {
    const res = robots();

    expect(res.rules).toBeDefined();
    expect(res.sitemap).toBe("https://Digicardo.app/sitemap.xml");

    const disallow = Array.isArray(res.rules)
      ? res.rules[0]?.disallow
      : (res.rules as { disallow?: string[] })?.disallow;

    expect(disallow).toContain("/dashboard");
    expect(disallow).toContain("/api");
    expect(disallow).toContain("/login");
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
    expect(items.some((i) => i.url === "https://Digicardo.app/user_standard")).toBe(true);
    expect(items.some((i) => i.url === "https://Digicardo.app/user_custom")).toBe(false); // Duplication prevented
  });
});
