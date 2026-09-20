import { cache } from "react";
import { notFound } from "next/navigation";
import { UsernameSchema } from "@/lib/validation/profile";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import { ProfileJsonLd } from "@/components/profile/ProfileJsonLd";
import { resolveProfileMetadata } from "@/lib/seo/metadata-resolver";
import type { PublicProfile, ThemeTokens } from "@/types/profile";
import type { Metadata } from "next";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

const LARAVEL_INTERNAL_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.LARAVEL_INTERNAL_API_URL ||
  "http://127.0.0.1:8000";

export const revalidate = 60;

interface PublicProfileResponse extends PublicProfile {
  theme_tokens?: ThemeTokens | null;
}

const getPublicProfile = cache(async (username: string): Promise<PublicProfileResponse | null> => {
  const normalized = username.trim().toLowerCase();
  const url = `${LARAVEL_INTERNAL_URL}/api/v1/p/${encodeURIComponent(normalized)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 60,
        tags: [`profile-${normalized}`],
      },
    });

    if (!res.ok) {
      return null;
    }

    const payload = await res.json();
    if (payload && payload.success && payload.data) {
      return payload.data as PublicProfileResponse;
    }

    return null;
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    return {
      title: "Profile Not Found — Digicardo",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const meta = resolveProfileMetadata(profile);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords.length > 0 ? meta.keywords : undefined,
    alternates: {
      canonical: meta.canonicalUrl,
    },
    robots: {
      index: meta.isIndexable,
      follow: meta.isIndexable,
      googleBot: {
        index: meta.isIndexable,
        follow: meta.isIndexable,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "profile",
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: meta.canonicalUrl,
      siteName: "Digicardo",
      username: profile.username,
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [meta.ogImage],
    },
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;

  // Validate username format
  const parsedUsername = UsernameSchema.safeParse(username.toLowerCase());
  if (!parsedUsername.success) {
    notFound();
  }

  const profile = await getPublicProfile(username);
  if (!profile) {
    notFound();
  }

  const blocks = profile.blocks ?? [];

  return (
    <>
      <ProfileJsonLd profile={profile} />
      <ProfileRenderer
        profile={profile}
        blocks={blocks}
        templateId={profile.template_id}
        themeTokens={profile.theme_tokens}
      />
    </>
  );
}
