"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import type { AnalyticsPeriod } from "@/types/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AnalyticsDateRangeSelectorProps {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  startDate?: string;
  endDate?: string;
  onCustomDateChange?: (start: string, end: string) => void;
  isLoading?: boolean;
}

export function AnalyticsDateRangeSelector({
  period,
  onPeriodChange,
  startDate,
  endDate,
  onCustomDateChange,
  isLoading,
}: AnalyticsDateRangeSelectorProps) {
  const [customStart, setCustomStart] = React.useState(startDate || "");
  const [customEnd, setCustomEnd] = React.useState(endDate || "");

  const periods: { id: AnalyticsPeriod; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
    { id: "custom", label: "Custom" },
  ];

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd && onCustomDateChange) {
      onCustomDateChange(customStart, customEnd);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Period Selection Button Pill Group */}
      <div className="inline-flex items-center p-1 rounded-2xl bg-muted/60 border border-border/80 text-xs font-bold flex-wrap gap-1">
        {periods.map((p) => {
          const isActive = period === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPeriodChange(p.id)}
              disabled={isLoading}
              className={cn(
                "px-3 py-1.5 rounded-xl transition-all select-none",
                isActive
                  ? "bg-card text-brand-700 shadow-xs border border-brand-200"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom Date Picker Inputs */}
      {period === "custom" && (
        <form
          onSubmit={handleApplyCustom}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/80 text-xs shadow-xs animate-in fade-in-50"
        >
          <Calendar className="w-4 h-4 text-muted-foreground ml-1.5 flex-shrink-0" />
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="rounded-xl border border-input bg-card px-2 py-1 text-xs text-foreground focus:outline-none focus:border-brand-600 font-mono"
            required
          />
          <span className="text-muted-foreground font-bold">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="rounded-xl border border-input bg-card px-2 py-1 text-xs text-foreground focus:outline-none focus:border-brand-600 font-mono"
            required
          />
          <Button
            type="submit"
            variant="pill"
            size="sm"
            className="h-7 px-3 text-xs bg-brand-600 text-white font-bold"
          >
            Apply
          </Button>
        </form>
      )}
    </div>
  );
}
