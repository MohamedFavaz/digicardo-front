"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IndianRupee, LogIn, Wallet, HandCoins, Loader2, PencilLine, Trash2, UserPlus, Users, X } from "lucide-react";
import { ConsolePage, DataTable, EmptyState, PageHeader, Panel, StatCard, StatusPill } from "@/components/console/ui";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { createStaffSchema, staffPaymentSchema, updateStaffSchema } from "@/lib/zod/franchise";
import { FranchiseApiError, commissionLabel, franchiseApi, ownerImpersonateStaff, rupees, shortDate, type StaffSummary } from "@/lib/franchise/api";

const input = "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#343C22]/20";
const primaryBtn = "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60";

type Form = Record<string, string>;
type Dialog = { kind: "add" } | { kind: "edit"; staff: StaffSummary } | { kind: "pay"; staff: StaffSummary } | null;

function Field({ label, name, form, set, errors, type = "text", hint, ...rest }: {
  label: string;
  name: string;
  form: Form;
  set: (f: Form) => void;
  errors: Record<string, string>;
  type?: string;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "form">) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <input {...rest} type={type} name={name} className={input} value={form[name] ?? ""} onChange={(e) => set({ ...form, [name]: e.target.value })} />
      {errors[name] ? <span className="block text-xs text-destructive">{errors[name]}</span> : hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function CommissionFields({ form, set, errors }: { form: Form; set: (f: Form) => void; errors: Record<string, string> }) {
  const pct = form.commission_type === "percentage";
  return (
    <div className="space-y-2 rounded-2xl bg-muted/60 p-4">
      <p className="text-sm font-medium text-foreground">Commission for each card</p>
      <div className="flex gap-2" role="radiogroup" aria-label="Commission type">
        {[
          { id: "fixed", label: "Fixed ₹ per card" },
          { id: "percentage", label: "% of sale amount" },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={form.commission_type === o.id}
            onClick={() => set({ ...form, commission_type: o.id })}
            className={`h-9 rounded-full px-3.5 text-sm ${form.commission_type === o.id ? "bg-[#343C22] text-white" : "border border-border bg-white text-foreground"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <Field
        label={pct ? "Percentage (%)" : "Amount (₹)"}
        name="commission_value"
        type="number"
        min={0}
        step="0.01"
        max={pct ? 100 : undefined}
        inputMode="decimal"
        form={form}
        set={set}
        errors={errors}
        hint={pct ? "Worked out from the amount the customer paid for each card." : "Paid for every card this person makes."}
      />
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-[#FBFBF8] p-5 shadow-xl sm:max-w-lg sm:rounded-3xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-normal text-[#121212]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function FranchiseStaffPage() {
  const me = useFranchise();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffSummary[] | null>(null);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [form, setForm] = useState<Form>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!me.is_owner) router.replace("/franchise/dashboard");
  }, [me.is_owner, router]);

  const load = useCallback(() => {
    franchiseApi<StaffSummary[]>("franchise/staff")
      .then((r) => setStaff(r.data))
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  function open(d: Dialog) {
    setErrors({});
    if (d?.kind === "add") setForm({ commission_type: "fixed", commission_value: "100" });
    if (d?.kind === "edit") setForm({ name: d.staff.name, email: d.staff.email, mobile: d.staff.mobile ?? "", password: "", commission_type: d.staff.commission_type, commission_value: String(d.staff.commission_value) });
    if (d?.kind === "pay") setForm({ amount: d.staff.balance > 0 ? String(d.staff.balance) : "", method: "UPI", note: "", paid_on: new Date().toLocaleDateString("en-CA") });
    setDialog(d);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dialog) return;
    const schema = dialog.kind === "add" ? createStaffSchema : dialog.kind === "edit" ? updateStaffSchema : staffPaymentSchema;
    const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));
    const parsed = schema.safeParse(clean);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      if (dialog.kind === "add") await franchiseApi("franchise/staff", { method: "POST", body: parsed.data });
      if (dialog.kind === "edit") await franchiseApi(`franchise/staff/${dialog.staff.id}`, { method: "PUT", body: { ...parsed.data, mobile: form.mobile || null } });
      if (dialog.kind === "pay") await franchiseApi(`franchise/staff/${dialog.staff.id}/payments`, { method: "POST", body: parsed.data });
      setDialog(null);
      load();
    } catch (err) {
      if (err instanceof FranchiseApiError && Object.keys(err.fields).length) setErrors(err.fields);
      else setErrors({ form: err instanceof Error ? err.message : "Couldn't save." });
    } finally {
      setSaving(false);
    }
  }

  async function toggle(s: StaffSummary) {
    const next = s.status === "active" ? "suspended" : "active";
    if (next === "suspended" && !confirm(`Suspend ${s.name}? They won't be able to sign in until you turn them back on.`)) return;
    try {
      await franchiseApi(`franchise/staff/${s.id}`, { method: "PUT", body: { status: next } });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update.");
    }
  }

  async function remove(s: StaffSummary) {
    if (!confirm(`Remove ${s.name}'s login? Their ${s.cards} card(s) stay in your franchise and still show who made them.`)) return;
    try {
      await franchiseApi(`franchise/staff/${s.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't remove.");
    }
  }

  return (
    <ConsolePage>
      <PageHeader
        title="Staff"
        description="Your workers sign in at /franchise-login with the email and password you set here. Each person only sees the cards they make."
        actions={
          <button type="button" onClick={() => open({ kind: "add" })} className={primaryBtn}>
            <UserPlus className="h-4 w-4" /> Add staff
          </button>
        }
      />

      {error && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p>}

      {staff && staff.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Total collected by staff" icon={IndianRupee} value={rupees(staff.reduce((s, x) => s + x.sales, 0))} hint={`From ${staff.reduce((s, x) => s + x.cards, 0)} cards`} />
          <StatCard label="Total commission" icon={Wallet} value={rupees(staff.reduce((s, x) => s + x.earned, 0))} hint="Earned by all staff" />
          <StatCard label="Received from staff" icon={HandCoins} value={rupees(staff.reduce((s, x) => s + (x.handed_over ?? 0), 0))} hint="Cash handovers you confirmed" href="/franchise/cash" />
          <StatCard
            label="Still with staff"
            icon={HandCoins}
            value={rupees(staff.reduce((s, x) => s + Math.max(0, x.cash_due ?? 0), 0))}
            hint="Collected − commission − handed over"
            href="/franchise/cash"
            tone={staff.some((x) => (x.cash_due ?? 0) > 0) ? "warning" : "neutral"}
          />
        </div>
      )}

      <Panel>
        {!staff ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
          </div>
        ) : staff.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No staff yet"
            text="Add the people who make cards for your franchise. You decide how much commission each one gets."
            action={
              <button type="button" onClick={() => open({ kind: "add" })} className={primaryBtn}>
                <UserPlus className="h-4 w-4" /> Add staff
              </button>
            }
          />
        ) : (
          <DataTable head={["Staff", "Commission rule", "Cards", "Total collected", "Commission", "Handed over", "Still with staff", ""]}>
            {staff.map((s) => (
              <tr key={s.id} className="align-middle">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <StatusPill tone={s.status === "active" ? "success" : "danger"}>{s.status === "active" ? "Active" : "Suspended"}</StatusPill>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.email}{s.mobile ? ` · ${s.mobile}` : ""}</p>
                  <p className="text-xs text-muted-foreground">Last card: {shortDate(s.last_card_at)}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{commissionLabel(s.commission_type, s.commission_value)}</td>
                <td className="px-5 py-3">
                  <Link href={`/franchise/cards?created_by=${s.id}`} className="font-medium hover:underline">
                    {s.cards}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-medium">{rupees(s.sales)}</td>
                <td className="whitespace-nowrap px-5 py-3">{rupees(s.earned)}</td>
                <td className="whitespace-nowrap px-5 py-3">{rupees(s.handed_over)}</td>
                <td className="whitespace-nowrap px-5 py-3 font-medium">
                  {(s.cash_due ?? 0) > 0.009 ? (
                    <span className="text-[#92400E]">{rupees(s.cash_due)}</span>
                  ) : (s.cash_due ?? 0) < -0.009 ? (
                    <span className="font-normal text-[#52525B]">You owe {rupees(-(s.cash_due ?? 0))}</span>
                  ) : (
                    <span className="font-normal text-[#1E7B43]">Settled</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1 whitespace-nowrap">
                    {s.status === "active" && (
                      <button
                        type="button"
                        title={`See ${s.name}'s panel`}
                        onClick={async () => {
                          try {
                            await ownerImpersonateStaff(s.id);
                          } catch (e) {
                            setError(e instanceof Error ? e.message : "Couldn't open this staff panel.");
                          }
                        }}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-xs font-semibold text-[#343C22] hover:bg-muted"
                      >
                        <LogIn className="h-3.5 w-3.5" /> Impersonate
                      </button>
                    )}
                    <button type="button" onClick={() => open({ kind: "pay", staff: s })} className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium hover:bg-muted">
                      <HandCoins className="h-3.5 w-3.5" /> Pay
                    </button>
                    <button type="button" onClick={() => open({ kind: "edit", staff: s })} className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium hover:bg-muted">
                      <PencilLine className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button type="button" onClick={() => toggle(s)} className="inline-flex h-8 items-center rounded-full px-3 text-xs font-medium hover:bg-muted">
                      {s.status === "active" ? "Suspend" : "Turn on"}
                    </button>
                    <button type="button" onClick={() => remove(s)} aria-label={`Remove ${s.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-[#FDECEC]">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>

      {dialog && (
        <Modal title={dialog.kind === "add" ? "Add staff" : dialog.kind === "edit" ? `Edit ${dialog.staff.name}` : `Pay ${dialog.staff.name}`} onClose={() => setDialog(null)}>
          <form onSubmit={submit} className="space-y-4">
            {dialog.kind === "pay" ? (
              <>
                <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  Collected {rupees(dialog.staff.sales)} · commission {rupees(dialog.staff.earned)} · paid {rupees(dialog.staff.paid)} · <span className="font-medium text-foreground">to pay {rupees(dialog.staff.balance)}</span>
                </p>
                <Field label="Amount paid (₹)" name="amount" type="number" min={1} step="0.01" inputMode="decimal" form={form} set={setForm} errors={errors} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Paid by" name="method" form={form} set={setForm} errors={errors} placeholder="UPI / Cash / Bank" />
                  <Field label="Date" name="paid_on" type="date" form={form} set={setForm} errors={errors} />
                </div>
                <Field label="Note (optional)" name="note" form={form} set={setForm} errors={errors} />
              </>
            ) : (
              <>
                <Field label="Full name" name="name" form={form} set={setForm} errors={errors} autoComplete="off" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email (login)" name="email" type="email" form={form} set={setForm} errors={errors} autoComplete="off" />
                  <Field label="Mobile (optional)" name="mobile" type="tel" form={form} set={setForm} errors={errors} hint="Can also be used to sign in" />
                </div>
                <Field
                  label={dialog.kind === "add" ? "Password" : "New password (optional)"}
                  name="password"
                  type="text"
                  form={form}
                  set={setForm}
                  errors={errors}
                  autoComplete="new-password"
                  hint={dialog.kind === "add" ? "At least 8 characters. Share it with this person." : "Leave empty to keep their password."}
                />
                <CommissionFields form={form} set={setForm} errors={errors} />
                {dialog.kind === "edit" && <p className="text-xs text-muted-foreground">A new commission rule applies to cards made from now on. Earlier cards keep their amount.</p>}
              </>
            )}
            {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setDialog(null)} className="h-10 rounded-full px-4 text-sm font-medium hover:bg-muted">
                Cancel
              </button>
              <button type="submit" disabled={saving} className={primaryBtn}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {dialog.kind === "add" ? "Add staff" : dialog.kind === "edit" ? "Save" : "Record payment"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </ConsolePage>
  );
}
