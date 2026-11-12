"use client";
import { useEffect, useState } from "react";
import { Gauge, CreditCard, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AgentLimitsPage() {
  const [data, setData] = useState<{ card_limit: number; cards_used: number; remaining_credits: number; restore_on_delete: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bff/v1/agent/cards/limits", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => { if (json.success) setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 flex items-center justify-center py-32"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div>;

  const limit = data?.card_limit || 0;
  const used = data?.cards_used || 0;
  const remaining = data?.remaining_credits || 0;
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Card Creation Limits</h1>
        <p className="text-xs text-slate-500 mt-1">Your card quota usage and remaining credits</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        {/* Circular gauge visualization */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle cx="60" cy="60" r="52" fill="none"
              stroke={pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981"}
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 327} 327`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900">{pct}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Used</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <CreditCard className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
            <p className="text-xl font-black text-slate-900">{used}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Cards Used</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <p className="text-xl font-black text-emerald-700">{remaining}</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">Remaining</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Gauge className="w-5 h-5 text-violet-500 mx-auto mb-2" />
            <p className="text-xl font-black text-slate-900">{limit}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total Limit</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-gradient-to-r from-red-400 to-red-500" : pct >= 70 ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-emerald-400 to-emerald-500"}`}
            style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>

        {remaining <= 0 && (
          <div className="flex items-center gap-2 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium justify-center">
            <AlertTriangle className="w-4 h-4" /> No credits remaining. Contact your admin to increase your limit.
          </div>
        )}

        {data?.restore_on_delete && (
          <p className="text-[11px] text-slate-400 mt-4">
            <span className="font-semibold">Note:</span> Deleting a card restores the credit back to your quota.
          </p>
        )}
      </div>
    </div>
  );
}

