"use client";

import * as React from "react";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";
import { CreateSection, Hero, NavBar, ShareSection } from "@/components/landing/home/Top";
import { AnalyticsSection, BentoSection, MadeForSection, TemplatesSection } from "@/components/landing/home/Middle";
import { ContactSection, FaqSection, FinalSection, PricingSection } from "@/components/landing/home/Bottom";

/**
 * The public home page — bold, colour-blocked sections:
 * hero (lime) → create (violet) → share (plum) → analytics (lavender) → made for + bento + templates (cream)
 * → pricing (white) → FAQ (plum) → contact (lime) → call to action + footer (violet).
 */
export function LandingClient() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white antialiased [scroll-behavior:smooth]">
      <NavBar />
      <main>
        <Hero />
        <CreateSection />
        <ShareSection />
        <AnalyticsSection />
        <MadeForSection />
        <BentoSection />
        <TemplatesSection />
        <PricingSection />
        <FaqSection />
        <ContactSection />
      </main>
      <FinalSection />
      <FloatingWhatsApp />
    </div>
  );
}
