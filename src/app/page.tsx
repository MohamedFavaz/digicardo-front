import * as React from "react";
import { LandingClient } from "@/components/landing/LandingClient";

export const metadata = {
  title: "Digicardo — The Modern Digital Business Card & Smart Profile Platform",
  description:
    "Create your personalized digital business card and link profile with Digicardo. Share instantly via NFC smart card tap and high-res dynamic QR codes.",
};

export default function HomePage() {
  return <LandingClient />;
}
