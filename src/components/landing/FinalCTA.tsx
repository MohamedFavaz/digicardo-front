"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  DoodleSparkle,
  DoodleLoop,
} from "@/components/ui/playful/Doodles";
import { RequestAccessModal } from "@/components/landing/RequestAccessModal";

export function FinalCTA() {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
    <RequestAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Main Colorful Closing Banner ── */}
        <div className="relative rounded-[40px] bg-gradient-to-br from-[#f5f2fe] via-[#fff0f3] to-[#fff8eb] border-2 border-brand-200/80 p-8 sm:p-14 lg:p-20 text-center shadow-float overflow-hidden">
          
          {/* Decorative Sparkles & Doodles */}
          <div className="absolute top-8 left-10 hidden sm:block animate-bounce-subtle">
            <DoodleSparkle color="#7047eb" className="w-8 h-8" />
          </div>
          <div className="absolute bottom-10 right-12 hidden sm:block">
            <DoodleLoop color="#ff4b72" className="w-10 h-10 opacity-70" />
          </div>

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center">
              <Badge variant="purple" size="default" className="gap-1.5 bg-white/90 shadow-xs border-brand-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXCLUSIVE DIGITAL IDENTITY</span>
              </Badge>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.12]">
              Ready to launch your <span className="lf-gradient-brand">Digicardo</span>?
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-lg mx-auto">
              Elevate your digital presence with custom-branded bio pages, contactless NFC cards, and omnichannel audience telemetry.
            </p>

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                type="button"
                variant="pill"
                size="lg"
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-cta hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 h-14 px-9"
              >
                <span>Request Access</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Benefit Checkmarks */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Admin provisioned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Custom domains &amp; NFC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Instant edge delivery</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
    </>
  );
}
