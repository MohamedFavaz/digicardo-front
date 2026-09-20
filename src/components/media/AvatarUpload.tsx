"use client";

import * as React from "react";
import { mediaApi } from "@/lib/api/media";
import { ApiClientError } from "@/lib/api/errors";
import { Camera, Trash2, Loader2 } from "lucide-react";
import type { MediaItem } from "@/types/media";

export interface AvatarUploadProps {
  currentUrl?: string | null;
  initials: string;
  onUploaded: (media: MediaItem) => void;
  onDeleted: () => void;
}

export function AvatarUpload({
  currentUrl,
  initials,
  onUploaded,
  onDeleted,
}: AvatarUploadProps) {
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
      setError("Avatar must be a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar file size must not exceed 5 MB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setIsUploading(true);

    try {
      const media = await mediaApi.uploadAvatar(file);
      setPreview(media.url);
      onUploaded(media);
    } catch (err: unknown) {
      setPreview(currentUrl || null);
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to upload avatar.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsUploading(true);
    try {
      await mediaApi.deleteAvatar();
      setPreview(null);
      onDeleted();
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to remove avatar.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
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

      <div className="relative group shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Profile Avatar"
            className="h-24 w-24 rounded-full border-2 border-indigo-500/40 object-cover shadow-md ring-4 ring-indigo-500/10"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-900 text-2xl font-bold text-slate-200 shadow-md">
            {initials}
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-xs">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          </div>
        )}

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-indigo-600 text-white shadow-md transition-transform hover:scale-105 hover:bg-indigo-500 disabled:opacity-50"
          title="Change avatar"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col justify-center space-y-1.5 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition-colors hover:bg-slate-800 hover:text-white"
          >
            Upload New Picture
          </button>
          {preview && (
            <button
              type="button"
              disabled={isUploading}
              onClick={handleDelete}
              className="inline-flex items-center gap-1 rounded-md border border-rose-900/50 bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-900/50 hover:text-rose-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          JPEG, PNG, or WebP. 5 MB max.
        </p>
        {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
      </div>
    </div>
  );
}
