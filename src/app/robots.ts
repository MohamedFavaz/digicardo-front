import { MetadataRoute } from "next";

const BASE_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://Digicardo.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/dashboard/*",
        "/api",
        "/api/",
        "/api/*",
        "/login",
        "/register",
        "/forgot-password",
        "/_next/",
      ],
    },
    sitemap: `${BASE_APP_URL}/sitemap.xml`,
  };
}
