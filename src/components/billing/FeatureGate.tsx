"use client";

import React, { useState } from "react";
import { useEntitlements } from "@/lib/hooks/use-entitlements";
import { FeatureKey } from "@/types/plans";
import { UpgradeDialog } from "./UpgradeDialog";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureGateProps {
  feature: FeatureKey | string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  title?: string;
  description?: string;
  showUpgradePrompt?: boolean;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  title,
  description,
  showUpgradePrompt = true,
}) => {
  const { can, isLoading } = useEntitlements();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // While loading entitlements, render children to avoid layout flashes or skeleton
  if (isLoading) {
    return <>{children}</>;
  }

  const isAllowed = can(feature);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <>
      <div
        className="rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/40 via-white to-transparent dark:from-indigo-950/20 dark:via-slate-900/50 p-6 text-center shadow-sm"
        data-testid="feature-gate-locked"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3 shadow-inner">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {title || "Unlock This Feature with Pro"}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
          {description || "This capability is part of Digicardo Pro and Business subscriptions. Upgrade to unlock immediate access."}
        </p>
        <Button
          onClick={() => setShowUpgradeModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>View Upgrade Options</span>
        </Button>
      </div>

      <UpgradeDialog
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        highlightFeature={feature}
      />
    </>
  );
};
