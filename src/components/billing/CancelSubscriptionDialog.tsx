"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

export interface CancelSubscriptionDialogProps {
  open: boolean;
  isCanceling: boolean;
  currentPeriodEnd: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelSubscriptionDialog({
  open,
  isCanceling,
  currentPeriodEnd,
  onClose,
  onConfirm,
}: CancelSubscriptionDialogProps) {
  if (!open) return null;

  const formattedDate = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "the end of your current billing period";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="relative w-full max-w-md rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-float space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                Cancel Subscription?
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Keep access until your billing period ends
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explanation */}
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          Are you sure you want to cancel your Digicardo subscription? You will retain full access to all Pro/Business features until <strong className="text-foreground">{formattedDate}</strong>. After this date, your plan will downgrade to Free and extra feature limits will be adjusted.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isCanceling}
            className="rounded-full text-xs font-bold h-9 px-4 bg-card"
          >
            Keep My Plan
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isCanceling}
            className="rounded-full text-xs font-black h-9 px-5 bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
          >
            {isCanceling ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin mr-1.5" />
            ) : null}
            <span>{isCanceling ? "Canceling..." : "Yes, Cancel Subscription"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
