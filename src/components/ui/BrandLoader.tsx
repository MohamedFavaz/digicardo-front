"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CardTapLoader } from "./CardTapLoader";
import { DigicardoLogo } from "./DigicardoLogo";

/**
 * Branded loading screen: an NFC visiting card taps a phone and the phone fills in with a contact
 * card (CardTapLoader), with the wordmark, a gliding progress bar and a short friendly message.
 * Motion stops for people who prefer reduced motion.
 */

const MESSAGES = ["Getting your card ready…", "Tapping in…", "Saving the contact…", "Almost there…"];

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
    const t = window.setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 1800);
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
        <CardTapLoader width={240} />
        <DigicardoLogo size="md" className="mt-6" />
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
