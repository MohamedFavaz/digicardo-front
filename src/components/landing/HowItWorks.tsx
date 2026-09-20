"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  UserPlus,
  PlusCircle,
  Palette,
  Share2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Create your page",
    desc: "Claim your unique handle in 30 seconds. No credit card or setup fee required.",
    icon: UserPlus,
    badgeColor: "bg-brand-50 text-brand-600 border-brand-200",
  },
  {
    number: "02",
    title: "Add what matters",
    desc: "Drop in your links, videos, music playlists, shop products, and contact forms.",
    icon: PlusCircle,
    badgeColor: "bg-mint-50 text-mint-600 border-mint-200",
  },
  {
    number: "03",
    title: "Make it yours",
    desc: "Personalize typography, color themes, button shapes, and background effects.",
    icon: Palette,
    badgeColor: "bg-coral-50 text-coral border-coral/20",
  },
  {
    number: "04",
    title: "Share everywhere",
    desc: "Put your link in your bio, print dynamic QR codes, or tap with your NFC card.",
    icon: Share2,
    badgeColor: "bg-amber-50 text-amber-700 border-amber/30",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="mint" size="default" className="gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIMPLE ONBOARDING</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Up and running in <span className="lf-gradient-brand">minutes.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            Four simple steps from sign-up to sharing your personalized profile link with the world.
          </p>
        </div>

        {/* ── 4 Connected Visual Step Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-3xl bg-card border border-border/80 p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-foreground/25 tracking-tighter">
                      {step.number}
                    </span>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-2xl border flex items-center justify-center shadow-2xs",
                        step.badgeColor
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-foreground leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center gap-1 text-[11px] font-bold text-brand-600">
                  <span>Fast setup</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
