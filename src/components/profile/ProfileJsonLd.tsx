import React from "react";
import { PublicProfile } from "@/types/profile";
import { resolveProfileMetadata } from "@/lib/seo/metadata-resolver";

interface ProfileJsonLdProps {
  profile: PublicProfile;
}

export const ProfileJsonLd: React.FC<ProfileJsonLdProps> = ({ profile }) => {
  const meta = resolveProfileMetadata(profile);

  // Extract public social URLs from blocks
  const socialUrls: string[] = [];
  if (Array.isArray(profile.blocks)) {
    profile.blocks.forEach((b) => {
      const cfg = b.config as Record<string, unknown> | undefined;
      if (b.type === "social" && cfg && typeof cfg.url === "string") {
        try {
          const parsed = new URL(cfg.url);
          if (parsed.protocol === "https:" || parsed.protocol === "http:") {
            socialUrls.push(parsed.href);
          }
        } catch {
          // ignore invalid URLs
        }
      }
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": profile.id ? undefined : undefined,
    "mainEntity": {
      "@type": "Person",
      "name": profile.display_name || `@${profile.username}`,
      "alternateName": `@${profile.username}`,
      "identifier": profile.username,
      "description": meta.description,
      "url": meta.canonicalUrl,
      "image": meta.ogImage,
      ...(socialUrls.length > 0 ? { "sameAs": socialUrls } : {}),
    },
  };

  // Prevent XSS script injection via JSON-LD
  const sanitizedJson = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedJson }}
    />
  );
};
