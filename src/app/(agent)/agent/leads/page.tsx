"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ChevronLeft, ChevronRight, Inbox, LayoutTemplate, Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { ButtonLink, ConsolePage, EmptyState, PageHeader, StatusPill } from "@/components/console/ui";
import { agentSiteApi, type AgentLead } from "@/lib/api/agent-site";
import { whatsappLink } from "@/lib/partner/types";
import { cn } from "@/lib/utils";

function when(iso: string) {
  const d = new Date(iso);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} h ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Agent: enquiries from the landing page's "Get your card" form. */
export default function AgentLeadsPage() {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<Awaited<ReturnType<typeof agentSiteApi.leads>> | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    agentSiteApi
      .leads(page)
      .then((d) => {
        setData(d);
        setError(null);
        window.dispatchEvent(new CustomEvent("agent-leads-changed", { detail: { unread: d.unread } }));
      })
      .catch((e: Error) => setError(e.message));
  }, [page]);

  React.useEffect(() => load(), [load]);

  const openLead = async (lead: AgentLead) => {
    setOpen(open === lead.id ? null : lead.id);
    if (!lead.is_read) {
      await agentSiteApi.markLeadRead(lead.id).catch(() => {});
      load();
    }
  };

  const remove = async (lead: AgentLead) => {
    if (!confirm(`Delete the enquiry from ${lead.name}?`)) return;
    await agentSiteApi.deleteLead(lead.id).catch(() => {});
    load();
  };

  return (
    <ConsolePage width="narrow">
      <PageHeader
        title="Leads"
        meta={data && data.unread > 0 ? <StatusPill tone="primary">{data.unread} new</StatusPill> : undefined}
        description="People who asked for a card on your landing page."
        actions={<ButtonLink href="/agent/site" variant="secondary" icon={LayoutTemplate}>Landing page</ButtonLink>}
      />
      {error && (
        <p className="flex items-center gap-2 rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">
          <AlertCircle className="h-4 w-4" aria-hidden="true" /> {error}
        </p>
      )}
      {!data ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]">
          <EmptyState
            icon={Inbox}
            title="No enquiries yet"
            text={
              <>
                When someone fills in the form on your landing page, it appears here and you get a notification.{" "}
                <Link href="/agent/site" className="font-medium text-[#343C22] underline-offset-4 hover:underline">
                  Edit your page
                </Link>
              </>
            }
          />
        </div>
      ) : (
        <ul className="space-y-2">
          {data.items.map((l) => {
            const wa = l.phone ? whatsappLink(l.phone, `Hi ${l.name}, thanks for your enquiry about a digital card!`) : null;
            const isOpen = open === l.id;
            return (
              <li key={l.id} className={cn("overflow-hidden rounded-[22px] border bg-[#FBFBF8]", l.is_read ? "border-[#E9E9E2]" : "border-[#B0C08F] ring-1 ring-[#DDE5CB]")}>
                <button type="button" onClick={() => void openLead(l)} aria-expanded={isOpen} className="flex w-full items-center gap-3 p-4 text-left">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DDE5CB] text-sm font-semibold text-[#343C22]">{l.name.slice(0, 1).toUpperCase()}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-medium text-[#121212]">{l.name}</span>
                      {!l.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#4B5634]" aria-label="New" />}
                    </span>
                    <span className="block truncate text-[13px] text-[#9A9C8F]">{[l.package, l.phone, l.email].filter(Boolean).join(" · ")}</span>
                  </span>
                  <span className="shrink-0 text-xs text-[#9A9C8F]">{when(l.created_at)}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-[#E9E9E2] px-4 pb-4 pt-3">
                    {l.message && <p className="whitespace-pre-line text-sm text-[#5E6054]">{l.message}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {wa && (
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#25D366] px-4 text-sm font-medium text-white">
                          <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                        </a>
                      )}
                      {l.phone && (
                        <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-input bg-card px-4 text-sm font-medium">
                          <Phone className="h-4 w-4" aria-hidden="true" /> Call
                        </a>
                      )}
                      {l.email && (
                        <a href={`mailto:${l.email}`} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-input bg-card px-4 text-sm font-medium">
                          <Mail className="h-4 w-4" aria-hidden="true" /> Email
                        </a>
                      )}
                      <button type="button" onClick={() => void remove(l)} className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-[#5E6054] hover:bg-[#FDECEC] hover:text-destructive">
                        <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                      </button>
                    </div>
                    {l.source_host && <p className="mt-2 text-xs text-[#9A9C8F]">Sent from {l.source_host}</p>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {data && data.pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-foreground">
            Page {data.pagination.current_page} of {data.pagination.last_page}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="inline-flex h-9 items-center gap-1 rounded-full border border-input bg-card px-3 text-[13px] disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
            </button>
            <button type="button" disabled={page >= data.pagination.last_page} onClick={() => setPage(page + 1)} className="inline-flex h-9 items-center gap-1 rounded-full border border-input bg-card px-3 text-[13px] disabled:opacity-40">
              Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </ConsolePage>
  );
}
