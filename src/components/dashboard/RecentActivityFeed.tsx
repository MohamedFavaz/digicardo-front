"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Inbox, Mail, Trash2, ArrowRight } from "lucide-react";
import type { ContactSubmissionItem } from "@/lib/api/contact";

export interface RecentActivityFeedProps {
  submissions: ContactSubmissionItem[];
  onDeleteSubmission?: (id: string) => void;
}

export function RecentActivityFeed({ submissions, onDeleteSubmission }: RecentActivityFeedProps) {
  return (
    <div className="rounded-[28px] sm:rounded-[32px] border border-border/80 bg-card p-4 sm:p-7 shadow-card space-y-5 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">Inquiries &amp; Messages</h3>
            <p className="text-xs text-muted-foreground font-medium">
              Submissions from your public contact form
            </p>
          </div>
        </div>
        <Link href="/dashboard/notifications">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground gap-1 hover:bg-muted/70"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {submissions.length > 0 ? (
        <div className="space-y-2">
          {submissions.slice(0, 3).map((sub) => (
            <div
              key={sub.id}
              className="flex items-start justify-between gap-3 p-3.5 rounded-2xl border border-border/80 bg-card hover:border-brand-500/40 shadow-2xs transition-all duration-200"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-foreground truncate">
                      {sub.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {sub.created_at
                        ? new Date(sub.created_at).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-600 font-mono font-medium truncate">
                    {sub.email}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1 pt-0.5">
                    {sub.message}
                  </p>
                </div>
              </div>

              {onDeleteSubmission && (
                <button
                  type="button"
                  onClick={() => onDeleteSubmission(sub.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 mt-0.5 active:scale-90"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center shadow-2xs">
            <Inbox className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-black text-foreground">Inbox is Empty</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium max-w-xs">
              When visitors submit your page contact form, messages will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
