"use client";

import * as React from "react";
import type { PublicProfileBlock, CountdownBlockConfig } from "@/types/blocks";
import { Clock, Sparkles } from "lucide-react";

interface CountdownBlockProps {
  block: PublicProfileBlock<CountdownBlockConfig>;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const target = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function CountdownBlock({ block }: CountdownBlockProps) {
  const { config } = block;
  const [mounted, setMounted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<TimeRemaining>(() =>
    calculateTimeRemaining(config.target_date)
  );

  React.useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(config.target_date));
    }, 1000);

    return () => clearInterval(interval);
  }, [config.target_date]);

  // Initial SSR render placeholder to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-900/80 p-5 text-center shadow-md">
        <h3
          className="text-sm font-semibold tracking-tight"
          style={{ color: "var(--lf-text-primary, #ffffff)" }}
        >
          {config.title}
        </h3>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="flex flex-col items-center justify-center space-y-1.5 rounded-[var(--lf-radius,0.75rem)] border border-indigo-900/50 bg-indigo-950/30 p-5 text-center shadow-md">
        <Sparkles className="h-6 w-6 text-[var(--lf-accent,#6366f1)]" />
        <h3
          className="text-sm font-bold text-white"
        >
          {config.title}
        </h3>
        <p className="text-xs font-medium text-indigo-300">
          {config.expired_message || "The countdown has ended!"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-900/90 p-5 text-center shadow-lg space-y-3.5">
      <div className="flex items-center justify-center gap-2">
        <Clock className="h-4 w-4 text-[var(--lf-accent,#6366f1)]" />
        <h3
          className="text-sm font-bold tracking-tight text-white"
        >
          {config.title}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.minutes },
          { label: "Secs", value: timeLeft.seconds },
        ].map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center rounded-lg border border-slate-800/80 bg-slate-950/60 py-2.5 shadow-xs"
          >
            <span className="font-mono text-xl font-extrabold text-white">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
