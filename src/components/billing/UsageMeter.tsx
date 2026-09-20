"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface UsageMeterProps {
  title: string;
  usage: number;
  limit: number | null;
  unit?: string;
  description?: string;
  className?: string;
}

export const UsageMeter: React.FC<UsageMeterProps> = ({
  title,
  usage,
  limit,
  unit = "",
  description,
  className = "",
}) => {
  const isUnlimited = limit === null || limit === -1;
  const percentage = isUnlimited ? 0 : limit > 0 ? Math.min(100, Math.round((usage / limit) * 100)) : 100;
  const isAtLimit = !isUnlimited && limit !== null && usage >= limit;
  const isNearLimit = !isUnlimited && limit !== null && usage / limit >= 0.8 && !isAtLimit;

  return (
    <div
      className={cn(
        "p-5 rounded-[28px] border border-border/80 bg-card shadow-card space-y-3 select-none",
        className
      )}
      data-testid="usage-meter"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-foreground">{title}</span>
        <span className="text-xs font-bold text-muted-foreground font-mono">
          {isUnlimited ? (
            <span className="text-brand-600 font-black">Unlimited</span>
          ) : (
            <span>
              <strong className="text-foreground font-black">{usage}</strong>
              {" / "}
              {limit} {unit}
            </span>
          )}
        </span>
      </div>

      {!isUnlimited ? (
        <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              isAtLimit
                ? "bg-rose-500"
                : isNearLimit
                ? "bg-amber-500"
                : "bg-gradient-to-r from-brand-500 to-emerald-400"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      ) : (
        <div className="w-full bg-emerald-50 border border-emerald-200/60 h-2.5 rounded-full overflow-hidden">
          <div className="h-full w-full bg-emerald-500/30 rounded-full" />
        </div>
      )}

      {description && (
        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
          {description}
        </p>
      )}

      {isAtLimit && (
        <p className="text-[11px] font-bold text-rose-600">
          Capacity limit reached. Upgrade plan to increase.
        </p>
      )}
    </div>
  );
};
