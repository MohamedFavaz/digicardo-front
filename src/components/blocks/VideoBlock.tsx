import React from "react";
import type { PublicProfileBlock, VideoBlockConfig } from "@/types/blocks";

interface VideoBlockProps {
  block: PublicProfileBlock<VideoBlockConfig>;
}

export function VideoBlock({ block }: VideoBlockProps) {
  const { config } = block;
  const embedUrl = config.embed_url;

  if (!embedUrl) {
    return null;
  }

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

      <div className="relative aspect-video w-full overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800 bg-black shadow-md">
        <iframe
          src={embedUrl}
          title={config.title || "Video Player"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
