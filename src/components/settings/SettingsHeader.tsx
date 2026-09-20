"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsHeader() {
  const pathname = usePathname();
  const isAccount = pathname.includes("/settings/account") || pathname === "/dashboard/settings";
  const isNotifications = pathname.includes("/settings/notifications");

  return (
    <div className="pb-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Section Tag */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span>Account &amp; Preferences</span>
          <span>·</span>
          <span>Security &amp; Privacy</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings &amp; Security
        </h1>

        <p className="text-xs text-muted-foreground max-w-xl">
          Manage your personal account credentials, active sessions, and communication preferences.
        </p>
      </div>

      {/* Segmented Navigation Tab Switcher */}
      <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex items-center p-1 rounded-2xl bg-muted/60 border border-border/80 text-xs font-bold self-start md:self-auto select-none shadow-2xs">
        <Link
          href="/dashboard/settings/account"
          className={cn(
            "px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all text-center",
            isAccount
              ? "bg-card text-brand-600 dark:text-brand-300 shadow-xs font-black border border-brand-200 dark:border-brand-800"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="w-3.5 h-3.5" />
          <span className="truncate">Account &amp; Security</span>
        </Link>

        <Link
          href="/dashboard/settings/notifications"
          className={cn(
            "px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all text-center",
            isNotifications
              ? "bg-card text-brand-600 dark:text-brand-300 shadow-xs font-black border border-brand-200 dark:border-brand-800"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="truncate">Notifications</span>
        </Link>
      </div>
    </div>
  );
}
