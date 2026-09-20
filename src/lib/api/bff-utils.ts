export const ALLOWED_PATH_PREFIXES = [
  "health",
  "auth",
  "p",
  "public",
  "profile",
  "blocks",
  "social-links",
  "theme",
  "templates",
  "media",
  "plans",
  "analytics",
  "access-requests",
  "subscriptions",
  "subscription",
  "entitlements",
  "notifications",
  "account",
  "admin",
];

export function isPathAllowed(pathSegments: string[]): boolean {
  if (!pathSegments || pathSegments.length === 0) return false;

  const firstSegment = pathSegments[0];

  // Prevent path traversal and malformed paths
  if (pathSegments.some((segment) => segment.includes("..") || segment.includes("/"))) {
    return false;
  }

  return ALLOWED_PATH_PREFIXES.includes(firstSegment);
}

/**
 * Splits multiple Set-Cookie header strings safely, respecting date commas in Expires attributes.
 */
export function splitSetCookies(setCookieHeader: string | string[] | null | undefined): string[] {
  if (!setCookieHeader) return [];
  if (Array.isArray(setCookieHeader)) return setCookieHeader;

  // Regex splits on commas that are followed by a cookie name=value pair, not date strings
  const cookies: string[] = [];
  const parts = setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_\-]+=[^;]+)/g);

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) cookies.push(trimmed);
  }

  return cookies;
}

/**
 * Rewrites upstream Laravel cookies to first-party Digicardo cookies.
 */
export function rewriteUpstreamCookie(cookieStr: string): string {
  let rewritten = cookieStr;

  // Map session and CSRF cookie names
  rewritten = rewritten.replace(/\blaravel_session=/g, "Digicardo_session=");
  rewritten = rewritten.replace(/\bXSRF-TOKEN=/g, "Digicardo_xsrf=");

  // Remove internal Laravel domain constraints so cookie attaches cleanly to first-party domain
  rewritten = rewritten.replace(/;\s*domain=[^;]+/gi, "");

  return rewritten;
}
