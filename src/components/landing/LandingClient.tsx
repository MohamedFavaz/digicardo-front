"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";
import { CarouselSection, Nav } from "@/components/landing/v2/Top";
import { BentoSection, PeopleWall } from "@/components/landing/v2/Middle";
import { FeatureStory, HeroShowcase } from "@/components/landing/v2/Story";
import { SmoothScroll } from "@/components/landing/v2/SmoothScroll";
import { CtaCards, FaqSection, Footer, LimeBand, PricingSection, TemplatesSection } from "@/components/landing/v2/Bottom";

/**
 * The public home page — a calm off-white canvas with scroll-driven motion:
 * pinned hero (cards fly in, fan, fold, travel into the showcase cascade) → photo carousel
 * → pinned statement (stack deals diagonally, then settles into the tab grid) → wall of faces → how-it-works bento → templates rail → pricing
 * → lime marquee band → two CTA cards → FAQ & contact → footer.
 */
export function LandingClient() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-[#F6F6F3] text-[#121018] antialiased">
        <SmoothScroll />
        <Nav />
        <main>
          <HeroShowcase />
          <CarouselSection />
          <FeatureStory />
          <PeopleWall />
          <BentoSection />
          <TemplatesSection />
          <PricingSection />
          <LimeBand />
          <CtaCards />
          <FaqSection />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </MotionConfig>
  );
}
