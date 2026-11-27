import { startImpersonation } from "@/lib/auth/switch-account";

/** Thrown by franchiseApi with the server's message and per-field errors. */
export class FranchiseApiError extends Error {
  constructor(message: string, public fields: Record<string, string> = {}, public status = 0) {
    super(message);
  }
}

/**
 * Calls the Laravel API through the BFF (`/api/bff/v1/...`). Returns `data` (and `meta` for lists);
 * throws FranchiseApiError with a readable message otherwise.
 */
export async function franchiseApi<T = unknown>(path: string, init?: { method?: string; body?: unknown }): Promise<{ data: T; meta?: Record<string, number> }> {
  const res = await fetch(`/api/bff/v1/${path.replace(/^\//, "")}`, {
    method: init?.method ?? "GET",
    credentials: "include",
    headers: { Accept: "application/json", ...(init?.body !== undefined ? { "Content-Type": "application/json" } : {}) },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(json?.error?.details ?? json?.errors ?? {})) {
      fields[k] = Array.isArray(v) ? String(v[0]) : String(v);
    }
    throw new FranchiseApiError(json?.error?.message || json?.message || "Something went wrong. Please try again.", fields, res.status);
  }
  return { data: json?.data as T, meta: json?.meta };
}

/** Owner "Impersonate": opens a staff member's panel; the banner there offers "Back to owner". */
export function ownerImpersonateStaff(staffId: string): Promise<void> {
  return startImpersonation(`/api/bff/v1/franchise/staff/${encodeURIComponent(staffId)}/impersonate`, "franchise_owner");
}

/** "Edit card design": opens the card's customer account in the studio. */
export function franchiseImpersonate(cardId: string): Promise<void> {
  return startImpersonation(`/api/bff/v1/franchise/cards/${encodeURIComponent(cardId)}/impersonate`, "franchise");
}

/** ₹600 for whole rupees, ₹794.70 when there are paise. */
export const rupees = (n?: number | string | null) => {
  const v = Number(n ?? 0);
  const digits = Number.isInteger(v) ? 0 : 2;
  return `₹${v.toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: 2 })}`;
};

export function shortDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export interface FranchiseCard {
  id: string;
  card_name: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  status: "active" | "inactive" | string;
  sale_amount?: string | number | null;
  staff_commission?: string | number | null;
  notes?: string | null;
  created_at: string;
  created_by_id?: string | null;
  created_by?: { id: string; name: string; role?: string } | null;
  profile?: { id: string; username: string } | null;
  public_url?: string | null;
  customer_user?: { id: string; expires_at?: string | null; validity_label?: string | null } | null;
}

export interface StaffSummary {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  status: "active" | "suspended" | string;
  commission_type: "fixed" | "percentage";
  commission_value: number;
  cards: number;
  active_cards: number;
  sales: number;
  earned: number;
  paid: number;
  balance: number;
  /** Collected − commission. */
  to_hand_over?: number;
  /** Cash handed to the owner and confirmed. */
  handed_over?: number;
  /** Handovers waiting for the owner. */
  pending_handover?: number;
  /** > 0: cash the staff member still holds; < 0: commission the franchise owes them. */
  cash_due?: number;
  last_card_at?: string | null;
}

export const commissionLabel = (type: string, value: number) =>
  type === "percentage" ? `${value}% of sale` : `${rupees(value)} per card`;
