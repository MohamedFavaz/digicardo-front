import useSWR from "swr";
import { plansApi } from "@/lib/api/plans";
import type { EntitlementsData, Plan, FeatureKey } from "@/types/plans";

/**
 * PLATFORM POLICY — All Features Unlocked for All Users
 *
 * Subscription gating and payment requirements have been removed.
 * Every authenticated user has full Pro-level access to all features.
 * The `can()`, `isFree`, `isPro`, `isBusiness` flags all reflect full access.
 * Backend billing routes are preserved for admin reference only.
 */
export function useEntitlements() {
  const {
    data: entitlements,
    error,
    isLoading,
    mutate,
  } = useSWR<EntitlementsData>("user-entitlements", () => plansApi.getEntitlements(), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const {
    data: plans,
    error: plansError,
    isLoading: isPlansLoading,
  } = useSWR<Plan[]>("public-plans", () => plansApi.list(), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // ── Platform Policy: All users have full Pro access ──────────────────────
  // Subscription / plan gating has been disabled. Every user gets unlimited
  // access to all features regardless of their assigned plan in the database.
  const isFree = false;
  const isPro = true;
  const isBusiness = true;

  // Plan object kept for display purposes only (not used for access control)
  const plan = entitlements?.plan ?? null;
  const subscription = entitlements?.subscription ?? null;

  /**
   * All features are always enabled — always returns true.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const can = (_feature: FeatureKey | string): boolean => {
    return true;
  };

  /**
   * All limits are removed — always returns null (unlimited).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const limit = (_feature: FeatureKey | string): number | null => {
    return null;
  };

  /**
   * Usage tracking — reads from entitlements if available, else 0.
   */
  const usage = (feature: FeatureKey | string): number => {
    if (!entitlements) return 0;
    return entitlements.usage[feature] ?? 0;
  };

  /**
   * Remaining is always unlimited — returns null.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const remaining = (_feature: FeatureKey | string): number | null => {
    return null;
  };

  return {
    entitlements,
    plan,
    subscription,
    plans: plans ?? [],
    isLoading,
    isPlansLoading,
    error,
    plansError,
    mutate,
    can,
    limit,
    usage,
    remaining,
    isFree,
    isPro,
    isBusiness,
  };
}
