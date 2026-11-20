import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Digicardo logo.
 * - Wordmark: "Digicardo" in heavy, tight type followed by a violet "tap" symbol (a dot with two
 *   contactless waves — sharing by tap / NFC). Used wherever there is room for the name.
 * - LogoMark: the same tap symbol in white on a violet tile, for square spots (favicon, collapsed
 *   sidebar, QR badge, "Made with" footers). Static files: public/logo.svg, logo.png, apple-touch-icon.png.
 */

const BRAND = "#5B3FE4";

/** The tap symbol on its own (24×24 box). */
export function TapGlyph({ className, color = BRAND, style }: { className?: string; color?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" fill="none">
      <circle cx="5" cy="12" r="3.2" fill={color} />
      <path d="M11.5 5.5a9.2 9.2 0 0 1 0 13M17 1.8a14.5 14.5 0 0 1 0 20.4" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

/** Square app icon: white tap symbol on a violet tile. */
export function LogoMark({ size = 28, className, title }: { size?: number; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      <rect width="64" height="64" rx="16" fill={BRAND} />
      <g transform="translate(14.1 14.6) scale(1.45)">
        <circle cx="5" cy="12" r="3.2" fill="#fff" />
        <path d="M11.5 5.5a9.2 9.2 0 0 1 0 13M17 1.8a14.5 14.5 0 0 1 0 20.4" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const SIZES = {
  xs: { text: "text-[17px]", mark: 20 },
  sm: { text: "text-[20px]", mark: 24 },
  md: { text: "text-[23px]", mark: 28 },
  lg: { text: "text-[26px]", mark: 32 },
  xl: { text: "text-[34px]", mark: 44 },
} as const;

export type LogoSize = keyof typeof SIZES;

interface DigicardoLogoProps {
  className?: string;
  /** Applied to the tap symbol (wordmark) or the tile (icon only). */
  iconClassName?: string;
  size?: LogoSize;
  /** false = the square icon only. */
  showWordmark?: boolean;
  /** Extra classes for the name, e.g. "text-white" on dark backgrounds. */
  wordmarkClassName?: string;
  subtitle?: string;
  proBadge?: boolean;
  /** Kept for older call sites. */
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
}) => {
  const s = SIZES[size];
  if (!showWordmark) return <LogoMark size={s.mark} className={cn(iconClassName, className)} title="Digicardo" />;

  const onDark = /text-white/.test(wordmarkClassName ?? "");
  return (
    <span className={cn("inline-flex select-none flex-col", className)}>
      <span className="inline-flex items-center gap-2">
        <span
          className={cn("inline-flex items-start font-extrabold leading-none tracking-[-0.045em] text-[#1C1245]", s.text, wordmarkClassName)}
          aria-label="Digicardo"
          role="img"
        >
          <span aria-hidden="true">Digicardo</span>
          <TapGlyph
            className={cn("ml-[0.08em] mt-[0.04em] h-[0.62em] w-[0.62em] shrink-0", iconClassName)}
            color={onDark ? "#B9A8FF" : BRAND}
          />
        </span>
        {proBadge && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium leading-none text-primary">Pro</span>}
      </span>
      {subtitle && <span className="mt-1 text-xs leading-tight text-muted-foreground">{subtitle}</span>}
    </span>
  );
};
