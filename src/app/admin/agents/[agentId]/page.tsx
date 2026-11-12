"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CreditCard,
  DollarSign,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Shield,
  Info,
} from "lucide-react";
import type { AgentUser } from "@/types/agent";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    suspended: "bg-amber-50 text-amber-700 border-amber-200",
    banned: "bg-red-50 text-red-700 border-red-200",
  };
  return map[status] || "bg-slate-50 text-slate-600 border-slate-200";
}

export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const router = useRouter();

  const [agent, setAgent] = useState<AgentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    status: "active",
    card_limit: "0",
    card_price: "0",
    agent_commission: "0",
    restore_on_delete: true,
  });

  const adminProfit = Math.max(0, (parseFloat(form.card_price) || 0) - (parseFloat(form.agent_commission) || 0));

  const fetchAgent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bff/v1/admin/agents/${agentId}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        const a = json.data?.agent || json.data;
        setAgent(a);
        setForm({
          name: a.name || "",
          email: a.email || "",
          mobile: a.mobile || "",
          password: "",
          status: a.status || "active",
          card_limit: String(a.agent_quota?.card_limit || 0),
          card_price: String(a.commission_config?.card_price || 0),
          agent_commission: String(a.commission_config?.agent_commission || 0),
          restore_on_delete: a.agent_quota?.restore_on_delete ?? true,
        });
      } else {
        setError("Agent not found");
      }
    } catch {
      setError("Failed to load agent");
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => { fetchAgent(); }, [fetchAgent]);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const body: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        mobile: form.mobile || undefined,
        status: form.status,
        card_limit: parseInt(form.card_limit) || 0,
        card_price: parseFloat(form.card_price) || 0,
        agent_commission: parseFloat(form.agent_commission) || 0,
        restore_on_delete: form.restore_on_delete,
      };
      if (form.password) body.password = form.password;

      const res = await fetch(`/api/bff/v1/admin/agents/${agentId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess("Agent updated successfully!");
        fetchAgent();
      } else {
        setError(json.message || json.error?.message || "Failed to update agent");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate() {
    setActionLoading(true);
    try {
      await fetch(`/api/bff/v1/admin/agents/${agentId}/activate`, { method: "POST", credentials: "include" });
      fetchAgent();
      setSuccess("Agent activated!");
    } finally { setActionLoading(false); }
  }

  async function handleDeactivate() {
    setActionLoading(true);
    try {
      await fetch(`/api/bff/v1/admin/agents/${agentId}/deactivate`, { method: "POST", credentials: "include" });
      fetchAgent();
      setSuccess("Agent deactivated!");
    } finally { setActionLoading(false); }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently delete this agent? This action cannot be undone.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bff/v1/admin/agents/${agentId}`, { method: "DELETE", credentials: "include" });
      const json = await res.json();
      if (json.success) {
        router.push("/admin/agents");
      } else {
        setError(json.message || "Failed to delete agent");
      }
    } finally { setActionLoading(false); }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto text-center py-32">
        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500">Agent not found</p>
        <Link href="/admin/agents" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Agents
        </Link>
      </div>
    );
  }

  const quota = agent.agent_quota;
  const config = agent.commission_config;
  const usedPct = quota ? Math.round((quota.cards_used / Math.max(quota.card_limit, 1)) * 100) : 0;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/agents" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 border border-slate-200/80 bg-white hover:text-black hover:bg-slate-50 transition-colors mb-4 shadow-2xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Agents
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{agent.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                Agent Profile
              </span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${statusColor(agent.status)}`}>
                {agent.status}
              </span>
            </div>
            <p className="text-slate-500 font-medium text-xs mt-1 leading-relaxed">
              Manage reseller quotas, commission structure, and status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {agent.status === "active" ? (
              <button onClick={handleDeactivate} disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-amber-200 bg-white text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-all shadow-2xs disabled:opacity-50">
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleRight className="w-3.5 h-3.5" />} Deactivate
              </button>
            ) : (
              <button onClick={handleActivate} disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-emerald-200 bg-white text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-all shadow-2xs disabled:opacity-50">
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleLeft className="w-3.5 h-3.5" />} Activate
              </button>
            )}
            <button onClick={handleDelete} disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-red-200 bg-white text-xs font-semibold text-red-700 hover:bg-red-50 transition-all shadow-2xs disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      {/* Agent Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-2xs">
            {agent.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{agent.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-500">{agent.email}</span>
              {agent.mobile && <span className="text-xs text-slate-400">· {agent.mobile}</span>}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Created: {formatDate(agent.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Quota & Commission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quota Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Card Quota</h2>
          </div>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-slate-900">{quota?.cards_used ?? 0}<span className="text-lg text-slate-400 font-semibold"> / {quota?.card_limit ?? 0}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Cards Used</p>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full transition-all ${usedPct >= 90 ? "bg-red-500" : usedPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(usedPct, 100)}%` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-400">{usedPct}% used</span>
            <span className="text-emerald-600">{(quota?.card_limit ?? 0) - (quota?.cards_used ?? 0)} remaining</span>
          </div>
        </div>

        {/* Commission Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Commission Config</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Card Price</span>
              <span className="text-sm font-bold text-slate-900">₹{config?.card_price?.toLocaleString() ?? "0"}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200/60">
              <span className="text-xs font-semibold text-amber-700">Agent Commission</span>
              <span className="text-sm font-bold text-amber-700">₹{config?.agent_commission?.toLocaleString() ?? "0"}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
              <span className="text-xs font-semibold text-emerald-700">Admin Profit</span>
              <span className="text-sm font-bold text-emerald-700">₹{config?.admin_profit?.toLocaleString() ?? "0"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Edit Agent</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> Name</label>
            <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> Email</label>
            <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile</label>
            <input type="tel" value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1.5"><Lock className="w-3.5 h-3.5 text-slate-400" /> New Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Leave blank to keep current"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1.5"><Shield className="w-3.5 h-3.5 text-slate-400" /> Status</label>
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-400">
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1.5"><CreditCard className="w-3.5 h-3.5 text-slate-400" /> Card Limit</label>
            <input type="number" value={form.card_limit} onChange={(e) => updateField("card_limit", e.target.value)} min="0" max="100000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1.5"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> Card Price (₹)</label>
            <input type="number" value={form.card_price} onChange={(e) => updateField("card_price", e.target.value)} min="0" step="1"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 mb-1.5"><DollarSign className="w-3.5 h-3.5 text-amber-500" /> Agent Commission (₹)</label>
            <input type="number" value={form.agent_commission} onChange={(e) => updateField("agent_commission", e.target.value)} min="0" step="1"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400" />
          </div>
        </div>

        {/* Admin profit display */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-emerald-700">Admin Profit: ₹{adminProfit.toLocaleString()} per card</span>
        </div>

        <div className="flex items-center gap-3 justify-end pt-2">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-black shadow-xs transition-all disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

