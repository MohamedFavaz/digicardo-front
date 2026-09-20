import { apiClient } from "./client";
import {
  Subscription,
  CheckoutRequest,
  CheckoutResponse,
  BillingPortalResponse,
  ChangePlanRequest,
} from "@/types/subscription";

export const subscriptionApi = {
  /**
   * Fetch current authenticated user's active subscription.
   */
  async getCurrent(): Promise<Subscription | null> {
    const res = await apiClient.get<Subscription | { subscription: null }>("/subscription");
    if (!res || !("id" in res)) {
      return null;
    }
    return res as Subscription;
  },

  /**
   * Initiate a checkout session for purchasing a paid subscription tier.
   */
  async checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
    return apiClient.post<CheckoutResponse>("/subscription/checkout", data);
  },

  /**
   * Request a customer billing portal URL for managing payment methods and billing history.
   */
  async portal(): Promise<BillingPortalResponse> {
    return apiClient.post<BillingPortalResponse>("/subscription/portal");
  },

  /**
   * Upgrade or downgrade plan tier or change billing interval.
   */
  async changePlan(data: ChangePlanRequest): Promise<Subscription> {
    return apiClient.post<Subscription>("/subscription/change-plan", data);
  },

  /**
   * Cancel active subscription at current period end.
   */
  async cancel(): Promise<Subscription> {
    return apiClient.post<Subscription>("/subscription/cancel");
  },

  /**
   * Resume a subscription scheduled for cancellation.
   */
  async resume(): Promise<Subscription> {
    return apiClient.post<Subscription>("/subscription/resume");
  },
};
