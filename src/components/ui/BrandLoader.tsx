"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Branded loading screen: the Digicardo tap symbol "sends" its waves, under a soft violet glow,
 * with the wordmark, a gliding progress bar and a short friendly message. Motion stops for
 * people who prefer reduced motion (motion-safe variants).
 */

const MESSAGES = ["Getting things ready…", "Polishing your card…", "Almost there…"];

function AnimatedMark({ size = 72 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* glow */}
      <div
        aria-hidden="true"
        className="absolute inset-[-55%] rounded-full bg-[radial-gradient(closest-side,#7C5CFF66,transparent)] motion-safe:animate-glow-pulse"
      />
      <svg viewBox="0 0 64 64" width={size} height={size} className="relative drop-shadow-[0_14px_28px_rgba(91,63,228,0.45)]" aria-hidden="true">
        <defs>
          <linearGradient id="bl-tile" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7259F2" />
            <stop offset="1" stopColor="#4A2FD8" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill="url(#bl-tile)" />
        <g transform="translate(14.1 14.6) scale(1.45)">
          <circle cx="5" cy="12" r="3.2" fill="#fff" className="origin-center [transform-box:fill-box] motion-safe:animate-tap-dot" />
          <path d="M11.5 5.5a9.2 9.2 0 0 1 0 13" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" className="motion-safe:animate-tap-wave [animation-delay:0.15s]" />
          <path d="M17 1.8a14.5 14.5 0 0 1 0 20.4" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" className="motion-safe:animate-tap-wave [animation-delay:0.4s]" />
        </g>
      </svg>
    </div>
  );
}

export function BrandLoader({
  fullScreen = true,
  label,
  className,
}: {
  fullScreen?: boolean;
  /** Fixed message instead of the rotating ones. */
  label?: string;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    if (label) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 1600);
    return () => window.clearInterval(t);
  }, [label]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center bg-background",
        fullScreen ? "fixed inset-0 z-50" : "min-h-[60vh] w-full",
        className,
      )}
    >
      {/* faint grid + glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#18181B08_1px,transparent_1px),linear-gradient(to_bottom,#18181B08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_45%_40%_at_50%_50%,#000_30%,transparent_100%)]"
      />
      <div className="relative flex flex-col items-center">
        <AnimatedMark />
        <span className="mt-7 inline-flex items-start text-[22px] font-extrabold leading-none tracking-[-0.045em] text-[#1C1245]">
          Digicardo
        </span>
        <div className="relative mt-5 h-1 w-40 overflow-hidden rounded-full bg-[#EDE9FE]">
          <div className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-[linear-gradient(90deg,#5B3FE4,#8B5CF6,#06B6D4)] motion-safe:animate-loader-bar motion-reduce:w-full" />
        </div>
        <p key={label ?? index} className="mt-4 text-sm font-medium text-muted-foreground motion-safe:animate-card-fade">
          {label ?? MESSAGES[index]}
        </p>
      </div>
    </div>
  );
}
