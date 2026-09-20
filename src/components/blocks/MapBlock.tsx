import React from "react";
import type { PublicProfileBlock, MapBlockConfig } from "@/types/blocks";
import { MapPin, Navigation } from "lucide-react";

interface MapBlockProps {
  block: PublicProfileBlock<MapBlockConfig>;
}

export function MapBlock({ block }: MapBlockProps) {
  const { config } = block;

  const searchQuery = config.latitude && config.longitude
    ? `${config.latitude},${config.longitude}`
    : config.address || "Location";

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

  if (config.display_mode === "embed" && config.latitude && config.longitude) {
    const embedSrc = `https://maps.google.com/maps?q=${config.latitude},${config.longitude}&z=14&output=embed`;
    return (
      <div className="w-full space-y-2">
        {config.label && (
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--lf-text-primary, #ffffff)" }}
          >
            {config.label}
          </h3>
        )}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800 shadow-md">
          <iframe
            src={embedSrc}
            title={config.label || "Map Location"}
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <a
      href={googleMapsUrl}
      target={config.open_in_new_tab !== false ? "_blank" : undefined}
      rel={config.open_in_new_tab !== false ? "noopener noreferrer" : undefined}
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-900/80 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--lf-accent,#6366f1)] hover:bg-slate-800/90 active:translate-y-0"
    >
      <div className="flex items-center gap-3 truncate">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[var(--lf-accent,#6366f1)] transition-colors group-hover:bg-[var(--lf-accent,#6366f1)] group-hover:text-white">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="truncate space-y-0.5">
          <p className="text-sm font-semibold text-white group-hover:text-indigo-200">
            {config.label || "Find Location"}
          </p>
          {config.address && (
            <p className="truncate text-xs text-slate-400">
              {config.address}
            </p>
          )}
        </div>
      </div>

      <Navigation className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-[var(--lf-accent,#6366f1)]" />
    </a>
  );
}
