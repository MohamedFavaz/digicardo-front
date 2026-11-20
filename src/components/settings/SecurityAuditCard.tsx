"use client";

import * as React from "react";
import { History, Clock } from "lucide-react";
import type { AccountSecurityEvent } from "@/types/security";
import { SettingsSection } from "./SettingsSection";

function timeAgo(isoString: string | null): string {
  if (!isoString) return "Unknown";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export interface SecurityAuditCardProps {
  events: AccountSecurityEvent[];
  isLoading: boolean;
}

export function SecurityAuditCard({ events, isLoading }: SecurityAuditCardProps) {
  return (
    <SettingsSection icon={History} title="Recent activity" description="Sign-ins and security changes on your account. If something looks wrong, change your password.">
      {isLoading ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-11 rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing recorded yet.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-border pl-5" role="list">
          {events.map((ev) => (
            <li key={ev.id} className="relative">
              <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-card" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground">{ev.description}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {new Date(ev.created_at).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
                <span aria-hidden="true">·</span>
                <span>{timeAgo(ev.created_at)}</span>
              </p>
            </li>
          ))}
        </ol>
      )}
    </SettingsSection>
  );
}
