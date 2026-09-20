"use client";

import * as React from "react";
import {
  Bell,
  ShieldCheck,
  CreditCard,
  Globe,
  Mail,
  Star,
  Filter,
} from "lucide-react";
import type { NotificationCategory } from "@/types/notifications";
import { cn } from "@/lib/utils";

export const NOTIFICATION_CATEGORIES: {
  value: NotificationCategory | undefined;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: undefined, label: "All Alerts", icon: <Bell className="h-3.5 w-3.5" /> },
  { value: "contact", label: "Contact Inquiries", icon: <Mail className="h-3.5 w-3.5" /> },
  { value: "domain", label: "Domains & SSL", icon: <Globe className="h-3.5 w-3.5" /> },
  { value: "subscription", label: "Billing", icon: <CreditCard className="h-3.5 w-3.5" /> },
  { value: "security", label: "Security", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  { value: "system", label: "System", icon: <Star className="h-3.5 w-3.5" /> },
];

export interface NotificationFilterBarProps {
  filterCategory: NotificationCategory | undefined;
  unreadOnly: boolean;
  onSelectCategory: (cat: NotificationCategory | undefined) => void;
  onToggleUnreadOnly: () => void;
}

export function NotificationFilterBar({
  filterCategory,
  unreadOnly,
  onSelectCategory,
  onToggleUnreadOnly,
}: NotificationFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {NOTIFICATION_CATEGORIES.map((cat) => {
          const isSelected = filterCategory === cat.value;
          return (
            <button
              key={String(cat.value)}
              type="button"
              onClick={() => onSelectCategory(cat.value)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 shadow-2xs",
                isSelected
                  ? "bg-brand-600 text-white shadow-cta"
                  : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Unread Only Toggle */}
      <button
        type="button"
        onClick={onToggleUnreadOnly}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 shadow-2xs border self-start sm:self-auto",
          unreadOnly
            ? "bg-brand-50 border-brand-200 text-brand-700 font-black"
            : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Filter className="h-3.5 w-3.5" />
        <span>Unread Only</span>
      </button>
    </div>
  );
}
