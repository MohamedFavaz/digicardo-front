/**
 * Pure TypeScript QR Code Matrix Generator
 * Standard QR Code Model 2 generator supporting Byte Mode (UTF-8/ASCII)
 * with Error Correction (ECC Level L/M/Q/H)
 */

import { encodeQr } from "./encoder";

export type QrEccLevel = "L" | "M" | "Q" | "H";

export interface QrCodeOptions {
  eccLevel?: QrEccLevel;
}

/**
 * Generates an SVG string representation of a scannable QR code
 */
export function generateQrSvg({
  text,
  size = 280,
  fgColor = "#0f172a",
  bgColor = "#ffffff",
  dotStyle = "rounded",
  centerLogo = "badge",
  avatarUrl,
}: {
  text: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  dotStyle?: "square" | "rounded" | "dots";
  centerLogo?: "badge" | "avatar" | "none";
  avatarUrl?: string | null;
}): string {
  const matrix = createQrMatrix(text, centerLogo === "none" ? "M" : "H");
  const moduleCount = matrix.length;
  const cellSize = size / moduleCount;

  let svgElements = "";

  // Helper to check if a cell is in the 3 finder pattern zones (top-left, top-right, bottom-left)
  const isFinderPattern = (row: number, col: number): boolean => {
    // Top-left finder: [0..6, 0..6]
    if (row <= 7 && col <= 7) return true;
    // Top-right finder: [0..6, N-8..N-1]
    if (row <= 7 && col >= moduleCount - 8) return true;
    // Bottom-left finder: [N-8..N-1, 0..6]
    if (row >= moduleCount - 8 && col <= 7) return true;
    return false;
  };

  // Center logo cutout zone
  const centerStart = Math.floor(moduleCount / 2) - 2;
  const centerEnd = Math.floor(moduleCount / 2) + 2;
  const isCenterCutout = (row: number, col: number): boolean => {
    if (centerLogo === "none") return false;
    return row >= centerStart && row <= centerEnd && col >= centerStart && col <= centerEnd;
  };

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c] && !isCenterCutout(r, c)) {
        const x = c * cellSize;
        const y = r * cellSize;
        const inFinder = isFinderPattern(r, c);

        if (inFinder || dotStyle === "square") {
          svgElements += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fgColor}" />`;
        } else if (dotStyle === "dots") {
          const radius = (cellSize * 0.85) / 2;
          const cx = x + cellSize / 2;
          const cy = y + cellSize / 2;
          svgElements += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fgColor}" />`;
        } else {
          // Rounded module
          const rx = cellSize * 0.35;
          svgElements += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${rx}" fill="${fgColor}" />`;
        }
      }
    }
  }

  // Optional Center Badge / Avatar
  let centerElement = "";
  if (centerLogo !== "none") {
    const badgeSize = cellSize * 4.6;
    const badgeX = (size - badgeSize) / 2;
    const badgeY = (size - badgeSize) / 2;
    const innerSize = badgeSize - 4;
    const innerX = badgeX + 2;
    const innerY = badgeY + 2;

    if (centerLogo === "avatar" && avatarUrl) {
      centerElement = `
        <rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="${badgeSize * 0.3}" fill="${bgColor}" stroke="${fgColor}" stroke-width="1.5" />
        <clipPath id="avatarClip">
          <rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" rx="${innerSize * 0.3}" />
        </clipPath>
        <image href="${avatarUrl}" x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice" />
      `;
    } else {
      // Digicardo Brand Logo Badge
      centerElement = `
        <rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="${badgeSize * 0.32}" fill="${bgColor}" stroke="${fgColor}" stroke-width="2" />
        <rect x="${badgeX + 2}" y="${badgeY + 2}" width="${badgeSize - 4}" height="${badgeSize - 4}" rx="${(badgeSize - 4) * 0.28}" fill="#ffffff" />
        <image href="/logo.png" x="${badgeX + 4}" y="${badgeY + 4}" width="${badgeSize - 8}" height="${badgeSize - 8}" preserveAspectRatio="xMidYMid meet" />
      `;
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="100%" height="100%" fill="${bgColor}" rx="16" />
      <g>${svgElements}</g>
      ${centerElement}
    </svg>
  `.trim();
}

/**
 * QR module matrix for `text` (true = dark). Uses the standards-compliant encoder in
 * ./encoder — the previous hand-rolled generator here produced codes no scanner could read.
 * Codes with a centre logo use error-correction level H so the covered modules are recoverable.
 */
export function createQrMatrix(text: string, ecc: QrEccLevel = "M"): boolean[][] {
  return encodeQr(text, ecc);
}
