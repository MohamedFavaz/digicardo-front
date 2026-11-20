"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { NestlySidebar } from "./NestlySidebar";
import { TopBar } from "./TopBar";
import { MobileTopHeader, MobileBottomNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { stopImpersonationAndLeave } from "@/lib/auth/switch-account";
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

  // Full-page navigation (see lib/auth/switch-account): the button stays in its "Returning…" state.
  const handleStopImpersonation = () => {
    setIsExiting(true);
    void stopImpersonationAndLeave();
  };

  return (
    // Nestly look: warm off-white canvas with a soft sage glow along the top.
    <div
      className="flex min-h-screen flex-col bg-[#F3F2EE] bg-[linear-gradient(180deg,#CBD5B1_0px,#D9E0C6_140px,#EAEBE0_300px,#F3F2EE_460px)] bg-no-repeat text-foreground antialiased md:flex-row"
      suppressHydrationWarning
    >
      <NestlySidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col" suppressHydrationWarning>
        <div className="sticky top-0 z-30 flex w-full flex-col md:static">
          {/* Shown while an admin or agent is editing a customer's card */}
          {isImpersonating && (
            <div
              className="flex w-full items-center justify-between gap-3 bg-foreground px-4 py-2 text-white sm:px-6 lg:px-8"
              role="status"
              suppressHydrationWarning
            >
              <div className="flex min-w-0 items-center gap-2.5 text-sm">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#C4B5FD]" aria-hidden="true" />
                <span className="shrink-0 font-semibold">{isAgentMode ? "Agent mode" : "Admin mode"}</span>
                <span className="hidden text-white/70 sm:inline">·</span>
                <span className="truncate text-white/80">
                  {isAgentMode ? "Editing the card for " : "Managing "}
                  <span className="font-semibold text-white">{user?.name || "this customer"}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleStopImpersonation}
                disabled={isExiting}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/90 disabled:opacity-60"
              >
                {isExiting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                )}
                {isExiting ? "Returning…" : isAgentMode ? "Back to agent panel" : "Back to admin"}
              </button>
            </div>
          )}

          <TopBar className="hidden md:flex" />
          <MobileTopHeader />
        </div>

        <main
          className={cn(
            "mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-5 sm:px-6 md:pb-12 md:pt-6 lg:px-8 lg:pt-8",
            className
          )}
        >
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
