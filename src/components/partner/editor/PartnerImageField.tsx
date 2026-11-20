"use client";

import * as React from "react";
import { Crop, ImagePlus, Loader2 } from "lucide-react";
import { ImageCropper } from "@/components/card-editor/ImageCropper";
import { agentSiteApi } from "@/lib/api/agent-site";
import { cn, resolveMediaUrl } from "@/lib/utils";

/** Upload (and optionally crop) an image for the agent's landing page. */
export function PartnerImageField({
  id,
  label,
  hint,
  value,
  onChange,
  crop = false,
  shape = "wide",
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  crop?: boolean;
  shape?: "square" | "wide";
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cropSrc, setCropSrc] = React.useState<string | null>(null);

  const upload = async (file: File | Blob, name: string) => {
    setBusy(true);
    setError(null);
    try {
      const { url } = await agentSiteApi.uploadImage(file, name);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return setError("Choose a JPG, PNG or WebP image.");
    if (file.size > 5 * 1024 * 1024) return setError("This image is larger than 5 MB.");
    setError(null);
    if (crop) setCropSrc(URL.createObjectURL(file));
    else void upload(file, file.name);
  };

  return (
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {hint && <p className="text-[13px] text-muted-foreground">{hint}</p>}
      <div className="mt-2 flex items-center gap-3">
        <div className={cn("flex shrink-0 items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground", shape === "square" ? "h-16 w-16 rounded-2xl" : "h-16 w-28 rounded-xl")}>
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element -- uploaded image
            <img src={resolveMediaUrl(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-input bg-card px-3.5 text-[13px] font-medium hover:bg-muted disabled:opacity-50">
            {crop && <Crop className="h-3.5 w-3.5" aria-hidden="true" />}
            {value ? "Change" : "Upload"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex h-9 items-center rounded-full px-3 text-[13px] font-medium text-muted-foreground hover:bg-muted">
              Remove
            </button>
          )}
        </div>
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-1.5 text-[13px] text-destructive">{error}</p>}
      {cropSrc && (
        <ImageCropper
          src={cropSrc}
          shape="square"
          title={`Crop ${label.toLowerCase()}`}
          onCancel={() => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
          }}
          onDone={async (blob) => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
            await upload(blob, `${id}.png`);
          }}
        />
      )}
    </div>
  );
}
