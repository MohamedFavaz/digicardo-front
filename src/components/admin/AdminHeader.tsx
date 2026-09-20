"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  children?: React.ReactNode;
}

const ADMIN_NAV_LINKS = [
  {
    href: "/dashboard/admin",
    label: "Overview",
    icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    exact: true,
  },
  {
    href: "/dashboard/admin/users",
    label: "Users",
    icon: <Users className="w-3.5 h-3.5" />,
    exact: false,
  },
  {
    href: "/dashboard/admin/profiles",
    label: "Profiles",
    icon: <FileText className="w-3.5 h-3.5" />,
    exact: false,
  },
  {
    href: "/dashboard/admin/reports",
    label: "Reports",
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
    exact: false,
  },
  {
    href: "/dashboard/admin/moderation",
    label: "Audit Log",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    exact: false,
  },
  {
    href: "/dashboard/admin/operations",
    label: "Operations",
    icon: <Activity className="w-3.5 h-3.5" />,
    exact: false,
  },
];

export function AdminHeader({
  title = "Admin Overview",
  subtitle = "Monitor your Digicardo platform and manage important activity.",
  badgeText = "PLATFORM CONTROL PLANE",
  children,
}: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="rounded-[36px] bg-gradient-to-br from-card via-card to-brand-50/30 border border-border/80 p-6 sm:p-8 shadow-card space-y-6 select-none">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs">
              <Shield className="w-3 h-3 text-purple-600" />
              <span>{badgeText}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-xs font-bold text-muted-foreground font-mono">
              SYSTEM LEVEL ACCESS
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {children && (
          <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
            {children}
          </div>
        )}
      </div>

      {/* Segmented Admin Sub-Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none border-t border-border/70 pt-4">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 shadow-2xs",
                isActive
                  ? "bg-brand-600 text-white shadow-cta font-black"
                  : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted font-medium"
              )}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
