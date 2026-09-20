"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useEntitlements } from "@/lib/hooks/use-entitlements";
import { PlanBadge } from "@/components/billing/PlanBadge";
import { CheckCircle2, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingSuccessPage() {
  const { plan, subscription, mutate, isFree } = useEntitlements();
  const [pollCount, setPollCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isFree && pollCount < 5) {
      intervalId = setTimeout(async () => {
        await mutate();
        setPollCount((prev) => prev + 1);
      }, 1500);
    } else {
      setIsVerifying(false);
    }

    return () => clearTimeout(intervalId);
  }, [isFree, pollCount, mutate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-6 shadow-xl">
        {isVerifying && isFree ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Confirming Your Subscription...
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please wait while our payment webhook activates your new feature entitlements.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Plan Activated
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Payment Successful!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Thank you for upgrading. Your Digicardo account has been updated with premium entitlements.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active Tier</span>
                {plan && <PlanBadge planCode={plan.code} size="sm" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Billing Cycle</span>
                <span className="font-semibold capitalize text-slate-900 dark:text-white">
                  {subscription?.billing_interval || "Monthly"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link href="/dashboard">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard/billing">
                <Button variant="outline" className="w-full text-xs font-semibold rounded-xl">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
