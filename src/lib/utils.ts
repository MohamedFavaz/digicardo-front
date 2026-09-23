import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS class names with conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const DEFAULT_HOSTINGER_API = "https://lightslategray-snake-169437.hostingersite.com";

/**
 * Resolves media and profile photo URLs safely.
 * Handles:
 * - Data URLs (in-memory crop canvas): returns as-is
 * - Full HTTPS URLs (Unsplash, external CDN): returns as-is
 * - Misconfigured localhost/127.0.0.1 URLs: rewrites to Hostinger backend storage URL
 * - Root-relative /storage/... URLs: converts to direct Hostinger storage URL so images load anywhere
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // If the URL has localhost/127.0.0.1, rewrite to Hostinger
  if (
    trimmed.includes("localhost:8000/storage/") ||
    trimmed.includes("localhost/storage/") ||
    trimmed.includes("127.0.0.1:8000/storage/") ||
    trimmed.includes("127.0.0.1/storage/")
  ) {
    const relativePath = trimmed.replace(/^https?:\/\/[^/]+\/storage\//, "");
    return `${DEFAULT_HOSTINGER_API}/storage/${relativePath}`;
  }

  // If it's a relative /storage path, point directly to Hostinger
  if (trimmed.startsWith("/storage/")) {
    const relativePath = trimmed.replace(/^\/storage\//, "");
    return `${DEFAULT_HOSTINGER_API}/storage/${relativePath}`;
  }

  return trimmed;
}
