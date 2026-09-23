"use client";

import { useEffect, useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  CreditCard,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  RotateCw,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  months: number;
  price: number;
  currency_symbol: string;
  formatted_price: string;
  is_active: boolean;
  sort_order?: number;
}

const CURRENCY_OPTIONS = ["₹", "$", "€", "£", "AED", "SAR", "¥"];

export default function AdminValidityPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editPrices, setEditPrices] = useState<Record<string, { price: string; symbol: string }>>({});
  const [planSaving, setPlanSaving] = useState<string | null>(null);
  const [planDeleting, setPlanDeleting] = useState<string | null>(null);
  const [planMsg, setPlanMsg] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [loading, setLoading] = useState(true);

  // New Plan Dialog / Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    months: "1",
    price: "",
    currency_symbol: "₹",
    is_active: true,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bff/v1/admin/validity-plans", { credentials: "include" });
      const json = await res.json();
      const p: Plan[] = json?.data?.plans || [];
      setPlans(p);
      const init: Record<string, { price: string; symbol: string }> = {};
      p.forEach((plan) => {
        init[plan.id] = { price: String(plan.price), symbol: plan.currency_symbol || "₹" };
      });
      setEditPrices(init);
    } catch {
      // Silently catch
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  async function handleSavePrice(planId: string) {
    setPlanSaving(planId);
    setPlanMsg((m) => ({ ...m, [planId]: { ok: false, text: "" } }));
    const { price, symbol } = editPrices[planId] || {};
    try {
      const res = await fetch(`/api/bff/v1/admin/validity-plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ price: parseFloat(price), currency_symbol: symbol }),
      });
      const json = await res.json();
      const isOk = res.ok;
      setPlanMsg((m) => ({
        ...m,
        [planId]: isOk
          ? { ok: true, text: "Saved" }
          : { ok: false, text: json?.error?.message || "Failed to update." },
      }));
      if (isOk) {
        setPlans((prev) =>
          prev.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  price: parseFloat(price),
                  currency_symbol: symbol,
                  formatted_price: `${symbol}${parseFloat(price).toFixed(0)}`,
                }
              : p
          )
        );
        setTimeout(() => {
          setPlanMsg((m) => {
            const next = { ...m };
            delete next[planId];
            return next;
          });
        }, 3000);
      }
    } catch {
      setPlanMsg((m) => ({ ...m, [planId]: { ok: false, text: "Network error." } }));
    } finally {
      setPlanSaving(null);
    }
  }

  async function handleToggleActive(plan: Plan) {
    const nextState = !plan.is_active;
    setPlanSaving(plan.id);
    try {
      const res = await fetch(`/api/bff/v1/admin/validity-plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: nextState }),
      });
      if (res.ok) {
        setPlans((prev) =>
          prev.map((p) => (p.id === plan.id ? { ...p, is_active: nextState } : p))
        );
      }
    } catch {
      // Ignore
    } finally {
      setPlanSaving(null);
    }
  }

  async function handleDeletePlan(planId: string) {
    if (!window.confirm("Are you sure you want to delete this validity plan?")) {
      return;
    }
    setPlanDeleting(planId);
    try {
      const res = await fetch(`/api/bff/v1/admin/validity-plans/${planId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setPlans((prev) => prev.filter((p) => p.id !== planId));
      } else {
        alert("Failed to delete plan.");
      }
    } catch {
      alert("Network error while deleting plan.");
    } finally {
      setPlanDeleting(null);
    }
  }

  async function handleCreatePlan(e: FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    const priceNum = parseFloat(newPlan.price);
    const monthsNum = parseInt(newPlan.months, 10);

    if (!newPlan.name.trim()) {
      setCreateError("Plan name is required.");
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      setCreateError("Please enter a valid price.");
      return;
    }
    if (isNaN(monthsNum) || monthsNum < 1) {
      setCreateError("Duration must be at least 1 month.");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await fetch("/api/bff/v1/admin/validity-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newPlan.name.trim(),
          months: monthsNum,
          price: priceNum,
          currency_symbol: newPlan.currency_symbol,
          is_active: newPlan.is_active,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setCreateSuccess("Plan created successfully!");
        fetchPlans();
        setTimeout(() => {
          setShowCreateModal(false);
          setNewPlan({
            name: "",
            months: "1",
            price: "",
            currency_symbol: "₹",
            is_active: true,
          });
          setCreateSuccess(null);
        }, 800);
      } else {
        setCreateError(json?.error?.message || "Failed to create plan.");
      }
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  }

  const activePlansCount = plans.filter((p) => p.is_active).length;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* ── Header Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 rounded-3xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight">Subscription Validity Plans</h1>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Pricing & Durations
            </span>
          </div>
          <p className="text-indigo-200 text-xs mt-1.5 max-w-xl leading-relaxed font-medium">
            Configure subscription validity tiers, manage duration windows, adjust pricing currencies, and activate or deactivate plans across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 h-10 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Plan</span>
          </button>
          <button
            onClick={fetchPlans}
            disabled={loading}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-50"
            title="Refresh plans"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Configured Plans</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{plans.length}</div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Custom validity durations</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Live Plans</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activePlansCount}</div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Available for account provisioning</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Quick Links</span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center font-black">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Link
              href="/admin/settings"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              Settings <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              href="/admin/admin-panel"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
            >
              Provision Users <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Plans Table & Editor ── */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Configured Plans & Tiers</h2>
              <p className="text-[11px] text-slate-400">Manage plan duration, prices, and status</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400">{plans.length} total tiers</span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-3 w-24 bg-slate-100 rounded-lg animate-pulse" />
                </div>
                <div className="h-9 w-48 bg-slate-100 rounded-2xl animate-pulse" />
              </div>
            ))
          ) : plans.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No validity plans found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click below to initialize default duration tiers or create a new custom plan.
              </p>
              <button
                onClick={fetchPlans}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all"
              >
                Reload Default Plans
              </button>
            </div>
          ) : (
            plans.map((plan) => {
              const edit = editPrices[plan.id] || {
                price: String(plan.price),
                symbol: plan.currency_symbol || "₹",
              };
              const msg = planMsg[plan.id];
              const isSaving = planSaving === plan.id;
              const isDeleting = planDeleting === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors ${
                    !plan.is_active ? "opacity-60 bg-slate-50/40" : ""
                  }`}
                >
                  {/* Left: Badge & Plan Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/80 text-indigo-700 font-black text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {plan.months >= 12
                        ? `${plan.months / 12}Y`
                        : `${plan.months}M`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{plan.name}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            plan.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {plan.is_active ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {plan.months} Month{plan.months > 1 ? "s" : ""} Validity (
                          {Math.round(plan.months * 30.5)} days)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Controls & Price Editing */}
                  <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
                    {/* Active/Inactive Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(plan)}
                      disabled={isSaving}
                      className={`h-9 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        plan.is_active
                          ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                      title="Toggle active status"
                    >
                      {plan.is_active ? "Disable" : "Enable"}
                    </button>

                    {/* Currency Selector */}
                    <select
                      value={edit.symbol}
                      onChange={(e) =>
                        setEditPrices((prev) => ({
                          ...prev,
                          [plan.id]: { ...edit, symbol: e.target.value },
                        }))
                      }
                      className="h-9 px-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
                    >
                      {CURRENCY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {/* Price Input */}
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={edit.price}
                        onChange={(e) =>
                          setEditPrices((prev) => ({
                            ...prev,
                            [plan.id]: { ...edit, price: e.target.value },
                          }))
                        }
                        className="w-28 h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 text-right focus:outline-none focus:border-indigo-500"
                        placeholder="Price"
                      />
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => handleSavePrice(plan.id)}
                      disabled={isSaving}
                      className="h-9 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? "Saving…" : "Save"}</span>
                    </button>

                    {/* Delete Plan */}
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      disabled={isDeleting}
                      className="w-9 h-9 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-all disabled:opacity-50"
                      title="Delete plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Feedback label */}
                    {msg && (
                      <span
                        className={`text-[11px] font-bold ml-1 ${
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

      {/* ── Create New Plan Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plus className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Validity Plan</h3>
                  <p className="text-xs text-slate-400">Create a new subscription tier</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              {createError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              {createSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{createSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Plan Display Name
                </label>
                <input
                  type="text"
                  required
                  value={newPlan.name}
                  onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. 1 Year Premium"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={newPlan.months}
                    onChange={(e) => setNewPlan((p) => ({ ...p, months: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Currency Symbol
                  </label>
                  <select
                    value={newPlan.currency_symbol}
                    onChange={(e) => setNewPlan((p) => ({ ...p, currency_symbol: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Plan Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={newPlan.price}
                  onChange={(e) => setNewPlan((p) => ({ ...p, price: e.target.value }))}
                  placeholder="e.g. 799"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 h-10 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{createLoading ? "Creating…" : "Save Plan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
