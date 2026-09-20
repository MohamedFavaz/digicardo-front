"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, CreditCard } from "lucide-react";
import { PlanBadge } from "@/components/billing/PlanBadge";
import type { Plan } from "@/types/plans";

export interface BillingHeaderProps {
  plan: Plan | null;
  isFree: boolean;
  isBusiness: boolean;
  isProcessingPortal: boolean;
  onRefresh: () => void;
  onOpenPortal: () => void;
  onOpenUpgrade: () => void;
}

export function BillingHeader({
  plan,
  isFree,
  isBusiness,
  isProcessingPortal,
  onRefresh,
  onOpenPortal,
  onOpenUpgrade,
}: BillingHeaderProps) {
  return (
    <div className="rounded-[36px] bg-gradient-to-br from-card via-card to-brand-50/30 border border-border/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Title & Plan Badge */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-black tracking-wider uppercase text-brand-600">
            ACCOUNT &amp; TIERS
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <PlanBadge planCode={plan?.code || "free"} size="sm" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Plan &amp; Billing 💳
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl">
          Manage your Digicardo subscription, check usage capacities, and upgrade feature limits.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="rounded-full text-xs font-bold gap-1.5 bg-card hover:bg-muted shadow-xs h-10 px-4"
        >
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Refresh</span>
        </Button>

        {!isFree && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenPortal}
            disabled={isProcessingPortal}
            className="rounded-full text-xs font-bold gap-1.5 bg-card hover:bg-muted shadow-xs h-10 px-4"
          >
            <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{isProcessingPortal ? "Opening..." : "Manage Stripe Billing"}</span>
          </Button>
        )}

        {!isBusiness && (
          <Button
            type="button"
            variant="pill"
            size="sm"
            onClick={onOpenUpgrade}
            className="h-10 px-5 gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-cta hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade Plan</span>
          </Button>
        )}
      </div>
    </div>
  );
}
