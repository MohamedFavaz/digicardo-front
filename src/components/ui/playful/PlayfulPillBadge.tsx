import * as React from "react";
import { cn } from "@/lib/utils";

export type PlayfulTheme = "purple" | "coral" | "amber" | "mint" | "sky" | "neutral";

export interface PlayfulPillBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: PlayfulTheme;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

const themeStyles: Record<PlayfulTheme, { bg: string; text: string; border: string; iconBg?: string }> = {
  purple: {
    bg: "bg-brand-50",
    text: "text-brand-700",
    border: "border-brand-200/80",
    iconBg: "bg-brand-100/80",
  },
  coral: {
    bg: "bg-coral-50",
    text: "text-coral-700",
    border: "border-coral/20",
    iconBg: "bg-coral-100/80",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber/30",
    iconBg: "bg-amber-100/80",
  },
  mint: {
    bg: "bg-mint-50",
    text: "text-mint-700",
    border: "border-mint/25",
    iconBg: "bg-mint-100/80",
  },
  sky: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky/25",
    iconBg: "bg-sky-100/80",
  },
  neutral: {
    bg: "bg-muted/80",
    text: "text-foreground",
    border: "border-border",
    iconBg: "bg-muted",
  },
};

const sizeStyles = {
  sm: "px-3 py-1 text-xs gap-1.5",
  md: "px-3.5 py-1.5 text-xs font-semibold gap-2",
  lg: "px-4.5 py-2 text-sm font-semibold gap-2.5",
};

export function PlayfulPillBadge({
  theme = "purple",
  icon,
  children,
  size = "md",
  clickable = false,
  className,
  ...props
}: PlayfulPillBadgeProps) {
  const t = themeStyles[theme];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border shadow-sm transition-all duration-200 select-none",
        t.bg,
        t.text,
        t.border,
        sizeStyles[size],
        clickable && "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        className
      )}
      {...props}
    >
      {icon && (
        <span className={cn("inline-flex items-center justify-center rounded-full text-xs", t.iconBg)}>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}
