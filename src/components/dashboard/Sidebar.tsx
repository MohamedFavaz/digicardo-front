"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import type { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Layers,
  Palette,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { SetupChecklistCard } from "@/components/dashboard/SetupChecklistCard";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  exact?: boolean;
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const fetchProfile = React.useCallback(() => {
    profileApi
      .getProfile()
      .then((p) => setProfile(p))
      .catch(() => { });
  }, []);

  React.useEffect(() => {
    setMounted(true);
    fetchProfile();

    const handleProfileUpdate = () => fetchProfile();
    window.addEventListener("digicardo_profile_updated", handleProfileUpdate);
    return () => window.removeEventListener("digicardo_profile_updated", handleProfileUpdate);
  }, [fetchProfile, pathname]);

  const username = mounted ? (profile?.username || null) : null;
  const displayName = mounted ? (profile?.display_name || user?.name || null) : null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/login");
    } catch {
      setIsLoggingOut(false);
    }
  };

  const isItemActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const mainNav: NavItem[] = [
    { title: "My Smart Profile", href: "/dashboard/page", icon: Layers },
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { title: "Appearance", href: "/dashboard/appearance", icon: Palette },
  ];

  const toolsNav: NavItem[] = [
    { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3, badge: "Live" },
    { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ];

  return (
    <aside
      suppressHydrationWarning
      className={cn(
        "hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#FAFAFA] border-r border-[#EFEFEF] z-30 select-none overflow-visible transition-all duration-300",
        className
      )}
    >
      {/* ── Top Row: Profile Trigger Pill + Notification Bell (Linktree Style) ── */}
      <div className="pt-4 pb-2 px-3.5 flex items-center justify-between gap-2 flex-shrink-0 relative">
        {/* Profile Dropdown Trigger */}
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full hover:bg-slate-200/60 transition-colors w-full text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300/80 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden">
              {displayName ? displayName.charAt(0).toUpperCase() : "•"}
            </div>
            <span className="text-xs font-semibold text-slate-900 truncate flex-1 leading-none" suppressHydrationWarning>
              {username ? `@${username}` : displayName || "Account"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0 transition-transform duration-200" />
          </button>

          {/* User Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900 truncate">{displayName || "Digicardo Creator"}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || ""}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/settings"
                  prefetch={false}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    prefetch={false}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Admin Console</span>
                  </Link>
                )}
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-red-600 hover:bg-red-50 w-full text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="flex-shrink-0">
          <NotificationBell align="left" />
        </div>
      </div>

      {/* ── Navigation Links (Linktree Style: h-10, soft rounded pill active state) ── */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 no-scrollbar">
        {/* Main Section */}
        <div className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  "flex items-center gap-3 px-3.5 h-10 rounded-xl text-sm font-medium transition-all select-none",
                  active
                    ? "bg-[#EBEBEB] text-black font-semibold shadow-2xs"
                    : "text-slate-700 hover:text-black hover:bg-slate-200/50"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] flex-shrink-0 stroke-[2]", active ? "text-black" : "text-slate-500")} />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Tools Section */}
        <div>
          <div className="px-3.5 pb-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Tools
            </span>
          </div>

          <div className="space-y-1">
            {toolsNav.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "flex items-center justify-between px-3.5 h-10 rounded-xl text-sm font-medium transition-all select-none",
                    active
                      ? "bg-[#EBEBEB] text-black font-semibold shadow-2xs"
                      : "text-slate-700 hover:text-black hover:bg-slate-200/50"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={cn("w-[18px] h-[18px] flex-shrink-0 stroke-[2]", active ? "text-black" : "text-slate-500")} />
                    <span className="truncate">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Linktree Setup Checklist Card (Floating at Bottom) ── */}
      <SetupChecklistCard profile={profile} />

      {/* ── Footer: Settings Link (Linktree Style) ── */}
      <div className="px-3.5 py-2.5 border-t border-[#EFEFEF] flex-shrink-0">
        <Link
          href="/dashboard/settings"
          prefetch={false}
          className={cn(
            "flex items-center gap-3 px-3 h-9 rounded-xl text-xs font-medium text-slate-600 hover:text-black hover:bg-slate-200/50 transition-colors",
            pathname === "/dashboard/settings" && "bg-[#EBEBEB] text-black font-semibold"
          )}
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
