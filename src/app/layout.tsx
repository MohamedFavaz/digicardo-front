import type { Metadata } from "next";
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
  title: "Digicardo — The Modern Digital Business Card & Smart Profile Platform",
  description: "Create your digital business card and link profile in minutes. Share your contact info, vCard data, social links, and physical NFC smart card — all from one stunning page.",
  keywords: ["digicardo", "digital business card", "nfc smart card", "link in bio", "vcard", "smart profile", "digital identity"],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Digicardo — The Modern Digital Business Card & Smart Profile Platform",
    description: "Create your digital business card and link profile in minutes. Share via QR & NFC tap.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* DNS prefetch for key external origins */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
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
