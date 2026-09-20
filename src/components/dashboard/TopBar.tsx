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
  Globe,
  Search,
  QrCode,
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
  "/dashboard/domains": { title: "Custom Domains", subtitle: "SSL & Domain Mapping", icon: Globe },
  "/dashboard/seo": { title: "SEO & Social", subtitle: "OpenGraph Cards & Meta Tags", icon: Search },
  "/dashboard/qr": { title: "QR Code & NFC", subtitle: "Physical & Contactless Touchpoints", icon: QrCode },
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
      .catch(() => {});
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
        "h-16 bg-card/80 dark:bg-card/70 backdrop-blur-2xl border-b border-border/70 px-5 lg:px-8 flex items-center justify-between select-none shadow-[0_1px_10px_rgba(0,0,0,0.02)]",
        className
      )}
    >
      {/* ── Left: Breadcrumb Page Title & Context Icon ── */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-2xl bg-muted/60 dark:bg-muted/40 border border-border/80 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-2xs flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-foreground leading-tight truncate tracking-tight">
              {pageInfo.title}
            </h1>
          </div>
          <p className="text-[11px] font-medium text-muted-foreground leading-tight hidden sm:block truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* ── Right: Live URL Pill + Quick Action Buttons + Notification Bell ── */}
      <div className="flex items-center gap-2.5">
        {/* URL copy pill */}
        {username && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/80 text-xs font-mono text-muted-foreground shadow-2xs hover:border-brand-300 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="truncate max-w-[140px] lg:max-w-[210px] font-semibold text-foreground" suppressHydrationWarning>
              digicardo.app/{username}
            </span>
            <button
              onClick={handleCopy}
              title="Copy Profile Link"
              aria-label="Copy public profile link"
              className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all ml-0.5 active:scale-90"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}

        {/* Quick QR & NFC Shortcut */}
        <Link href="/dashboard/qr" className="hidden lg:flex">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-xl hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border/60"
            title="Open QR & NFC Studio"
          >
            <QrCode className="w-4 h-4" />
          </Button>
        </Link>

        {/* View live page button */}
        {username && (
          <Link
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className="hidden md:flex"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5 border-border/80 bg-card hover:bg-muted/70 hover:border-brand-500/40 hover:text-brand-600 transition-all shadow-2xs active:scale-95"
            >
              <span>View Live</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-brand-600" />
            </Button>
          </Link>
        )}

        {/* Notification Bell with pulse indicator */}
        <div className="flex-shrink-0">
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
