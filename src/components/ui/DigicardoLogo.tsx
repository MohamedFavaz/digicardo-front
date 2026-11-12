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
    xs: { box: "w-6 h-6 rounded-lg p-1", img: 18, text: "text-sm", badge: "text-[8px] px-1.5" },
    sm: { box: "w-8 h-8 rounded-xl p-1.5", img: 24, text: "text-[15px]", badge: "text-[9px] px-1.5" },
    md: { box: "w-10 h-10 rounded-xl p-2", img: 26, text: "text-[17px]", badge: "text-[10px] px-2" },
    lg: { box: "w-11 h-11 rounded-xl p-2.5", img: 30, text: "text-lg", badge: "text-[10px] px-2" },
    xl: { box: "w-14 h-14 rounded-2xl p-3", img: 40, text: "text-2xl", badge: "text-xs px-2.5" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      {/* ── Logo Mark ── */}
      <div
        className={cn(
          currentSize.box,
          "relative flex items-center justify-center overflow-hidden flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
          variant === "badge"
            ? "bg-white dark:bg-zinc-900 border border-[#E3DFD9] dark:border-zinc-800 shadow-2xs"
            : "bg-white text-slate-900 border border-[#E3DFD9] dark:border-zinc-700 shadow-2xs",
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
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-bold tracking-tight leading-none text-slate-900 dark:text-white",
                currentSize.text,
                wordmarkClassName
              )}
            >
              Digicardo
            </span>

            {proBadge && (
              <span
                className={cn(
                  "font-semibold uppercase tracking-wider rounded-full bg-[#EDF5F2] text-[#0F766E] border border-[#D5EBE4] py-0.5 leading-none",
                  currentSize.badge
                )}
              >
                PRO
              </span>
            )}
          </div>

          {subtitle && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
