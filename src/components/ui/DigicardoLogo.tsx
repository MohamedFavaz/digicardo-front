import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DigicardoLogoProps {
  className?: string;
  iconClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  wordmarkClassName?: string;
  subtitle?: string;
  proBadge?: boolean;
  variant?: "default" | "inverted" | "mono" | "badge";
}

export const DigicardoLogo: React.FC<DigicardoLogoProps> = ({
  className,
  iconClassName,
  size = "md",
  showWordmark = true,
  wordmarkClassName,
  subtitle,
  proBadge = false,
  variant = "default",
}) => {
  const sizeMap = {
    xs: { box: "w-6 h-6 rounded-lg", img: 24, text: "text-sm", badge: "text-[8px]" },
    sm: { box: "w-7 h-7 rounded-xl", img: 28, text: "text-base", badge: "text-[9px]" },
    md: { box: "w-9 h-9 rounded-xl", img: 36, text: "text-lg", badge: "text-[9px]" },
    lg: { box: "w-11 h-11 rounded-2xl", img: 44, text: "text-xl", badge: "text-[10px]" },
    xl: { box: "w-14 h-14 rounded-2xl", img: 56, text: "text-2xl", badge: "text-xs" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* ── Logo Mark ── */}
      <div
        className={cn(
          currentSize.box,
          "relative flex items-center justify-center overflow-hidden flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
          variant === "badge"
            ? "bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-1"
            : "bg-white text-black border border-zinc-200/90 dark:border-zinc-700 shadow-sm p-0.5",
          iconClassName
        )}
      >
        <Image
          src="/logo.png"
          alt="Digicardo Logo"
          width={currentSize.img}
          height={currentSize.img}
          className="w-full h-full object-contain rounded-lg pointer-events-none"
          priority
        />
      </div>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-black tracking-tight leading-none text-foreground",
                currentSize.text,
                wordmarkClassName
              )}
            >
              Digi<span className="text-primary font-black">cardo</span>
            </span>

            {proBadge && (
              <span
                className={cn(
                  "font-mono uppercase font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 leading-none",
                  currentSize.badge
                )}
              >
                PRO
              </span>
            )}
          </div>

          {subtitle && (
            <span className="text-[10px] font-mono text-muted-foreground font-medium leading-tight mt-0.5 tracking-wider">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
