"use client";
import { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Link2,
  Users,
  BarChart3,
  Inbox,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Wallet,
  UserCog,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey?: "pendingRequests";
  section?: string;
}

const NAV: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "my-links",
    label: "My Links",
    href: "/admin/my-links",
    icon: Link2,
  },
  {
    id: "admin-panel",
    label: "Admin Panel",
    href: "/admin/admin-panel",
    icon: Users,
  },
  {
    id: "plans",
    label: "Validity Plans",
    href: "/admin/plans",
    icon: Sparkles,
  },
  {
    id: "access-requests",
    label: "Access Requests",
    href: "/admin/access-requests",
    icon: Inbox,
    badgeKey: "pendingRequests",
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    id: "accounts",
    label: "Accounts",
    href: "/admin/accounts",
    icon: CreditCard,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const AGENT_NAV: NavItem[] = [
  {
    id: "agents",
    label: "All Agents",
    href: "/admin/agents",
    icon: UserCog,
    section: "agent",
  },
  {
    id: "agents-create",
    label: "Create Agent",
    href: "/admin/agents/create",
    icon: UserPlus,
    section: "agent",
  },
  {
    id: "agent-cards",
    label: "Agent Cards",
    href: "/admin/agent-cards",
    icon: CreditCard,
    section: "agent",
  },
  {
    id: "agent-finance",
    label: "Agent Finance",
    href: "/admin/agent-finance",
    icon: Wallet,
    section: "agent",
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [agentSectionOpen, setAgentSectionOpen] = useState(() => {
    // Auto-open if we're on an agent-related page
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      return p.startsWith("/admin/agents") || p.startsWith("/admin/agent-cards") || p.startsWith("/admin/agent-finance");
    }
    return false;
  });
  // Guard to prevent rendering children (and triggering a flash redirect) before
  // the initial auth check resolves. Only set to true once we have confirmed the
  // user is a valid admin — or once we have redirected away.
  const [authChecked, setAuthChecked] = useState(false);

  // Run the auth check exactly once on mount — NOT on every pathname change.
  // Re-running on pathname caused a race condition: navigating inside /admin
  // would restart the fetch before the previous one resolved, and the catch
  // block would fire router.replace("/login") on an in-flight request.
  useEffect(() => {
    fetch("/api/bff/v1/auth/me", { credentials: "include" })
      .then(async (r) => {
        // Only treat confirmed auth failures (401 / 403) as "not logged in".
        // A 502 / network error should NOT redirect — it may be a transient issue.
        if (r.status === 401 || r.status === 403) {
          router.replace("/login");
          return;
        }
        const json = await r.json();
        const userData = json?.data;
        if (!userData || userData?.role !== "admin") {
          router.replace("/login");
        } else {
          setAdminName(userData?.name || "Admin");
          setAdminEmail(userData?.email || "");
          setAuthChecked(true);
        }
      })
      .catch(() => {
        // Network-level error — redirect to login so the user isn't stuck on a
        // blank screen.  This is intentional: if Laravel is completely unreachable
        // we cannot verify the session.
        router.replace("/login");
      });

    // Check pending access requests for sidebar badge (best-effort, no redirect on failure)
    fetch("/api/bff/v1/admin/access-requests?status=pending&per_page=1", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const total = json?.data?.pagination?.total || 0;
        setPendingRequests(total);
      })
      .catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // ← empty array: run only once on mount, not on every pathname change

  // Auto-expand agent section when navigating to agent pages
  useEffect(() => {
    if (pathname.startsWith("/admin/agents") || pathname.startsWith("/admin/agent-cards") || pathname.startsWith("/admin/agent-finance")) {
      setAgentSectionOpen(true);
    }
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/bff/v1/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  }

  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Don't render the protected shell until we've confirmed the user is an admin.
  // This prevents a brief flash of the admin UI before the redirect fires.
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex antialiased" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar (JunoMind Clean SaaS Style) ── */}
      <aside
        className={`
        fixed top-0 left-0 h-full z-50 w-72 flex flex-col transition-transform duration-300 ease-out
        bg-white border-r border-slate-200/80
        ${mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Image src="/logo.png" alt="Digicardo" width={22} height={22} className="w-5 h-5 object-contain invert brightness-200" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 tracking-tight leading-none">Digicardo</span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-3 space-y-5 overflow-y-auto">
          <div>
            <div className="px-3 pb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Navigation</span>
            </div>

            <div className="space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                const badgeCount = item.badgeKey === "pendingRequests" ? pendingRequests : 0;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setMobileOpen(false)}
                    className={`
                    flex items-center gap-3.5 px-3.5 h-10 rounded-xl text-sm font-medium transition-colors group relative
                    ${active
                        ? "bg-slate-100 text-slate-900 font-semibold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }
                  `}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] flex-shrink-0 stroke-[1.8] transition-colors ${active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                    />
                    <span className="truncate">{item.label}</span>

                    {badgeCount > 0 && (
                      <span
                        className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold leading-none ${active ? "bg-slate-900 text-white" : "bg-amber-400 text-amber-950 animate-pulse"
                          }`}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Agent Management Section ── */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setAgentSectionOpen(!agentSectionOpen)}
              className="flex items-center gap-2 px-3 pb-2 w-full text-left group cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex-1">Agent Management</span>
              {agentSectionOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {agentSectionOpen && (
              <div className="space-y-1">
                {AGENT_NAV.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/agents" ? true : pathname === item.href);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      prefetch={false}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        flex items-center gap-3.5 px-3.5 h-10 rounded-xl text-sm font-medium transition-colors group relative
                        ${active
                          ? "bg-slate-100 text-slate-900 font-semibold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }
                      `}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] flex-shrink-0 stroke-[1.8] transition-colors ${active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                          }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Bottom: admin info + logout (JunoMind style) */}
        <div className="flex-shrink-0 p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate leading-none">{adminName}</p>
              <p className="text-xs text-slate-400 truncate mt-1">{adminEmail || "admin@digicardo.app"}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out of Admin"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Top bar (mobile) ── */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-30 flex items-center px-4 gap-3 lg:hidden">
        <button onClick={() => setMobileOpen(true)} className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
          <Image src="/logo.png" alt="Digicardo" width={16} height={16} className="w-4 h-4 object-contain invert brightness-200" />
        </div>
        <span className="text-sm font-bold text-slate-900">Digicardo Admin</span>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-h-screen overflow-auto lg:pl-72 pt-14 lg:pt-0 pb-24 lg:pb-0">
        {children}
      </main>

      {/* ── Admin Mobile Bottom Navigation Dock ── */}
      <nav className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 max-w-md sm:mx-auto z-40 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-1.5 flex items-center justify-around select-none lg:hidden pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]">
        <Link
          href="/admin/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${pathname === "/admin/dashboard" ? "text-slate-900 font-bold" : "text-slate-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl ${pathname === "/admin/dashboard" ? "bg-slate-100 text-slate-900" : ""}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Overview</span>
        </Link>

        <Link
          href="/admin/my-links"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${pathname.startsWith("/admin/my-links") ? "text-slate-900 font-bold" : "text-slate-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl ${pathname.startsWith("/admin/my-links") ? "bg-slate-100 text-slate-900" : ""}`}>
            <Link2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">My Links</span>
        </Link>

        <Link
          href="/admin/admin-panel"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${pathname.startsWith("/admin/admin-panel") ? "text-slate-900 font-bold" : "text-slate-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl ${pathname.startsWith("/admin/admin-panel") ? "bg-slate-100 text-slate-900" : ""}`}>
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Users</span>
        </Link>

        <Link
          href="/admin/analytics"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${pathname.startsWith("/admin/analytics") ? "text-slate-900 font-bold" : "text-slate-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl ${pathname.startsWith("/admin/analytics") ? "bg-slate-100 text-slate-900" : ""}`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Stats</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${mobileOpen || (!["/admin/dashboard", "/admin/my-links", "/admin/admin-panel", "/admin/analytics"].includes(pathname))
            ? "text-slate-900 font-bold"
            : "text-slate-500 font-medium"
            }`}
          aria-label="Open full admin menu"
        >
          <div className="p-1.5 rounded-xl">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>
      </nav>
    </div>
  );
}
