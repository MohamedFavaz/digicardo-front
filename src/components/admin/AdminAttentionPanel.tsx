"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ShieldAlert, FileText, ArrowRight } from "lucide-react";

export interface AdminAttentionPanelProps {
  pendingReportsCount: number;
  profilesUnderReviewCount: number;
}

export function AdminAttentionPanel({
  pendingReportsCount,
  profilesUnderReviewCount,
}: AdminAttentionPanelProps) {
  const hasItems = pendingReportsCount > 0 || profilesUnderReviewCount > 0;

  if (!hasItems) {
    return (
      <div className="rounded-[32px] border border-emerald-200/80 bg-emerald-50/40 p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-emerald-950">
              All Systems Operational &amp; Clear ✨
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              Zero pending abuse reports and no profiles currently requiring urgent review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-card to-rose-50/40 p-6 shadow-card space-y-4 select-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs flex-shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-foreground">
            Items Requiring Attention
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            Pending governance and abuse triage items requiring review by moderators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {pendingReportsCount > 0 && (
          <Link
            href="/dashboard/admin/reports"
            className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-200 bg-card hover:bg-rose-50/50 transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-foreground">
                <strong className="text-rose-600 font-black">{pendingReportsCount}</strong> pending abuse reports
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
        )}

        {profilesUnderReviewCount > 0 && (
          <Link
            href="/dashboard/admin/profiles"
            className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-200 bg-card hover:bg-amber-50/50 transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-foreground">
                <strong className="text-amber-600 font-black">{profilesUnderReviewCount}</strong> profiles under review
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
        )}
      </div>
    </div>
  );
}
