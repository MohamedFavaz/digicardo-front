import { startImpersonation } from "@/lib/auth/switch-account";

/**
 * Admin "Open as customer": signs the admin in as a user (server-side impersonation) and opens
 * their dashboard. The banner there offers "Back to admin". Throws with a readable message on failure.
 */
export function adminImpersonate(userId: string): Promise<void> {
  // "Back to admin" brings the admin back to this page.
  const here = typeof window !== "undefined" ? window.location.pathname : "";
  const query = here.startsWith("/admin") ? `?return_to=${encodeURIComponent(here)}` : "";
  return startImpersonation(`/api/bff/v1/admin/users/${encodeURIComponent(userId)}/impersonate${query}`, "admin");
}
