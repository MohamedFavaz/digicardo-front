import React from "react";
import type { PublicProfileBlock, ImageBlockConfig } from "@/types/blocks";
import { ExternalLink } from "lucide-react";

export interface ImageBlockProps {
  block: PublicProfileBlock<ImageBlockConfig>;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { config } = block;
  const imageUrl = config.url;

  if (!imageUrl) {
    return null;
  }

  const imageElement = (
    <div className="group relative w-full overflow-hidden rounded-[var(--lf-radius,0.75rem)] border border-slate-800/40 bg-slate-900/30 shadow-sm transition-all hover:shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={config.alt_text || "Image"}
        width={config.width || undefined}
        height={config.height || undefined}
        loading="lazy"
        className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      {config.link_url && (
        <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
          <ExternalLink className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {config.link_url ? (
        <a
          href={config.link_url}
          target={config.open_in_new_tab !== false ? "_blank" : undefined}
          rel={config.open_in_new_tab !== false ? "noopener noreferrer" : undefined}
          className="block w-full focus:outline-none focus:ring-2 focus:ring-[var(--lf-accent)]"
        >
          {imageElement}
        </a>
      ) : (
        imageElement
      )}

      {config.caption && (
        <p
          className="mt-1.5 text-center text-xs leading-relaxed opacity-70"
          style={{ color: "var(--lf-text-secondary, #64748b)" }}
        >
          {config.caption}
        </p>
      )}
    </div>
  );
}
