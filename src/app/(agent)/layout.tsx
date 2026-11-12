"use client";
import { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  CreditCard,
  PlusCircle,
  Wallet,
  Gauge,
  BarChart3,
  User,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "GENERAL",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/agent/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "CARDS",
    items: [
      { id: "cards", label: "All Cards", href: "/agent/cards", icon: CreditCard },
      { id: "create-card", label: "Create Card", href: "/agent/cards/create", icon: PlusCircle },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { id: "earnings", label: "My Earnings", href: "/agent/earnings", icon: Wallet },
      { id: "limits", label: "Card Limits", href: "/agent/limits", icon: Gauge },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { id: "profile", label: "My Profile", href: "/agent/profile", icon: User },
    ],
  },
];

export default function AgentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [agentName, setAgentName] = useState("Agent");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentAvatar, setAgentAvatar] = useState<string | null>(null);
  const [quota, setQuota] = useState({ used: 0, limit: 0 });
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch("/api/bff/v1/agent/auth/me", { credentials: "include" })
      .then(async (r) => {
        if (!mounted) return;

        if (r.status === 401) {
          router.replace("/agent-login");
          return;
        }

        if (r.status === 403) {
          // If 403, verify if impersonating before ejecting
          const isImpersonatingLocal =
            typeof window !== "undefined" &&
            localStorage.getItem("digicardo_impersonating") === "true";
          if (!isImpersonatingLocal) {
            router.replace("/agent-login");
            return;
          }
        }

        if (!r.ok) {
          // Server error (500, 502, etc.) — do NOT treat as unauthenticated
          console.warn("AgentLayout: /agent/auth/me returned non-OK status", r.status);
          setAuthChecked(true);
          return;
        }

        const json = await r.json();
        const data = json?.data;
        const user = data?.user || data;
        const isAgent = user?.role === "agent" || data?.user?.role === "agent";
        const isAdmin = user?.role === "admin" || data?.is_admin === true;
        const isImpersonating = data?.is_impersonating === true;

        if (!user || (!isAgent && !isAdmin && !isImpersonating)) {
          router.replace("/agent-login");
        } else {
          setAgentName(user?.name || "Agent");
          setAgentEmail(user?.email || "");
          setAgentAvatar(user?.avatar_url || null);
          const agentQuota = data?.quota || user?.agent_quota;
          if (agentQuota) {
            setQuota({
              used: agentQuota.cards_used || 0,
              limit: agentQuota.card_limit || 0,
            });
          }
          setAuthChecked(true);
        }
      })
      .catch((err) => {
        // Do not eject user on transient network glitches or dev reloads
        console.warn("AgentLayout: session verification transient error:", err);
        if (mounted) {
          setAuthChecked(true);
        }
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleProfileUpdated(event: CustomEvent<{ user?: { name?: string; email?: string; avatar_url?: string | null } }>) {
      if (event.detail?.user) {
        if (event.detail.user.name) setAgentName(event.detail.user.name);
        if (event.detail.user.email) setAgentEmail(event.detail.user.email);
        if ("avatar_url" in event.detail.user) setAgentAvatar(event.detail.user.avatar_url || null);
      }
    }
    window.addEventListener("agent-profile-updated", handleProfileUpdated as EventListener);
    return () => {
      window.removeEventListener("agent-profile-updated", handleProfileUpdated as EventListener);
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/bff/v1/agent/auth/logout", { method: "POST", credentials: "include" });
    router.push("/agent-login");
  }

  const initials = agentName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const quotaPct = quota.limit > 0 ? Math.round((quota.used / quota.limit) * 100) : 0;

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F5F2EE] flex items-center justify-center" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#D5EBE4] border-t-[#0F766E] animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EE] text-slate-900 flex antialiased" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-72 flex flex-col transition-transform duration-300 ease-out bg-[#F5F2EE]
        ${mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3.5 px-6 pt-5 pb-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E3DFD9] p-2 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Image src="/logo.png" alt="Digicardo" width={26} height={26} className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 tracking-tight leading-none">Digicardo</p>
            <p className="text-xs text-[#0F766E] font-bold tracking-wider uppercase mt-1">Agent Panel</p>
          </div>
        </div>

        {/* Quota gauge */}
        <div className="px-4 pt-3 pb-2">
          <div className="p-3.5 rounded-2xl bg-white border border-[#E3DFD9] shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Card Credits</span>
              <span className="font-bold text-[#0F766E]">{quota.used} / {quota.limit}</span>
            </div>
            <div className="w-full h-2 bg-[#EAE6E1] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${quotaPct >= 90 ? "bg-red-500" : quotaPct >= 70 ? "bg-amber-500" : "bg-[#0F766E]"}`}
                style={{ width: `${Math.min(quotaPct, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-2">{Math.max(0, quota.limit - quota.used)} remaining</p>
          </div>
        </div>

        {/* Nav with JunoMind grouped sections & pills */}
        <nav className="flex-1 px-4 py-2 space-y-4 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <div className="px-3 pb-1.5">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                  {group.label}
                </span>
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/agent/dashboard" && pathname.startsWith(item.href) && item.id !== "cards");

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-4 h-11 rounded-xl text-[15px] font-medium transition-colors group relative
                      ${active
                        ? "bg-[#D5EBE4] text-[#0F766E] font-semibold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-[#EAE6E1]/70"
                      }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 stroke-[2] transition-colors ${active ? "text-[#0F766E]" : "text-slate-400 group-hover:text-slate-600"}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom: agent info + logout matching JunoMind style */}
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E3DFD9] shadow-2xs">
            {agentAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agentAvatar}
                alt={agentName}
                className="w-10 h-10 rounded-full object-cover border border-[#BCE0D4] flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#D5EBE4] border border-[#BCE0D4] flex items-center justify-center text-[#0F766E] text-sm font-bold flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate leading-none">{agentName}</p>
              <p className="text-xs text-slate-400 truncate mt-1">{agentEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#F5F2EE] border-b border-[#E3DFD9] z-30 flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200/60">
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-white border border-[#E3DFD9] p-0.5 flex items-center justify-center">
            <Image src="/logo.png" alt="Digicardo" width={20} height={20} className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-bold text-slate-900">Agent Panel</span>
        </div>
        <Link href="/agent/profile" className="flex items-center">
          {agentAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agentAvatar} alt={agentName} className="w-8 h-8 rounded-full object-cover border border-[#BCE0D4]" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#D5EBE4] border border-[#BCE0D4] flex items-center justify-center text-[#0F766E] text-xs font-bold">
              {initials}
            </div>
          )}
        </Link>
      </div>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto lg:pl-72 pt-14 lg:pt-0 pb-24 lg:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 max-w-md sm:mx-auto z-40 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-1.5 flex items-center justify-around select-none lg:hidden pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]">
        {[
          { href: "/agent/dashboard", icon: LayoutDashboard, label: "Home" },
          { href: "/agent/cards", icon: CreditCard, label: "Cards" },
          { href: "/agent/cards/create", icon: PlusCircle, label: "Create" },
          { href: "/agent/earnings", icon: Wallet, label: "Earnings" },
        ].map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/agent/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${active ? "text-emerald-600 font-extrabold" : "text-slate-500 font-medium"}`}>
              <div className={`p-1.5 rounded-2xl ${active ? "bg-emerald-50 text-emerald-600" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={() => setMobileOpen(true)} className="flex flex-col items-center justify-center flex-1 py-1 text-center text-slate-500 font-medium">
          <div className="p-1.5 rounded-2xl"><Menu className="w-5 h-5" /></div>
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>
      </nav>
    </div>
  );
}

