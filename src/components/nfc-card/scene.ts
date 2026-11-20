import { encodeQr } from "@/lib/qr/encoder";
import { CARD_H, CARD_W, isLight, resolveTheme, type NfcCardDesign } from "./design";

/**
 * The card as a list of simple shapes in millimetres (origin = top-left of the trimmed card).
 * One scene is drawn three ways — on-screen SVG, downloadable SVG and a 300 dpi PNG — so the
 * preview and the print files always match.
 */

export type Fill = string | { from: string; to: string };

export type Shape =
  | { t: "bg"; fill: Fill }
  | { t: "rect"; x: number; y: number; w: number; h: number; r: number; fill: string; opacity?: number }
  | { t: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; sw?: number; opacity?: number }
  | { t: "arc"; d: string; stroke: string; sw: number; opacity?: number }
  | { t: "text"; x: number; y: number; text: string; size: number; weight: 400 | 500 | 600 | 700 | 800; fill: string; anchor: "start" | "middle" | "end"; opacity?: number; spacing?: number }
  | { t: "glyph"; x: number; y: number; size: number; color: string }
  | { t: "image"; cx: number; cy: number; r: number; href: string }
  | { t: "qr"; x: number; y: number; size: number; matrix: boolean[][]; fg: string };

export interface CardData {
  name: string;
  role: string;
  /** Business / brand line shown next to the logo on the Signature front (company or category). */
  brand: string;
  /** Job title alone (Signature shows the company at the top, so it isn't repeated under the name). */
  jobTitle: string;
  initials: string;
  logoUrl: string | null;
  url: string;
  urlLabel: string;
  phone: string;
  email: string;
  website: string;
}

/** Measures text width in mm for a font size in mm (uses the page's font via canvas). */
export type Measure = (text: string, size: number, weight: number) => number;

function fit(text: string, size: number, weight: number, maxW: number, measure: Measure): number {
  const w = measure(text, size, weight);
  return w > maxW ? Math.max(size * 0.55, (size * maxW) / w) : size;
}

function decor(design: NfcCardDesign, accent: string, side: "front" | "back"): Shape[] {
  if (design.decor === "orbits") {
    return side === "front"
      ? [
          { t: "circle", cx: 80, cy: -2, r: 30, fill: accent, opacity: 0.13 },
          { t: "circle", cx: 92, cy: 50, r: 22, fill: accent, opacity: 0.09 },
        ]
      : [{ t: "circle", cx: -6, cy: 58, r: 26, fill: accent, opacity: 0.1 }];
  }
  if (design.decor === "waves") {
    const cx = side === "front" ? 70 : 8;
    const cy = side === "front" ? 46 : 50;
    return [14, 22, 30, 38].map((r, i) => ({
      t: "arc" as const,
      d: `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`,
      stroke: accent,
      sw: 1.4,
      opacity: 0.22 - i * 0.04,
    }));
  }
  return [];
}

/** Rings top-right and a soft disc bottom-left — the Signature front's own decoration. */
function signatureDecor(design: NfcCardDesign, fg: string): Shape[] {
  if (design.decor === "none") return [];
  return [
    { t: "circle", cx: 80, cy: -4, r: 25, stroke: fg, sw: 0.3, opacity: 0.2 },
    { t: "circle", cx: 83, cy: 0, r: 14, stroke: fg, sw: 0.3, opacity: 0.14 },
    { t: "circle", cx: 4, cy: 66, r: 30, fill: fg, opacity: 0.06 },
  ];
}

/** A gold contact chip (decorative — NFC cards have the antenna inside). */
function chip(x: number, y: number): Shape[] {
  const w = 9.6;
  const h = 7.2;
  const line = "#A87B22";
  const c1 = x + w * 0.34;
  const c2 = x + w * 0.66;
  return [
    { t: "rect", x: x - 0.25, y: y - 0.25, w: w + 0.5, h: h + 0.5, r: 1.55, fill: line },
    { t: "rect", x, y, w, h, r: 1.35, fill: "#E9C46A" },
    {
      t: "arc",
      d: `M ${x} ${y + h / 3} H ${c1} M ${c2} ${y + h / 3} H ${x + w} M ${x} ${y + (2 * h) / 3} H ${c1} M ${c2} ${y + (2 * h) / 3} H ${x + w} M ${c1} ${y} V ${y + h} M ${c2} ${y} V ${y + h} M ${c1} ${y + h / 2} H ${c2}`,
      stroke: line,
      sw: 0.28,
    },
  ];
}

export function buildScene(side: "front" | "back", design: NfcCardDesign, data: CardData, measure: Measure): Shape[] {
  const theme = resolveTheme(design);
  const fg = theme.fg;
  const accent = theme.accent;
  const shapes: Shape[] = [{ t: "bg", fill: design.gradient ? { from: theme.bg, to: theme.bg2 } : theme.bg }];
  shapes.push(...(side === "front" && design.front === "signature" ? signatureDecor(design, fg) : decor(design, accent, side)));
  const onAccent = isLight(accent) ? "#1C1245" : "#FFFFFF";

  const badge = (cx: number, cy: number, r: number): Shape[] =>
    data.logoUrl
      ? [{ t: "circle", cx, cy, r: r + 0.5, fill: fg, opacity: 0.9 }, { t: "image", cx, cy, r, href: data.logoUrl }]
      : [
          { t: "circle", cx, cy, r, fill: accent },
          { t: "text", x: cx, y: cy + r * 0.36, text: data.initials, size: r * 0.95, weight: 800, fill: onAccent, anchor: "middle" },
        ];

  if (side === "front") {
    const pad = 7;
    if (design.front === "signature") {
      // Logo tile + brand, chip, name and role bottom-left, round tap button bottom-right.
      const p = 6.5;
      if (design.showLogo && data.logoUrl) {
        shapes.push({ t: "circle", cx: p + 4.4, cy: p + 4.4, r: 4.8, fill: fg, opacity: 0.9 }, { t: "image", cx: p + 4.4, cy: p + 4.4, r: 4.4, href: data.logoUrl });
      } else {
        shapes.push({ t: "rect", x: p, y: p, w: 8.8, h: 8.8, r: 2.2, fill: fg, opacity: 0.16 });
        shapes.push({ t: "glyph", x: p + 1.85, y: p + 1.8, size: 5.2, color: fg });
      }
      if (data.brand) {
        const brandX = p + 11.5;
        shapes.push({ t: "text", x: brandX, y: p + 5.6, text: data.brand, size: fit(data.brand, 3.1, 700, 52 - brandX + 18, measure), weight: 700, fill: fg, anchor: "start", spacing: 0.01 });
      }
      shapes.push(...chip(p, 20));

      const tapX = 73.2;
      const tapY = 41.2;
      shapes.push({ t: "circle", cx: tapX, cy: tapY, r: 12.4, stroke: accent, sw: 0.4, opacity: 0.25 });
      shapes.push({ t: "circle", cx: tapX, cy: tapY, r: 9.4, stroke: accent, sw: 0.45, opacity: 0.45 });
      shapes.push({ t: "circle", cx: tapX, cy: tapY, r: 6.3, fill: accent });
      shapes.push({ t: "glyph", x: tapX - 2.55, y: tapY - 3.25, size: 6.5, color: onAccent });

      const maxW = tapX - 12.4 - p - 1.5;
      const nameSize = fit(data.name, 5.2, 800, maxW, measure);
      const words = data.name.trim().split(/\s+/);
      if (measure(data.name, nameSize, 800) > maxW && words.length > 1) {
        // Too long even at the smallest size: two lines, split near the middle.
        const half = data.name.length / 2;
        let cut = 1;
        for (let i = 1, len = words[0].length; i < words.length; len += words[i].length + 1, i++) {
          if (Math.abs(len - half) < Math.abs(words.slice(0, cut).join(" ").length - half)) cut = i;
        }
        const lines = [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
        const size = Math.min(...lines.map((l) => fit(l, 4.4, 800, maxW, measure)));
        lines.forEach((text, i) =>
          shapes.push({ t: "text", x: p, y: 43.6 - (lines.length - 1 - i) * size * 1.08, text, size, weight: 800, fill: fg, anchor: "start", spacing: -0.03 })
        );
      } else {
        shapes.push({ t: "text", x: p, y: 43.6, text: data.name, size: nameSize, weight: 800, fill: fg, anchor: "start", spacing: -0.03 });
      }
      const second = data.brand ? data.jobTitle : data.role;
      if (design.showRole && second) {
        shapes.push({ t: "text", x: p, y: 48.4, text: second, size: fit(second, 2.7, 500, maxW, measure), weight: 500, fill: fg, anchor: "start", opacity: 0.8 });
      }
    } else if (design.front === "classic") {
      if (design.showLogo) shapes.push(...badge(pad + 6, pad + 6, 6));
      shapes.push({ t: "glyph", x: CARD_W - pad - 7, y: pad, size: 7, color: accent });
      const nameSize = fit(data.name, 6, 800, CARD_W - pad * 2, measure);
      shapes.push({ t: "text", x: pad, y: 40, text: data.name, size: nameSize, weight: 800, fill: fg, anchor: "start", spacing: -0.04 });
      if (design.showRole && data.role) {
        shapes.push({ t: "text", x: pad, y: 46.5, text: data.role, size: fit(data.role, 2.9, 500, CARD_W - pad * 2, measure), weight: 500, fill: fg, anchor: "start", opacity: 0.75 });
      }
    } else if (design.front === "centered") {
      if (design.showLogo) shapes.push(...badge(CARD_W / 2, 14, 7));
      const y = design.showLogo ? 31 : 26;
      shapes.push({ t: "text", x: CARD_W / 2, y, text: data.name, size: fit(data.name, 5.6, 800, CARD_W - 14, measure), weight: 800, fill: fg, anchor: "middle", spacing: -0.04 });
      if (design.showRole && data.role) {
        shapes.push({ t: "text", x: CARD_W / 2, y: y + 6, text: data.role, size: fit(data.role, 2.8, 500, CARD_W - 14, measure), weight: 500, fill: fg, anchor: "middle", opacity: 0.75 });
      }
      shapes.push({ t: "glyph", x: CARD_W / 2 - 9.5, y: 43.2, size: 4.4, color: accent });
      shapes.push({ t: "text", x: CARD_W / 2 - 4, y: 46.6, text: "Tap to connect", size: 2.4, weight: 600, fill: fg, anchor: "start", opacity: 0.8 });
    } else {
      const nameSize = fit(data.name, 8, 800, CARD_W - pad * 2, measure);
      shapes.push({ t: "text", x: pad, y: 28, text: data.name, size: nameSize, weight: 800, fill: fg, anchor: "start", spacing: -0.045 });
      if (design.showRole && data.role) {
        shapes.push({ t: "text", x: pad, y: 35, text: data.role, size: fit(data.role, 3, 500, CARD_W - pad * 2, measure), weight: 500, fill: fg, anchor: "start", opacity: 0.75 });
      }
      shapes.push({ t: "glyph", x: CARD_W - pad - 8, y: CARD_H - pad - 8, size: 8, color: accent });
    }
    return shapes;
  }

  // Back: QR code that opens the card + the address and contact lines.
  const matrix = encodeQr(data.url, "M");
  const qrDark = isLight(theme.bg) && !design.gradient ? theme.fg : "#111111";
  if (design.back === "qr-left") {
    const box = 34;
    shapes.push({ t: "rect", x: 7, y: (CARD_H - box) / 2, w: box, h: box, r: 3, fill: "#FFFFFF" });
    shapes.push({ t: "qr", x: 9.5, y: (CARD_H - box) / 2 + 2.5, size: box - 5, matrix, fg: qrDark });
    const x = 47;
    const maxW = CARD_W - x - 5;
    shapes.push({ t: "glyph", x, y: 9.5, size: 5, color: accent });
    shapes.push({ t: "text", x: x + 6.5, y: 13.6, text: "Tap or scan", size: 3.2, weight: 800, fill: fg, anchor: "start" });
    shapes.push({ t: "text", x, y: 21, text: data.urlLabel, size: fit(data.urlLabel, 2.6, 600, maxW, measure), weight: 600, fill: accent, anchor: "start" });
    if (design.showContacts) {
      let y = 29;
      for (const line of [data.phone, data.email, data.website].filter(Boolean)) {
        shapes.push({ t: "text", x, y, text: line, size: fit(line, 2.4, 500, maxW, measure), weight: 500, fill: fg, anchor: "start", opacity: 0.85 });
        y += 5;
      }
    }
  } else {
    const box = 32;
    const top = 6;
    shapes.push({ t: "rect", x: (CARD_W - box) / 2, y: top, w: box, h: box, r: 3, fill: "#FFFFFF" });
    shapes.push({ t: "qr", x: (CARD_W - box) / 2 + 2.5, y: top + 2.5, size: box - 5, matrix, fg: qrDark });
    shapes.push({ t: "text", x: CARD_W / 2, y: top + box + 5.2, text: "Tap or scan to connect", size: 2.7, weight: 700, fill: fg, anchor: "middle" });
    shapes.push({ t: "text", x: CARD_W / 2, y: top + box + 9.4, text: data.urlLabel, size: fit(data.urlLabel, 2.4, 600, CARD_W - 14, measure), weight: 600, fill: accent, anchor: "middle" });
  }
  return shapes;
}
