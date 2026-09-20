import React from "react";
import { Sparkles, Crown, Zap } from "lucide-react";

interface PlanBadgeProps {
  planCode?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({
  planCode = "free",
  className = "",
  size = "md",
}) => {
  const code = (planCode || "free").toLowerCase();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2",
  }[size];

  if (code === "business") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm ${sizeClasses} ${className}`}
        data-testid="plan-badge-business"
      >
        <Crown className={size === "sm" ? "w-3 h-3 text-amber-500" : "w-3.5 h-3.5 text-amber-500"} />
        <span>Business</span>
      </span>
    );
  }

  if (code === "pro") {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm ${sizeClasses} ${className}`}
        data-testid="plan-badge-pro"
      >
        <Sparkles className={size === "sm" ? "w-3 h-3 text-indigo-500" : "w-3.5 h-3.5 text-indigo-500"} />
        <span>Pro</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${sizeClasses} ${className}`}
      data-testid="plan-badge-free"
    >
      <Zap className={size === "sm" ? "w-3 h-3 text-slate-400" : "w-3.5 h-3.5 text-slate-400"} />
      <span>Free Plan</span>
    </span>
  );
};
