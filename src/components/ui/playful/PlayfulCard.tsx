import * as React from "react";
import { cn } from "@/lib/utils";

export interface PlayfulCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentColor?: "purple" | "coral" | "amber" | "mint" | "sky" | "none";
  hoverable?: boolean;
  padded?: boolean;
  children: React.ReactNode;
}

const accentTopBorders = {
  none: "",
  purple: "border-t-4 border-t-brand-600",
  coral: "border-t-4 border-t-coral",
  amber: "border-t-4 border-t-amber",
  mint: "border-t-4 border-t-mint",
  sky: "border-t-4 border-t-sky",
};

export function PlayfulCard({
  accentColor = "none",
  hoverable = true,
  padded = true,
  className,
  children,
  ...props
}: PlayfulCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card text-card-foreground shadow-card transition-all duration-300 overflow-hidden",
        accentTopBorders[accentColor],
        hoverable && "hover:-translate-y-1 hover:shadow-hover hover:border-brand-200/80",
        padded && "p-6 sm:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
