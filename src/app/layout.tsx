import type { Metadata, Viewport } from "next";
import { SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE, SITE_NAME, SITE_URL } from "@/lib/seo";
import localFont from "next/font/local";
import { Suspense } from "react";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import "./globals.css";


// Inter (SIL Open Font License), self-hosted latin variable font 400–800 — builds never depend
// on reaching Google Fonts (a bad Google response once failed a Vercel deploy).
const inter = localFont({
  src: [{ path: "../lib/fonts/files/inter-latin.woff2", weight: "400 800", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SEO_TITLE, template: `%s | ${SITE_NAME}` },
  description: SEO_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SEO_KEYWORDS,
  category: "business",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: SITE_URL,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Digicardo digital business card templates" }],
  },
  twitter: { card: "summary_large_image", title: SEO_TITLE, description: SEO_DESCRIPTION, images: ["/og-image.jpg"] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Paste the code from Google Search Console / Bing Webmaster Tools into these env vars.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F6F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={inter.variable}>
      <head />
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans antialiased">
        {/* Global route-change progress indicator — zero cost, pure CSS transitions */}
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        {children}
      </body>

    </html>
  );
}
