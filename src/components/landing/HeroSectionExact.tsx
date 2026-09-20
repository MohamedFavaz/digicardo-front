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
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide"
                style={{ backgroundColor: "#eeebfc", color: "#5B3FE4" }}
              >
                Digital Visiting Card
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 leading-[1.12] tracking-tight">
              One Card.
              <br />
              Many <span style={{ color: "#5B3FE4" }}>Possibilities.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
              Create a beautiful digital visiting card and share it instantly with
              anyone, anywhere. Simple, professional and always with you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-bold text-white transition-all transform hover:-translate-y-0.5 active:scale-98"
                style={{
                  backgroundColor: "#5B3FE4",
                  boxShadow: "0 8px 22px rgba(91, 63, 228, 0.32)",
                }}
              >
                <span>Create Your Card</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full text-sm sm:text-base font-bold text-slate-900 hover:text-[#5B3FE4] bg-transparent transition-colors group cursor-pointer"
              >
                <span
                  className="w-8 h-8 rounded-full border border-slate-300 group-hover:border-[#5B3FE4] flex items-center justify-center transition-colors"
                  style={{ color: "#5B3FE4" }}
                >
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
              
              {/* Phone Image Mockup with lavender aura */}
              <div className="relative z-10 w-[340px] sm:w-[420px] lg:w-[470px] xl:w-[500px] flex items-center justify-center">
                <img
                  src="/hero-phone.png"
                  alt="Digicardo Digital Visiting Card Preview"
                  className="w-full h-auto object-contain select-none pointer-events-none mix-blend-multiply"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(91, 63, 228, 0.06))",
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
