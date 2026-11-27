"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Loader2, Plus, Search, X } from "lucide-react";
import { ConsolePage, DataTable, EmptyState, PageHeader, Panel, StatusPill } from "@/components/console/ui";
import { Pager } from "@/components/console/Pager";
import { OpenPanelButton } from "@/components/admin/OpenPanelButton";
import { createFranchiseSchema } from "@/lib/zod/franchise";
import { FranchiseApiError, franchiseApi, rupees, shortDate } from "@/lib/franchise/api";

interface FranchiseRow {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  status: string;
  created_at: string;
  staff_count: number;
  cards_count: number;
  agent_quota?: { card_limit: number; cards_used: number } | null;
  commission_config?: { card_price: string | number } | null;
}

const input = "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#343C22]/20";
const EMPTY = { name: "", email: "", mobile: "", password: "", card_limit: "50", card_price: "" };

export default function AdminFranchisesPage() {
  const [rows, setRows] = useState<FranchiseRow[] | null>(null);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    const qs = new URLSearchParams({ page: String(page) });
    if (query) qs.set("search", query);
    franchiseApi<FranchiseRow[]>(`admin/franchises?${qs}`).then((r) => {
      setRows(r.data);
      setMeta({ current_page: r.meta?.current_page ?? 1, last_page: r.meta?.last_page ?? 1, total: r.meta?.total ?? 0 });
    });
  }, [page, query]);
  useEffect(load, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));
    const parsed = createFranchiseSchema.safeParse(clean);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      await franchiseApi("admin/franchises", { method: "POST", body: { ...parsed.data, agent_commission: 0 } });
      setCreating(false);
      setForm(EMPTY);
      load();
    } catch (err) {
      setErrors(err instanceof FranchiseApiError && Object.keys(err.fields).length ? err.fields : { form: err instanceof Error ? err.message : "Couldn't create." });
    } finally {
      setSaving(false);
    }
  }

  const field = (name: keyof typeof EMPTY, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input {...props} className={input} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
      {errors[name] ? <span className="block text-xs text-destructive">{errors[name]}</span> : hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );

  return (
    <ConsolePage>
      <PageHeader
        title="Franchises"
        description="Franchise owners sign in at /franchise-login, add their own staff and decide each person's commission."
        actions={
          <button type="button" onClick={() => { setErrors({}); setCreating(true); }} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634]">
            <Plus className="h-4 w-4" /> New franchise
          </button>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setQuery(search.trim());
        }}
        className="relative max-w-sm"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, mobile" aria-label="Search franchises" className="h-10 w-full rounded-full border border-border bg-white pl-10 pr-4 text-sm" />
      </form>

      <Panel>
        {!rows ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState icon={Building2} title={query ? "No franchises found" : "No franchises yet"} text="Create a franchise to give a partner their own panel with staff logins." />
        ) : (
          <DataTable head={["Franchise", "Staff", "Cards", "Card credits", "Price per card", "Since", "Status", ""]}>
            {rows.map((f) => (
              <tr key={f.id}>
                <td className="px-5 py-3">
                  <Link href={`/admin/franchises/${f.id}`} className="font-medium text-foreground hover:underline">
                    {f.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{f.email}{f.mobile ? ` · ${f.mobile}` : ""}</p>
                </td>
                <td className="px-5 py-3">{f.staff_count}</td>
                <td className="px-5 py-3">{f.cards_count}</td>
                <td className="whitespace-nowrap px-5 py-3">{f.agent_quota ? `${f.agent_quota.cards_used} / ${f.agent_quota.card_limit}` : "—"}</td>
                <td className="px-5 py-3">{f.commission_config ? rupees(f.commission_config.card_price) : "—"}</td>
                <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{shortDate(f.created_at)}</td>
                <td className="px-5 py-3">
                  <StatusPill tone={f.status === "active" ? "success" : "danger"}>{f.status === "active" ? "Active" : "Suspended"}</StatusPill>
                </td>
                <td className="px-5 py-3 text-right">
                  <OpenPanelButton userId={f.id} label="Impersonate" small disabled={f.status !== "active"} />
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>
      <Pager page={meta.current_page} lastPage={meta.last_page} total={meta.total} onPage={setPage} />

      {creating && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="New franchise" onClick={() => setCreating(false)}>
          <form onSubmit={create} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full space-y-4 overflow-y-auto rounded-t-3xl bg-[#FBFBF8] p-5 shadow-xl sm:max-w-lg sm:rounded-3xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-normal">New franchise</h2>
              <button type="button" onClick={() => setCreating(false)} aria-label="Close" className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            {field("name", "Franchise / owner name", { autoComplete: "off" })}
            <div className="grid gap-4 sm:grid-cols-2">
              {field("email", "Owner email (login)", { type: "email", autoComplete: "off" })}
              {field("mobile", "Mobile (optional)", { type: "tel" })}
            </div>
            {field("password", "Password", { type: "text", autoComplete: "new-password" }, "At least 8 characters. Share it with the owner.")}
            <div className="grid gap-4 sm:grid-cols-2">
              {field("card_limit", "Card credits", { type: "number", min: 1 }, "How many cards the franchise can make.")}
              {field("card_price", "Price per card (₹)", { type: "number", min: 0 }, "What the franchise pays you per card.")}
            </div>
            {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setCreating(false)} className="h-10 rounded-full px-4 text-sm font-medium hover:bg-muted">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Create franchise
              </button>
            </div>
          </form>
        </div>
      )}
    </ConsolePage>
  );
}
