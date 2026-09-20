import { apiClient } from "./client";
import { Plan, Subscription, EntitlementsData } from "@/types/plans";

export const plansApi = {
  /**
   * List all active public plans with pricing and features.
   */
  async list(): Promise<Plan[]> {
    return apiClient.get<Plan[]>("/plans");
  },

  /**
   * Retrieve the authenticated user's current subscription details.
   */
  async getSubscription(): Promise<Subscription> {
    return apiClient.get<Subscription>("/subscription");
  },

  /**
   * Retrieve the resolved feature entitlements, limits, usage, and remaining capacities.
   */
  async getEntitlements(): Promise<EntitlementsData> {
    return apiClient.get<EntitlementsData>("/entitlements");
  },
};
