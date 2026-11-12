import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS class names with conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Resolves media and profile photo URLs safely.
 * Handles:
 * - Data URLs (in-memory crop canvas): returns as-is
 * - Blob URLs: returns as-is
 * - Full URLs pointing to local Laravel storage (http://127.0.0.1:8000/storage/... or http://localhost:8000/storage/...):
 *   converts to same-origin relative `/storage/...` path so the Next.js media proxy can serve it without CORS/port issues.
 * - Relative /storage paths: returns as-is.
 * - External CDN URLs (e.g. Unsplash): returns as-is.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Convert absolute local backend storage URLs to relative /storage/* paths
  if (
    trimmed.includes("localhost:8000/storage/") ||
    trimmed.includes("localhost/storage/") ||
    trimmed.includes("127.0.0.1:8000/storage/") ||
    trimmed.includes("127.0.0.1/storage/")
  ) {
    const relativePath = trimmed.replace(/^https?:\/\/[^/]+\/storage\//, "");
    return `/storage/${relativePath}`;
  }

  // If it's a relative storage path, ensure leading slash
  if (trimmed.startsWith("/storage/") || trimmed.startsWith("storage/")) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  return trimmed;
}
