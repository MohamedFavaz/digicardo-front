"use client";

import * as React from "react";
import { Check, Trash2, ShieldCheck, CreditCard, Globe, Mail, Star } from "lucide-react";
import type { Notification, NotificationCategory } from "@/types/notifications";
import { cn } from "@/lib/utils";

function timeAgo(isoString: string): string {
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

function getCategoryIcon(cat: NotificationCategory) {
  switch (cat) {
    case "security":
      return <ShieldCheck className="w-4 h-4 text-rose-600" />;
    case "subscription":
      return <CreditCard className="w-4 h-4 text-emerald-600" />;
    case "domain":
      return <Globe className="w-4 h-4 text-sky-600" />;
    case "contact":
      return <Mail className="w-4 h-4 text-amber-600" />;
    case "system":
    default:
      return <Star className="w-4 h-4 text-brand-600" />;
  }
}

export interface NotificationItemCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export function NotificationItemCard({
  notification,
  onMarkRead,
  onRemove,
}: NotificationItemCardProps) {
  const isUnread = !notification.is_read;

  return (
    <div
      className={cn(
        "group relative flex items-start justify-between p-4 sm:p-5 rounded-[28px] border transition-all gap-4 select-none",
        isUnread
          ? "bg-card border-brand-200/90 shadow-xs ring-1 ring-brand-500/10"
          : "bg-card/70 border-border/70 shadow-2xs hover:bg-card hover:border-border"
      )}
    >
      {/* Category Icon & Content */}
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <div className="mt-0.5 w-9 h-9 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-center shadow-2xs flex-shrink-0">
          {getCategoryIcon(notification.category)}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={cn(
                "text-xs sm:text-sm font-black leading-snug",
                isUnread ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {notification.title}
            </h4>

            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
            )}
          </div>

          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            {notification.body}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted/50 text-[10px] font-mono font-bold text-muted-foreground uppercase">
              {notification.category}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground font-medium">
              {timeAgo(notification.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {isUnread && (
          <button
            type="button"
            id={`mark-read-${notification.id}`}
            onClick={() => onMarkRead(notification.id)}
            title="Mark as read"
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 transition-colors border border-border/60 bg-card"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          id={`delete-notification-${notification.id}`}
          onClick={() => onRemove(notification.id)}
          title="Delete alert"
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors border border-border/60 bg-card"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
