"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, Globe, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const SETTINGS_TABS = [
  { href: "/dashboard/settings/account", label: "Account", icon: User, match: ["/dashboard/settings/account", "/dashboard/settings"] },
  { href: "/dashboard/settings/notifications", label: "Notifications", icon: Bell, match: ["/dashboard/settings/notifications"] },
  { href: "/dashboard/seo", label: "Search & sharing", icon: Search, match: ["/dashboard/seo"] },
  { href: "/dashboard/domains", label: "Custom domain", icon: Globe, match: ["/dashboard/domains"] },
  { href: "/dashboard/billing", label: "Plan & billing", icon: CreditCard, match: ["/dashboard/billing"] },
];

/** One Settings area with tabs (plan §3.4); the page title is in the top bar. */
export function SettingsHeader() {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="Settings" className="-mx-4 overflow-x-auto border-b border-border px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-1">
        {SETTINGS_TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match.some((m) => pathname === m || (m !== "/dashboard/settings" && pathname.startsWith(`${m}/`)));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center gap-1.5 border-b-2 px-3 text-sm transition-colors",
                  active ? "border-primary font-semibold text-foreground" : "border-transparent font-medium text-[#52525B] hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
