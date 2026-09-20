"use client";

import * as React from "react";
import { mediaApi } from "@/lib/api/media";
import { ApiClientError } from "@/lib/api/errors";
import { Upload, X, Loader2 } from "lucide-react";
import type { MediaItem } from "@/types/media";

export interface ImageUploadProps {
  currentUrl?: string | null;
  onUploaded: (media: MediaItem) => void;
  onRemoved?: () => void;
  altText?: string;
  maxSizeMb?: number;
}

export function ImageUpload({
  currentUrl,
  onUploaded,
  onRemoved,
  altText,
  maxSizeMb = 8,
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(currentUrl || null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(currentUrl || null);
  }, [currentUrl]);

  const handleFile = async (file: File) => {
    setError(null);

    // Client-side UX validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image exceeds maximum allowed size of ${maxSizeMb} MB.`);
      return;
    }

    // Local instant preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setIsUploading(true);

    try {
      const media = await mediaApi.uploadImage(file, altText);
      setPreview(media.url);
      onUploaded(media);
    } catch (err: unknown) {
      setPreview(currentUrl || null);
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to upload image. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemoved) {
      onRemoved();
    }
  };

  return (
    <div className="w-full space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {preview ? (
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="h-full w-full object-cover"
          />

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                <span>Uploading image...</span>
              </div>
            </div>
          )}

          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition-colors hover:bg-rose-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-800 bg-slate-950/40 p-4 text-center transition-colors hover:border-indigo-500/60 hover:bg-slate-900/40"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-indigo-400 shadow-sm">
            <Upload className="h-5 w-5" />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-200">
            Click to upload or drag & drop
          </p>
          <p className="text-[11px] text-slate-500">
            JPEG, PNG, or WebP up to {maxSizeMb} MB
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-rose-400">{error}</p>
      )}
    </div>
  );
}
