/**
 * Safe link helpers for user-provided URLs on public cards.
 *
 * Mirrors the backend rule in App\Services\ThemeTokenSanitizer: only http, https,
 * mailto and tel are allowed. Anything else (javascript:, data:, vbscript:, …)
 * is refused, so a stored value can never run script on the card's origin.
 */

const ALLOWED_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

/**
 * Returns a safe href for a user-provided URL, or null when it must not be used.
 * Bare domains ("studio.in") and protocol-relative URLs get https://.
 */
export function safeHref(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Browsers ignore control characters and whitespace inside a scheme ("java\tscript:").
  // eslint-disable-next-line no-control-regex
  const probe = trimmed.replace(/[\u0000- \u007f]+/g, "");
  const match = /^([a-z][a-z0-9+.-]*):/i.exec(probe);

  if (match) {
    const scheme = match[1].toLowerCase();
    // "example.com:8080/path" is a host with a port, not a scheme.
    if (scheme.includes(".")) return `https://${trimmed}`;
    return ALLOWED_SCHEMES.has(scheme) ? trimmed : null;
  }

  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Opens a user-provided URL safely. http(s) links open in a new tab without giving
 * the new page access to this one (noopener); mailto:/tel: open in place.
 * Returns false when the URL is empty or unsafe (nothing is opened).
 */
export function openExternal(raw: string | null | undefined): boolean {
  const href = safeHref(raw);
  if (!href || typeof window === "undefined") return false;

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    window.location.href = href;
    return true;
  }

  window.open(href, "_blank", "noopener,noreferrer");
  return true;
}
