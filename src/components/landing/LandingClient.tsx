"use client";

import * as React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSectionExact } from "@/components/landing/HeroSectionExact";
import { FeaturesRow } from "@/components/landing/FeaturesRow";
import { PricingExact } from "@/components/landing/PricingExact";
import { WhatsAppContactSection } from "@/components/landing/WhatsAppContactSection";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";
import { FooterExact } from "@/components/landing/FooterExact";
import { X, ChevronDown, CheckCircle2, Play } from "lucide-react";

export function LandingClient() {
  const [showFaqModal, setShowFaqModal] = React.useState(false);
  const [showDemoModal, setShowDemoModal] = React.useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: "How does Digicardo work?",
      answer:
        "Digicardo lets you create a sleek digital visiting card in minutes. You get a unique link and dynamic QR code that you can share with anyone. When someone opens your card or taps an NFC device, they can save your contact directly, view services, and follow your social profiles.",
    },
    {
      question: "What is the difference between the 1 Year and Lifelong plan?",
      answer:
        "The 1 Year Plan gives you full access to all features and templates for 12 months (₹1,000/year). The Lifelong Plan gives you lifetime access with a one-time payment of ₹4,000 with all future updates included.",
    },
    {
      question: "Can I update my contact details after sharing my card?",
      answer:
        "Yes! Any time you update your details, social links, or services from your dashboard, the changes reflect instantly on your live card without needing to change your link or re-print your QR code.",
    },
    {
      question: "Does the recipient need to install an app to view my card?",
      answer:
        "No app installation is required! Your digital visiting card opens instantly in any web browser on smartphones, tablets, and desktop computers.",
    },
    {
      question: "Can I connect my card to a physical NFC card?",
      answer:
        "Yes! Your Digicardo profile URL can be written to any standard NFC smart card or tag, enabling one-tap contact sharing.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#5B3FE4]/15 selection:text-[#5B3FE4] flex flex-col justify-between">
      {/* ── Fixed Navbar ── */}
      <Navbar onOpenFaq={() => setShowFaqModal(true)} />

      {/* ── Main Landing Content (Matches Reference Screenshot) ── */}
      <main className="flex-1 pt-18 sm:pt-20">
        {/* Hero Section */}
        <HeroSectionExact onOpenDemo={() => setShowDemoModal(true)} />

        {/* 4 Feature Highlights Row */}
        <FeaturesRow />

        {/* Pricing Section ("Choose Your Plan") */}
        <PricingExact />

        {/* WhatsApp & Contact Section */}
        <WhatsAppContactSection />
      </main>

      {/* ── Footer ── */}
      <FooterExact />

      {/* ── FAQs Modal (When user clicks FAQs in Navbar) ── */}
      {showFaqModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{ backgroundColor: "#eeebfc", color: "#5B3FE4" }}
                >
                  Help & FAQs
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Frequently Asked Questions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFaqModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = faqOpenIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left gap-3 focus:outline-none"
                    >
                      <span className="text-sm font-bold text-slate-800">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#5B3FE4]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFaqModal(false)}
                className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white transition-colors"
                style={{ backgroundColor: "#5B3FE4" }}
              >
                Close FAQs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Demo Video / Preview Modal ── */}
      {showDemoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-center">
            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#eeebfc", color: "#5B3FE4" }}
            >
              <Play className="w-6 h-6 fill-current ml-1" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Digicardo Interactive Demo
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6 max-w-sm mx-auto">
              Experience how your digital card looks, updates in real-time, and captures leads seamlessly on any device.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4" style={{ color: "#5B3FE4" }} />
                <span>Instant contact saving directly to phone address book</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4" style={{ color: "#5B3FE4" }} />
                <span>Dynamic QR code generator for cards & signage</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4" style={{ color: "#5B3FE4" }} />
                <span>One-tap WhatsApp, Call, Location & Payment links</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDemoModal(false)}
                className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close Preview
              </button>
              <a
                href="/register"
                className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white shadow-md transition-all"
                style={{
                  backgroundColor: "#5B3FE4",
                  boxShadow: "0 6px 18px rgba(91, 63, 228, 0.25)",
                }}
              >
                Create Your Card Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating WhatsApp Quick Chat Widget ── */}
      <FloatingWhatsApp />
    </div>
  );
}
