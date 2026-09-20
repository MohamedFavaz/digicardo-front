"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Infinity as InfinityIcon, Check } from "lucide-react";

export function PricingExact() {
  const plan1Features = [
    "Your personalized digital card",
    "Share via link or QR code",
    "Update anytime",
    "Professional templates",
    "1 year access",
  ];

  const plan2Features = [
    "Your personalized digital card",
    "Share via link or QR code",
    "Update anytime",
    "Professional templates",
    "Lifetime access",
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div>
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{ backgroundColor: "#eeebfc", color: "#5B3FE4" }}
            >
              Simple Pricing
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Plan
          </h2>

          <p className="text-sm sm:text-base text-slate-500 font-medium">
            One card. More opportunities.
          </p>
        </div>

        {/* ── Pricing Cards Grid ── */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* ── Card 1: 1 Year Plan ── */}
          <div className="bg-white rounded-[28px] border border-slate-200 p-7 sm:p-9 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#eeebfc", color: "#5B3FE4" }}
                >
                  <Calendar className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">
                  1 Year Plan
                </h3>
                <div className="flex items-baseline justify-center gap-1 mt-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    ₹1,000
                  </span>
                  <span className="text-slate-500 font-medium text-xs sm:text-sm">
                    / year
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 mb-8">
                {plan1Features.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check
                      className="w-4 h-4 stroke-[2.5] flex-shrink-0"
                      style={{ color: "#5B3FE4" }}
                    />
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <Link
              href="/register?plan=1year"
              className="w-full text-center py-3.5 px-6 rounded-full font-bold text-sm border-2 transition-all duration-200 active:scale-98 block"
              style={{
                borderColor: "#5B3FE4",
                color: "#5B3FE4",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#5B3FE4";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#5B3FE4";
              }}
            >
              Get 1 Year Plan
            </Link>
          </div>

          {/* ── Card 2: Lifelong Plan (Best Value) ── */}
          <div
            className="bg-white rounded-[28px] p-7 sm:p-9 flex flex-col justify-between relative"
            style={{
              border: "2px solid #5B3FE4",
              boxShadow: "0 12px 32px rgba(91, 63, 228, 0.12)",
            }}
          >
            {/* Best Value Badge */}
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm"
              style={{ backgroundColor: "#5B3FE4" }}
            >
              Best Value
            </div>

            <div>
              {/* Icon & Title */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#eeebfc", color: "#5B3FE4" }}
                >
                  <InfinityIcon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mb-1">
                  Lifelong Plan
                </h3>
                <div className="flex items-baseline justify-center gap-1 mt-1 mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    ₹4,000
                  </span>
                  <span className="text-slate-500 font-medium text-xs sm:text-sm">
                    / lifetime
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 mb-8">
                {plan2Features.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check
                      className="w-4 h-4 stroke-[2.5] flex-shrink-0"
                      style={{ color: "#5B3FE4" }}
                    />
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <Link
              href="/register?plan=lifetime"
              className="w-full text-center py-3.5 px-6 rounded-full font-bold text-sm text-white transition-all duration-200 active:scale-98 block"
              style={{
                backgroundColor: "#5B3FE4",
                boxShadow: "0 6px 18px rgba(91, 63, 228, 0.32)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4A32C0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#5B3FE4";
              }}
            >
              Get Lifelong Plan
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
