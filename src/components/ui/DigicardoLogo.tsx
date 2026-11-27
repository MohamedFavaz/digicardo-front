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

/** Square app icon: a bold white "d" with lime tap waves on a violet tile (same as public/logo.svg and the favicon). */
export function LogoMark({ size = 28, className, title }: { size?: number; className?: string; title?: string }) {
  const id = React.useId().replace(/:/g, "");
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
      <defs>
        <linearGradient id={`lm-${id}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6E52F5" />
          <stop offset="1" stopColor="#4B30D6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#lm-${id})`} />
      <g transform="translate(-4.5 0)">
        <circle cx="26" cy="39" r="9.5" stroke="#fff" strokeWidth="7" />
        <rect x="32" y="13" width="7" height="36" rx="3.5" fill="#fff" />
        <path d="M44 22.5a6.5 6.5 0 0 1 6.5 6.5M44 14.5a14.5 14.5 0 0 1 14.5 14.5" stroke="#DAF56B" strokeWidth="3.8" strokeLinecap="round" />
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

  // Brand wordmark: "Digi" (capital D) + "cardo" in the accent, with tap waves rising after the "o".
  // Light backgrounds: navy + violet. Dark backgrounds (wordmarkClassName contains text-white): white + lime.
  const onDark = /text-white/.test(wordmarkClassName ?? "");
  const accent = onDark ? "#DAF56B" : BRAND;
  return (
    <span className={cn("inline-flex select-none flex-col", className)}>
      <span className="inline-flex items-center gap-2">
        <span
          className={cn("relative inline-flex items-baseline font-extrabold leading-none tracking-[-0.04em] text-[#1C1245]", s.text, wordmarkClassName)}
          aria-label="Digicardo"
          role="img"
        >
          <span aria-hidden="true">Digi</span>
          <span aria-hidden="true" style={{ color: accent }}>
            cardo
          </span>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            overflow="visible"
            className={cn("-ml-[0.06em] h-[0.58em] w-[0.58em] shrink-0 -translate-y-[0.46em]", iconClassName)}
          >
            <path d="M3 11.5A9.5 9.5 0 0 1 12.5 21M3 3.5A17.5 17.5 0 0 1 20.5 21" stroke={accent} strokeWidth="3.6" strokeLinecap="round" />
          </svg>
        </span>
        {proBadge && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium leading-none text-primary">Pro</span>}
      </span>
      {subtitle && <span className="mt-1 text-xs leading-tight text-muted-foreground">{subtitle}</span>}
    </span>
  );
};
