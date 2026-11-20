import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/templates/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Driven by CSS variables (globals.css) so a scoped theme (the owner dashboard's
        // "Nestly" look) can swap the whole scale; defaults are the violet brand.
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          950: "rgb(var(--brand-950) / <alpha-value>)",
          DEFAULT: "rgb(var(--brand-500) / <alpha-value>)",
        },
        coral: {
          50: "#fff0f3",
          100: "#ffe0e6",
          200: "#ffc2cd",
          500: "#ff4b72",
          600: "#e6335a",
          700: "#c01e42",
          DEFAULT: "#ff4b72",
          light: "#fff0f3",
        },
        amber: {
          50: "#fff8eb",
          100: "#feefd2",
          200: "#fedda5",
          500: "#ffaa1d",
          600: "#e6900a",
          DEFAULT: "#ffaa1d",
          light: "#fff8eb",
        },
        mint: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          500: "#10b981",
          600: "#059669",
          DEFAULT: "#10b981",
          light: "#ecfdf5",
        },
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          500: "#0ea5e9",
          600: "#0284c7",
          DEFAULT: "#0ea5e9",
          light: "#f0f9ff",
        },
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        // Design system v6: borders first, quiet shadows, no coloured glows.
        card: "var(--shadow-xs)",
        soft: "var(--shadow-md)",
        float: "var(--shadow-lg)",
        cta: "var(--shadow-sm)",
        hover: "var(--shadow-md)",
      },
      borderRadius: {
        none: "0px",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        roboto: ["var(--font-roboto)", "Roboto", "sans-serif"],
        outfit: ["var(--font-outfit)", "Outfit", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "wiggle-subtle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        // Card entrance, chosen by the theme's `animation` token (fade | slide | scale).
        "card-fade": { from: { opacity: "0" }, to: { opacity: "1" } },
        "card-slide": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
        "card-scale": { from: { opacity: "0", transform: "scale(0.97)" }, to: { opacity: "1", transform: "none" } },
        // Landing page: floating badges and the scrolling "made for" strip.
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        // Loading states: skeleton sweep, logo "tap" waves, indeterminate bar.
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        "tap-wave": { "0%, 15%": { opacity: "0.15" }, "40%, 70%": { opacity: "1" }, "100%": { opacity: "0.15" } },
        "tap-dot": { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.25)" } },
        "loader-bar": { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(250%)" } },
        "glow-pulse": { "0%, 100%": { opacity: "0.55", transform: "scale(1)" }, "50%": { opacity: "0.9", transform: "scale(1.08)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "wiggle-subtle": "wiggle-subtle 1s ease-in-out infinite",
        "card-fade": "card-fade 0.5s ease-out both",
        "card-slide": "card-slide 0.5s ease-out both",
        "card-scale": "card-scale 0.45s ease-out both",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "tap-wave": "tap-wave 1.4s ease-in-out infinite",
        "tap-dot": "tap-dot 1.4s ease-in-out infinite",
        "loader-bar": "loader-bar 1.3s cubic-bezier(0.4,0,0.2,1) infinite",
        "glow-pulse": "glow-pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
