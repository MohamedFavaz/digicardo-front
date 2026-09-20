"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Globe, Plus } from "lucide-react";
import { DoodleSparkle } from "@/components/ui/playful/Doodles";

export interface DomainsEmptyStateProps {
  isFreePlan: boolean;
  onOpenConnectModal: () => void;
  onOpenUpgradeModal: () => void;
}

export function DomainsEmptyState({
  isFreePlan,
  onOpenConnectModal,
  onOpenUpgradeModal,
}: DomainsEmptyStateProps) {
  return (
    <div className="rounded-[36px] border border-border/80 bg-gradient-to-b from-card to-brand-50/20 p-8 sm:p-12 text-center shadow-card space-y-6 relative overflow-hidden">
      {/* Playful Doodle */}
      <div className="absolute top-4 right-8 text-brand-300 opacity-60 hidden sm:block">
        <DoodleSparkle className="w-8 h-8" />
      </div>

      {/* Floating Animated Globe Icon */}
      <div className="relative mx-auto w-16 h-16 rounded-3xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-float">
        <Globe className="w-8 h-8" />
      </div>

      {/* Text Headline & Value Proposition */}
      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          Make your page truly yours 🌐
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          Connect your own branded domain like <strong className="text-foreground">yourname.com</strong> or <strong className="text-foreground">links.studio.com</strong> instead of using the default Digicardo address.
        </p>
      </div>

      {/* Action CTA Button — all users have full access */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={onOpenConnectModal}
          variant="pill"
          size="sm"
          className="h-10 px-6 gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-cta hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Your First Domain</span>
        </Button>
      </div>
    </div>
  );
}
