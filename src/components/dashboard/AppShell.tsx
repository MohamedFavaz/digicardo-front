"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { authApi } from "@/lib/api/auth";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

export interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  const { user } = useAuth();
  const [isExiting, setIsExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isImpersonating = mounted && (
    Boolean(user?.is_impersonated) ||
    (typeof window !== "undefined" && localStorage.getItem("digicardo_impersonating") === "true") ||
    (typeof document !== "undefined" && document.cookie.includes("digicardo_impersonating=true"))
  );

  const handleStopImpersonation = async () => {
    setIsExiting(true);
    try {
      const res = await authApi.stopImpersonation();
      if (typeof window !== "undefined") {
        localStorage.removeItem("digicardo_impersonating");
        document.cookie = "digicardo_impersonating=; path=/; max-age=0;";
      }
      window.location.href = res?.redirect_url || "/admin/my-links";
    } catch (err) {
      console.error("Failed to stop impersonation:", err);
      if (typeof window !== "undefined") {
        localStorage.removeItem("digicardo_impersonating");
        document.cookie = "digicardo_impersonating=; path=/; max-age=0;";
      }
      window.location.href = "/admin/my-links";
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row antialiased select-auto" suppressHydrationWarning>
      {/* ── 1. Desktop Left Sidebar (Fixed on Viewport Left) ── */}
      <Sidebar />

      {/* ── 2. Main Content Canvas & Top Bar ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-clip min-h-screen" suppressHydrationWarning>
        {/* ── Sticky Top Header Region ── */}
        <div className="sticky top-0 z-30 flex flex-col w-full bg-background/80 backdrop-blur-xl">
          {/* Impersonation Security Alert Banner (UI/UX Pro Max - Brand Violet) */}
          {isImpersonating && (
            <div
              className="w-full bg-card/95 dark:bg-card/90 backdrop-blur-xl border-b border-brand-500/20 dark:border-brand-500/25 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 shadow-2xs select-none transition-all"
              suppressHydrationWarning
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 text-[11px] font-bold text-brand-600 dark:text-brand-300 flex-shrink-0 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600" />
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  <span className="uppercase font-black tracking-wider text-[10px]">Admin Mode</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                  <span className="hidden sm:inline">Managing studio:</span>
                  <span className="font-bold text-foreground truncate">{user?.name || "User"}</span>
                  {user?.email && (
                    <span className="text-muted-foreground/60 text-[11px] font-mono hidden md:inline truncate">
                      ({user.email})
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStopImpersonation}
                disabled={isExiting}
                title="Return to Admin Console"
                className="group inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 min-h-[34px] sm:min-h-[36px] rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 shadow-xs hover:shadow-[0_4px_16px_rgba(91,63,228,0.3)] transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 flex-shrink-0 select-none"
              >
                {isExiting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" aria-hidden="true" />
                    <span>Returning...</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
                    <span>Back to Admin</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Desktop / Tablet Top Bar */}
          <TopBar className="hidden md:flex" />

          {/* Mobile Top Header */}
          <MobileNav />
        </div>

        {/* Dynamic Route View Content Container */}
        <main
          className={cn(
            "flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl w-full mx-auto pb-32 sm:pb-28 md:pb-12",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
