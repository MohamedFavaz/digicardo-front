"use client";

import * as React from "react";
import { mediaApi } from "@/lib/api/media";
import { ApiClientError } from "@/lib/api/errors";
import { Upload, X, Loader2 } from "lucide-react";
import type { MediaItem } from "@/types/media";

export interface CoverUploadProps {
  currentUrl?: string | null;
  onUploaded: (media: MediaItem) => void;
  onDeleted: () => void;
}

export function CoverUpload({
  currentUrl,
  onUploaded,
  onDeleted,
}: CoverUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(currentUrl || null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(currentUrl || null);
  }, [currentUrl]);

  const handleFile = async (file: File) => {
    setError(null);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Cover must be a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Cover image size must not exceed 8 MB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setIsUploading(true);

    try {
      const media = await mediaApi.uploadCover(file);
      setPreview(media.url);
      onUploaded(media);
    } catch (err: unknown) {
      setPreview(currentUrl || null);
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to upload cover image.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsUploading(true);
    try {
      await mediaApi.deleteCover();
      setPreview(null);
      onDeleted();
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to remove cover image.");
      }
    } finally {
      setIsUploading(false);
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
        <div className="relative h-36 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Profile Cover"
            className="h-full w-full object-cover"
          />

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                <span>Uploading cover...</span>
              </div>
            </div>
          )}

          {!isUploading && (
            <button
              type="button"
              onClick={handleDelete}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition-colors hover:bg-rose-600"
              title="Remove cover"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-800 bg-slate-950/40 p-4 text-center transition-colors hover:border-indigo-500/60 hover:bg-slate-900/40"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-indigo-400 shadow-sm">
            <Upload className="h-4 w-4" />
          </div>
          <p className="mt-1.5 text-xs font-semibold text-slate-200">
            Upload Cover / Header Banner
          </p>
          <p className="text-[11px] text-slate-500">
            JPEG, PNG, or WebP up to 8 MB
          </p>
        </div>
      )}

      {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}
