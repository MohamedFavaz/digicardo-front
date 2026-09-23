"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import type { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import {
  LayoutDashboard,
  Layers,
  Palette,
  BarChart3,
  MoreHorizontal,
  Globe,
  Search,
  QrCode,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Zap,
  Users,
  ChevronRight,
} from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MobileTopHeader() {
  const [profile, setProfile] = React.useState<Profile | null>(null);

  React.useEffect(() => {
    profileApi
      .getProfile()
      .then((p) => setProfile(p))
      .catch(() => {});
  }, []);

  const username = profile?.username;

  return (
    <header className="h-16 bg-card/90 dark:bg-card/80 backdrop-blur-2xl border-b border-border/80 px-4 flex items-center justify-between select-none shadow-2xs md:hidden">
      <Link href="/dashboard" className="flex items-center">
        <DigicardoLogo size="sm" proBadge />
      </Link>

      {/* Live URL Pill + Notification */}
      <div className="flex items-center gap-2">
        {username && (
          <Link
            href={`/${username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800 shadow-2xs"
          >
            <span>View</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}

        <NotificationBell />
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    profileApi
      .getProfile()
      .then((p) => setProfile(p))
      .catch(() => {});
  }, []);

  // Close "More" drawer whenever route changes
  React.useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const username = profile?.username;
  const displayName = profile?.display_name || user?.name || "Creator";
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
      // Ignore
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

  // Primary 4 Bottom Navigation items + More
  const primaryTabs = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      title: "My Page",
      href: "/dashboard/page",
      icon: Layers,
      isActive: pathname.startsWith("/dashboard/page"),
    },
    {
      title: "Design",
      href: "/dashboard/appearance",
      icon: Palette,
      isActive: pathname.startsWith("/dashboard/appearance"),
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      isActive: pathname.startsWith("/dashboard/analytics"),
    },
  ];

  interface MoreNavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    badge?: string;
    badgeType?: "hot" | "live" | "admin";
  }

  // Secondary items shown in "More" Drawer
  const moreItems: MoreNavItem[] = [
    {
      title: "QR & NFC Smart Card",
      href: "/dashboard/qr",
      icon: QrCode,
      description: "Printable QR & contactless tap card",
      badge: "NFC",
      badgeType: "hot",
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Users,
      description: "Contact submissions & subscribers",
    },
    {
      title: "Custom Domains",
      href: "/dashboard/domains",
      icon: Globe,
      description: "Connect custom branded URL",
    },
    {
      title: "SEO & Social Sharing",
      href: "/dashboard/seo",
      icon: Search,
      description: "Search snippet & OpenGraph previews",
    },
    {
      title: "Account Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Profile info, password & security",
    },
  ];

  if (user?.role === "admin") {
    moreItems.push({
      title: "Admin Console",
      href: "/admin/dashboard",
      icon: ShieldCheck,
      description: "Platform management & governance",
      badge: "Admin",
      badgeType: "admin",
    });
  }

  const isMoreActive =
    !primaryTabs.some((t) => t.isActive) ||
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/billing") ||
    pathname.startsWith("/dashboard/seo") ||
    pathname.startsWith("/dashboard/domains") ||
    pathname.startsWith("/dashboard/qr");

  return (
    <>
      {/* ── Floating Bottom Navigation Dock ── */}
      <nav className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 max-w-md sm:mx-auto z-40 bg-card/95 dark:bg-card/90 backdrop-blur-2xl border border-border/80 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] p-1.5 flex items-center justify-around select-none md:hidden pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.title}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 text-center transition-all duration-200 active:scale-95 relative",
                tab.isActive
                  ? "text-brand-600 font-extrabold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-2xl transition-all duration-200",
                  tab.isActive
                    ? "bg-brand-500/15 text-brand-600 shadow-xs"
                    : "hover:bg-muted/50"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.title}</span>
            </Link>
          );
        })}

        {/* More Drawer Button */}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-all duration-200 active:scale-95 relative",
            isMoreActive || moreOpen
              ? "text-brand-600 font-extrabold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
          aria-label="Open more menu"
        >
          <div
            className={cn(
              "p-1.5 rounded-2xl transition-all duration-200",
              isMoreActive || moreOpen
                ? "bg-brand-500/15 text-brand-600 shadow-xs"
                : "hover:bg-muted/50"
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">More</span>
        </button>
      </nav>

      {/* ── "More" Slide-Up Mobile Sheet Drawer ── */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-md animate-in fade-in duration-200 md:hidden">
          <div
            className="fixed inset-0"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-50 bg-card rounded-t-[36px] border-t border-border/80 p-6 max-h-[85vh] overflow-y-auto shadow-float animate-in slide-in-from-bottom duration-250 space-y-5">
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground leading-none">
                    {displayName}
                  </h3>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {user?.email ?? `@${username}`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Profile URL Card */}
            {username && (
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between">
                <div className="min-w-0 space-y-0.5">
                  <span className="block text-[10px] font-mono uppercase font-bold text-muted-foreground">
                    Public Link
                  </span>
                  <p className="text-xs font-mono font-bold text-foreground truncate">
                    digicardo.app/{username}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy link"
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
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors"
                    title="Open live link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Secondary Menu Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground px-1">
                Studio Tools
              </span>

              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-2xl transition-colors",
                      active
                        ? "bg-brand-500/10 text-brand-600 font-bold"
                        : "hover:bg-muted/60 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center",
                          active
                            ? "bg-brand-500 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive rounded-2xl h-11 font-bold text-xs shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function MobileNav() {
  return (
    <>
      <MobileTopHeader />
      <MobileBottomNav />
    </>
  );
}
