/**
 * Geometry for the square image cropper (logo / profile photo).
 *
 * The image is drawn inside a square frame of `frame` CSS px at `scale` (CSS px per image px),
 * with its top-left corner at (`x`, `y`) relative to the frame's top-left corner.
 */

export interface CropView {
  scale: number;
  x: number;
  y: number;
}

/** Smallest scale shows the whole image (letterboxed); "cover" fills the frame. */
export function scaleLimits(w: number, h: number, frame: number) {
  const contain = frame / Math.max(w, h);
  const cover = frame / Math.min(w, h);
  return { min: contain, cover, max: cover * 5 };
}

/**
 * Keep the image sensible inside the frame: when it is larger than the frame on an axis it must
 * cover the frame on that axis; when smaller it must stay fully inside.
 */
export function clampView(view: CropView, w: number, h: number, frame: number): CropView {
  const { min, max } = scaleLimits(w, h, frame);
  const scale = Math.min(max, Math.max(min, view.scale));
  const clampAxis = (pos: number, size: number) => {
    const scaled = size * scale;
    return scaled >= frame ? Math.min(0, Math.max(frame - scaled, pos)) : Math.min(frame - scaled, Math.max(0, pos));
  };
  return { scale, x: clampAxis(view.x, w), y: clampAxis(view.y, h) };
}

/** Centre the image at a scale. */
export function centredView(w: number, h: number, frame: number, scale: number): CropView {
  return clampView({ scale, x: (frame - w * scale) / 2, y: (frame - h * scale) / 2 }, w, h, frame);
}

/** Zoom to a new scale keeping the image point under (`px`, `py`) (frame coords) still. */
export function zoomAt(view: CropView, nextScale: number, px: number, py: number, w: number, h: number, frame: number): CropView {
  const { min, max } = scaleLimits(w, h, frame);
  const scale = Math.min(max, Math.max(min, nextScale));
  const ratio = scale / view.scale;
  return clampView({ scale, x: px - (px - view.x) * ratio, y: py - (py - view.y) * ratio }, w, h, frame);
}

/** Where to draw the source image on an output square of `out` px. */
export function outputRect(view: CropView, w: number, h: number, frame: number, out: number) {
  const k = out / frame;
  return { dx: view.x * k, dy: view.y * k, dw: w * view.scale * k, dh: h * view.scale * k };
}

/** Output size: up to 1024 px, but never upscale beyond the image's own detail. */
export function outputSize(view: CropView, frame: number): number {
  const detail = frame / view.scale; // image px across the frame
  return Math.round(Math.min(1024, Math.max(256, detail)));
}
