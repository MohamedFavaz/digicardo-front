"use client";

import * as React from "react";
import { Plus } from "lucide-react";

export interface DomainsHeaderProps {
  domainCount: number;
  domainLimit: number;
  planName: string;
  isFreePlan: boolean;
  onOpenConnectModal: () => void;
  onOpenUpgradeModal: () => void;
}

/** Custom-domain toolbar (the page title is in the top bar). Plan props are kept for compatibility. */
export function DomainsHeader({ domainCount, domainLimit, onOpenConnectModal }: DomainsHeaderProps) {
  const isLimitReached = domainLimit > 0 && domainCount >= domainLimit;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        {domainLimit === -1 ? `${domainCount} connected` : `${domainCount} of ${domainLimit} connected`} · Use an address like
        <strong className="font-semibold text-foreground"> yourname.com</strong> instead of the Digicardo link.
      </p>
      <button
        type="button"
        onClick={onOpenConnectModal}
        disabled={isLimitReached}
        className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[#4A32C0] disabled:opacity-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Connect a domain
      </button>
    </div>
  );
}
