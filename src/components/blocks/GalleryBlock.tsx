"use client";

import * as React from "react";
import type { PublicProfileBlock, GalleryBlockConfig } from "@/types/blocks";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryBlockProps {
  block: PublicProfileBlock<GalleryBlockConfig>;
}

export function GalleryBlock({ block }: GalleryBlockProps) {
  const { config } = block;
  const images = config.images || [];
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const layout = config.layout || "grid";

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  return (
    <div className="w-full">
      {/* Grid Layout */}
      {layout === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => openLightbox(idx)}
              className="group relative aspect-square w-full overflow-hidden rounded-[var(--lf-radius,0.5rem)] border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[var(--lf-accent)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt_text || "Gallery Photo"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Maximize2 className="h-4 w-4 text-white" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Masonry / Staggered Layout */}
      {layout === "masonry" && (
        <div className="columns-2 gap-2.5 space-y-2.5">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => openLightbox(idx)}
              className="group relative w-full overflow-hidden rounded-[var(--lf-radius,0.5rem)] border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[var(--lf-accent)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt_text || "Gallery Photo"}
                loading="lazy"
                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Carousel Layout */}
      {layout === "carousel" && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => openLightbox(idx)}
              className="group relative h-48 w-44 shrink-0 snap-center overflow-hidden rounded-[var(--lf-radius,0.5rem)] border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-[var(--lf-accent)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt_text || "Gallery Photo"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="max-h-[85vh] max-w-[90vw] overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt_text || "Enlarged view"}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
