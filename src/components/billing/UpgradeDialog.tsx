"use client";

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useEntitlements } from "@/lib/hooks/use-entitlements";
import { subscriptionApi } from "@/lib/api/subscription";
import { Plan } from "@/types/plans";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightFeature?: string;
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { plans, plan: currentPlan, subscription, mutate, isFree } = useEntitlements();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("yearly");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const proPlan = plans.find((p) => p.code === "pro");
  const businessPlan = plans.find((p) => p.code === "business");

  const handleSelectPlan = async (plan: Plan) => {
    try {
      setIsProcessing(plan.code);
      setErrorMessage(null);

      // If user is on Free plan or has no active paid subscription, initiate checkout
      if (isFree || !subscription || !subscription.is_active) {
        const res = await subscriptionApi.checkout({
          plan: plan.code as "pro" | "business",
          interval: billingInterval,
        });

        if (res.checkout_url) {
          window.location.href = res.checkout_url;
          return;
        }
      } else {
        // Active subscriber switching plan tier
        await subscriptionApi.changePlan({
          plan: plan.code as "pro" | "business",
          interval: billingInterval,
        });
        await mutate();
        onOpenChange(false);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to initiate plan upgrade. Please try again."
      );
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="sm:max-w-[760px] -m-6 p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent dark:from-indigo-950/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Unlock Premium Capabilities
              </span>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Upgrade Your Digicardo Platform
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Scale your presence with custom domains, premium blocks, deep analytics, and zero branding.
              </DialogDescription>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Monthly / Yearly Toggle */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setBillingInterval("monthly")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  billingInterval === "monthly"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Monthly billing
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval("yearly")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  billingInterval === "yearly"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>Annual billing</span>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  Save 22%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto">
          {/* PRO PLAN */}
          <div className="rounded-2xl border-2 border-indigo-600 dark:border-indigo-500 p-5 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/20 relative flex flex-col justify-between">
            <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Most Popular
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pro</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">For creators & professionals</p>
                </div>
              </div>

              <div className="mt-4 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    ${billingInterval === "yearly" ? "7" : "9"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ month</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {billingInterval === "yearly" ? "Billed annually ($84/year)" : "Billed monthly ($9/mo)"}
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>3</strong> Profiles / User Identities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>1 Custom Domain</strong> (e.g. yourname.com)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>90 Days</strong> Analytics History</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>Full VCard Business Features</strong> & Custom Themes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>Advanced Blocks</strong> (Video, Gallery, Music, Booking)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>Remove Digicardo Branding</strong></span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => proPlan && handleSelectPlan(proPlan)}
              disabled={isProcessing !== null || currentPlan?.code === "pro"}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
            >
              {currentPlan?.code === "pro" ? "Current Plan" : "Upgrade to Pro"}
              {currentPlan?.code !== "pro" && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>

          {/* BUSINESS PLAN */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Business</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">For agencies & brand teams</p>
                </div>
              </div>

              <div className="mt-4 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    ${billingInterval === "yearly" ? "23" : "29"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ month</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {billingInterval === "yearly" ? "Billed annually ($276/year)" : "Billed monthly ($29/mo)"}
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>10</strong> Profiles / Client Sub-accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>10 Custom Domains</strong> with Instant SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>365 Days (1 Year)</strong> Analytics History</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>Priority 24/7 Support</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>All Pro Features Included</strong></span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => businessPlan && handleSelectPlan(businessPlan)}
              disabled={isProcessing !== null || currentPlan?.code === "business"}
              variant="outline"
              className="mt-6 w-full border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2"
            >
              {currentPlan?.code === "business" ? "Current Plan" : "Upgrade to Business"}
              {currentPlan?.code !== "business" && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure 256-bit encrypted checkout. Cancel anytime.</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="hover:underline text-slate-600 dark:text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};
