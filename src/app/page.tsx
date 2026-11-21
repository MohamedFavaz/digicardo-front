import * as React from "react";
import type { Metadata } from "next";
import { LandingClient } from "@/components/landing/LandingClient";
import { CONTACT_PHONES, HOME_FAQS, SEO_DESCRIPTION, SEO_TITLE, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: SEO_TITLE },
  description: SEO_DESCRIPTION,
  alternates: { canonical: "/" },
};

/**
 * Structured data for Google: who we are (Organization), the site (WebSite), what we sell with
 * real prices (Product + Offers), and the FAQ shown on the page (FAQPage). Everything here
 * mirrors visible page content, as Google requires.
 */
function structuredData() {
  const org = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SEO_DESCRIPTION,
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: CONTACT_PHONES.map((c) => ({
      "@type": "ContactPoint",
      telephone: c.tel,
      contactType: c.type,
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Malayalam"],
    })),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  const product = {
    "@type": "Product",
    "@id": `${SITE_URL}/#product`,
    name: "Digicardo Digital Business Card",
    description:
      "A digital business card (digital visiting card) with its own link, QR code and NFC support — save contact, WhatsApp, call, UPI payments, location, gallery and enquiries in one page.",
    brand: { "@id": `${SITE_URL}/#organization` },
    image: `${SITE_URL}/og-image.jpg`,
    offers: [
      {
        "@type": "Offer",
        name: "1 Year plan",
        price: "1000",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/register?plan=1year`,
      },
      {
        "@type": "Offer",
        name: "Lifelong plan",
        price: "4000",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/register?plan=lifetime`,
      },
    ],
  };
  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return { "@context": "https://schema.org", "@graph": [org, website, product, faq] };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output only; "<" is escaped so the data can't break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }}
      />
      <LandingClient />
    </>
  );
}
