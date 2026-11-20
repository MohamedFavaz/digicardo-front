import localFont from "next/font/local";

/**
 * Fonts for the "Nestly" look used by the owner dashboard and the admin / agent consoles:
 * a light geometric sans for UI and an elegant serif for accents (scoped via `.theme-nestly`).
 *
 * Self-hosted (files/ — Outfit and Cormorant Garamond, SIL Open Font License, latin subset,
 * variable weight) so a production build never depends on reaching Google Fonts: a bad
 * response from Google during `next build` failed a Vercel deploy.
 */
export const nestlySans = localFont({
  src: [{ path: "./files/outfit-latin.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-nestly",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const nestlySerif = localFont({
  src: [
    { path: "./files/cormorant-garamond-latin.woff2", weight: "400 600", style: "normal" },
    { path: "./files/cormorant-garamond-italic-latin.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-nestly-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

/** Classes that turn on the Nestly theme and fonts for everything inside. */
export const nestlyThemeClass = `${nestlySans.variable} ${nestlySerif.variable} theme-nestly font-sans`;
