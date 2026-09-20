"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BellRing, CheckCheck, Settings } from "lucide-react";

export interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export function NotificationsHeader({
  unreadCount,
  onMarkAllRead,
}: NotificationsHeaderProps) {
  return (
    <div className="rounded-[36px] bg-gradient-to-br from-card via-card to-brand-50/30 border border-border/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Title & Badge */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-black tracking-wider uppercase text-brand-600">
            ACTIVITY &amp; AUDIENCE
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          {unreadCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-50 text-brand-700 border border-brand-200">
              <BellRing className="w-3 h-3 text-brand-600 animate-pulse" />
              <span>{unreadCount} Unread Alerts</span>
            </span>
          ) : (
            <span className="text-xs font-bold text-muted-foreground font-mono">
              All Caught Up ✓
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Notifications Center 🔔
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-xl">
          Real-time updates on visitor contact inquiries, domain SSL verifications, and system events.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
        {unreadCount > 0 && (
          <Button
            id="mark-all-read-button"
            type="button"
            variant="pill"
            size="sm"
            onClick={onMarkAllRead}
            className="h-10 px-5 gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-cta"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </Button>
        )}

        <Link href="/dashboard/settings/notifications">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-bold gap-1.5 bg-card hover:bg-muted shadow-xs h-10 px-4"
          >
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Preferences</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
