"use client";

import * as React from "react";
import { Inbox } from "lucide-react";
import { DoodleSparkle } from "@/components/ui/playful/Doodles";

export interface NotificationEmptyStateProps {
  unreadOnly: boolean;
}

export function NotificationEmptyState({ unreadOnly }: NotificationEmptyStateProps) {
  return (
    <div className="rounded-[36px] border border-border/80 bg-gradient-to-b from-card to-brand-50/20 p-8 sm:p-12 text-center shadow-card space-y-5 relative overflow-hidden select-none">
      {/* Decorative Sparkle */}
      <div className="absolute top-4 right-8 text-brand-300 opacity-60 hidden sm:block">
        <DoodleSparkle className="w-8 h-8" />
      </div>

      {/* Floating Animated Bell Icon */}
      <div className="relative mx-auto w-16 h-16 rounded-3xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-float">
        <Inbox className="w-8 h-8" />
      </div>

      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-xl font-black text-foreground tracking-tight">
          {unreadOnly ? "No Unread Alerts ✨" : "You're All Caught Up ✨"}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          {unreadOnly
            ? "You have read all your incoming notifications and messages."
            : "No notifications right now. New inquiries and updates will appear here."}
        </p>
      </div>
    </div>
  );
}
