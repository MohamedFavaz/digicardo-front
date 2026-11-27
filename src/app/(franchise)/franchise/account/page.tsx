"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ConsolePage, PageHeader, Panel } from "@/components/console/ui";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { FranchiseApiError, franchiseApi } from "@/lib/franchise/api";

const input = "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#343C22]/20";

export default function FranchiseAccountPage() {
  const me = useFranchise();
  const [form, setForm] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setDone("");
    if (form.password.length < 8) return setErrors({ password: "At least 8 characters." });
    if (form.password !== form.password_confirmation) return setErrors({ password_confirmation: "The passwords don't match." });
    setSaving(true);
    try {
      await franchiseApi("franchise/auth/password", { method: "POST", body: form });
      setForm({ current_password: "", password: "", password_confirmation: "" });
      setDone("Password changed.");
    } catch (err) {
      setErrors(err instanceof FranchiseApiError && Object.keys(err.fields).length ? err.fields : { form: err instanceof Error ? err.message : "Couldn't change it." });
    } finally {
      setSaving(false);
    }
  }

  const field = (name: keyof typeof form, label: string) => (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input type="password" autoComplete={name === "current_password" ? "current-password" : "new-password"} className={input} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
      {errors[name] && <span className="block text-xs text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <ConsolePage width="narrow">
      <PageHeader title="Account" description={me.is_owner ? `Franchise owner · ${me.franchise.name}` : `Staff · ${me.franchise.name}`} />
      <Panel title="Your details">
        <dl className="divide-y divide-border px-5 text-sm">
          <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{me.user.name}</dd></div>
          <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{me.user.email}</dd></div>
          <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Mobile</dt><dd className="font-medium">{me.user.mobile || "—"}</dd></div>
        </dl>
        <p className="px-5 pb-4 text-xs text-muted-foreground">{me.is_owner ? "To change these, contact the Digicardo administrator." : "To change these, ask your franchise owner."}</p>
      </Panel>
      <Panel title="Change password">
        <form onSubmit={submit} className="space-y-4 p-5">
          {field("current_password", "Current password")}
          {field("password", "New password")}
          {field("password_confirmation", "New password again")}
          {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
          {done && <p className="text-sm text-[#1E7B43]">{done}</p>}
          <button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Change password
          </button>
        </form>
      </Panel>
    </ConsolePage>
  );
}
