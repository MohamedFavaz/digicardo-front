"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profileApi } from "@/lib/api/profile";
import type { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import {
  ExternalLink,
  Copy,
  Check,
  LayoutDashboard,
  Layers,
  Palette,
  BarChart3,
  Bell,
  CreditCard,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

const PAGE_CONFIG: Record<
  string,
  { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "/dashboard": { title: "Overview", subtitle: "Command Center & Metrics", icon: LayoutDashboard },
  "/dashboard/page": { title: "My Page", subtitle: "Blocks, Links & Bio Content", icon: Layers },
  "/dashboard/appearance": { title: "Appearance", subtitle: "Themes, Colors & Typography", icon: Palette },
  "/dashboard/analytics": { title: "Analytics", subtitle: "Real-time Traffic & Conversions", icon: BarChart3 },
  "/dashboard/notifications": { title: "Notifications", subtitle: "Activity & Contact Inquiries", icon: Bell },
  "/dashboard/billing": { title: "Billing & Plans", subtitle: "Subscription & Invoices", icon: CreditCard },
  "/dashboard/settings": { title: "Settings", subtitle: "Account Security & Preferences", icon: Settings },
  "/admin/dashboard": { title: "Admin Console", subtitle: "Platform Management", icon: ShieldCheck },
};

export function TopBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    profileApi
      .getProfile()
      .then((p) => setProfile(p))
      .catch(() => { });
  }, []);

  const pageInfo = PAGE_CONFIG[pathname] ?? {
    title: "Dashboard",
    subtitle: "Creator Studio",
    icon: Sparkles,
  };
  const Icon = pageInfo.icon;

  const username = profile?.username;
  const publicUrl = username
    ? typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://digicardo.app/${username}`
    : null;

  const [greeting, setGreeting] = React.useState("Welcome");

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <header
      className={cn(
        "h-16 bg-transparent px-5 lg:px-8 flex items-center justify-between select-none",
        className
      )}
    >
      {/* ── Left: Linktree Greeting on /dashboard or Page Title on sub-routes ── */}
      <div className="flex items-center gap-3 min-w-0">
        {pathname === "/dashboard" ? (
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none" suppressHydrationWarning>
              {greeting}, {username || "Creator"}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs flex-shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 leading-tight truncate tracking-tight">
                  {pageInfo.title}
                </h1>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-tight hidden sm:block truncate">
                {pageInfo.subtitle}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Linktree Public Link Pill + Notification Bell ── */}
      <div className="flex items-center gap-2.5">
        {/* Linktree style Public URL Pill */}
        {username && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-2xs hover:border-slate-300 transition-all">
            <span className="text-slate-400 font-serif text-sm leading-none">✳</span>
            <span className="truncate max-w-[140px] lg:max-w-[220px]" suppressHydrationWarning>
              digicardo.app/{username}
            </span>
            <button
              onClick={handleCopy}
              title="Copy Profile Link"
              aria-label="Copy public profile link"
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all ml-0.5 active:scale-90 cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <Link
              href={`/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open public profile"
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all active:scale-90"
            >
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}
        <NotificationBell align="right" />
      </div>
    </header>
  );
}
