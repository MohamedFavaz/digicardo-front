"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PlanBadge } from "@/components/billing/PlanBadge";

export interface DomainsHeaderProps {
  domainCount: number;
  domainLimit: number;
  planName: string;
  isFreePlan: boolean;
  onOpenConnectModal: () => void;
  onOpenUpgradeModal: () => void;
}

export function DomainsHeader({
  domainCount,
  domainLimit,
  planName,
  isFreePlan,
  onOpenConnectModal,
  onOpenUpgradeModal,
}: DomainsHeaderProps) {
  const isLimitReached = domainLimit > 0 && domainCount >= domainLimit;

  return (
    <div className="rounded-[36px] bg-gradient-to-br from-card via-card to-brand-50/30 border border-border/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Title & Quota */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-black tracking-wider uppercase text-brand-600">
            BRANDED DOMAINS
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <PlanBadge planCode={planName || "free"} />
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-xs font-bold text-muted-foreground font-mono">
            {domainLimit === -1
              ? `${domainCount} connected (Unlimited)`
              : `${domainCount} of ${domainLimit} connected`}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Custom Domains 🌐
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl">
          Connect your custom domain (e.g. <strong className="text-foreground">yourname.com</strong> or <strong className="text-foreground">links.studio.io</strong>) to replace the default Digicardo URL.
        </p>
      </div>

      {/* Connect Domain Action CTA — all users have full access */}
      <div className="flex-shrink-0">
        <Button
          onClick={onOpenConnectModal}
          variant="pill"
          size="sm"
          className="h-10 px-5 gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-cta hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Domain</span>
        </Button>
      </div>
    </div>
  );
}
