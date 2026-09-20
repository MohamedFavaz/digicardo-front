import { Plan } from "./plans";

export type BillingInterval = "monthly" | "yearly";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "expired"
  | "incomplete"
  | "incomplete_expired"
  | "paused"
  | "grace_period";

export interface Subscription {
  id: string;
  plan_code?: string;
  plan?: Plan | null;
  provider: string;
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
  status: SubscriptionStatus;
  billing_interval: BillingInterval;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_ends_at: string | null;
  grace_period_ends_at?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CheckoutRequest {
  plan: "pro" | "business";
  interval: BillingInterval;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id?: string;
  provider: string;
  message?: string;
}

export interface BillingPortalResponse {
  portal_url: string;
  provider: string;
}

export interface ChangePlanRequest {
  plan: "pro" | "business";
  interval?: BillingInterval;
}

export interface UsageLimitConflict {
  current: number;
  allowed: number;
}

export interface DowngradeBlockedDetails {
  profiles?: UsageLimitConflict;
  custom_domains?: UsageLimitConflict;
}
