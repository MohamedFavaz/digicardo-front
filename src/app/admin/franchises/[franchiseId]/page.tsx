"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Gauge, IndianRupee, Loader2, Save, Trash2, Users } from "lucide-react";
import { ConsolePage, DataTable, EmptyState, PageHeader, Panel, StatCard, StatusPill } from "@/components/console/ui";
import { OpenPanelButton } from "@/components/admin/OpenPanelButton";
import { FranchisePricing, franchisePaysLabel, type FranchisePayMode } from "@/components/admin/FranchisePricing";
import { AgentSitePanel } from "@/components/admin/AgentSitePanel";
import { FranchiseApiError, commissionLabel, franchiseApi, rupees, shortDate, type StaffSummary } from "@/lib/franchise/api";

interface Detail {
  franchise: {
    id: string;
    name: string;
    email: string;
    mobile?: string | null;
    status: string;
    created_at: string;
    agent_quota?: { card_limit: number; cards_used: number } | null;
    commission_config?: { card_price: string | number; franchise_fee?: string | number | null } | null;
  };
  performance: { total_cards: number; active_cards: number; total_revenue: number };
  staff: StaffSummary[];
}

const input = "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#343C22]/20";

export default function AdminFranchisePage() {
  const { franchiseId } = useParams<{ franchiseId: string }>();
  const router = useRouter();
  const [data, setData] = useState<Detail | null>(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", card_limit: "", card_price: "", franchise_fee: "" });
  const [payMode, setPayMode] = useState<FranchisePayMode>("fee");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    franchiseApi<Detail>(`admin/franchises/${franchiseId}`)
      .then((r) => {
        setData(r.data);
        const f = r.data.franchise;
        setForm({
          name: f.name,
          email: f.email,
          mobile: f.mobile ?? "",
          password: "",
          card_limit: String(f.agent_quota?.card_limit ?? 0),
          card_price: f.commission_config ? String(Number(f.commission_config.card_price)) : "",
          franchise_fee: f.commission_config?.franchise_fee != null ? String(Number(f.commission_config.franchise_fee)) : "",
        });
        setPayMode(f.commission_config?.franchise_fee != null ? "fee" : "per_card");
      })
      .catch((e) => setErrors({ form: e.message }));
  }, [franchiseId]);
  useEffect(load, [load]);

  async function save(body: Record<string, unknown>, label: string) {
    setBusy(label);
    setErrors({});
    setNote("");
    try {
      await franchiseApi(`admin/franchises/${franchiseId}`, { method: "PUT", body });
      setNote("Saved.");
      load();
    } catch (err) {
      setErrors(err instanceof FranchiseApiError && Object.keys(err.fields).length ? err.fields : { form: err instanceof Error ? err.message : "Couldn't save." });
    } finally {
      setBusy("");
    }
  }

  if (!data) {
    return <ConsolePage>{errors.form ? <p className="text-sm text-destructive">{errors.form}</p> : <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />}</ConsolePage>;
  }

  const f = data.franchise;
  const active = f.status === "active";
  const field = (name: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input {...props} className={input} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
      {errors[name] && <span className="block text-xs text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <ConsolePage>
      <PageHeader
        back={{ href: "/admin/franchises", label: "Franchises" }}
        title={f.name}
        meta={<StatusPill tone={active ? "success" : "danger"}>{active ? "Active" : "Suspended"}</StatusPill>}
        description={`${f.email} · since ${shortDate(f.created_at)}`}
        actions={
          <>
            <OpenPanelButton userId={f.id} label="Impersonate" disabled={!active} />
            <button
              type="button"
              disabled={!!busy}
              onClick={() => {
                if (active && !confirm(`Suspend ${f.name}? The owner and all their staff will be signed out of the franchise panel.`)) return;
                save({ status: active ? "suspended" : "active" }, "status");
              }}
              className="inline-flex h-10 items-center rounded-full border border-border bg-white px-4 text-sm font-medium hover:bg-muted disabled:opacity-60"
            >
              {active ? "Suspend" : "Turn on"}
            </button>
            <button
              type="button"
              disabled={!!busy}
              onClick={async () => {
                if (!confirm(`Delete ${f.name}? Their staff logins are removed and their cards are deleted.`)) return;
                setBusy("delete");
                try {
                  await franchiseApi(`admin/franchises/${franchiseId}`, { method: "DELETE" });
                  router.push("/admin/franchises");
                } catch (e) {
                  setErrors({ form: e instanceof Error ? e.message : "Couldn't delete." });
                  setBusy("");
                }
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-destructive hover:bg-[#FDECEC] disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </>
        }
      />

      {errors.form && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{errors.form}</p>}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Cards made" icon={CreditCard} value={data.performance.total_cards} hint={`${data.performance.active_cards} live`} />
        <StatCard label="Credits used" icon={Gauge} value={`${f.agent_quota?.cards_used ?? 0} / ${f.agent_quota?.card_limit ?? 0}`} />
        <StatCard label="Staff" icon={Users} value={data.staff.length} />
        <StatCard label="Billed to franchise" icon={IndianRupee} value={rupees(data.performance.total_revenue)} hint={franchisePaysLabel(f.commission_config)} />
      </div>

      <Panel title="Staff" description="Added and managed by the franchise owner.">
        {data.staff.length === 0 ? (
          <EmptyState icon={Users} title="No staff yet" text="The owner adds staff from their franchise panel." />
        ) : (
          <DataTable head={["Staff", "Commission rule", "Cards", "Earned", "Paid", "Status", ""]}>
            {data.staff.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3">
                  <span className="font-medium">{s.name}</span>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{commissionLabel(s.commission_type, s.commission_value)}</td>
                <td className="px-5 py-3">{s.cards}</td>
                <td className="px-5 py-3">{rupees(s.earned)}</td>
                <td className="px-5 py-3">{rupees(s.paid)}</td>
                <td className="px-5 py-3">
                  <StatusPill tone={s.status === "active" ? "success" : "danger"}>{s.status === "active" ? "Active" : "Suspended"}</StatusPill>
                </td>
                <td className="px-5 py-3 text-right">
                  <OpenPanelButton userId={s.id} label="Impersonate" small disabled={!active || s.status !== "active"} />
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>

      <Panel title="Franchise settings">
        <form
          className="grid gap-4 p-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const body: Record<string, unknown> = {
              name: form.name,
              email: form.email,
              mobile: form.mobile || null,
              card_limit: Number(form.card_limit || 0),
            };
            if (payMode === "fee") {
              body.franchise_fee = Number(form.franchise_fee || 0);
              body.agent_commission = 0;
            } else {
              body.franchise_fee = null;
              body.card_price = Number(form.card_price || 0);
              body.agent_commission = 0;
            }
            if (form.password) body.password = form.password;
            save(body, "settings");
          }}
        >
          {field("name", "Name")}
          {field("email", "Owner email (login)", { type: "email" })}
          {field("mobile", "Mobile", { type: "tel" })}
          {field("password", "New password (optional)", { type: "text", autoComplete: "new-password" })}
          {field("card_limit", "Card credits", { type: "number", min: 0 })}
          <FranchisePricing
            mode={payMode}
            fee={form.franchise_fee}
            price={form.card_price}
            onMode={setPayMode}
            onFee={(v) => setForm({ ...form, franchise_fee: v })}
            onPrice={(v) => setForm({ ...form, card_price: v })}
            errors={errors}
          />
          <div className="flex items-center gap-3 sm:col-span-2">
            <button type="submit" disabled={!!busy} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60">
              {busy === "settings" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
            {note && <span className="text-sm text-[#1E7B43]">{note}</span>}
          </div>
        </form>
      </Panel>
      <AgentSitePanel agentId={f.id} />
    </ConsolePage>
  );
}
