import { MetadataRoute } from "next";

const BASE_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://Digicardo.app";
const LARAVEL_INTERNAL_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.LARAVEL_INTERNAL_API_URL ||
  "http://127.0.0.1:8000";

interface SitemapProfileItem {
  username: string;
  primary_custom_domain?: string | null;
  updated_at?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  try {
    const res = await fetch(`${LARAVEL_INTERNAL_URL}/api/v1/internal/sitemap-profiles?limit=1000`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // 1-hour cache
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload && payload.success && Array.isArray(payload.data)) {
        const profiles: SitemapProfileItem[] = payload.data;

        for (const p of profiles) {
          // Choose single canonical URL to prevent duplication
          const profileUrl = p.primary_custom_domain
            ? `https://${p.primary_custom_domain.replace(/\/+$/, "")}/`
            : `${BASE_APP_URL}/${encodeURIComponent(p.username)}`;

          routes.push({
            url: profileUrl,
            lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
            changeFrequency: "daily",
            priority: 0.8,
          });
        }
      }
    }
  } catch (err) {
    console.error("[Sitemap] Failed to fetch public profiles for sitemap", err);
  }

  return routes;
}
