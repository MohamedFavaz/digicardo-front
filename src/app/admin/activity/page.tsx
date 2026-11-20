"use client";

import * as React from "react";
import { History } from "lucide-react";
import { ConsolePage, EmptyState, PageHeader } from "@/components/console/ui";
import { FilterTabs, Pager } from "@/components/console/Pager";
import { adminCall, formatDate, humanize, timeAgo, type Paged } from "@/lib/api/admin-console";

interface LogRow {
  id: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  actor?: { name: string; email: string; role: string } | null;
}

/** Plain-language descriptions for known admin actions. */
const ACTIONS: Record<string, string> = {
  "user.impersonated": "Opened a customer's account",
  "user.created_by_admin": "Created a user",
  "broadcast.sent": "Sent a message",
  "broadcast.retracted": "Unsent a message",
  "agent_domain.set": "Set an agent domain",
  "agent_domain.checked": "Checked an agent domain",
  "agent_domain.activated": "Activated an agent domain",
  "agent_domain.removed": "Removed an agent domain",
  "agent_landing.disabled": "Turned off an agent's landing page",
  "agent_landing.enabled": "Turned on an agent's landing page",
};

function detail(row: LogRow): string {
  const m = row.metadata ?? {};
  const bits = [m.target_name, m.target_email, m.target_username ? `/${m.target_username}` : null, m.domain, m.audience ? `to ${humanize(String(m.audience))}` : null, typeof m.recipient_count === "number" ? `${m.recipient_count} recipients` : null, m.status ? `status: ${m.status}` : null]
    .filter(Boolean)
    .map(String);
  return bits.join(" · ");
}

type Filter = "" | "user" | "agent_site" | "broadcast_message" | "profile";

/** Admin: who did what, and when. */
export default function AdminActivityPage() {
  const [type, setType] = React.useState<Filter>("");
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<Paged<LogRow> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const q = new URLSearchParams({ page: String(page), per_page: "25", ...(type ? { target_type: type } : {}) });
    adminCall<Paged<LogRow>>(`/audit-logs?${q}`)
      .then((d) => (setData(d), setError(null)))
      .catch((e: Error) => setError(e.message));
  }, [page, type]);

  return (
    <ConsolePage width="narrow">
      <PageHeader title="Activity log" description="Every admin action is recorded here: who did it, what changed and when." />
      <FilterTabs
        label="Kind of action"
        value={type}
        onChange={(v) => {
          setType(v);
          setPage(1);
        }}
        options={[
          { id: "", label: "All" },
          { id: "user", label: "Users" },
          { id: "agent_site", label: "Agent sites" },
          { id: "broadcast_message", label: "Messages" },
          { id: "profile", label: "Cards" },
        ]}
      />
      {error && <p className="rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">{error}</p>}
      <section className="overflow-hidden rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]">
        {!data ? (
          <div className="space-y-3 p-5" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState icon={History} title="Nothing recorded yet" />
        ) : (
          <ol className="relative mx-5 my-4 space-y-4 border-l border-border pl-5">
            {data.items.map((row) => (
              <li key={row.id} className="relative">
                <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#4B5634] ring-4 ring-[#FBFBF8]" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">{ACTIONS[row.action] ?? humanize(row.action)}</p>
                {detail(row) && <p className="text-[13px] text-muted-foreground">{detail(row)}</p>}
                <p className="mt-0.5 text-xs text-muted-foreground" title={formatDate(row.created_at, true)}>
                  {row.actor?.name ?? "System"} · {timeAgo(row.created_at)}
                </p>
              </li>
            ))}
          </ol>
        )}
        {data && <Pager page={data.pagination.current_page} lastPage={data.pagination.last_page} total={data.pagination.total} onPage={setPage} />}
      </section>
    </ConsolePage>
  );
}
