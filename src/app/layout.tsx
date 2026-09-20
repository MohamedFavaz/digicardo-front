import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  // Only load the weights we actually use
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Digicardo — The Modern Digital Business Card & Smart Profile Platform",
  description: "Create your digital business card and link profile in minutes. Share your contact info, vCard data, social links, and physical NFC smart card — all from one stunning page.",
  keywords: ["digicardo", "digital business card", "nfc smart card", "link in bio", "vcard", "smart profile", "digital identity"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
