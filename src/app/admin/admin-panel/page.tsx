"use client";
import { useEffect, useState, useCallback, FormEvent } from "react";
import Link from "next/link";
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Search,
  Calendar,
  AtSign,
  Mail,
  User as UserIcon,
  Clock,
  Sparkles,
  Inbox,
} from "lucide-react";
import { DeleteUserModal, DeleteUserTarget } from "@/components/admin/DeleteUserModal";

interface Plan {
  id: string;
  name: string;
  months: number;
  price: number;
  currency_symbol: string;
  formatted_price: string;
  is_active: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  status: string;
  expires_at?: string;
  validity_label?: string;
  created_at: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      title={`Copy ${label || text}`}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${copied
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-muted/50 text-[#52525B] border-border hover:text-foreground hover:bg-zinc-100"
        }`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export default function AdminPanelPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [credentials, setCredentials] = useState<{ email?: string; username: string; plain_password: string } | null>(null);

  const [form, setForm] = useState({ name: "", email: "", username: "", validity_plan_id: "" });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<DeleteUserTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [plansRes, usersRes] = await Promise.all([
        fetch("/api/bff/v1/admin/validity-plans", { credentials: "include" }),
        fetch("/api/bff/v1/admin/users?per_page=50&sort_by=created_at&sort_dir=desc", { credentials: "include" }),
      ]);
      const [pj, uj] = await Promise.all([plansRes.json(), usersRes.json()]);
      setPlans(pj?.data?.plans?.filter((p: Plan) => p.is_active) || []);
      setUsers(
        (uj?.data?.items || []).map((u: Record<string, unknown>) => ({
          ...u,
          username: (u.profile as Record<string, unknown>)?.username,
        }))
      );
    } catch (err) {
      console.error("Failed to load admin panel data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Read URL search params to prefill from Access Requests
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const name = sp.get("name");
      const email = sp.get("email");
      const username = sp.get("username");
      if (name || email || username) {
        setForm(prev => ({
          ...prev,
          name: name || prev.name,
          email: email || prev.email,
          username: username || prev.username,
        }));
        setActionFeedback("Customer details prefilled from access request!");
        setTimeout(() => setActionFeedback(null), 6000);
      }
    }
  }, []);

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
        if (res.status === 404) {
          // User was already deleted from the system
          setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
          setActionFeedback(`User ${deleteTarget.name} has already been deleted.`);
          setTimeout(() => setActionFeedback(null), 5000);
          setDeleteTarget(null);
          return;
        }
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

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError("");
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email address is required";
    if (!form.username.trim()) errs.username = "Username handle is required";
    if (form.username.trim().length < 3) errs.username = "Username must be at least 3 characters";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setCreating(true);
    try {
      const body: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        role: "user",
        status: "active",
      };
      if (form.validity_plan_id) body.validity_plan_id = form.validity_plan_id;

      const res = await fetch("/api/bff/v1/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!res.ok) {
        const errMsg = json?.error?.message || "Failed to create user account.";
        const details = json?.error?.details;
        if (details && typeof details === "object") {
          const fieldErrs: Record<string, string> = {};
          Object.entries(details).forEach(([k, v]) => {
            fieldErrs[k] = Array.isArray(v) ? v[0] : String(v);
          });
          setErrors(fieldErrs);
        } else {
          setServerError(errMsg);
        }
        return;
      }

      setCredentials(json?.data?.credentials);
      setForm({ name: "", email: "", username: "", validity_plan_id: "" });
      setActionFeedback("User provisioned successfully! Credentials generated below.");
      fetchData();
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  const selectedPlan = plans.find(p => p.id === form.validity_plan_id);

  const filteredUsers = users.filter(u => {
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.username && u.username.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const activeCount = users.filter(u => u.status === "active").length;
  const suspendedCount = users.filter(u => u.status === "suspended").length;

  return (
    <div suppressHydrationWarning className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Users</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-[#52525B] border border-border">
              {users.length} Users
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed font-medium">
            Provision user accounts, assign validity plans, and manage access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/access-requests"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Access requests</span>
          </Link>
        </div>
      </div>

      {/* Action feedback banner */}
      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-600 hover:text-emerald-900 font-semibold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Create Form on Left, User Management Table on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Create User Form + Generated Credentials (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Credentials Display Card (Customer) */}
          {credentials && (
            <div className="bg-gradient-to-br from-emerald-900 to-zinc-900 border border-emerald-500/30 rounded-2xl p-5 text-white shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Customer Credentials Ready</span>
                </div>
                <button
                  onClick={() => setCredentials(null)}
                  className="text-muted-foreground hover:text-white text-xs font-semibold"
                >
                  ✕ Dismiss
                </button>
              </div>

              <p className="text-xs text-zinc-300">
                Copy and share these customer credentials. The password will not be displayed again.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700">
                  <div className="min-w-0">
                    <span className="text-xs capitalize font-semibold text-muted-foreground block">Username</span>
                    <span className="font-mono text-emerald-300 font-semibold truncate block">{credentials.username}</span>
                  </div>
                  <CopyButton text={credentials.username} label="username" />
                </div>

                {credentials.email && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700">
                    <div className="min-w-0">
                      <span className="text-xs capitalize font-semibold text-muted-foreground block">Email</span>
                      <span className="font-mono text-emerald-300 font-semibold truncate block">{credentials.email}</span>
                    </div>
                    <CopyButton text={credentials.email} label="email" />
                  </div>
                )}

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700">
                  <div className="min-w-0">
                    <span className="text-xs capitalize font-semibold text-muted-foreground block">Password</span>
                    <span className="font-mono text-amber-300 font-semibold truncate block">
                      {credentials.plain_password}
                    </span>
                  </div>
                  <CopyButton text={credentials.plain_password} label="password" />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const allText = `Digicardo Login Details:\nUsername: ${credentials.username}\nEmail: ${credentials.email || ""
                      }\nPassword: ${credentials.plain_password}\nLogin URL: ${window.location.origin}/login`;
                    navigator.clipboard.writeText(allText);
                    setActionFeedback("All login details copied to clipboard!");
                    setTimeout(() => setActionFeedback(null), 3000);
                  }}
                  className="w-full h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Details</span>
                </button>
              </div>
            </div>
          )}


          {/* Account Creation Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 text-[#52525B] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    New Customer Card
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Account credentials & validity tier
                  </p>
                </div>
              </div>

            </div>


            {(
              <form onSubmit={handleCreate} className="p-5 space-y-4">
                {serverError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#52525B] capitalize flex items-center gap-1">
                    <UserIcon className="w-3 h-3 text-muted-foreground" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Sarah Connor"
                    className={`w-full h-9 px-3 rounded-xl border text-xs text-[#52525B] placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-all ${errors.name ? "border-red-400 bg-red-50/20" : "border-border"
                      }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#52525B] capitalize flex items-center gap-1">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <span>Email *</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="sarah@example.com"
                    className={`w-full h-9 px-3 rounded-xl border text-xs text-[#52525B] placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-all ${errors.email ? "border-red-400 bg-red-50/20" : "border-border"
                      }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
                </div>

                {/* Username Handle */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#52525B] capitalize flex items-center gap-1">
                    <AtSign className="w-3 h-3 text-muted-foreground" />
                    <span>Handle / Username *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground font-semibold">
                      digicardo.app/
                    </span>
                    <input
                      value={form.username}
                      onChange={e =>
                        setForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, "") }))
                      }
                      placeholder="sarahc"
                      className={`w-full h-9 pl-28 pr-3 rounded-xl border text-xs font-mono text-[#52525B] placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-all ${errors.username ? "border-red-400 bg-red-50/20" : "border-border"
                        }`}
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-500 font-semibold">{errors.username}</p>}
                </div>

                {/* Validity Plan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#52525B] capitalize flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span>Validity Plan</span>
                  </label>
                  <select
                    value={form.validity_plan_id}
                    onChange={e => setForm(p => ({ ...p, validity_plan_id: e.target.value }))}
                    className="w-full h-9 px-3 rounded-xl border border-border text-xs text-[#52525B] bg-card focus:outline-none focus:border-zinc-400 transition-all"
                  >
                    <option value="">No Plan (No expiration)</option>
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.months} mo) — {p.currency_symbol || "₹"}
                        {p.price}
                      </option>
                    ))}
                  </select>

                  {selectedPlan && (
                    <div className="p-2.5 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
                      <span className="text-[#52525B] font-semibold">{selectedPlan.name}:</span>
                      <span className="font-semibold text-foreground">
                        {selectedPlan.months} months ({selectedPlan.currency_symbol || "₹"}
                        {selectedPlan.price})
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{creating ? "Creating…" : "Create Customer Account"}</span>
                  </button>
                </div>
              </form>

            )}
          </div>
        </div>

        {/* Right Column: User Management Table (7 cols) */}
        <div className="xl:col-span-7 bg-card border border-border rounded-2xl overflow-hidden">
          {/* Header & Filters */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${statusFilter === "all" ? "bg-primary text-white font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 font-medium"
                  }`}
              >
                All ({users.length})
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${statusFilter === "active" ? "bg-primary text-white font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 font-medium"
                  }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter("suspended")}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${statusFilter === "suspended" ? "bg-primary text-white font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 font-medium"
                  }`}
              >
                Suspended ({suspendedCount})
              </button>
            </div>

            <div className="relative sm:w-60">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users or handles…"
                className="w-full h-8 pl-8 pr-3 rounded-full border border-border text-xs placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground capitalize">User / Handle</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground capitalize">Validity Plan</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground capitalize">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground capitalize text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td colSpan={4} className="px-5 py-4">
                        <div className="h-5 bg-zinc-100 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                      No users found matching your filter or search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => {
                    const isSuspended = user.status === "suspended";
                    const initial = user.name.charAt(0).toUpperCase();

                    return (
                      <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                        {/* User / Handle */}
                        <td className="px-5 py-3.5 min-w-[180px]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 text-[#52525B] font-semibold flex items-center justify-center text-xs flex-shrink-0">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{user.name}</p>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                {user.username && (
                                  <a
                                    href={`/${user.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-xs font-mono font-semibold hover:underline inline-flex items-center gap-0.5 ${isSuspended ? "text-muted-foreground line-through" : "text-[#52525B]"
                                      }`}
                                  >
                                    <span>/{user.username}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Validity Plan */}
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-[#52525B] block">
                            {user.validity_label || "Standard"}
                          </span>
                          {user.expires_at ? (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(user.expires_at)}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">No expiration</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${isSuspended
                              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? "bg-amber-500" : "bg-emerald-500"}`} />
                            <span>{isSuspended ? "Suspended" : "Active"}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Suspend / Reactivate */}
                            <button
                              onClick={() => toggleSuspend(user)}
                              disabled={toggling === user.id || deleting}
                              title={isSuspended ? "Reactivate user & link on web" : "Suspend user & link on web"}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border border-border bg-card hover:bg-muted/50 text-[#52525B] disabled:opacity-50`}
                            >
                              {toggling === user.id ? "…" : isSuspended ? "Reactivate" : "Suspend"}
                            </button>

                            {/* Permanent Delete */}
                            <button
                              onClick={() => {
                                setDeleteError(null);
                                setDeleteTarget({
                                  id: user.id,
                                  name: user.name,
                                  email: user.email,
                                  username: user.username,
                                });
                              }}
                              disabled={toggling === user.id || deleting}
                              title="Permanently delete user & link from database"
                              className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
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
