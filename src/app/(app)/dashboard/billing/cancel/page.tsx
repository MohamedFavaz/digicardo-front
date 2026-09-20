"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <XCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Checkout Canceled
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            No charges were made to your account. You remain on your current plan.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link href="/dashboard/billing">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Billing</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full text-xs font-semibold rounded-xl">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
