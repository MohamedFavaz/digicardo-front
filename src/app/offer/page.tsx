import type { Metadata } from "next";
import { OfferLanding } from "@/components/landing/OfferLanding";

/** Landing page for the Instagram / Facebook ad (Malayalam, ₹799 digital card offer). */
export const metadata: Metadata = {
  title: { absolute: "₹799 ഡിജിറ്റൽ വിസിറ്റിംഗ് കാർഡ് | Digicardo" },
  description: "ഒരു ലിങ്കിൽ നിങ്ങളുടെ ബിസിനസ് മുഴുവൻ — കോൾ, WhatsApp, ലൊക്കേഷൻ, UPI. ആപ്പ് വേണ്ട, പ്രിന്റിംഗ് വേണ്ട. വെറും ₹799.",
  alternates: { canonical: "/offer" },
  // Ad-only page: keep it out of Google so it doesn't compete with the home page.
  robots: { index: false, follow: true },
  openGraph: {
    title: "₹799 ഡിജിറ്റൽ വിസിറ്റിംഗ് കാർഡ് | Digicardo",
    description: "ഒരു ലിങ്കിൽ നിങ്ങളുടെ ബിസിനസ് മുഴുവൻ. വെറും ₹799.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function OfferPage() {
  return <OfferLanding />;
}
