"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Building2,
  AtSign,
  MessageSquare,
  Check,
  X,
  Copy,
  Trash2,
  UserPlus,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";

interface AccessRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business_name?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  review_note?: string;
  created_at: string;
  reviewed_at?: string;
}

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

function formatDateTime(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${mins}`;
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
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-all ${copied
        ? "bg-emerald-100 text-emerald-700"
        : "bg-zinc-100 text-[#52525B] hover:bg-zinc-200 hover:text-[#52525B]"
        }`}
    >
      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function parseMessageAndHandle(rawMessage?: string) {
  if (!rawMessage) return { desiredHandle: null, messageText: null };
  const match = rawMessage.match(/^Desired Handle:\s*@?([a-zA-Z0-9_.-]+)\s*—\s*([\s\S]*)$/i);
  if (match) {
    return {
      desiredHandle: match[1].trim(),
      messageText: match[2].trim() || null,
    };
  }
  return { desiredHandle: null, messageText: rawMessage.trim() || null };
}

export default function AdminAccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ per_page: "50" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const r = await fetch(`/api/bff/v1/admin/access-requests?${params}`, { credentials: "include" });
      const j = await r.json();
      setRequests(j?.data?.items || []);
      setTotal(j?.data?.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to load access requests:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleReview(id: string, action: "approve" | "reject") {
    setReviewing(id);
    try {
      const note = reviewNote[id] || "";
      const res = await fetch(`/api/bff/v1/admin/access-requests/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, review_note: note }),
      });
      if (res.ok) {
        setRequests(prev =>
          prev.map(r =>
            r.id === id ? { ...r, status: action === "approve" ? "approved" : "rejected", review_note: note } : r
          )
        );
        setReviewNote(prev => {
          const n = { ...prev };
          delete n[id];
          return n;
        });
        showToast(action === "approve" ? "Request approved successfully!" : "Request rejected.");
      } else {
        const j = await res.json();
        alert(j?.message || "Failed to update review status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing review.");
    } finally {
      setReviewing(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Permanently delete the access request from "${name}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/bff/v1/admin/access-requests/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
        setTotal(prev => Math.max(0, prev - 1));
        showToast(`Request from "${name}" deleted.`);
      } else {
        alert("Failed to delete request.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting request.");
    } finally {
      setDeleting(null);
    }
  }

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div suppressHydrationWarning className="p-6 lg:p-8 max-w-[1300px] mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-white text-xs font-semibold rounded-xl shadow-2xl border border-zinc-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Access requests</h1>
            {pendingCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                {pendingCount} Pending
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-[#52525B] border border-border">
                All reviewed
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed font-medium">
            Review customer inquiries, approve handles, and provision accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cards/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create card</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${statusFilter === f.key
                ? "bg-primary text-white font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 font-medium"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, mobile, email, handle…"
              className="w-full h-9 pl-9 pr-4 rounded-full border border-border bg-card text-xs text-[#52525B] placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300 transition-all"
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {total} request{total === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 bg-zinc-200 rounded" />
                  <div className="h-3 w-72 bg-zinc-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-[#52525B]">
            No {statusFilter !== "all" ? statusFilter : ""} customer requests found
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            When visitors click &quot;Request Access&quot; on the website and submit their mobile number and details, their requests will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(req => {
            const { desiredHandle, messageText } = parseMessageAndHandle(req.message);
            const initial = req.name?.charAt(0).toUpperCase() || "U";
            const createdDate = formatDateTime(req.created_at);

            // Quick provisioning link to prefill the admin creation panel
            const provisionUrl = `/admin/cards/create?name=${encodeURIComponent(req.name)}&email=${encodeURIComponent(
              req.email
            )}&username=${encodeURIComponent(desiredHandle || req.name.toLowerCase().replace(/[^a-z0-9]/g, ""))}`;

            return (
              <div
                key={req.id}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6 transition-all hover:shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Customer Profile & Typed Data */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Header: Avatar, Name, Status, Date */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 text-[#52525B] font-semibold text-sm flex items-center justify-center flex-shrink-0 border border-border">
                        {initial}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base font-semibold text-foreground truncate">{req.name}</h2>

                          {/* Status Badge */}
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${req.status === "pending"
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : req.status === "approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-red-50 text-red-700 border border-red-200/60"
                              }`}
                          >
                            {req.status === "pending" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                            {req.status === "approved" && <Check className="w-3 h-3 text-emerald-600" />}
                            {req.status === "rejected" && <X className="w-3 h-3 text-red-500" />}
                            {req.status.toUpperCase()}
                          </span>

                          {/* Handle Badge if provided */}
                          {desiredHandle && (
                            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-[#52525B] border border-border text-xs font-mono font-semibold flex items-center gap-1">
                              <AtSign className="w-3 h-3 text-muted-foreground" />
                              {desiredHandle}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>Submitted on {createdDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Typed Attributes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 pt-1">
                      {/* Mobile Number - Highlighted */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold capitalize text-muted-foreground">Mobile Number</p>
                            {req.phone ? (
                              <a
                                href={`tel:${req.phone}`}
                                className="text-xs font-semibold text-foreground hover:text-black transition-colors truncate block"
                              >
                                {req.phone}
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Not provided</span>
                            )}
                          </div>
                        </div>
                        {req.phone && <CopyButton text={req.phone} label="mobile number" />}
                      </div>

                      {/* Email Address */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-zinc-100 text-[#52525B] flex items-center justify-center flex-shrink-0">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold capitalize text-muted-foreground">Email Address</p>
                            <a
                              href={`mailto:${req.email}`}
                              className="text-xs font-semibold text-foreground hover:text-black transition-colors truncate block"
                            >
                              {req.email}
                            </a>
                          </div>
                        </div>
                        <CopyButton text={req.email} label="email" />
                      </div>

                      {/* Business / Organization */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-zinc-100 text-[#52525B] flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold capitalize text-muted-foreground">Organization / Brand</p>
                            <span className="text-xs font-semibold text-foreground truncate block">
                              {req.business_name || "Individual / Creator"}
                            </span>
                          </div>
                        </div>
                        {req.business_name && <CopyButton text={req.business_name} label="business name" />}
                      </div>
                    </div>

                    {/* Customer Typed Message & Requirements */}
                    {messageText && (
                      <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-[#52525B] space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold capitalize text-muted-foreground">
                          <MessageSquare className="w-3.5 h-3.5 text-[#52525B]" />
                          <span>Customer Note / Requirements</span>
                        </div>
                        <p className="text-xs leading-relaxed text-[#52525B] whitespace-pre-wrap pl-5 font-normal">
                          &ldquo;{messageText}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Review Note if any */}
                    {req.review_note && (
                      <div className="text-xs text-[#52525B] bg-zinc-100/70 px-3 py-1.5 rounded-full border border-border inline-flex items-center gap-1.5">
                        <span className="font-semibold text-[#52525B]">Admin Note:</span>
                        <span>{req.review_note}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Action Controls */}
                  <div className="flex flex-col gap-2.5 lg:w-64 flex-shrink-0 pt-2 lg:pt-0 lg:border-l lg:border-border lg:pl-6">
                    {/* Quick Provision Button */}
                    <Link
                      href={provisionUrl}
                      className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full bg-card hover:bg-muted/50 text-[#52525B] hover:text-black text-xs font-semibold border border-border transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Provision in Panel</span>
                    </Link>

                    {/* Review Buttons */}
                    {req.status === "pending" && (
                      <div className="space-y-2 pt-1">
                        <input
                          value={reviewNote[req.id] || ""}
                          onChange={e => setReviewNote(prev => ({ ...prev, [req.id]: e.target.value }))}
                          placeholder="Optional review note…"
                          className="h-8 px-3 rounded-full border border-border text-xs placeholder-zinc-400 focus:outline-none focus:border-zinc-400 w-full"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(req.id, "approve")}
                            disabled={reviewing === req.id}
                            className="flex-1 inline-flex items-center justify-center gap-1 h-8 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{reviewing === req.id ? "Approving…" : "Approve"}</span>
                          </button>
                          <button
                            onClick={() => handleReview(req.id, "reject")}
                            disabled={reviewing === req.id}
                            className="flex-1 inline-flex items-center justify-center gap-1 h-8 rounded-full bg-card hover:bg-red-50 text-red-600 border border-border hover:border-red-200 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Allow changing status if already reviewed */}
                    {req.status !== "pending" && (
                      <div className="flex items-center gap-2">
                        {req.status === "rejected" ? (
                          <button
                            onClick={() => handleReview(req.id, "approve")}
                            disabled={reviewing === req.id}
                            className="flex-1 inline-flex items-center justify-center gap-1 h-8 rounded-full bg-card text-emerald-700 hover:bg-emerald-50 text-xs font-semibold border border-border transition-all disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Switch to Approved</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReview(req.id, "reject")}
                            disabled={reviewing === req.id}
                            className="flex-1 inline-flex items-center justify-center gap-1 h-8 rounded-full bg-card text-amber-700 hover:bg-amber-50 text-xs font-semibold border border-border transition-all disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Revoke / Reject</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Delete Request Permanently */}
                    <button
                      onClick={() => handleDelete(req.id, req.name)}
                      disabled={deleting === req.id}
                      className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-full text-muted-foreground hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-all disabled:opacity-50 mt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deleting === req.id ? "Deleting…" : "Delete Request"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
