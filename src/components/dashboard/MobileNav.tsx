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

export function MobileNav() {
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
    <div className="md:hidden">
      {/* ── 1. Top Mobile Header ── */}
      <header className="h-16 bg-card/90 dark:bg-card/80 backdrop-blur-2xl border-b border-border/80 px-4 flex items-center justify-between select-none shadow-2xs">
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

      {/* ── 2. Floating Bottom Navigation Dock ── */}
      <nav className="fixed bottom-3 left-3 right-3 z-40 bg-card/90 dark:bg-card/80 backdrop-blur-2xl border border-border/80 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5 flex items-center justify-around select-none">
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

      {/* ── 3. "More" Slide-Up Mobile Sheet Drawer ── */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
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
                  <span className="block font-mono text-xs font-bold text-foreground truncate">
                    digicardo.app/{username}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-8 px-3 text-xs font-bold gap-1 rounded-xl shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Navigation Grid */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-extrabold tracking-widest text-muted-foreground/70 uppercase px-1 mb-2">
                All Studio Tools
              </div>

              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 active:scale-[0.98]",
                      active
                        ? "bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-300 font-black shadow-2xs"
                        : "bg-muted/25 border border-border/50 text-foreground hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                          active
                            ? "bg-brand-600 text-white shadow-xs"
                            : "bg-card border border-border/80 text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-black truncate leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate font-medium">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
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
    </div>
  );
}
