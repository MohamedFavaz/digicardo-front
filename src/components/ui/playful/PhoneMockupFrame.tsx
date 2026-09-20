import * as React from "react";
import { cn } from "@/lib/utils";

export interface PhoneMockupFrameProps {
  children: React.ReactNode;
  tilt?: "none" | "left" | "right" | "center-forward";
  scale?: number;
  className?: string;
  shadow?: boolean;
}

export function PhoneMockupFrame({
  children,
  tilt = "none",
  scale = 1,
  className,
  shadow = true,
}: PhoneMockupFrameProps) {
  const tiltClasses = {
    none: "",
    left: "transform -rotate-6 hover:-rotate-3 transition-transform duration-300",
    right: "transform rotate-6 hover:rotate-3 transition-transform duration-300",
    "center-forward": "transform scale-105 z-10 hover:scale-[1.07] transition-transform duration-300",
  };

  return (
    <div
      className={cn(
        "relative rounded-[40px] p-2.5 bg-slate-900 border-[3.5px] border-slate-800 transition-all duration-300 select-none",
        shadow && "shadow-[0_24px_60px_-12px_rgba(24,24,38,0.25),0_12px_24px_-8px_rgba(112,71,235,0.15)]",
        tiltClasses[tilt],
        className
      )}
      style={{
        width: 280 * scale,
        maxWidth: "100%",
      }}
    >
      {/* Glossy bezel inner line */}
      <div className="relative w-full rounded-[32px] overflow-hidden bg-background border border-slate-800/40">
        {/* Dynamic Island / Top Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
        </div>

        {/* Screen Content Container */}
        <div className="relative w-full min-h-[500px] overflow-y-auto no-scrollbar pt-6">
          {children}
        </div>

        {/* Bottom Home Indicator bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-400/40 rounded-full z-30" />
      </div>
    </div>
  );
}
