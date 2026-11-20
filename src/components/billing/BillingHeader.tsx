"use client";

import * as React from "react";
import { CreditCard, Loader2, RefreshCw } from "lucide-react";
import { PlanBadge } from "@/components/billing/PlanBadge";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
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

/** Settings tabs + billing actions (title is in the top bar). */
export function BillingHeader({ plan, isFree, isProcessingPortal, onRefresh, onOpenPortal }: BillingHeaderProps) {
  return (
    <div className="space-y-4">
      <SettingsHeader />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Current plan <PlanBadge planCode={plan?.code || "free"} />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onRefresh} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-input bg-card px-3.5 text-sm font-semibold hover:bg-muted">
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Refresh
          </button>
          {!isFree && (
            <button type="button" onClick={onOpenPortal} disabled={isProcessingPortal} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-input bg-card px-3.5 text-sm font-semibold hover:bg-muted disabled:opacity-50">
              {isProcessingPortal ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CreditCard className="h-4 w-4" aria-hidden="true" />}
              Manage payments
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
