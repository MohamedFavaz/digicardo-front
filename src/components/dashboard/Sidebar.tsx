"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import { cn } from "@/lib/utils";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import {
  LayoutDashboard,
  Layers,
  Palette,
  BarChart3,
  Globe,
  Search,
  QrCode,
  Settings,
  LogOut,
  Bell,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Zap,
  ChevronRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { authApi } from "@/lib/api/auth";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: "live" | "hot" | "new" | "admin" | "default";
  exact?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    profileApi
      .getProfile()
      .then((p) => setProfile(p))
      .catch(() => {});
  }, []);

  const username = mounted ? (profile?.username || user?.username || null) : null;
  const displayName = mounted ? (profile?.display_name || user?.name || null) : null;
  const publicUrl = username && typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : username
      ? `https://digicardo.app/${username}`
      : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/login");
    } catch {
      setIsLoggingOut(false);
    }
  };

  const navGroups: NavGroup[] = [
    {
      items: [
        { title: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
        { title: "My Page", href: "/dashboard/page", icon: Layers },
        { title: "Appearance", href: "/dashboard/appearance", icon: Palette },
      ],
    },
    {
      label: "Growth & Insights",
      items: [
        {
          title: "Analytics",
          href: "/dashboard/analytics",
          icon: BarChart3,
          badge: "Live",
          badgeType: "live",
        },
        { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
      ],
    },
    {
      label: "Touchpoints & Tools",
      items: [
        {
          title: "QR & NFC Smart Card",
          href: "/dashboard/qr",
          icon: QrCode,
          badge: "NFC",
          badgeType: "hot",
        },
        { title: "Custom Domains", href: "/dashboard/domains", icon: Globe },
        { title: "SEO & Social Preview", href: "/dashboard/seo", icon: Search },
      ],
    },
    {
      label: "Workspace & Account",
      items: [
        { title: "Settings & Security", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ];

  if (user?.role === "admin") {
    navGroups.push({
      label: "Administration",
      items: [
        {
          title: "Admin Console",
          href: "/admin/dashboard",
          icon: ShieldCheck,
          badge: "Root",
          badgeType: "admin",
        },
      ],
    });
  }

  const isItemActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const renderBadge = (item: NavItem) => {
    if (!item.badge) return null;

    switch (item.badgeType) {
      case "live":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{item.badge}</span>
          </span>
        );
      case "hot":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-500/15 to-purple-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/20 shadow-2xs">
            <Sparkles className="w-2.5 h-2.5 text-brand-500" />
            <span>{item.badge}</span>
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-600 border border-red-500/20">
            {item.badge}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
            {item.badge}
          </span>
        );
    }
  };

  return (
    <aside
      suppressHydrationWarning
      className={cn(
        "hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 bg-card/95 backdrop-blur-2xl border-r border-border/80 z-30 select-none overflow-hidden transition-all duration-300 shadow-[1px_0_15px_rgba(0,0,0,0.03)]",
        className
      )}
    >
      {/* ── Brand Header with Glowing Emblem ── */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border/70 flex-shrink-0 relative overflow-hidden">
        {/* Ambient brand glow */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        <Link
          href="/dashboard"
          className="flex items-center group transition-transform duration-200 active:scale-98"
        >
          <DigicardoLogo size="md" proBadge subtitle="Smart Card Studio" />
        </Link>
      </div>

      {/* ── Live Profile Quick-Card Mini Widget ── */}
      <div className="px-3 pt-3 flex-shrink-0" suppressHydrationWarning>
        <div className="p-3 rounded-2xl bg-gradient-to-br from-muted/50 via-muted/30 to-brand-50/20 dark:to-brand-950/10 border border-border/80 space-y-2 relative overflow-hidden group" suppressHydrationWarning>
          <div className="flex items-center justify-between" suppressHydrationWarning>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                PAGE LIVE
              </span>
            </div>

            {username ? (
              <Link
                href={`/${username}`}
                target="_blank"
                rel="noreferrer"
                suppressHydrationWarning
                className="text-[10px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5 transition-colors"
              >
                <span>View</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            ) : (
              <span className="text-[10px] font-mono text-muted-foreground/60">Live</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-1 p-1.5 rounded-xl bg-card border border-border/70 text-xs shadow-2xs" suppressHydrationWarning>
            <span className="font-mono text-[11px] font-bold text-foreground truncate px-1" suppressHydrationWarning>
              {username ? `/${username}` : "/…"}
            </span>
            {username && (
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy Profile URL"
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation Items ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 no-scrollbar">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label || `g-${groupIndex}`} className="space-y-1">
            {group.label && (
              <div className="px-3 pb-1 pt-1 flex items-center justify-between">
                <p className="text-[10px] font-mono font-extrabold tracking-[0.16em] text-muted-foreground/70 uppercase">
                  {group.label}
                </p>
              </div>
            )}
            
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 group relative select-none",
                      active
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-300 shadow-2xs font-extrabold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-0.5"
                    )}
                  >
                    {/* Active Left Indicator Bar */}
                    {active && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-600 shadow-sm" />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0",
                          active
                            ? "bg-brand-600 text-white shadow-xs scale-105"
                            : "bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {renderBadge(item)}
                      {active && (
                        <ChevronRight className="w-3 h-3 text-brand-600 dark:text-brand-400 opacity-70" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── User Profile Footer ── */}
      <div className="p-3 border-t border-border/70 flex-shrink-0 bg-muted/20" suppressHydrationWarning>
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-muted/60 transition-all border border-transparent hover:border-border/60" suppressHydrationWarning>
          <div className="flex items-center gap-2.5 min-w-0" suppressHydrationWarning>
            {/* User Avatar Initial with status ring */}
            <div className="relative flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs"
                suppressHydrationWarning
              >
                {displayName ? displayName.charAt(0).toUpperCase() : "•"}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>

            <div className="flex flex-col min-w-0" suppressHydrationWarning>
              <span className="text-xs font-black text-foreground truncate leading-tight" suppressHydrationWarning>
                {displayName || "Account"}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground truncate leading-tight" suppressHydrationWarning>
                {user?.email || (username ? `@${username}` : "…")}
              </span>
            </div>
          </div>

          {/* Quick Sign-Out */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Sign out"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0 active:scale-95 disabled:opacity-40"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
