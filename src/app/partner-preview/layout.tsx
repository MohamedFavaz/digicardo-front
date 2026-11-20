import type { Metadata } from "next";
import { nestlySans, nestlySerif } from "@/lib/fonts/nestly";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

export default function PartnerPreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${nestlySans.variable} ${nestlySerif.variable}`}>{children}</div>;
}
