import * as React from "react";
import { cn } from "@/lib/utils";

export interface DoodleProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  className?: string;
}

/**
 * Curved Hand-drawn Arrow Doodle
 * Seen in the approved visual reference pointing to creator social proof and CTAs
 */
export function DoodleCurvedArrow({
  color = "#ff4b72",
  className,
  ...props
}: DoodleProps) {
  return (
    <svg
      width="54"
      height="38"
      viewBox="0 0 54 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
      {...props}
    >
      <path
        d="M3 28C14 36 34 39 48 20C50.5 16.5 49 10 44 8C39 6 34 11 36 17C38.5 24.5 49.5 28.5 51 29M51 29L43.5 32.5M51 29L47 21"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Four-pointed Star Sparkle Doodle
 */
export function DoodleSparkle({
  color = "#ffaa1d",
  className,
  ...props
}: DoodleProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
      {...props}
    >
      <path
        d="M14 2C14 8.627 8.627 14 2 14C8.627 14 14 19.373 14 26C14 19.373 19.373 14 26 14C19.373 14 14 8.627 14 2Z"
        fill={color}
      />
    </svg>
  );
}

/**
 * Organic Loop / Squiggle Doodle
 */
export function DoodleLoop({
  color = "#7047eb",
  className,
  ...props
}: DoodleProps) {
  return (
    <svg
      width="42"
      height="46"
      viewBox="0 0 42 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
      {...props}
    >
      <path
        d="M6 3C18 1 38 7 36 21C34 35 15 32 10 24C5 16 22 14 34 32C37 36 38 41 37 44"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Playful Hand-Drawn Wavy Underline
 */
export function DoodleUnderline({
  color = "#ff4b72",
  className,
  ...props
}: DoodleProps) {
  return (
    <svg
      width="120"
      height="14"
      viewBox="0 0 120 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
      {...props}
    >
      <path
        d="M2 10C24 4 58 3 118 8M18 12C45 8 82 8 110 11"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
