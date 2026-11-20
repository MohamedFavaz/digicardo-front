"use client";

import * as React from "react";
import { encodeQr, qrPath } from "@/lib/qr/encoder";

/** A scannable QR code for `value`, drawn as one SVG path (no external service). */
export function CardQr({
  value,
  color = "#18181B",
  background = "#FFFFFF",
  size = 92,
  label = "QR code for this card",
}: {
  value: string;
  color?: string;
  background?: string;
  size?: number;
  label?: string;
}) {
  const { d, n } = React.useMemo(() => {
    const matrix = encodeQr(value, "M");
    return { d: qrPath(matrix, 2), n: matrix.length + 4 };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${n} ${n}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className="shrink-0"
    >
      <rect width={n} height={n} fill={background} />
      <path d={d} fill={color} />
    </svg>
  );
}

/** Downloads the QR code as a PNG (1024 px) so it can be printed. */
export function downloadQrPng(value: string, fileName: string, color = "#18181B"): void {
  if (typeof document === "undefined") return;
  const matrix = encodeQr(value, "M");
  const n = matrix.length + 8;
  const scale = Math.max(4, Math.floor(1024 / n));
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = n * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  matrix.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) ctx.fillRect((x + 4) * scale, (y + 4) * scale, scale, scale);
    })
  );
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${fileName.replace(/[^\w-]+/g, "_")}-qr.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
