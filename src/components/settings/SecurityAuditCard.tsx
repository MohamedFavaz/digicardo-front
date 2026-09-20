"use client";

import * as React from "react";
import { History, Clock } from "lucide-react";
import type { AccountSecurityEvent } from "@/types/security";

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
    <div className="rounded-xl border border-border bg-white p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
          <History className="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Security Activity Audit Trail
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            Recent authentication events and security actions recorded on your account.
          </p>
        </div>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 rounded-2xl bg-muted/40" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="text-xs text-muted-foreground font-medium">No recent security events recorded.</p>
      ) : (
        <ul className="divide-y divide-border/60" role="list">
          {events.map((ev) => (
            <li key={ev.id} className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-brand-500 flex-shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">{ev.description}</p>
                  <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {new Date(ev.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    <span className="text-muted-foreground font-mono">({timeAgo(ev.created_at)})</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
