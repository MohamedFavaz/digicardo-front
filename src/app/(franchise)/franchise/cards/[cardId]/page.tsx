"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, ExternalLink, Eye, EyeOff, Loader2, PencilLine, RefreshCw, Save, Trash2 } from "lucide-react";
import { ConsolePage, PageHeader, Panel, StatusPill } from "@/components/console/ui";
import { ChangeUsernameDialog } from "@/components/shared/ChangeUsernameDialog";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { ExpiryLabel } from "@/components/partner/CardExpiry";
import { usernameApi } from "@/lib/api/username";
import { franchiseApi, franchiseImpersonate, rupees, shortDate, type FranchiseCard, type StaffSummary } from "@/lib/franchise/api";

const input = "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#343C22]/20";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground sm:text-right">{children}</span>
    </div>
  );
}

export default function FranchiseCardPage() {
  const me = useFranchise();
  const router = useRouter();
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<FranchiseCard | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [money, setMoney] = useState({ sale_amount: "", staff_commission: "", taken_by_id: "" });
  const [staff, setStaff] = useState<StaffSummary[]>([]);
  // Renew with one of the admin's plans.
  const [plans, setPlans] = useState<{ id: string; name: string; months: number; price: number; currency_symbol: string }[]>([]);
  const [renewPlan, setRenewPlan] = useState("");
  const [renewed, setRenewed] = useState("");

  useEffect(() => {
    franchiseApi<{ id: string; name: string; months: number; price: number; currency_symbol: string }[]>("franchise/cards/plans")
      .then((r) => {
        setPlans(r.data);
        setRenewPlan((r.data as { id: string; months: number; is_default?: boolean }[]).find((p) => p.is_default)?.id ?? r.data.find((p) => p.months === 12)?.id ?? r.data[0]?.id ?? "");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (me.is_owner) franchiseApi<StaffSummary[]>("franchise/staff").then((r) => setStaff(r.data)).catch(() => {});
  }, [me.is_owner]);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    franchiseApi<FranchiseCard>(`franchise/cards/${cardId}`)
      .then((r) => {
        setCard(r.data);
        setMoney({
          sale_amount: r.data.sale_amount != null ? String(Number(r.data.sale_amount)) : "",
          staff_commission: String(Number(r.data.staff_commission ?? 0)),
          taken_by_id: r.data.created_by_id ?? "",
        });
      })
      .catch((e) => setError(e.message));
  }, [cardId]);

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy("");
    }
  }

  if (!card) {
    return (
      <ConsolePage width="narrow">
        {error ? <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p> : <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />}
      </ConsolePage>
    );
  }

  const live = card.status === "active";
  const madeBy = card.created_by ? (card.created_by.id === me.user.id ? "You" : card.created_by.name) : "—";

  return (
    <ConsolePage width="narrow">
      <PageHeader
        back={{ href: "/franchise/cards", label: "Cards" }}
        title={card.card_name}
        meta={<StatusPill tone={live ? "success" : "neutral"}>{live ? "Live" : "Hidden"}</StatusPill>}
        description={card.public_url?.replace(/^https?:\/\//, "")}
        actions={
          <>
            <button
              type="button"
              onClick={() => run("studio", () => franchiseImpersonate(card.id))}
              disabled={!!busy}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60"
            >
              {busy === "studio" ? <Loader2 className="h-4 w-4 animate-spin" /> : <PencilLine className="h-4 w-4" />}
              Edit design
            </button>
            {card.public_url && (
              <a href={card.public_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm font-medium shadow-[0_6px_16px_-12px_rgba(52,60,34,0.6)] hover:bg-white">
                <ExternalLink className="h-4 w-4" /> Open
              </a>
            )}
          </>
        }
      />

      {error && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p>}

      <Panel title="Card">
        <div className="divide-y divide-border px-5">
          <Row label="Customer">{card.customer_name}</Row>
          <Row label="Email">{card.customer_email || "—"}</Row>
          <Row label="Phone">{card.customer_phone || "—"}</Row>
          <Row label="Card address">
            <span className="inline-flex items-center gap-2">
              /{card.profile?.username}
              {card.profile && (
                <button type="button" onClick={() => setRenaming(true)} className="text-xs font-medium text-primary hover:underline">
                  Change
                </button>
              )}
              {card.public_url && (
                <button type="button" aria-label="Copy link" onClick={() => navigator.clipboard?.writeText(card.public_url!)} className="text-muted-foreground hover:text-foreground">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          </Row>
          <Row label="Made by">{madeBy}</Row>
          <Row label="Made on">{shortDate(card.created_at)}</Row>
          <Row label="Plan / expiry">
            <ExpiryLabel expiresAt={card.customer_user?.expires_at} plan={card.customer_user?.validity_label} className="sm:items-end" />
          </Row>
          {card.notes && <Row label="Notes">{card.notes}</Row>}
        </div>
      </Panel>

      <Panel title="Money" description={me.is_owner ? "You can correct these. Changing a commission here affects this card only." : undefined}>
        {me.is_owner ? (
          <form
            className="grid gap-4 p-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              run("money", async () => {
                const reassigned = money.taken_by_id && money.taken_by_id !== card.created_by_id;
                const r = await franchiseApi<FranchiseCard>(`franchise/cards/${card.id}`, {
                  method: "PUT",
                  body: {
                    sale_amount: money.sale_amount === "" ? null : Number(money.sale_amount),
                    // A new order taker gets their own commission worked out by the server.
                    ...(reassigned ? { taken_by_id: money.taken_by_id } : { staff_commission: Number(money.staff_commission || 0) }),
                  },
                });
                setCard({ ...card, ...r.data });
                setMoney((m) => ({ ...m, staff_commission: String(Number(r.data.staff_commission ?? 0)), taken_by_id: r.data.created_by_id ?? m.taken_by_id }));
                setSaved("Saved");
                setTimeout(() => setSaved(""), 2000);
              });
            }}
          >
            <label className="space-y-1.5 text-sm sm:col-span-2">
              <span className="text-muted-foreground">Order taken by</span>
              <select className={input} value={money.taken_by_id} onChange={(e) => setMoney({ ...money, taken_by_id: e.target.value })}>
                <option value={me.user.id}>Me (owner)</option>
                {staff
                  .filter((s) => s.status === "active" || s.id === card.created_by_id)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
              {money.taken_by_id !== (card.created_by_id ?? "") && (
                <span className="block text-xs text-muted-foreground">Their commission for this card is worked out again when you save.</span>
              )}
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="text-muted-foreground">Customer paid (₹)</span>
              <input type="number" min={0} step="0.01" inputMode="decimal" className={input} value={money.sale_amount} onChange={(e) => setMoney({ ...money, sale_amount: e.target.value })} />
            </label>
            <label className="space-y-1.5 text-sm">
              <span className="text-muted-foreground">Staff commission (₹)</span>
              <input type="number" min={0} step="0.01" inputMode="decimal" className={input} value={money.staff_commission} onChange={(e) => setMoney({ ...money, staff_commission: e.target.value })} />
            </label>
            <div className="flex items-center gap-3 sm:col-span-2">
              <button type="submit" disabled={!!busy} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60">
                {busy === "money" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
              {saved && <span className="text-sm text-[#1E7B43]">{saved}</span>}
            </div>
          </form>
        ) : (
          <div className="divide-y divide-border px-5">
            {card.sale_amount != null ? (
              <Row label="Customer paid">{rupees(card.sale_amount)}</Row>
            ) : (
              // Left empty when the card was made: staff add it once (the owner can correct it later).
              <form
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!(Number(money.sale_amount) > 0)) return setError("Enter the amount the customer paid.");
                  run("money", async () => {
                    const r = await franchiseApi<FranchiseCard>(`franchise/cards/${card.id}`, { method: "PUT", body: { sale_amount: Number(money.sale_amount) } });
                    setCard({ ...card, ...r.data });
                  });
                }}
              >
                <label className="flex-1 space-y-1.5 text-sm">
                  <span className="text-muted-foreground">Amount collected from the customer (₹) — not added yet</span>
                  <input type="number" min={1} step="0.01" inputMode="decimal" className={input} value={money.sale_amount} onChange={(e) => setMoney({ ...money, sale_amount: e.target.value })} placeholder="799" />
                </label>
                <button type="submit" disabled={!!busy} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60">
                  {busy === "money" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save amount
                </button>
              </form>
            )}
            <Row label="My commission">{rupees(card.staff_commission)}</Row>
          </div>
        )}
      </Panel>

      <Panel title="Renew" description="Extend this card with a plan. An expired card goes live again straight away.">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
          <label className="flex-1 space-y-1.5 text-sm">
            <span className="text-muted-foreground">Plan</span>
            <select className={input} value={renewPlan} onChange={(e) => setRenewPlan(e.target.value)}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.currency_symbol}
                  {Number(p.price).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
            <span className="block text-xs text-muted-foreground">
              {(() => {
                const plan = plans.find((p) => p.id === renewPlan);
                if (!plan) return null;
                const cur = card.customer_user?.expires_at ? new Date(card.customer_user.expires_at) : null;
                const base = cur && cur.getTime() > Date.now() ? new Date(cur) : new Date();
                base.setMonth(base.getMonth() + plan.months);
                return `New expiry: ${base.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
              })()}
            </span>
          </label>
          <button
            type="button"
            disabled={!!busy || !renewPlan}
            onClick={() =>
              run("renew", async () => {
                const plan = plans.find((p) => p.id === renewPlan);
                if (!confirm(`Renew "${card.card_name}" with the ${plan?.name ?? ""} plan?`)) return;
                const r = await franchiseApi<FranchiseCard>(`franchise/cards/${card.id}/renew`, { method: "POST", body: { validity_plan_id: renewPlan } });
                setCard({ ...card, ...r.data });
                setRenewed("Renewed.");
                setTimeout(() => setRenewed(""), 3000);
              })
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#343C22] px-5 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-60"
          >
            {busy === "renew" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Renew
          </button>
        </div>
        {renewed && <p className="px-5 pb-4 text-sm text-[#1E7B43]">{renewed}</p>}
      </Panel>

      <Panel title="Visibility">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{live ? "The card is live. Anyone with the link can open it." : "The card is hidden. Its link shows nothing."}</p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!!busy}
              onClick={() =>
                run("status", async () => {
                  const r = await franchiseApi<FranchiseCard>(`franchise/cards/${card.id}/${live ? "unpublish" : "publish"}`, { method: "POST" });
                  setCard({ ...card, status: r.data.status });
                })
              }
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-medium hover:bg-muted disabled:opacity-60"
            >
              {busy === "status" ? <Loader2 className="h-4 w-4 animate-spin" /> : live ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {live ? "Hide card" : "Make live"}
            </button>
            {me.is_owner && (
              <button
                type="button"
                disabled={!!busy}
                onClick={() => {
                  if (!confirm(`Delete "${card.card_name}"?

The card link stops working and the customer can no longer sign in. This cannot be undone.`)) return;
                  run("delete", async () => {
                    await franchiseApi(`franchise/cards/${card.id}`, { method: "DELETE" });
                    router.push("/franchise/cards");
                  });
                }}
                className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-destructive hover:bg-[#FDECEC] disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            )}
          </div>
        </div>
      </Panel>

      {card.profile && (
        <ChangeUsernameDialog
          open={renaming}
          onClose={() => setRenaming(false)}
          currentUsername={card.profile.username}
          profileId={card.profile.id}
          who="this"
          save={(name) => usernameApi.changeForFranchiseCard(card.id, name)}
          onSaved={(name) =>
            setCard((c) =>
              c && c.profile ? { ...c, profile: { ...c.profile, username: name }, public_url: c.public_url?.replace(/[^/]+$/, name) ?? null } : c,
            )
          }
        />
      )}
    </ConsolePage>
  );
}
