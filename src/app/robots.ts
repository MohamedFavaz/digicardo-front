import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Crawl rules. Public pages (home, card pages, partner pages) are open; signed-in areas and
 * account flows are blocked. Next's own /_next/ assets must stay crawlable — Google needs the
 * CSS and JS to render and rank the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Exact paths only ("$" = end, "?" = query, "/" = sub-pages), so card addresses that merely
      // start with the same letters (e.g. /adminshop) stay crawlable.
      disallow: [
        "/api$",
        "/api?",
        "/api/",
        "/dashboard$",
        "/dashboard?",
        "/dashboard/",
        "/admin$",
        "/admin?",
        "/admin/",
        "/agent$",
        "/agent?",
        "/agent/",
        "/admin-login$",
        "/admin-login?",
        "/agent-login$",
        "/agent-login?",
        "/agent-login/",
        "/franchise$",
        "/franchise?",
        "/franchise/",
        "/franchise-login$",
        "/franchise-login?",
        "/franchise-login/",
        "/login$",
        "/login?",
        "/login/",
        "/register$",
        "/register?",
        "/register/",
        "/forgot-password$",
        "/forgot-password?",
        "/forgot-password/",
        "/reset-password$",
        "/reset-password?",
        "/reset-password/",
        "/verify-email$",
        "/verify-email?",
        "/verify-email/",
        "/account-deleted$",
        "/account-deleted?",
        "/account-deleted/",
        "/setup$",
        "/setup?",
        "/setup/",
        "/partner-preview$",
        "/partner-preview?",
        "/partner-preview/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
