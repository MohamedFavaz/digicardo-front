"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  Link2, 
  ExternalLink, 
  Search, 
  Trash2, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  CreditCard,
  AtSign,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  LogIn,
  KeyRound,
  Loader2,
  ArrowRight,
  MoreVertical,
} from "lucide-react";
import { DeleteUserModal, DeleteUserTarget } from "@/components/admin/DeleteUserModal";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  status: string;
  role: string;
  expires_at?: string;
  validity_label?: string;
  plan_price_paid?: number;
  created_at: string;
  plan_price_currency?: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const FILTERS = [
  { key: "all", label: "All Profiles" },
  { key: "active", label: "Active Links" },
  { key: "suspended", label: "Suspended" },
  { key: "expiring", label: "Expiring Soon" },
  { key: "expired", label: "Expired" },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function MyLinksPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<DeleteUserTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".row-action-menu")) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenuId]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ per_page: "20", page: String(page) });
      if (filter !== "all") params.set("filter", filter);
      if (search.trim()) params.set("search", search.trim());
      const r = await fetch(`/api/bff/v1/admin/users?${params}`, { credentials: "include" });
      const j = await r.json();
      const items = (j?.data?.items || []).map((u: Record<string, unknown>) => ({
        ...u,
        username: (u.profile as Record<string, unknown>)?.username,
      }));
      setUsers(items);
      setPagination(j?.data?.pagination || null);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function toggleSuspend(user: User) {
    const isActive = user.status === "active";
    setToggling(user.id);
    try {
      const res = await fetch(`/api/bff/v1/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: isActive ? "suspended" : "active" }),
      });
      if (res.ok) {
        const nextStatus = isActive ? "suspended" : "active";
        setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: nextStatus } : u)));
        setActionFeedback(
          nextStatus === "suspended"
            ? `User "${user.name}" and public profile link /${user.username || ""} have been suspended on the web.`
            : `User "${user.name}" and public profile link /${user.username || ""} have been reactivated on the web.`
        );
        setTimeout(() => setActionFeedback(null), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/bff/v1/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        setDeleteError(json?.error?.message || "Failed to permanently delete user.");
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      setActionFeedback(
        `User ${deleteTarget.name} (${deleteTarget.email}) and profile link have been permanently deleted from database and web.`
      );
      setTimeout(() => setActionFeedback(null), 5000);
      setDeleteTarget(null);
    } catch {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleImpersonate(user: User) {
    if (impersonatingId) return;
    setImpersonatingId(user.id);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("digicardo_impersonating", "true");
        document.cookie = "digicardo_impersonating=true; path=/; max-age=86400; SameSite=Lax";
      }
      const res = await fetch(`/api/bff/v1/admin/users/${user.id}/impersonate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("digicardo_impersonating");
          document.cookie = "digicardo_impersonating=; path=/; max-age=0;";
        }
        setActionFeedback(json?.error?.message || "Failed to log in as user.");
        setTimeout(() => setActionFeedback(null), 5000);
        return;
      }
      setActionFeedback(`Authenticated securely as "${user.name}". Redirecting to Studio...`);
      // Hard redirect to clear previous auth state and hydrate as the user
      window.location.href = json?.data?.redirect_url || "/dashboard";
    } catch (err) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("digicardo_impersonating");
        document.cookie = "digicardo_impersonating=; path=/; max-age=0;";
      }
      console.error("Impersonation error:", err);
      setActionFeedback("An unexpected error occurred during direct login.");
      setTimeout(() => setActionFeedback(null), 5000);
    } finally {
      setImpersonatingId(null);
    }
  }

  return (
    <div suppressHydrationWarning className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Public Links & Profiles Directory</h1>
            {pagination && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {pagination.total} Registered Profiles
              </span>
            )}
          </div>
          <p className="text-indigo-200 text-xs mt-1.5 max-w-xl leading-relaxed">
            Monitor and manage public profile links across the platform. Instantly suspend unauthorized profiles, inspect subscription validity windows, and manage account statuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/admin-panel"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-900 text-xs font-bold shadow hover:bg-indigo-50 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </Link>
        </div>
      </div>

      {/* Action feedback */}
      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, or handle…"
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">User Account</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public Profile Link</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan & Expiration</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan Fee</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-5 bg-slate-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                    <Link2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No profile links found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try choosing another filter or search keyword.</p>
                  </td>
                </tr>
              ) : (
                users.map((u, index) => {
                  const expired = u.expires_at ? new Date(u.expires_at) < new Date() : false;
                  const expiringIn = u.expires_at && !expired ? daysUntil(u.expires_at) : null;
                  const expiringSoon = expiringIn !== null && expiringIn <= 7;
                  const isSuspended = u.status === "suspended";
                  const initial = u.name.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        expired ? "bg-red-50/20" : expiringSoon ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* User Account */}
                      <td className="px-5 py-3.5 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{u.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Public Profile Link */}
                      <td className="px-5 py-3.5">
                        {u.username ? (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={`/${u.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 font-mono font-bold text-xs transition-colors ${
                                  isSuspended
                                    ? "text-slate-400 line-through hover:text-slate-600"
                                    : "text-indigo-600 hover:text-indigo-800"
                                }`}
                              >
                                <span>digicardo.app/{u.username}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              {isSuspended && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  Link Suspended
                                </span>
                              )}
                            </div>

                            {/* Direct Studio Login Shortcut */}
                            <button
                              type="button"
                              onClick={() => handleImpersonate(u)}
                              disabled={impersonatingId === u.id || deleting}
                              title="Direct login to this user's studio without credentials"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-900 w-fit transition-colors group cursor-pointer"
                            >
                              {impersonatingId === u.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                                  <span className="text-indigo-500">Entering studio...</span>
                                </>
                              ) : (
                                <>
                                  <KeyRound className="w-3 h-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                                  <span>Direct Studio Login</span>
                                  <ArrowRight className="w-2.5 h-2.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-400 italic text-xs">No handle set</span>
                            <button
                              type="button"
                              onClick={() => handleImpersonate(u)}
                              disabled={impersonatingId === u.id || deleting}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-900 w-fit cursor-pointer"
                            >
                              {impersonatingId === u.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <LogIn className="w-3 h-3" />
                              )}
                              <span>Login as User</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Plan & Expiration */}
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-800">{u.validity_label || "Standard"}</p>
                        {u.expires_at ? (
                          expired ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 mt-1 inline-block">
                              Expired
                            </span>
                          ) : expiringIn !== null && expiringIn <= 30 ? (
                            <span
                              className={`text-[10px] font-bold mt-0.5 block ${
                                expiringSoon ? "text-amber-600" : "text-slate-500"
                              }`}
                            >
                              {expiringIn} day{expiringIn === 1 ? "" : "s"} left
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                              {formatDate(u.expires_at)}
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] text-slate-400">No expiration</span>
                        )}
                      </td>

                      {/* Price Paid */}
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-800">
                          {u.plan_price_paid != null
                            ? `${u.plan_price_currency || "₹"}${Number(u.plan_price_paid).toFixed(0)}`
                            : "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            isSuspended
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? "bg-amber-500" : "bg-emerald-500"}`} />
                          <span>{isSuspended ? "SUSPENDED" : "ACTIVE"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2 row-action-menu relative">
                          {/* Direct Login as User (Primary Quick Action) */}
                          <button
                            onClick={() => handleImpersonate(u)}
                            disabled={impersonatingId === u.id || deleting || toggling === u.id}
                            title="Direct Login to User Studio without credentials"
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 disabled:opacity-50 flex items-center gap-1.5 shadow-2xs cursor-pointer group active:scale-95"
                          >
                            {impersonatingId === u.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Entering...</span>
                              </>
                            ) : (
                              <>
                                <LogIn className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white transition-colors" />
                                <span>Login as User</span>
                              </>
                            )}
                          </button>

                          {/* 3-Dot More Actions Menu (Suspend & Delete) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === u.id ? null : u.id);
                              }}
                              title="More profile actions"
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${
                                openMenuId === u.id
                                  ? "bg-slate-100 text-slate-900 border-slate-300 shadow-2xs"
                                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200/80"
                              }`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openMenuId === u.id && (
                              <div
                                className={`absolute right-0 z-50 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 text-left text-xs select-none transition-all ${
                                  index >= users.length - 2 ? "bottom-full mb-1.5" : "top-full mt-1.5"
                                }`}
                              >
                                {/* Suspend / Reactivate Profile Link */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    toggleSuspend(u);
                                  }}
                                  disabled={toggling === u.id || deleting || impersonatingId === u.id}
                                  className={`w-full px-3.5 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer font-semibold ${
                                    isSuspended
                                      ? "text-emerald-700 hover:bg-emerald-50"
                                      : "text-amber-700 hover:bg-amber-50"
                                  }`}
                                >
                                  {isSuspended ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                      <span>Reactivate Profile Link</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                      <span>Suspend Profile Link</span>
                                    </>
                                  )}
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                {/* Delete User & Link */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setDeleteError(null);
                                    setDeleteTarget({
                                      id: u.id,
                                      name: u.name,
                                      email: u.email,
                                      username: u.username,
                                    });
                                  }}
                                  disabled={toggling === u.id || deleting || impersonatingId === u.id}
                                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-semibold"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                                  <span>Delete Link & User</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold">{users.length}</span> of <span className="font-bold">{pagination.total}</span> profiles
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Prev</span>
              </button>
              <span className="px-3 py-1.5 text-xs text-slate-700 font-bold">
                Page {page} of {pagination.last_page}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={page === pagination.last_page || loading}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete User Modal */}
      <DeleteUserModal
        user={deleteTarget}
        isOpen={Boolean(deleteTarget)}
        isDeleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
