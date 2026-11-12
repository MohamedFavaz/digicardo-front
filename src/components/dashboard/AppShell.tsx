"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileTopHeader, MobileBottomNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { authApi } from "@/lib/api/auth";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

export interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  const router = useRouter();
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

  // If an agent account visits the user studio directly without impersonating, redirect to Agent Portal
  React.useEffect(() => {
    if (mounted && user?.role === "agent" && !isImpersonating) {
      router.replace("/agent/dashboard");
    }
  }, [mounted, user, isImpersonating, router]);

  const impersonatorRole =
    user?.impersonator_role ||
    (typeof window !== "undefined" ? localStorage.getItem("digicardo_impersonator_role") : null);
  const isAgentMode = impersonatorRole === "agent";

  const handleStopImpersonation = async () => {
    setIsExiting(true);
    try {
      const res = await authApi.stopImpersonation();
      if (typeof window !== "undefined") {
        localStorage.removeItem("digicardo_impersonating");
        localStorage.removeItem("digicardo_impersonator_role");
        document.cookie = "digicardo_impersonating=; path=/; max-age=0;";
      }
      window.location.href = res?.redirect_url || (isAgentMode ? "/agent/cards" : "/admin/my-links");
    } catch (err) {
      console.error("Failed to stop impersonation:", err);
      if (typeof window !== "undefined") {
        localStorage.removeItem("digicardo_impersonating");
        localStorage.removeItem("digicardo_impersonator_role");
        document.cookie = "digicardo_impersonating=; path=/; max-age=0;";
      }
      window.location.href = isAgentMode ? "/agent/cards" : "/admin/my-links";
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
          {/* Impersonation Security Alert Banner (Admin Violet or Agent Emerald) */}
          {isImpersonating && (
            <div
              className={`w-full backdrop-blur-xl border-b px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 shadow-2xs select-none transition-all ${isAgentMode
                  ? "bg-emerald-950/95 text-white border-emerald-500/30"
                  : "bg-white/95 text-slate-800 border-slate-200/80 shadow-2xs"
                }`}
              suppressHydrationWarning
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full border text-[11px] font-bold flex-shrink-0 shadow-2xs ${isAgentMode
                      ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                      : "bg-slate-100 border-slate-200 text-slate-800"
                    }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAgentMode ? "bg-emerald-400" : "bg-slate-900"
                        }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${isAgentMode ? "bg-emerald-500" : "bg-slate-900"
                        }`}
                    />
                  </span>
                  <ShieldCheck
                    className={`w-3.5 h-3.5 ${isAgentMode ? "text-emerald-400" : "text-slate-800"}`}
                    aria-hidden="true"
                  />
                  <span className="uppercase font-black tracking-wider text-[10px]">
                    {isAgentMode ? "Agent Mode" : "Admin Mode"}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1.5 text-xs truncate ${isAgentMode ? "text-emerald-100/90" : "text-slate-600 font-medium"
                    }`}
                >
                  <span className="hidden sm:inline">
                    {isAgentMode ? "Customizing card for customer:" : "Managing studio:"}
                  </span>
                  <span className={`font-bold truncate ${isAgentMode ? "text-white" : "text-slate-900"}`}>
                    {user?.name || "Customer"}
                  </span>
                  {user?.email && (
                    <span
                      className={`text-[11px] font-mono hidden md:inline truncate ${isAgentMode ? "text-emerald-300/80" : "text-slate-400"
                        }`}
                    >
                      ({user.email})
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStopImpersonation}
                disabled={isExiting}
                title={isAgentMode ? "Return to Agent Panel" : "Return to Admin Console"}
                className={`group inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 flex-shrink-0 select-none ${isAgentMode
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50 hover:shadow-[0_4px_16px_rgba(16,185,129,0.4)]"
                    : "bg-slate-900 hover:bg-black text-white"
                  }`}
              >
                {isExiting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" aria-hidden="true" />
                    <span>Returning...</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
                    <span>{isAgentMode ? "Back to Agent Panel" : "Back to Admin"}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Desktop / Tablet Top Bar */}
          <TopBar className="hidden md:flex" />

          {/* Mobile Top Header (Branding & Quick Actions) */}
          <MobileTopHeader />
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

      {/* ── 3. Mobile Floating Bottom Navigation Dock (Placed outside any overflow or backdrop-blur containers) ── */}
      <MobileBottomNav />
    </div>
  );
}
