import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a second dev server (e.g. a local preview on another port) build into its own
  // folder instead of sharing — and corrupting — the main `.next` cache.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Keep the dev-only Next.js badge away from the sidebar account menu (bottom-left).
  devIndicators: { position: "bottom-right" },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "date-fns",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // Ensure headers for security and edge caching (production only for static immutable cache)
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }
    // Signed-in areas and account flows are never indexed (server-side header, so private
    // route names here are not published anywhere).
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    const privatePaths = [
      "/dashboard", "/dashboard/:path*", "/admin", "/admin/:path*", "/agent", "/agent/:path*",
      "/agent-login", "/login", "/register", "/forgot-password", "/reset-password/:path*",
      "/verify-email/:path*", "/account-deleted", "/setup/:path*", "/partner-preview/:path*",
      "/internal-admin-sign-in",
    ];
    return [
      ...privatePaths.map((source) => ({ source, headers: noindex })),
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

// Restart trigger: botanical clean reload
export default nextConfig;
