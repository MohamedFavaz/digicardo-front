import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PartnerLanding } from "@/components/partner/PartnerLanding";
import { nestlySans, nestlySerif } from "@/lib/fonts/nestly";
import type { PartnerPublicPayload } from "@/lib/partner/types";

const LARAVEL_INTERNAL_URL = process.env.LARAVEL_INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

const getPartner = cache(async (slug: string): Promise<PartnerPublicPayload | null> => {
  if (!/^[a-z0-9-]{3,60}$/.test(slug)) return null;
  try {
    const res = await fetch(`${LARAVEL_INTERNAL_URL}/api/v1/public/partners/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: [`partner-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? (json.data as PartnerPublicPayload) : null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = await getPartner(slug.toLowerCase());
  if (!site) return { title: "Page not found", robots: { index: false, follow: false } };
  const { brand, hero, seo } = site.content;
  const title = seo.title || `${brand.name} — ${brand.tagline || "Digital business cards"}`;
  const description = seo.description || hero.subtitle;
  return {
    title,
    description,
    alternates: { canonical: site.page_url },
    openGraph: { type: "website", title, description, url: site.page_url, siteName: brand.name },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** An agent's landing page: /partner/{slug}, or the root of the agent's own domain. */
export default async function PartnerPage({ params }: Props) {
  const { slug } = await params;
  const site = await getPartner(slug.toLowerCase());
  if (!site) notFound();

  return (
    <div className={`${nestlySans.variable} ${nestlySerif.variable}`}>
      <PartnerLanding content={site.content} showcase={site.showcase} slug={site.slug} />
    </div>
  );
}
