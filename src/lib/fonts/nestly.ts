import { Cormorant_Garamond, Outfit } from "next/font/google";

/**
 * Fonts for the "Nestly" look used by the owner dashboard and the admin / agent consoles:
 * a light geometric sans for UI and an elegant serif for accents (scoped via `.theme-nestly`).
 */
export const nestlySans = Outfit({
  subsets: ["latin"],
  variable: "--font-nestly",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const nestlySerif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-nestly-serif",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

/** Classes that turn on the Nestly theme and fonts for everything inside. */
export const nestlyThemeClass = `${nestlySans.variable} ${nestlySerif.variable} theme-nestly font-sans`;
