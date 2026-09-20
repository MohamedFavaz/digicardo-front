"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: "How does Digicardo differ from basic link-in-bio services?",
      answer:
        "Digicardo combines full-page creative freedom with omnichannel distribution. Rather than a static list of buttons, you get digital business cards, interactive content blocks, vCard contact downloads, complete theme token controls, real-time analytics, branded QR codes, and custom domain routing.",
    },
    {
      question: "Can I connect my own custom domain (e.g. yourname.com)?",
      answer:
        "Yes! Pro and Business plans support custom domains. You can connect your domain via standard CNAME and TXT records, with automatic SSL certificate provisioning and global edge-caching.",
    },
    {
      question: "Is there really a free forever plan?",
      answer:
        "Yes. The Starter plan is 100% free with no credit card required. You get unlimited custom links, contact blocks, digital business card templates, and 7-day analytics telemetry.",
    },
    {
      question: "How fast do public profile pages load?",
      answer:
        "Public profiles are globally edge-cached on Cloudflare with a sub-100ms Time-to-First-Byte (TTFB). Your visitors experience instantaneous page loads anywhere in the world.",
    },
    {
      question: "How do QR codes and NFC cards work?",
      answer:
        "Every Digicardo profile automatically gets a high-resolution customizable QR code you can download for print, business cards, and merchandise. You can also configure physical Digicardo NFC smart cards to share your contact details and links with a single contactless tap.",
    },
    {
      question: "Can I cancel or switch my plan at any time?",
      answer:
        "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your Billing settings with zero lock-in or cancellation fees.",
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-muted/20 border-t border-border/70 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black uppercase tracking-wider font-mono shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Everything you need to know <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#7047eb] to-[#ff4b72] bg-clip-text text-transparent">
              before getting started.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl mx-auto">
            Got questions? We have got answers. If you need further help, our support team is always available.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-[28px] border transition-all duration-200 overflow-hidden",
                  isOpen
                    ? "bg-card border-brand-300/80 shadow-card"
                    : "bg-card/70 border-border/80 hover:bg-card hover:border-border"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 select-none focus:outline-none"
                >
                  <span className="text-sm font-black text-foreground">{faq.question}</span>
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground flex-shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180 bg-brand-50 text-brand-600" : ""
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-muted-foreground font-medium leading-relaxed border-t border-border/40 animate-in fade-in-50 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground font-medium">
            Still have questions?{" "}
            <a href="mailto:support@Digicardo.app" className="font-bold text-brand-600 hover:underline">
              Contact our team
            </a>{" "}
            — we are here to help 24/7.
          </p>
        </div>

      </div>
    </section>
  );
}
