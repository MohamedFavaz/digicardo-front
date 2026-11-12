"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Wallet,
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Banknote,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Save,
} from "lucide-react";
import type { AgentUser, AgentPaymentRecord } from "@/types/agent";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

interface FinanceDashboard {
  total_revenue: number;
  total_profit: number;
  total_commission: number;
  pending_payments: number;
  paid_commission: number;
  total_cards_sold: number;
}

export default function AdminAgentFinancePage() {
  const [dashboard, setDashboard] = useState<FinanceDashboard | null>(null);
  const [payments, setPayments] = useState<AgentPaymentRecord[]>([]);
  const [agents, setAgents] = useState<AgentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentLastPage, setPaymentLastPage] = useState(1);

  // Record Payment form
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    agent_id: "",
    amount: "",
    payment_method: "",
    reference_number: "",
    notes: "",
  });
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/bff/v1/admin/agent-finance/dashboard", { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setDashboard(json.data);
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const res = await fetch(`/api/bff/v1/admin/agent-finance/payments?page=${paymentPage}&per_page=10`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setPayments(json.data?.payments || json.data || []);
        const meta = json.data?.pagination || json.meta || {};
        setPaymentLastPage(meta.last_page || 1);
      }
    } catch {
      // Network error
    } finally {
      setPaymentsLoading(false);
    }
  }, [paymentPage]);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/bff/v1/admin/agents?per_page=100", { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setAgents(json.data?.agents || json.data || []);
      }
    } catch {
      // Network error
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchAgents();
  }, [fetchDashboard, fetchAgents]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    setPaymentError("");
    setPaymentSuccess("");

    if (!paymentForm.agent_id) {
      setPaymentError("Please select an agent");
      return;
    }
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      setPaymentError("Please enter a valid amount");
      return;
    }

    setPaymentSubmitting(true);
    try {
      const res = await fetch("/api/bff/v1/admin/agent-finance/payments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: paymentForm.agent_id,
          amount: parseFloat(paymentForm.amount),
          status: "paid",
          payment_method: paymentForm.payment_method || null,
          reference_number: paymentForm.reference_number || null,
          notes: paymentForm.notes || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPaymentSuccess("Payment recorded successfully!");
        setPaymentForm({ agent_id: "", amount: "", payment_method: "", reference_number: "", notes: "" });
        setShowPaymentForm(false);
        fetchPayments();
        fetchDashboard();
      } else {
        setPaymentError(json.message || json.error?.message || "Failed to record payment");
      }
    } catch {
      setPaymentError("Network error. Please try again.");
    } finally {
      setPaymentSubmitting(false);
    }
  }

  const paymentStatusIcon = (status: string) => {
    if (status === "paid") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    if (status === "failed") return <XCircle className="w-3.5 h-3.5 text-red-600" />;
    return <Clock className="w-3.5 h-3.5 text-amber-600" />;
  };

  const paymentStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      failed: "bg-red-50 text-red-700 border-red-200",
    };
    return map[status] || map.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Agent Finance</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
              Finance & Commission
            </span>
          </div>
          <p className="text-slate-500 font-medium text-xs mt-1 leading-relaxed">
            Revenue, profit, and commission payouts management.
          </p>
        </div>
        <button
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs active:scale-95"
        >
          <Banknote className="w-4 h-4" />
          {showPaymentForm ? "Close Form" : "Record Payment"}
        </button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : dashboard ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Revenue", value: `₹${dashboard.total_revenue?.toLocaleString() || "0"}`, icon: TrendingUp, color: "text-slate-900 bg-slate-100" },
            { label: "Admin Profit", value: `₹${dashboard.total_profit?.toLocaleString() || "0"}`, icon: DollarSign, color: "text-emerald-700 bg-emerald-50" },
            { label: "Total Commission", value: `₹${dashboard.total_commission?.toLocaleString() || "0"}`, icon: Wallet, color: "text-amber-700 bg-amber-50" },
            { label: "Paid Commission", value: `₹${dashboard.paid_commission?.toLocaleString() || "0"}`, icon: CheckCircle2, color: "text-blue-700 bg-blue-50" },
            { label: "Pending Payments", value: `₹${dashboard.pending_payments?.toLocaleString() || "0"}`, icon: Clock, color: "text-orange-700 bg-orange-50" },
            { label: "Cards Sold", value: String(dashboard.total_cards_sold || 0), icon: CreditCard, color: "text-violet-700 bg-violet-50" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4">
              <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-slate-900 tracking-tight">{value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Record Payment Form */}
      {showPaymentForm && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Record Agent Payment</h2>

          {paymentError && (
            <div className="flex items-center gap-2 px-4 py-2.5 mb-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {paymentError}
            </div>
          )}

          {paymentSuccess && (
            <div className="flex items-center gap-2 px-4 py-2.5 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {paymentSuccess}
            </div>
          )}

          <form onSubmit={handleRecordPayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Agent *</label>
              <select
                value={paymentForm.agent_id}
                onChange={(e) => setPaymentForm({ ...paymentForm, agent_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400"
              >
                <option value="">Select Agent</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Amount (₹) *</label>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Payment Method</label>
              <input
                type="text"
                value={paymentForm.payment_method}
                onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                placeholder="e.g., Bank Transfer, UPI, Cash"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Reference Number</label>
              <input
                type="text"
                value={paymentForm.reference_number}
                onChange={(e) => setPaymentForm({ ...paymentForm, reference_number: e.target.value })}
                placeholder="Transaction ID"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Notes</label>
              <textarea
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                placeholder="Optional notes"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 resize-none"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={paymentSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-black shadow-xs transition-all disabled:opacity-50"
              >
                {paymentSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Record Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Payment History</h2>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Commission payments made to agents</p>
          </div>
        </div>

        {paymentsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Banknote className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">No payments recorded yet</p>
            <p className="text-xs text-slate-400 mt-1">Record commission payments to track agent payouts</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Agent</th>
                  <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Amount</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Method</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Reference</th>
                  <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <p className="text-xs font-semibold text-slate-800">{payment.agent?.name || "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-slate-900">₹{payment.amount?.toLocaleString() || "0"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${paymentStatusBadge(payment.status)}`}>
                        {paymentStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600">{payment.payment_method || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 font-mono">{payment.reference_number || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">{formatDate(payment.paid_at || payment.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {paymentLastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Page {paymentPage} of {paymentLastPage}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                disabled={paymentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPaymentPage((p) => Math.min(paymentLastPage, p + 1))}
                disabled={paymentPage >= paymentLastPage}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

