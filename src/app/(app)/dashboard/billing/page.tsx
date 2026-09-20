"use client";

import * as React from "react";
import { useEntitlements } from "@/lib/hooks/use-entitlements";
import { subscriptionApi } from "@/lib/api/subscription";
import { BillingHeader } from "@/components/billing/BillingHeader";
import { CurrentPlanCard } from "@/components/billing/CurrentPlanCard";
import { UsageMeter } from "@/components/billing/UsageMeter";
import { CancelSubscriptionDialog } from "@/components/billing/CancelSubscriptionDialog";
import { UpgradeDialog } from "@/components/billing/UpgradeDialog";
import { BillingSkeleton } from "@/components/billing/BillingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Crown,
  Zap,
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const {
    plan,
    subscription,
    usage,
    limit,
    isFree,
    isPro,
    isBusiness,
    isLoading,
    mutate,
  } = useEntitlements();

  const [showUpgradeDialog, setShowUpgradeDialog] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [selectedBillingInterval, setSelectedBillingInterval] = React.useState<"monthly" | "yearly">("yearly");

  const [isProcessingPortal, setIsProcessingPortal] = React.useState(false);
  const [isProcessingCancel, setIsProcessingCancel] = React.useState(false);
  const [isProcessingResume, setIsProcessingResume] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  const handleOpenPortal = async () => {
    try {
      setIsProcessingPortal(true);
      setActionError(null);
      const res = await subscriptionApi.portal();
      if (res.portal_url) {
        window.location.href = res.portal_url;
      }
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to open billing portal.");
    } finally {
      setIsProcessingPortal(false);
    }
  };

  const handleConfirmCancel = async () => {
    try {
      setIsProcessingCancel(true);
      setActionError(null);
      await subscriptionApi.cancel();
      setActionSuccess("Your subscription has been scheduled for cancellation at the end of your billing period.");
      setShowCancelModal(false);
      await mutate();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to cancel subscription.");
    } finally {
      setIsProcessingCancel(false);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      setIsProcessingResume(true);
      setActionError(null);
      await subscriptionApi.resume();
      setActionSuccess("Your subscription has been resumed successfully! 🎉");
      await mutate();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to resume subscription.");
    } finally {
      setIsProcessingResume(false);
    }
  };

  if (isLoading && !plan) {
    return <BillingSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 select-none" data-testid="billing-page">
      
      {/* ── Studio Header ── */}
      <BillingHeader
        plan={plan}
        isFree={isFree}
        isBusiness={isBusiness}
        isProcessingPortal={isProcessingPortal}
        onRefresh={() => mutate()}
        onOpenPortal={handleOpenPortal}
        onOpenUpgrade={() => setShowUpgradeDialog(true)}
      />

      {/* ── Success Toast Banner ── */}
      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ── Error Banner ── */}
      {actionError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ── Current Plan Overview Card ── */}
      <CurrentPlanCard
        plan={plan}
        subscription={subscription}
        isFree={isFree}
        isProcessingResume={isProcessingResume}
        onOpenCancelModal={() => setShowCancelModal(true)}
        onResumeSubscription={handleResumeSubscription}
      />

      {/* ── Feature Capacities & Usage ── */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="font-black text-base text-foreground">
            Feature Usage &amp; Capacities
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            Real-time tracking of assigned profiles, custom domains, and analytics history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UsageMeter
            title="Profile Identities"
            usage={usage("profile_count")}
            limit={limit("profile_count")}
            unit="profiles"
            description="Active profile handles assigned to your account."
          />
          <UsageMeter
            title="Custom Domains"
            usage={usage("custom_domain_count")}
            limit={limit("custom_domain_count")}
            unit="domains"
            description="Custom apex/subdomains verified with SSL."
          />
          <UsageMeter
            title="Analytics History"
            usage={limit("analytics_history_days") ?? 7}
            limit={limit("analytics_history_days")}
            unit="days"
            description="Continuous historical tracking and metric rollups."
          />
        </div>
      </div>

      {/* ── Plans Comparison Grid ── */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xl font-black text-foreground">Available Plans</h3>
            <p className="text-xs text-muted-foreground font-medium">
              Choose the tier that fits your growth needs. Upgrade or switch anytime.
            </p>
          </div>

          {/* Billing Interval Toggle Switcher */}
          <div className="inline-flex items-center p-1 bg-muted/60 rounded-2xl border border-border/80 text-xs font-bold self-start sm:self-auto select-none">
            <button
              type="button"
              onClick={() => setSelectedBillingInterval("monthly")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl transition-all",
                selectedBillingInterval === "monthly"
                  ? "bg-card text-brand-700 shadow-xs border border-brand-200"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setSelectedBillingInterval("yearly")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5",
                selectedBillingInterval === "yearly"
                  ? "bg-card text-brand-700 shadow-xs border border-brand-200"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Annual</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] px-1.5 py-0.5 rounded-md font-black">
                -22%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* FREE TIER CARD */}
          <div className="rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center shadow-2xs">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-black text-lg text-foreground">Free</h4>
              </div>

              <div>
                <span className="text-3xl font-black text-foreground">$0</span>
                <span className="text-xs text-muted-foreground font-medium"> / forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-muted-foreground font-medium border-t border-border/70 pt-4">
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 Public Profile Identity</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Standard Blocks (Link, Text, Socials)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>7 Days Analytics History</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <span>Standard Digicardo Badge</span>
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              disabled={isFree}
              onClick={() => {
                if (!isFree) setShowCancelModal(true);
              }}
              className="w-full text-xs font-bold rounded-full h-10 bg-card"
            >
              {isFree ? "Current Active Tier" : "Downgrade to Free"}
            </Button>
          </div>

          {/* PRO TIER CARD (POPULAR) */}
          <div className="rounded-[32px] border-2 border-brand-500 bg-gradient-to-b from-brand-50/30 via-card to-card p-6 sm:p-7 shadow-float relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 right-6 bg-brand-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-black text-lg text-foreground">Pro</h4>
              </div>

              <div>
                <span className="text-3xl font-black text-foreground">
                  ${selectedBillingInterval === "yearly" ? "7" : "9"}
                </span>
                <span className="text-xs text-muted-foreground font-medium"> / month</span>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                  {selectedBillingInterval === "yearly" ? "Billed annually ($84/yr)" : "Billed monthly"}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-foreground font-semibold border-t border-border/70 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span><strong>3</strong> Profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span><strong>1 Custom Domain</strong> (SSL included)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span><strong>90 Days</strong> Analytics History</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Advanced Blocks (Video, Music, Gallery)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span><strong>Remove Digicardo Badge</strong></span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setShowUpgradeDialog(true)}
              disabled={isPro}
              variant="pill"
              className="w-full h-10 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-cta"
            >
              {isPro ? "Current Active Plan" : "Upgrade to Pro"}
            </Button>
          </div>

          {/* BUSINESS TIER CARD */}
          <div className="rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-2xs">
                  <Crown className="w-4 h-4" />
                </div>
                <h4 className="font-black text-lg text-foreground">Business</h4>
              </div>

              <div>
                <span className="text-3xl font-black text-foreground">
                  ${selectedBillingInterval === "yearly" ? "23" : "29"}
                </span>
                <span className="text-xs text-muted-foreground font-medium"> / month</span>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                  {selectedBillingInterval === "yearly" ? "Billed annually ($276/yr)" : "Billed monthly"}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-foreground font-semibold border-t border-border/70 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>10</strong> Profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>10 Custom Domains</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>365 Days (1 Year)</strong> Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>All Advanced Blocks &amp; Themes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Priority Support</strong></span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setShowUpgradeDialog(true)}
              disabled={isBusiness}
              variant="outline"
              className="w-full text-xs font-bold rounded-full h-10 bg-card"
            >
              {isBusiness ? "Current Active Plan" : "Upgrade to Business"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Cancel Subscription Dialog Modal ── */}
      <CancelSubscriptionDialog
        open={showCancelModal}
        isCanceling={isProcessingCancel}
        currentPeriodEnd={subscription?.current_period_end || null}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />

      {/* ── Pro / Business Upgrade Dialog Modal ── */}
      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
      />

    </div>
  );
}
