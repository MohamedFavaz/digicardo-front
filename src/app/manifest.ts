import type { MetadataRoute } from "next";
import { SEO_DESCRIPTION, SITE_NAME } from "@/lib/seo";

/** Web app manifest: name, colours and icons for "Add to home screen" and search engines. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} – Digital Business Card`,
    short_name: SITE_NAME,
    description: SEO_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F6F6F3",
    theme_color: "#5B3FE4",
    lang: "en-IN",
    categories: ["business", "productivity"],
    icons: [
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
