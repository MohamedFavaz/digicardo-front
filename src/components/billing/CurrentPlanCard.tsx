"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { Plan, Subscription } from "@/types/plans";

export interface CurrentPlanCardProps {
  plan: Plan | null;
  subscription: Subscription | null;
  isFree: boolean;
  isProcessingResume: boolean;
  onOpenCancelModal: () => void;
  onResumeSubscription: () => void;
}

export function CurrentPlanCard({
  plan,
  subscription,
  isFree,
  isProcessingResume,
  onOpenCancelModal,
  onResumeSubscription,
}: CurrentPlanCardProps) {
  const planName = plan?.name || "Free Forever Plan";
  const planDesc = plan?.description || "Essential link sharing with 1 profile identity and standard Digicardo features.";
  const isCanceled = Boolean(subscription?.cancel_at_period_end);

  const formattedPeriodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : null;

  return (
    <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-6 select-none">

      {/* Cancellation Banner Alert if scheduled */}
      {isCanceled && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-black">
                Subscription Scheduled for Cancellation
              </h4>
              <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                Your plan remains active with full Pro access until <strong className="font-bold">{formattedPeriodEnd}</strong>.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={onResumeSubscription}
            disabled={isProcessingResume}
            className="rounded-full text-xs font-bold h-8 px-4 bg-amber-600 hover:bg-amber-700 text-white flex-shrink-0 gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isProcessingResume ? "Resuming..." : "Resume Subscription"}</span>
          </Button>
        </div>
      )}

      {/* Top Split: Plan Details & Billing Cycle Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* Left: Active Tier */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-muted-foreground">
              ACTIVE TIER
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{subscription?.status ? subscription.status.toUpperCase() : "ACTIVE"}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            {planName}
          </h2>

          <p className="text-xs text-muted-foreground font-medium max-w-lg leading-relaxed">
            {planDesc}
          </p>
        </div>

        {/* Right: Cycle & Renewal Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/80 flex-shrink-0">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
              Billing Interval
            </span>
            <span className="block text-xs font-black text-foreground capitalize">
              {subscription?.billing_interval || "Free Forever"}
            </span>
          </div>

          {formattedPeriodEnd && (
            <div className="sm:border-l sm:border-border/80 sm:pl-4 space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                {isCanceled ? "Access Ends On" : "Next Renewal Date"}
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-foreground">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{formattedPeriodEnd}</span>
              </div>
            </div>
          )}

          {!isFree && !isCanceled && (
            <div className="sm:border-l sm:border-border/80 sm:pl-4 flex items-center">
              <button
                type="button"
                onClick={onOpenCancelModal}
                className="text-xs font-bold text-muted-foreground hover:text-rose-600 underline transition-colors"
              >
                Cancel Plan
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
