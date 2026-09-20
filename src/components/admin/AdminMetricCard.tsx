"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  badgeBg?: string;
  badgeColor?: string;
  subStats?: React.ReactNode;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}

export function AdminMetricCard({
  title,
  value,
  icon,
  badgeBg = "bg-brand-50 border-brand-200/80",
  badgeColor = "text-brand-600",
  subStats,
  linkHref,
  linkLabel = "Manage",
  className,
}: AdminMetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-border/80 bg-card p-6 shadow-card flex flex-col justify-between space-y-4 select-none hover:shadow-hover transition-all duration-300",
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
            {title}
          </span>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-2xl border shadow-2xs",
              badgeBg,
              badgeColor
            )}
          >
            {icon}
          </div>
        </div>

        <div className="text-3xl font-black tracking-tight text-foreground">
          {value}
        </div>

        {subStats && (
          <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 flex-wrap">
            {subStats}
          </div>
        )}
      </div>

      {linkHref && (
        <div className="pt-3 border-t border-border/70">
          <Link
            href={linkHref}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>{linkLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
