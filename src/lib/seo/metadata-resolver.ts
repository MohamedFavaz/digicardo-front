import { PublicProfile } from "@/types/profile";
import { ResolvedMetadata } from "@/types/seo";

const BASE_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://Digicardo.app";

/**
 * Resolves complete production-ready metadata for a public profile
 * adhering strictly to the Digicardo 5-tier fallback strategy.
 */
export function resolveProfileMetadata(profile: PublicProfile): ResolvedMetadata {
  const username = profile.username;
  const displayName = profile.display_name?.trim() || null;
  const bio = profile.bio?.trim() || null;

  // 1. Title Fallback: seo_title -> display_name -> username
  const title =
    profile.seo_title?.trim() ||
    (displayName ? `${displayName} (@${username}) — Digicardo` : `@${username} — Digicardo`);

  // 2. Description Fallback: seo_description -> bio -> default copy
  const defaultDescription = displayName
    ? `Find all contact details and links from ${displayName} on Digicardo.`
    : `Find all contact details and links from @${username} on Digicardo.`;

  const description = profile.seo_description?.trim() || bio || defaultDescription;

  // 3. Open Graph Title Fallback: og_title -> seo_title -> display_name -> username
  const ogTitle =
    profile.og_title?.trim() ||
    profile.seo_title?.trim() ||
    displayName ||
    `@${username}`;

  // 4. Open Graph Description Fallback: og_description -> seo_description -> bio -> default
  const ogDescription =
    profile.og_description?.trim() ||
    profile.seo_description?.trim() ||
    bio ||
    defaultDescription;

  // 5. Open Graph Image Fallback: og_image_url -> avatar_url -> cover_url -> dynamic OG generator
  const ogImage =
    profile.og_image_url ||
    profile.avatar_url ||
    profile.cover_url ||
    `${BASE_APP_URL}/api/og/${encodeURIComponent(username)}`;

  // 6. Canonical Public URL: primary custom domain vs standard Digicardo.app/username
  const canonicalUrl = profile.primary_custom_domain
    ? `https://${profile.primary_custom_domain.replace(/\/+$/, "")}/`
    : `${BASE_APP_URL}/${encodeURIComponent(username)}`;

  // 7. Keywords
  const keywords = Array.isArray(profile.seo_keywords)
    ? profile.seo_keywords
    : [];

  const isIndexable = profile.indexable !== false;

  return {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    isIndexable,
  };
}
