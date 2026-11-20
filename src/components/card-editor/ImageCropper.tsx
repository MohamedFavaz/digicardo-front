"use client";

import * as React from "react";
import { Check, Loader2, Minus, Plus, RotateCcw, RotateCw, X } from "lucide-react";
import { centredView, clampView, outputRect, outputSize, scaleLimits, zoomAt, type CropView } from "@/lib/editor/crop";
import { cn } from "@/lib/utils";

const FRAME = 280;

type Source = HTMLImageElement | HTMLCanvasElement;
const dims = (s: Source) => (s instanceof HTMLImageElement ? { w: s.naturalWidth, h: s.naturalHeight } : { w: s.width, h: s.height });

/** Rotate a source by 90° steps into a new canvas. */
function rotated(src: Source, dir: 1 | -1): HTMLCanvasElement {
  const { w, h } = dims(src);
  const c = document.createElement("canvas");
  c.width = h;
  c.height = w;
  const ctx = c.getContext("2d")!;
  ctx.translate(h / 2, w / 2);
  ctx.rotate((dir * Math.PI) / 2);
  ctx.drawImage(src, -w / 2, -h / 2);
  return c;
}

/**
 * Square crop dialog for a logo or profile photo: drag to move, zoom (slider, wheel, pinch, + / −),
 * rotate, and — for logos — zoom out to fit a wide logo with a transparent or white background.
 * Resolves with a PNG blob; nothing is uploaded until the owner presses "Use photo".
 */
export function ImageCropper({
  src,
  shape,
  title,
  onCancel,
  onDone,
}: {
  src: string;
  shape: "circle" | "square";
  title: string;
  onCancel: () => void;
  onDone: (blob: Blob) => Promise<void> | void;
}) {
  const [source, setSource] = React.useState<Source | null>(null);
  const [view, setView] = React.useState<CropView>({ scale: 1, x: 0, y: 0 });
  const [background, setBackground] = React.useState<"transparent" | "white">("transparent");
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const pinch = React.useRef<{ dist: number; scale: number } | null>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const previewRef = React.useRef<HTMLCanvasElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Load the image (same-origin /storage or a blob: URL, so the canvas stays exportable).
  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setSource(img);
      const { cover } = scaleLimits(img.naturalWidth, img.naturalHeight, FRAME);
      setView(centredView(img.naturalWidth, img.naturalHeight, FRAME, cover));
    };
    img.onerror = () => setError("This image couldn't be opened for cropping. Upload it again.");
    img.src = src;
  }, [src]);

  const size = source ? dims(source) : { w: 1, h: 1 };
  const limits = scaleLimits(size.w, size.h, FRAME);
  const set = React.useCallback((next: CropView) => setView(clampView(next, size.w, size.h, FRAME)), [size.w, size.h]);

  // Draw the live view.
  React.useEffect(() => {
    const c = previewRef.current;
    if (!c || !source) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = FRAME * dpr;
    c.height = FRAME * dpr;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, FRAME, FRAME);
    if (background === "white") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, FRAME, FRAME);
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, view.x, view.y, size.w * view.scale, size.h * view.scale);
  }, [source, view, background, size.w, size.h]);

  // Esc closes; focus the dialog.
  React.useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, saving]);

  // Wheel zoom (needs a non-passive listener to stop the page scrolling).
  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      setView((v) => zoomAt(v, v.scale * Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top, size.w, size.h, FRAME));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [size.w, size.h]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: view.scale };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const next = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, next);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const r = frameRef.current!.getBoundingClientRect();
      const scale = pinch.current.scale * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist);
      setView((v) => zoomAt(v, scale, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, size.w, size.h, FRAME));
    } else if (pointers.current.size === 1) {
      setView((v) => clampView({ ...v, x: v.x + next.x - prev.x, y: v.y + next.y - prev.y }, size.w, size.h, FRAME));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 6;
    const moves: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[e.key]) {
      e.preventDefault();
      set({ ...view, x: view.x + moves[e.key][0], y: view.y + moves[e.key][1] });
    } else if (e.key === "+" || e.key === "=") {
      zoomBy(1.1);
    } else if (e.key === "-") {
      zoomBy(1 / 1.1);
    }
  };

  const zoomTo = (scale: number) => setView((v) => zoomAt(v, scale, FRAME / 2, FRAME / 2, size.w, size.h, FRAME));
  const zoomBy = (k: number) => setView((v) => zoomAt(v, v.scale * k, FRAME / 2, FRAME / 2, size.w, size.h, FRAME));
  const rotate = (dir: 1 | -1) => {
    if (!source) return;
    const next = rotated(source, dir);
    setSource(next);
    setView(centredView(next.width, next.height, FRAME, scaleLimits(next.width, next.height, FRAME).cover));
  };
  const reset = () => source && setView(centredView(size.w, size.h, FRAME, limits.cover));

  // Slider works on a log scale so zooming feels even.
  const toSlider = (s: number) => Math.round((Math.log(s / limits.min) / Math.log(limits.max / limits.min)) * 100);
  const fromSlider = (n: number) => limits.min * Math.pow(limits.max / limits.min, n / 100);

  const letterboxed = view.scale < limits.cover - 1e-6;

  const save = async () => {
    if (!source) return;
    setSaving(true);
    setError(null);
    try {
      const out = outputSize(view, FRAME);
      const c = document.createElement("canvas");
      c.width = out;
      c.height = out;
      const ctx = c.getContext("2d")!;
      if (background === "white") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, out, out);
      }
      ctx.imageSmoothingQuality = "high";
      const r = outputRect(view, size.w, size.h, FRAME, out);
      ctx.drawImage(source, r.dx, r.dy, r.dw, r.dh);
      const blob = await new Promise<Blob | null>((resolve) => c.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Couldn't create the image.");
      await onDone(blob);
    } catch (e) {
      setError(e instanceof Error && e.name !== "SecurityError" ? e.message : "This image can't be cropped here. Upload it again, then crop.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && !saving && onCancel()}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cropper-title"
        className="w-full max-w-[400px] rounded-t-2xl bg-card p-4 shadow-2xl outline-none sm:rounded-2xl sm:p-5"
      >
        <div className="flex items-center justify-between">
          <h2 id="cropper-title" className="text-base font-semibold text-foreground">
            {title}
          </h2>
          <button type="button" onClick={onCancel} disabled={saving} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-0.5 text-[13px] text-muted-foreground">Drag to move. Pinch, scroll or use the slider to zoom.</p>

        <div className="mt-4 flex justify-center">
          <div
            ref={frameRef}
            tabIndex={0}
            role="application"
            aria-label="Crop area. Use the arrow keys to move and plus or minus to zoom."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className="relative cursor-grab touch-none select-none overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing"
            style={{
              width: FRAME,
              height: FRAME,
              // Checkerboard shows transparent areas.
              backgroundColor: "#fff",
              backgroundImage:
                background === "transparent"
                  ? "linear-gradient(45deg,#E4E4E7 25%,transparent 25%),linear-gradient(-45deg,#E4E4E7 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#E4E4E7 75%),linear-gradient(-45deg,transparent 75%,#E4E4E7 75%)"
                  : undefined,
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
            }}
          >
            <canvas ref={previewRef} style={{ width: FRAME, height: FRAME }} className="absolute inset-0" aria-hidden="true" />
            {!source && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
              </div>
            )}
            {/* Shape guide: dims what falls outside a round photo, plus a rule-of-thirds grid. */}
            {shape === "circle" && <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />}
            <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 border-2 border-white/90", shape === "circle" ? "rounded-full" : "rounded-lg")} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_33.2%,rgba(255,255,255,0.45)_33.3%,rgba(255,255,255,0.45)_33.6%,transparent_33.7%,transparent_66.5%,rgba(255,255,255,0.45)_66.6%,rgba(255,255,255,0.45)_66.9%,transparent_67%),linear-gradient(to_bottom,transparent_33.2%,rgba(255,255,255,0.45)_33.3%,rgba(255,255,255,0.45)_33.6%,transparent_33.7%,transparent_66.5%,rgba(255,255,255,0.45)_66.6%,rgba(255,255,255,0.45)_66.9%,transparent_67%)]" />
          </div>
        </div>

        {/* Zoom */}
        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={() => zoomBy(1 / 1.15)} aria-label="Zoom out" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-input hover:bg-muted">
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={source ? toSlider(view.scale) : 0}
            onChange={(e) => zoomTo(fromSlider(Number(e.target.value)))}
            aria-label="Zoom"
            disabled={!source}
            className="h-2 flex-1 cursor-pointer accent-[#5B3FE4]"
          />
          <button type="button" onClick={() => zoomBy(1.15)} aria-label="Zoom in" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-input hover:bg-muted">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Tools */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => rotate(-1)} disabled={!source} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input px-3 text-[13px] font-semibold hover:bg-muted disabled:opacity-50">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Rotate
          </button>
          <button type="button" onClick={() => rotate(1)} disabled={!source} aria-label="Rotate right" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-muted disabled:opacity-50">
            <RotateCw className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => source && setView(centredView(size.w, size.h, FRAME, limits.min))} disabled={!source} className="inline-flex h-9 items-center rounded-lg border border-input px-3 text-[13px] font-semibold hover:bg-muted disabled:opacity-50">
            Fit whole image
          </button>
          <button type="button" onClick={reset} disabled={!source} className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-semibold text-[#52525B] hover:bg-muted disabled:opacity-50">
            Reset
          </button>
        </div>

        {letterboxed && (
          <div className="mt-3 flex items-center gap-2 text-[13px]">
            <span className="text-muted-foreground">Empty space:</span>
            {(["transparent", "white"] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBackground(b)}
                aria-pressed={background === b}
                className={cn("h-8 rounded-full border px-3 font-medium", background === b ? "border-primary bg-[#F6F4FE] text-[#3D2AAD]" : "border-input hover:bg-muted")}
              >
                {b === "transparent" ? "Transparent" : "White"}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 text-[13px] text-destructive">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onCancel} disabled={saving} className="h-11 flex-1 rounded-lg border border-input text-sm font-semibold hover:bg-muted disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={() => void save()} disabled={!source || saving} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            {saving ? "Saving…" : "Use photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
