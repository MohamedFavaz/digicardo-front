"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, ExternalLink, Loader2, PencilLine, PlusCircle, Search, Trash2 } from "lucide-react";
import { ButtonLink, ConsolePage, DataTable, EmptyState, PageHeader, Panel, StatusPill } from "@/components/console/ui";
import { FilterTabs, Pager } from "@/components/console/Pager";
import { useFranchise } from "@/components/franchise/FranchiseContext";
import { ExpiryLabel } from "@/components/partner/CardExpiry";
import { franchiseApi, franchiseImpersonate, rupees, shortDate, type FranchiseCard, type StaffSummary } from "@/lib/franchise/api";

type StatusFilter = "all" | "active" | "inactive";

function CardsList() {
  const me = useFranchise();
  const router = useRouter();
  const params = useSearchParams();
  const createdBy = params.get("created_by") ?? "";

  const [cards, setCards] = useState<FranchiseCard[]>([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [staff, setStaff] = useState<StaffSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Owner only: deletes the card, its public page and the customer's login.
  async function remove(c: FranchiseCard) {
    if (!confirm(`Delete "${c.card_name}"?

The card link stops working and the customer can no longer sign in. This cannot be undone.`)) return;
    setDeleting(c.id);
    try {
      await franchiseApi(`franchise/cards/${c.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't delete the card.");
    } finally {
      setDeleting(null);
    }
  }

  useEffect(() => {
    if (me.is_owner) franchiseApi<StaffSummary[]>("franchise/staff").then((r) => setStaff(r.data)).catch(() => {});
  }, [me.is_owner]);

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), per_page: "15" });
    if (status !== "all") qs.set("status", status);
    if (query) qs.set("search", query);
    if (createdBy) qs.set("created_by", createdBy);
    franchiseApi<FranchiseCard[]>(`franchise/cards?${qs}`)
      .then((r) => {
        setCards(r.data);
        setMeta({ current_page: r.meta?.current_page ?? 1, last_page: r.meta?.last_page ?? 1, total: r.meta?.total ?? 0 });
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, status, query, createdBy]);

  useEffect(load, [load]);

  async function openStudio(id: string) {
    setOpening(id);
    try {
      await franchiseImpersonate(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't open the card.");
      setOpening(null);
    }
  }

  function pickStaff(id: string) {
    setPage(1);
    router.replace(id ? `/franchise/cards?created_by=${id}` : "/franchise/cards");
  }

  const head = me.is_owner
    ? ["Card", "Made by", "Customer paid", "Staff commission", "Date", "Expires", "Status", ""]
    : ["Card", "Customer paid", "My commission", "Date", "Expires", "Status", ""];

  return (
    <ConsolePage>
      <PageHeader
        title={me.is_owner ? "All cards" : "My cards"}
        description={me.is_owner ? "Every card your franchise has made, and who made it." : "Cards you have made. Only you and your franchise owner can see them."}
        actions={
          <ButtonLink href="/franchise/cards/create" icon={PlusCircle}>
            New card
          </ButtonLink>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs<StatusFilter>
          label="Card status"
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={[
            { id: "all", label: "All" },
            { id: "active", label: "Live" },
            { id: "inactive", label: "Hidden" },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          {me.is_owner && (
            <select
              aria-label="Made by"
              value={createdBy}
              onChange={(e) => pickStaff(e.target.value)}
              className="h-10 rounded-full border border-border bg-white px-4 text-sm"
            >
              <option value="">Everyone</option>
              <option value={me.user.id}>Me (owner)</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(search.trim());
            }}
            className="relative"
          >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone"
              aria-label="Search cards"
              className="h-10 w-full rounded-full border border-border bg-white pl-10 pr-4 text-sm sm:w-64"
            />
          </form>
        </div>
      </div>

      {error && <p className="rounded-xl bg-[#FDECEC] px-4 py-3 text-sm text-destructive">{error}</p>}

      <Panel>
        {loading && cards.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
          </div>
        ) : cards.length === 0 ? (
          <EmptyState icon={CreditCard} title="No cards found" text={query || createdBy || status !== "all" ? "Try a different filter." : "Make your first card for a customer."} />
        ) : (
          <DataTable head={head}>
            {cards.map((c) => (
              <tr key={c.id} className="align-middle">
                <td className="px-5 py-3">
                  <Link href={`/franchise/cards/${c.id}`} className="font-medium text-foreground hover:underline">
                    {c.card_name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{c.customer_name}{c.profile?.username ? ` · /${c.profile.username}` : ""}</p>
                </td>
                {me.is_owner && <td className="px-5 py-3 text-muted-foreground">{c.created_by ? (c.created_by.id === me.user.id ? "You" : c.created_by.name) : "—"}</td>}
                <td className="px-5 py-3">{c.sale_amount != null ? rupees(c.sale_amount) : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-5 py-3">{rupees(c.staff_commission)}</td>
                <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{shortDate(c.created_at)}</td>
                <td className="px-5 py-3">
                  <ExpiryLabel expiresAt={c.customer_user?.expires_at} plan={c.customer_user?.validity_label} />
                </td>
                <td className="px-5 py-3">
                  <StatusPill tone={c.status === "active" ? "success" : "neutral"}>{c.status === "active" ? "Live" : "Hidden"}</StatusPill>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openStudio(c.id)}
                      disabled={opening !== null}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                    >
                      {opening === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PencilLine className="h-3.5 w-3.5" />}
                      Edit design
                    </button>
                    {me.is_owner && (
                      <button
                        type="button"
                        onClick={() => void remove(c)}
                        disabled={deleting !== null}
                        aria-label={`Delete ${c.card_name}`}
                        title="Delete card"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-[#FDECEC] disabled:opacity-50"
                      >
                        {deleting === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    {c.public_url && (
                      <a href={c.public_url} target="_blank" rel="noopener noreferrer" aria-label="Open live card" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>

      <Pager page={meta.current_page} lastPage={meta.last_page} total={meta.total} onPage={setPage} />
    </ConsolePage>
  );
}

export default function FranchiseCardsPage() {
  return (
    <Suspense>
      <CardsList />
    </Suspense>
  );
}
