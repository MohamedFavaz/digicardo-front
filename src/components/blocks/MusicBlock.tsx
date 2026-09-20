import React from "react";
import type { PublicProfileBlock, MusicBlockConfig } from "@/types/blocks";

interface MusicBlockProps {
  block: PublicProfileBlock<MusicBlockConfig>;
}

export function MusicBlock({ block }: MusicBlockProps) {
  const { config } = block;
  const embedUrl = config.embed_url;

  if (!embedUrl) {
    return null;
  }

  // Adjust height based on provider (Spotify compact vs SoundCloud)
  const isSoundCloud = config.provider === "soundcloud";
  const heightClass = isSoundCloud ? "h-[166px]" : "h-[152px]";

  return (
    <div className="w-full space-y-2">
      {config.title && (
        <h3
          className="text-sm font-semibold tracking-tight text-center sm:text-left"
          style={{ color: "var(--lf-text-primary, #ffffff)" }}
        >
          {config.title}
        </h3>
      )}

      <div className={`w-full overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-slate-950 shadow-md ${heightClass}`}>
        <iframe
          src={embedUrl}
          title={config.title || "Audio Player"}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
