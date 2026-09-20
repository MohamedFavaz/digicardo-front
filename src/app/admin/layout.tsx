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
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey?: "pendingRequests";
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
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
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // ← empty array: run only once on mount, not on every pathname change

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
      <div className="min-h-screen bg-slate-50/70 flex items-center justify-center" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex antialiased" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
        fixed top-0 left-0 h-full z-50 w-[240px] flex flex-col transition-transform duration-300 ease-out
        bg-white border-r border-slate-200/90 shadow-sm
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-[68px] border-b border-slate-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Image src="/logo.png" alt="Digicardo" width={28} height={28} className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 tracking-tight leading-none">Digicardo</p>
            <p className="text-[10px] text-indigo-600 font-extrabold tracking-[0.18em] uppercase mt-1">Admin Console</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto">
          <div className="px-2.5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation</span>
          </div>

          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            const badgeCount = item.badgeKey === "pendingRequests" ? pendingRequests : 0;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3.5 h-[40px] rounded-xl text-xs font-semibold transition-all duration-150 group relative
                  ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-300"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="truncate">{item.label}</span>

                {badgeCount > 0 && (
                  <span
                    className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
                      active ? "bg-white text-indigo-700" : "bg-amber-400 text-amber-950 animate-pulse"
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: admin info + logout */}
        <div className="flex-shrink-0 p-3.5 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-none">{adminName}</p>
              <p className="text-[10px] text-slate-400 truncate mt-1">{adminEmail || "admin@digicardo.app"}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out of Admin"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Top bar (mobile) ── */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-30 flex items-center px-4 gap-3 lg:hidden shadow-sm">
        <button onClick={() => setMobileOpen(true)} className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100">
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center">
          <Image src="/logo.png" alt="Digicardo" width={20} height={20} className="w-full h-full object-contain" />
        </div>
        <span className="text-sm font-bold text-slate-900">Digicardo Admin</span>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-h-screen overflow-auto lg:pl-[240px] pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
