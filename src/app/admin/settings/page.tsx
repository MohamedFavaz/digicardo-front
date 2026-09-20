"use client";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { 
  Settings, 
  Key, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck, 
  Calendar,
  Lock,
  Sparkles
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  months: number;
  price: number;
  currency_symbol: string;
  formatted_price: string;
  is_active: boolean;
}

export default function AdminSettingsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editPrices, setEditPrices] = useState<Record<string, { price: string; symbol: string }>>({});
  const [planSaving, setPlanSaving] = useState<string | null>(null);
  const [planMsg, setPlanMsg] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [loading, setLoading] = useState(true);

  const [pwForm, setPwForm] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    fetch("/api/bff/v1/admin/validity-plans", { credentials: "include" })
      .then(r => r.json())
      .then(json => {
        const p: Plan[] = json?.data?.plans || [];
        setPlans(p);
        const init: Record<string, { price: string; symbol: string }> = {};
        p.forEach(plan => {
          init[plan.id] = { price: String(plan.price), symbol: plan.currency_symbol || "₹" };
        });
        setEditPrices(init);
      })
      .finally(() => setLoading(false));
  }, []);

  async function savePlanPrice(planId: string) {
    setPlanSaving(planId);
    setPlanMsg(m => ({ ...m, [planId]: { ok: false, text: "" } }));
    const { price, symbol } = editPrices[planId] || {};
    try {
      const res = await fetch(`/api/bff/v1/admin/validity-plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ price: parseFloat(price), currency_symbol: symbol }),
      });
      const json = await res.json();
      setPlanMsg(m => ({
        ...m,
        [planId]: res.ok
          ? { ok: true, text: "Price updated!" }
          : { ok: false, text: json?.error?.message || "Failed to save." },
      }));
      if (res.ok) {
        setPlans(prev =>
          prev.map(p => (p.id === planId ? { ...p, price: parseFloat(price), currency_symbol: symbol } : p))
        );
      }
    } catch {
      setPlanMsg(m => ({ ...m, [planId]: { ok: false, text: "Network error." } }));
    } finally {
      setPlanSaving(null);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.password !== pwForm.password_confirmation) {
      setPwMsg({ ok: false, text: "New passwords do not match." });
      return;
    }
    if (pwForm.password.length < 8) {
      setPwMsg({ ok: false, text: "New password must be at least 8 characters." });
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/bff/v1/admin/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pwForm),
      });
      const json = await res.json();
      if (res.ok) {
        setPwMsg({ ok: true, text: "Admin password updated successfully!" });
        setPwForm({ current_password: "", password: "", password_confirmation: "" });
      } else {
        setPwMsg({ ok: false, text: json?.error?.message || "Failed to update password." });
      }
    } catch {
      setPwMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setPwSaving(false);
    }
  }

  const CURRENCY_OPTIONS = ["₹", "$", "€", "£", "AED", "SAR"];

  return (
    <div suppressHydrationWarning className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">System Settings & Security</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Admin Configuration
            </span>
          </div>
          <p className="text-indigo-200 text-xs mt-1.5 max-w-xl leading-relaxed">
            Configure validity subscription pricing tiers, currency settings, and maintain the master administrator password and credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Validity Plan Pricing (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Validity Plan Pricing</h2>
                <p className="text-[11px] text-slate-400">Configure prices for each duration tier</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">{plans.length} Active Plans</span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="h-8 w-24 bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse ml-auto" />
                </div>
              ))
            ) : plans.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No validity plans found.
              </div>
            ) : (
              plans.map(plan => {
                const edit = editPrices[plan.id] || { price: String(plan.price), symbol: plan.currency_symbol };
                const msg = planMsg[plan.id];
                const isSaving = planSaving === plan.id;

                return (
                  <div key={plan.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                        {plan.months >= 12 ? `${plan.months / 12}Y` : `${plan.months}M`}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{plan.name} Plan</p>
                        <p className="text-[11px] text-slate-400">Valid for {plan.months} calendar month{plan.months > 1 ? "s" : ""}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* Currency selector */}
                      <select
                        value={edit.symbol}
                        onChange={e =>
                          setEditPrices(prev => ({
                            ...prev,
                            [plan.id]: { ...edit, symbol: e.target.value },
                          }))
                        }
                        className="h-8 px-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
                      >
                        {CURRENCY_OPTIONS.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      {/* Price input */}
                      <input
                        type="number"
                        step="0.01"
                        value={edit.price}
                        onChange={e =>
                          setEditPrices(prev => ({
                            ...prev,
                            [plan.id]: { ...edit, price: e.target.value },
                          }))
                        }
                        className="w-24 h-8 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 text-right focus:outline-none focus:border-indigo-500"
                      />

                      {/* Save button */}
                      <button
                        onClick={() => savePlanPrice(plan.id)}
                        disabled={isSaving}
                        className="h-8 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 shadow-sm"
                      >
                        <Save className="w-3 h-3" />
                        <span>{isSaving ? "…" : "Save"}</span>
                      </button>

                      {msg && (
                        <span
                          className={`text-[11px] font-bold ${
                            msg.ok ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {msg.text}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Security & Password (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Admin Security</h2>
              <p className="text-[11px] text-slate-400">Update master administrator credentials</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="p-5 space-y-4">
            {pwMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  pwMsg.ok
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {pwMsg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{pwMsg.text}</span>
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={pwForm.current_password}
                  onChange={e => setPwForm(p => ({ ...p, current_password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full h-9 px-3 pr-10 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                New Password *
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={pwForm.password}
                onChange={e => setPwForm(p => ({ ...p, password: e.target.value }))}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Confirm New Password *
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={pwForm.password_confirmation}
                onChange={e => setPwForm(p => ({ ...p, password_confirmation: e.target.value }))}
                required
                placeholder="Repeat new password"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={pwSaving}
                className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-1.5"
              >
                <Key className="w-4 h-4" />
                <span>{pwSaving ? "Updating Password…" : "Update Admin Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
