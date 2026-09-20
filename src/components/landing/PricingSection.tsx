"use client";

import * as React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [annual, setAnnual] = React.useState(true);

  const plans = [
    {
      id: "free",
      name: "Starter",
      tagline: "Essential link-in-bio for emerging creators.",
      priceMonthly: 0,
      priceAnnual: 0,
      badge: null,
      highlight: false,
      features: [
        "Unlimited custom links",
        "Up to 10 active blocks",
        "5 Modern profile templates",
        "Standard QR code generation",
        "7-Day analytics telemetry",
        "Standard Digicardo.app/you handle",
      ],
      ctaText: "Request Starter Access",
      ctaHref: "/register",
    },
    {
      id: "pro",
      name: "Pro Creator",
      tagline: "Advanced customization & custom branding.",
      priceMonthly: 9,
      priceAnnual: 7,
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "Everything in Starter, plus:",
        "Unlimited content blocks",
        "All premium templates & custom CSS themes",
        "1 Custom Domain (yourname.com)",
        "30-Day detailed analytics & referrer tracking",
        "Branded QR Codes & NFC card profiles",
        "Remove Digicardo footer branding",
        "Priority customer support",
      ],
      ctaText: "Request Pro Access",
      ctaHref: "/register",
    },
    {
      id: "business",
      name: "Business & Agency",
      tagline: "Maximum scale, team tools & custom domains.",
      priceMonthly: 29,
      priceAnnual: 23,
      badge: "ENTERPRISE",
      highlight: false,
      features: [
        "Everything in Pro Creator, plus:",
        "Up to 5 Custom Domains",
        "90-Day analytics with CSV/PDF exports",
        "Custom OpenGraph cards & advanced SEO",
        "Direct Contact inbox with email forwarding",
        "Dedicated VIP onboarding & 99.9% uptime SLA",
      ],
      ctaText: "Request Enterprise Access",
      ctaHref: "/register",
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden bg-background">

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-16">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-black uppercase tracking-wider font-mono shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-brand-600" />
            <span>TRANSPARENT, HONEST PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Simple plans for creators <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#7047eb] via-[#8b5cf6] to-[#ff4b72] bg-clip-text text-transparent">
              at every stage of growth.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            Start completely free. Upgrade anytime for custom domains, deeper analytics telemetry, and unlimited creative freedom.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={cn("text-xs font-bold transition-colors", !annual ? "text-foreground font-black" : "text-muted-foreground")}>
              Monthly
            </span>

            <button
              type="button"
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-8 rounded-full bg-card border border-border/80 p-1 shadow-inner transition-colors focus:outline-none"
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full bg-brand-600 transition-transform duration-200 shadow-cta",
                  annual ? "translate-x-6 bg-brand-600" : "translate-x-0 bg-muted-foreground"
                )}
              />
            </button>

            <span className={cn("text-xs font-bold transition-colors flex items-center gap-1.5", annual ? "text-foreground font-black" : "text-muted-foreground")}>
              <span>Annual</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase">
                Save 22%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-[36px] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300",
                  plan.highlight
                    ? "bg-card border-2 border-brand-500 shadow-float ring-4 ring-brand-500/10 -translate-y-1"
                    : "bg-card border border-border/80 shadow-card hover:shadow-float hover:-translate-y-0.5"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider shadow-cta flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground font-mono">
                      / month {annual && price > 0 ? "(billed yearly)" : ""}
                    </span>
                  </div>

                  <div className="h-px bg-border/60" />

                  {/* Features List */}
                  <ul className="space-y-3 text-xs">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 font-medium text-foreground">
                        <div className="w-4 h-4 rounded-full bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="pt-8 mt-auto">
                  <Link
                    href={plan.ctaHref}
                    className={cn(
                      buttonVariants({
                        variant: plan.highlight ? "pill" : "outline",
                      }),
                      "w-full h-11 text-xs font-black gap-2 transition-all inline-flex items-center justify-center cursor-pointer",
                      plan.highlight
                        ? "bg-brand-600 hover:bg-brand-700 text-white shadow-cta"
                        : "rounded-full border-border/80 bg-card hover:bg-muted font-bold shadow-2xs"
                    )}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
