"use client";

import * as React from "react";
import { qrPath } from "@/lib/qr/encoder";
import { CARD_H, CARD_RADIUS, CARD_W } from "./design";
import type { Measure, Shape } from "./scene";

/** Draws a card scene as on-screen SVG, as a downloadable SVG file and as a print PNG. */

const GLYPH_DOT = { cx: 5, cy: 12, r: 3.2 };
const GLYPH_WAVES = "M11.5 5.5a9.2 9.2 0 0 1 0 13M17 1.8a14.5 14.5 0 0 1 0 20.4";
export const FONT_STACK = "Inter, 'Helvetica Neue', Arial, sans-serif";

/** The page's actual font (next/font gives Inter a generated family name). */
export function pageFont(): string {
  if (typeof document === "undefined") return FONT_STACK;
  return getComputedStyle(document.body).fontFamily || FONT_STACK;
}

/** Text width in mm, measured with a canvas in the page font. */
export function makeMeasure(): Measure {
  let ctx: CanvasRenderingContext2D | null = null;
  return (text, size, weight) => {
    if (typeof document === "undefined") return text.length * size * 0.55;
    ctx ??= document.createElement("canvas").getContext("2d");
    if (!ctx) return text.length * size * 0.55;
    ctx.font = `${weight} 100px ${pageFont()}`;
    return (ctx.measureText(text).width / 100) * size;
  };
}

// ── SVG (preview + file) ───────────────────────────────────────────────────────────

function escapeXml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);
}

/** Builds the SVG markup. `bleed` extends the background beyond the trim line (print files). */
export function sceneToSvg(
  shapes: Shape[],
  { bleed = 0, rounded = false, font = FONT_STACK, id = "c", images = {} }: { bleed?: number; rounded?: boolean; font?: string; id?: string; images?: Record<string, string> } = {}
): string {
  const W = CARD_W + bleed * 2;
  const H = CARD_H + bleed * 2;
  const defs: string[] = [];
  const body: string[] = [];
  let clipN = 0;
  for (const s of shapes) {
    switch (s.t) {
      case "bg": {
        if (typeof s.fill === "string") body.push(`<rect x="${-bleed}" y="${-bleed}" width="${W}" height="${H}" fill="${s.fill}"/>`);
        else {
          defs.push(`<linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.fill.from}"/><stop offset="1" stop-color="${s.fill.to}"/></linearGradient>`);
          body.push(`<rect x="${-bleed}" y="${-bleed}" width="${W}" height="${H}" fill="url(#${id}-g)"/>`);
        }
        break;
      }
      case "rect":
        body.push(`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${s.fill}"${s.opacity != null ? ` opacity="${s.opacity}"` : ""}/>`);
        break;
      case "circle":
        body.push(
          `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.fill ?? "none"}"${s.stroke ? ` stroke="${s.stroke}" stroke-width="${s.sw ?? 0.5}"` : ""}${s.opacity != null ? ` opacity="${s.opacity}"` : ""}/>`
        );
        break;
      case "arc":
        body.push(`<path d="${s.d}" fill="none" stroke="${s.stroke}" stroke-width="${s.sw}" stroke-linecap="round"${s.opacity != null ? ` opacity="${s.opacity}"` : ""}/>`);
        break;
      case "text":
        body.push(
          `<text x="${s.x}" y="${s.y}" font-family="${escapeXml(font)}" font-size="${s.size}" font-weight="${s.weight}" fill="${s.fill}" text-anchor="${s.anchor}"${
            s.spacing ? ` letter-spacing="${(s.spacing * s.size).toFixed(3)}"` : ""
          }${s.opacity != null ? ` opacity="${s.opacity}"` : ""}>${escapeXml(s.text)}</text>`
        );
        break;
      case "glyph": {
        const k = s.size / 24;
        body.push(
          `<g transform="translate(${s.x} ${s.y}) scale(${k})"><circle cx="${GLYPH_DOT.cx}" cy="${GLYPH_DOT.cy}" r="${GLYPH_DOT.r}" fill="${s.color}"/><path d="${GLYPH_WAVES}" fill="none" stroke="${s.color}" stroke-width="3.2" stroke-linecap="round"/></g>`
        );
        break;
      }
      case "image": {
        const href = images[s.href] ?? s.href;
        const cid = `${id}-clip${clipN++}`;
        defs.push(`<clipPath id="${cid}"><circle cx="${s.cx}" cy="${s.cy}" r="${s.r}"/></clipPath>`);
        body.push(
          `<image href="${escapeXml(href)}" x="${s.cx - s.r}" y="${s.cy - s.r}" width="${s.r * 2}" height="${s.r * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${cid})"/>`
        );
        break;
      }
      case "qr": {
        const m = s.size / s.matrix.length;
        body.push(`<path d="${qrPath(s.matrix)}" fill="${s.fg}" transform="translate(${s.x} ${s.y}) scale(${m})" shape-rendering="crispEdges"/>`);
        break;
      }
    }
  }
  const clip = rounded
    ? `<clipPath id="${id}-card"><rect x="0" y="0" width="${CARD_W}" height="${CARD_H}" rx="${CARD_RADIUS}"/></clipPath>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-bleed} ${-bleed} ${W} ${H}" width="${W}mm" height="${H}mm"><defs>${defs.join("")}${clip}</defs><g${
    rounded ? ` clip-path="url(#${id}-card)"` : ""
  }>${body.join("")}</g></svg>`;
}

/** On-screen card (rounded corners, no bleed). */
export function CardSvg({ shapes, className, label }: { shapes: Shape[]; className?: string; label: string }) {
  const id = React.useId().replace(/:/g, "");
  const markup = React.useMemo(
    () => sceneToSvg(shapes, { rounded: true, font: pageFont(), id }).replace(/ width="[\d.]+mm" height="[\d.]+mm"/, ' width="100%" height="100%"'),
    [shapes, id]
  );
  return <div role="img" aria-label={label} className={className} dangerouslySetInnerHTML={{ __html: markup }} />;
}

// ── PNG (canvas) ───────────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Renders the scene to a canvas at `dpi` with `bleed` mm around the trim line. */
export async function sceneToCanvas(shapes: Shape[], { dpi = 300, bleed = 0 }: { dpi?: number; bleed?: number } = {}): Promise<HTMLCanvasElement> {
  const pxPerMm = dpi / 25.4;
  const W = CARD_W + bleed * 2;
  const H = CARD_H + bleed * 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * pxPerMm);
  canvas.height = Math.round(H * pxPerMm);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(pxPerMm, pxPerMm);
  ctx.translate(bleed, bleed);
  const font = pageFont();

  for (const s of shapes) {
    ctx.save();
    if ("opacity" in s && s.opacity != null) ctx.globalAlpha = s.opacity;
    switch (s.t) {
      case "bg": {
        if (typeof s.fill === "string") ctx.fillStyle = s.fill;
        else {
          const g = ctx.createLinearGradient(-bleed, -bleed, CARD_W + bleed, CARD_H + bleed);
          g.addColorStop(0, s.fill.from);
          g.addColorStop(1, s.fill.to);
          ctx.fillStyle = g;
        }
        ctx.fillRect(-bleed, -bleed, W, H);
        break;
      }
      case "rect":
        ctx.fillStyle = s.fill;
        ctx.beginPath();
        ctx.roundRect(s.x, s.y, s.w, s.h, s.r);
        ctx.fill();
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2);
        if (s.fill) {
          ctx.fillStyle = s.fill;
          ctx.fill();
        }
        if (s.stroke) {
          ctx.strokeStyle = s.stroke;
          ctx.lineWidth = s.sw ?? 0.5;
          ctx.stroke();
        }
        break;
      case "arc":
        ctx.strokeStyle = s.stroke;
        ctx.lineWidth = s.sw;
        ctx.lineCap = "round";
        ctx.stroke(new Path2D(s.d));
        break;
      case "text":
        ctx.fillStyle = s.fill;
        ctx.textAlign = s.anchor === "middle" ? "center" : s.anchor === "end" ? "right" : "left";
        ctx.textBaseline = "alphabetic";
        // Fonts are sized in px at 100× and scaled down so sub-pixel sizes render crisply.
        ctx.translate(s.x, s.y);
        ctx.scale(0.01, 0.01);
        ctx.font = `${s.weight} ${s.size * 100}px ${font}`;
        if (s.spacing && "letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${s.spacing * s.size * 100}px`;
        ctx.fillText(s.text, 0, 0);
        break;
      case "glyph": {
        const k = s.size / 24;
        ctx.translate(s.x, s.y);
        ctx.scale(k, k);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(GLYPH_DOT.cx, GLYPH_DOT.cy, GLYPH_DOT.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 3.2;
        ctx.lineCap = "round";
        ctx.stroke(new Path2D(GLYPH_WAVES));
        break;
      }
      case "image": {
        const img = await loadImage(s.href);
        if (img) {
          ctx.beginPath();
          ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2);
          ctx.clip();
          const scale = Math.max((s.r * 2) / img.width, (s.r * 2) / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.drawImage(img, s.cx - w / 2, s.cy - h / 2, w, h);
        }
        break;
      }
      case "qr": {
        const m = s.size / s.matrix.length;
        ctx.fillStyle = s.fg;
        s.matrix.forEach((row, y) => row.forEach((dark, x) => dark && ctx.fillRect(s.x + x * m, s.y + y * m, m + 0.01, m + 0.01)));
        break;
      }
    }
    ctx.restore();
  }
  return canvas;
}

// ── Downloads ──────────────────────────────────────────────────────────────────────

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ── PNG resolution (pHYs chunk) ──
// Canvas PNGs carry no DPI, so print software assumes 72 dpi and shows the card at 4× size.
// Insert a pHYs chunk right after IHDR saying 300 dpi (11811 pixels per metre).

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export async function withPngDpi(blob: Blob, dpi: number): Promise<Blob> {
  const src = new Uint8Array(await blob.arrayBuffer());
  const ihdrEnd = 8 + 4 + 4 + 13 + 4; // signature + IHDR (length, type, data, crc)
  const ppm = Math.round(dpi / 0.0254);
  const chunk = new Uint8Array(21);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, 9); // data length
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  view.setUint32(8, ppm);
  view.setUint32(12, ppm);
  chunk[16] = 1; // unit: metre
  view.setUint32(17, crc32(chunk.subarray(4, 17)));
  const out = new Uint8Array(src.length + chunk.length);
  out.set(src.subarray(0, ihdrEnd), 0);
  out.set(chunk, ihdrEnd);
  out.set(src.subarray(ihdrEnd), ihdrEnd + chunk.length);
  return new Blob([out], { type: "image/png" });
}

const toPngBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("empty"))), "image/png"));

export async function downloadPng(shapes: Shape[], fileName: string, bleed: number) {
  let blob: Blob;
  try {
    blob = await toPngBlob(await sceneToCanvas(shapes, { dpi: 300, bleed }));
  } catch {
    // A cross-site logo can block PNG export; retry without it.
    blob = await toPngBlob(await sceneToCanvas(shapes.filter((s) => s.t !== "image"), { dpi: 300, bleed }));
  }
  saveBlob(await withPngDpi(blob, 300), fileName);
}

/** SVG file with the logo embedded (so it opens anywhere) and an Inter-first font stack. */
export async function downloadSvg(shapes: Shape[], fileName: string, bleed: number) {
  const images: Record<string, string> = {};
  for (const s of shapes) {
    if (s.t !== "image") continue;
    try {
      const blob = await (await fetch(s.href)).blob();
      images[s.href] = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.readAsDataURL(blob);
      });
    } catch {
      // Leave the URL as-is if it can't be fetched.
    }
  }
  const svg = sceneToSvg(shapes, { bleed, font: FONT_STACK, id: "nfc", images });
  saveBlob(new Blob([svg], { type: "image/svg+xml" }), fileName);
}
