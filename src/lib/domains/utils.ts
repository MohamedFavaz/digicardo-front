/**
 * Custom Domain Hostname Utilities
 */

const SYSTEM_DOMAINS = [
  "Digicardo.app",
  "www.Digicardo.app",
  "app.Digicardo.app",
  "api.Digicardo.app",
  "localhost",
  "127.0.0.1",
];

/**
 * Normalizes a raw hostname by trimming, lowercasing, stripping trailing dots and removing port numbers.
 */
export function normalizeHost(rawHost: string): string {
  if (!rawHost) return "";
  let host = rawHost.trim().toLowerCase();
  // Strip port
  host = host.split(":")[0];
  // Strip trailing dot
  host = host.replace(/\.+$/, "");
  return host;
}

/**
 * Check if a host belongs to Digicardo system domains or local development.
 */
export function isSystemDomain(rawHost: string): boolean {
  const host = normalizeHost(rawHost);
  if (!host) return true;

  for (const sysDomain of SYSTEM_DOMAINS) {
    if (host === sysDomain || host.endsWith(`.${sysDomain}`)) {
      return true;
    }
  }

  return false;
}

/**
 * Client-side domain syntax validator.
 */
export function validateDomainInput(rawDomain: string): { isValid: boolean; error?: string } {
  const domain = normalizeHost(rawDomain);

  if (!domain) {
    return { isValid: false, error: "Domain name is required." };
  }

  if (rawDomain.includes("://") || rawDomain.includes("/")) {
    return { isValid: false, error: "Please enter a domain name only (no http:// or /paths)." };
  }

  if (rawDomain.includes("@") || rawDomain.includes(":")) {
    return { isValid: false, error: "Domain contains invalid characters or ports." };
  }

  if (domain === "localhost" || domain.endsWith(".localhost") || domain.endsWith(".local")) {
    return { isValid: false, error: "Local domains cannot be added." };
  }

  if (isSystemDomain(domain)) {
    return { isValid: false, error: "Digicardo system domains cannot be claimed." };
  }

  const labels = domain.split(".");
  if (labels.length < 2) {
    return { isValid: false, error: "Domain must include a valid extension (e.g. .com, .me, .io)." };
  }

  const hostnameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
  if (!hostnameRegex.test(domain)) {
    return { isValid: false, error: "Invalid domain format. Use letters, numbers, and hyphens only." };
  }

  return { isValid: true };
}
