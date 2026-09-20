"use client";

import * as React from "react";
import Link from "next/link";
import { History, Clock, ArrowRight } from "lucide-react";
import type { ModerationActionItem } from "@/types/admin";

export interface AdminActivityFeedProps {
  actions: ModerationActionItem[];
  isLoading: boolean;
}

export function AdminActivityFeed({ actions, isLoading }: AdminActivityFeedProps) {
  return (
    <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-600 flex items-center justify-center shadow-2xs">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-foreground">
              Recent Moderation &amp; Governance Actions
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              Audit log of administrative decisions, role adjustments, and profile reviews.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/admin/moderation"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <span>View Audit Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted/40" />
          ))}
        </div>
      ) : actions.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground font-medium">
          No recent administrative actions recorded yet.
        </div>
      ) : (
        <ul className="divide-y divide-border/60" role="list">
          {actions.map((act) => (
            <li key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-black uppercase flex-shrink-0 mt-0.5">
                  {act.target_type ? act.target_type[0] : "A"}
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-foreground">
                    <span className="capitalize">{act.action_type.replace(/_/g, " ")}</span> on{" "}
                    <span className="font-mono text-muted-foreground font-bold">
                      {act.target_type}:{act.target_id.slice(0, 10)}...
                    </span>
                  </div>
                  {act.reason && (
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Reason: {act.reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right text-[11px] text-muted-foreground font-medium flex-shrink-0">
                <span className="font-bold text-foreground">by {act.actor?.name ?? "Admin"}</span>
                <div className="flex items-center sm:justify-end gap-1 font-mono text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>{new Date(act.created_at).toLocaleString()}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
