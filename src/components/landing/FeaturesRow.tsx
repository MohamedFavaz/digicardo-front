"use client";

import * as React from "react";
import { Share2, Smartphone, PenTool, ShieldCheck } from "lucide-react";

export function FeaturesRow() {
  const features = [
    {
      title: "Instant Sharing",
      description: "Share via link or QR code",
      icon: Share2,
      bgColor: "#eeebfc",
      textColor: "#5B3FE4",
    },
    {
      title: "Works on Any Device",
      description: "Mobile, tablet or desktop",
      icon: Smartphone,
      bgColor: "#eeebfc",
      textColor: "#5B3FE4",
    },
    {
      title: "Professional Design",
      description: "Clean and modern look",
      icon: PenTool,
      bgColor: "#eeebfc",
      textColor: "#5B3FE4",
    },
    {
      title: "Always Yours",
      description: "Update anytime, anywhere",
      icon: ShieldCheck,
      bgColor: "#e8f8f0",
      textColor: "#10b981",
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-center">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex flex-col items-center group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 shadow-2xs"
                  style={{
                    backgroundColor: feature.bgColor,
                    color: feature.textColor,
                  }}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
