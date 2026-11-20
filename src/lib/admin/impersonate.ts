import { startImpersonation } from "@/lib/auth/switch-account";

/**
 * Admin "Open as customer": signs the admin in as a user (server-side impersonation) and opens
 * their dashboard. The banner there offers "Back to admin". Throws with a readable message on failure.
 */
export function adminImpersonate(userId: string): Promise<void> {
  return startImpersonation(`/api/bff/v1/admin/users/${encodeURIComponent(userId)}/impersonate`, "admin");
}
