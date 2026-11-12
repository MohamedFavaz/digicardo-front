"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function HeroSectionExact({ onOpenDemo }: { onOpenDemo?: () => void }) {
  return (
    <section className="relative overflow-hidden pt-4 pb-12 lg:pt-8 lg:pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ── Left Column: Value Proposition ── */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
            {/* Pill Tag */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                <span>Digital Business Card &amp; Smart Profile</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 leading-[1.12] tracking-tight">
              One Card.
              <br />
              Endless <span className="underline decoration-slate-300 decoration-wavy decoration-from-font">Possibilities.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
              Create a sleek digital visiting card and share it instantly with
              anyone, anywhere. Simple, professional, contactless and always with you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-slate-900 hover:bg-black transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span>Create Your Card</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full text-sm sm:text-base font-bold text-slate-800 hover:text-black bg-white hover:bg-slate-50 border border-slate-200/80 transition-colors shadow-2xs group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-slate-900 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span>View Demo</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Professional"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Professional"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Professional"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Professional"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                Trusted by professionals
              </span>
            </div>
          </div>

          {/* ── Right Column: Phone Image Merged with Background & Doodle ── */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-center relative">
            <div className="relative inline-flex items-center justify-center max-w-full">

              {/* Phone Image Mockup with neutral drop shadow */}
              <div className="relative z-10 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] lg:max-w-[470px] xl:max-w-[500px] flex items-center justify-center mx-auto">
                <img
                  src="/hero-phone.png"
                  alt="Digicardo Digital Visiting Card Preview"
                  className="w-full h-auto max-w-full object-contain select-none pointer-events-none mix-blend-multiply"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(15, 23, 42, 0.08))",
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
