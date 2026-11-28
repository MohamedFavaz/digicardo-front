"use client";

import * as React from "react";
import { Building2, Loader2, Repeat2, UserCog, X } from "lucide-react";

export interface ConvertCardTarget {
  id: string;
  name: string;
  email: string;
  username?: string;
  mobile?: string | null;
}

type PartnerType = "agent" | "franchise";

export interface ConvertCardResult {
  type: PartnerType;
  partnerId: string;
  partnerName: string;
}

interface Props {
  card: ConvertCardTarget | null;
  onClose: () => void;
  onConverted: (result: ConvertCardResult) => void;
}

const inputCls =
  "w-full h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300";

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-[#52525B]">{label}</span>
      {children}
      {error ? <span className="block text-xs text-red-600">{error}</span> : hint ? <span className="block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

/**
 * Converts an Admin Direct Card into an agent or franchise: creates the partner login with its card
 * limit and commission slab, and moves the card under it (uses 1 credit). Optionally books the
 * hand-over as a card sale in finance. One-way.
 */
export function ConvertCardModal({ card, onClose, onConverted }: Props) {
  const [type, setType] = React.useState<PartnerType>("agent");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    card_limit: "10",
    card_price: "500",
    agent_commission: "200",
    franchise_fee: "",
    sale_amount: "",
    sale_commission: "",
  });
  const [recordSale, setRecordSale] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!card) return;
    setType("agent");
    setRecordSale(false);
    setErrors({});
    setForm({
      name: card.name,
      email: "",
      mobile: card.mobile ?? "",
      password: "",
      card_limit: "10",
      card_price: "500",
      agent_commission: "200",
      franchise_fee: "",
      sale_amount: "",
      sale_commission: "",
    });
  }, [card]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && card && !saving) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, saving, onClose]);

  if (!card) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isFranchise = type === "franchise";
  const usesFee = isFranchise && form.franchise_fee !== "";
  // Sale defaults follow the commission slab until the admin types their own.
  const saleAmount = form.sale_amount !== "" ? form.sale_amount : usesFee ? "0" : form.card_price;
  const saleCommission = isFranchise ? "0" : form.sale_commission !== "" ? form.sale_commission : form.agent_commission;
  const profit = (Number(saleAmount) || 0) - (Number(saleCommission) || 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const num = (v: string) => (v === "" ? null : Number(v));
    const body: Record<string, unknown> = {
      type,
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim() || null,
      password: form.password,
      card_limit: Number(form.card_limit),
      card_price: usesFee ? null : num(form.card_price),
      agent_commission: isFranchise ? 0 : num(form.agent_commission),
      record_sale: recordSale,
    };
    if (isFranchise) body.franchise_fee = num(form.franchise_fee);
    if (recordSale) {
      body.sale_amount = Number(saleAmount);
      body.sale_commission = Number(saleCommission);
    }
    try {
      const res = await fetch(`/api/bff/v1/admin/users/${card!.id}/convert`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = (json?.error?.details || {}) as Record<string, string[]>;
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(details)) flat[k] = Array.isArray(v) ? v[0] : String(v);
        if (!Object.keys(flat).length) flat.form = json?.error?.message || "Couldn't convert the card.";
        else if (flat.user) flat.form = flat.user;
        setErrors(flat);
        return;
      }
      onConverted({ type, partnerId: json?.data?.partner?.id, partnerName: json?.data?.partner?.name ?? form.name });
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="convert-card-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-5"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1 pr-6">
          <h2 id="convert-card-title" className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Repeat2 className="h-5 w-5" /> Convert Admin Direct Card
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Creates a new {isFranchise ? "franchise" : "agent"} login and moves{" "}
            <span className="font-semibold text-foreground">{card.username ? `/${card.username}` : card.name}</span> under it as its
            first card (uses 1 credit). The card stays live. This can&apos;t be undone.
          </p>
        </div>

        {/* Type */}
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["agent", "Agent", UserCog],
              ["franchise", "Franchise", Building2],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold transition-all ${
                type === key ? "border-[#343C22] bg-[#343C22] text-white" : "border-border text-[#52525B] hover:bg-zinc-50"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* Login */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{isFranchise ? "Franchise" : "Agent"} login</h3>
          <Field label="Name" error={errors.name}>
            <input className={inputCls} value={form.name} onChange={set("name")} required minLength={2} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Login email" error={errors.email} hint={`Must differ from the card's email (${card.email}).`}>
              <input className={inputCls} type="email" value={form.email} onChange={set("email")} required />
            </Field>
            <Field label="Mobile" error={errors.mobile}>
              <input className={inputCls} value={form.mobile} onChange={set("mobile")} placeholder="Optional" />
            </Field>
          </div>
          <Field label="Password" error={errors.password}>
            <input className={inputCls} type="text" value={form.password} onChange={set("password")} required minLength={8} placeholder="At least 8 characters" />
          </Field>
        </section>

        {/* Slab */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Card limit &amp; commission slab</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Card limit" error={errors.card_limit} hint="Includes this card">
              <input className={inputCls} type="number" min={1} value={form.card_limit} onChange={set("card_limit")} required />
            </Field>
            {isFranchise && (
              <Field label="Franchise fee (₹)" error={errors.franchise_fee} hint="One-time; blank = per-card price">
                <input className={inputCls} type="number" min={0} value={form.franchise_fee} onChange={set("franchise_fee")} placeholder="—" />
              </Field>
            )}
            {!usesFee && (
              <Field label="Price per card (₹)" error={errors.card_price}>
                <input className={inputCls} type="number" min={0} value={form.card_price} onChange={set("card_price")} />
              </Field>
            )}
            {!isFranchise && (
              <Field label="Agent commission (₹)" error={errors.agent_commission} hint="Per card">
                <input className={inputCls} type="number" min={0} value={form.agent_commission} onChange={set("agent_commission")} />
              </Field>
            )}
          </div>
        </section>

        {/* Finance */}
        <section className="space-y-3 rounded-xl border border-border p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#343C22]" checked={recordSale} onChange={(e) => setRecordSale(e.target.checked)} />
            <span>
              <span className="block text-sm font-semibold text-foreground">Record in sales / finance</span>
              <span className="block text-xs text-muted-foreground">
                Book this card as a sale to the {isFranchise ? "franchise" : "agent"}. Leave off if the customer already paid you for it.
              </span>
            </span>
          </label>
          {recordSale && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Sale amount (₹)" error={errors.sale_amount}>
                <input className={inputCls} type="number" min={0} value={saleAmount} onChange={set("sale_amount")} />
              </Field>
              {!isFranchise && (
                <Field label="Agent commission (₹)" error={errors.sale_commission}>
                  <input className={inputCls} type="number" min={0} value={saleCommission} onChange={set("sale_commission")} />
                </Field>
              )}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#52525B]">Admin profit</span>
                <div className={`h-10 flex items-center rounded-xl bg-zinc-50 px-3 text-sm font-semibold ${profit < 0 ? "text-red-600" : "text-foreground"}`}>
                  ₹{profit.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </section>

        {errors.form && <p className="rounded-xl bg-[#FDECEC] px-3 py-2 text-sm text-red-600">{errors.form}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 px-4 rounded-xl border border-border text-sm font-semibold text-[#52525B] hover:bg-zinc-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || (recordSale && profit < 0)}
            className="inline-flex h-10 items-center gap-2 px-5 rounded-xl bg-[#343C22] text-sm font-semibold text-white hover:bg-[#4B5634] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Repeat2 className="h-4 w-4" />}
            Convert to {isFranchise ? "franchise" : "agent"}
          </button>
        </div>
      </form>
    </div>
  );
}
