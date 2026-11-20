"use client";

import * as React from "react";
import { AlertCircle, Check, CheckCircle2, ExternalLink, Loader2, Mail, Megaphone, Search, Send, X, type LucideIcon } from "lucide-react";
import type { AdminAudiences, Audience, Recipient, SendPayload, SentMessage } from "@/lib/api/broadcasts";
import { cn } from "@/lib/utils";

export interface AudienceOption {
  id: Audience;
  label: string;
  hint: string;
  icon: LucideIcon;
  /** Known head-count (null while loading, undefined when it depends on a choice). */
  count?: number | null;
}

export interface Starter {
  label: string;
  title: string;
  body: string;
}

const TITLE_MAX = 120;
const BODY_MAX = 2000;

const inputCls =
  "w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-[#A1A1AA] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function plural(n: number, one: string, many: string) {
  return `${n.toLocaleString()} ${n === 1 ? one : many}`;
}

function isLinkOk(link: string) {
  const v = link.trim();
  if (!v) return true;
  if (v.startsWith("/") && !v.startsWith("//") && !/\s/.test(v)) return true;
  return /^https?:\/\/[^\s/$.?#][^\s]*$/i.test(v);
}

/** How the message looks in the recipient's notifications. */
export function MessagePreview({ sender, title, body, link }: { sender: string; title: string; body: string; link: string }) {
  return (
    <div className="rounded-2xl border border-border bg-[#F7F7F8] p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">What people will see</p>
      <div className="rounded-2xl border border-[#DCD6FA] bg-card p-4 shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-primary/10">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFECFD] text-primary">
            <Megaphone className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              From <span className="font-semibold text-foreground">{sender}</span> · just now
            </p>
            <p className={cn("mt-1 break-words text-sm font-semibold", title ? "text-foreground" : "text-[#A1A1AA]")}>{title || "Your title"}</p>
            <p className={cn("mt-1 whitespace-pre-line break-words text-sm leading-relaxed", body ? "text-[#52525B]" : "text-[#A1A1AA]")}>
              {body || "Your message appears here."}
            </p>
            {link.trim() && (
              <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white">
                Open <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">It appears under the bell icon and on their Notifications page.</p>
    </div>
  );
}

function RecipientPicker({
  selected,
  onChange,
  search,
  placeholder,
}: {
  selected: Recipient[];
  onChange: (next: Recipient[]) => void;
  search: (q: string) => Promise<Recipient[]>;
  placeholder: string;
}) {
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<Recipient[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const searchRef = React.useRef(search);
  searchRef.current = search;

  React.useEffect(() => {
    let live = true;
    const t = setTimeout(() => {
      searchRef
        .current(q)
        .then((r) => live && (setResults(r), setError(null)))
        .catch((e: Error) => live && (setResults([]), setError(e.message)));
    }, q ? 250 : 0);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [q]);

  const picked = new Set(selected.map((r) => r.id));
  const toggle = (r: Recipient) => onChange(picked.has(r.id) ? selected.filter((s) => s.id !== r.id) : [...selected, r]);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-[#FAFAFA] p-3">
      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Chosen people">
          {selected.map((r) => (
            <li key={r.id} className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#EFECFD] py-1 pl-3 pr-1 text-xs font-medium text-[#3D2AAD]">
              <span className="truncate">{r.name}</span>
              <button type="button" onClick={() => toggle(r)} aria-label={`Remove ${r.name}`} className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-[#DCD6FA]">
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label={placeholder} className={cn(inputCls, "h-10 pl-9")} />
      </div>
      <div className="max-h-60 overflow-y-auto rounded-lg border border-border bg-card">
        {results === null ? (
          <div className="space-y-2 p-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-9 rounded-md" />
            ))}
          </div>
        ) : error ? (
          <p className="p-3 text-sm text-destructive">{error}</p>
        ) : results.length === 0 ? (
          <p className="p-3 text-sm text-muted-foreground">{q ? "Nobody matches that search." : "Nobody to show yet."}</p>
        ) : (
          <ul className="divide-y divide-border">
            {results.map((r) => {
              const on = picked.has(r.id);
              return (
                <li key={r.id}>
                  <button type="button" onClick={() => toggle(r)} aria-pressed={on} className={cn("flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/60", on && "bg-[#F6F4FE]")}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-[#52525B]">{(r.name || "?").slice(0, 1).toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{r.name}</span>
                        {r.role === "agent" && <span className="rounded-full bg-[#FEF3C7] px-1.5 text-[10px] font-semibold text-[#92400E]">Agent</span>}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {r.email}
                        {r.username ? ` · /${r.username}` : ""}
                      </span>
                    </span>
                    <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", on ? "border-primary bg-primary text-white" : "border-input bg-card")}>
                      {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({ summary, emailing, sending, onCancel, onConfirm }: { summary: string; emailing: boolean; sending: boolean; onCancel: () => void; onConfirm: () => void }) {
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !sending && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, sending]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && !sending && onCancel()}>
      <div role="dialog" aria-modal="true" aria-labelledby="send-confirm-title" className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFECFD] text-primary">
          <Send className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 id="send-confirm-title" className="mt-3 text-base font-semibold text-foreground">
          Send this message?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          It goes to <span className="font-semibold text-foreground">{summary}</span> right away{emailing ? ", by notification and email" : ""}. You can unsend it later.
        </p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onCancel} disabled={sending} className="h-10 flex-1 rounded-lg border border-input bg-card text-sm font-semibold hover:bg-muted disabled:opacity-50">
            Cancel
          </button>
          <button ref={confirmRef} type="button" onClick={onConfirm} disabled={sending} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            {sending ? "Sending…" : "Send now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MessageComposer({
  options,
  agents,
  searchRecipients,
  onSend,
  onSent,
  senderLabel,
  starters,
  allowEmail = false,
  pickerPlaceholder = "Search by name, email or card link",
}: {
  options: AudienceOption[];
  agents?: AdminAudiences["agents"];
  searchRecipients: (q: string) => Promise<Recipient[]>;
  onSend: (payload: SendPayload) => Promise<SentMessage>;
  onSent?: (message: SentMessage) => void;
  senderLabel: string;
  starters: Starter[];
  allowEmail?: boolean;
  pickerPlaceholder?: string;
}) {
  const [audience, setAudience] = React.useState<Audience>(options[0].id);
  const [selected, setSelected] = React.useState<Recipient[]>([]);
  const [agentId, setAgentId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [link, setLink] = React.useState("");
  const [email, setEmail] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState<string | null>(null);

  const option = options.find((o) => o.id === audience) ?? options[0];
  const chosenAgent = agents?.find((a) => a.id === agentId);

  const reach: number | null =
    audience === "selected" ? selected.length : audience === "agent_customers" ? (chosenAgent ? chosenAgent.customers : 0) : (option.count ?? null);

  const linkOk = isLinkOk(link);
  const blocker =
    audience === "selected" && selected.length === 0
      ? "Choose at least one person."
      : audience === "agent_customers" && !agentId
        ? "Choose an agent."
        : reach === 0
          ? "Nobody is in this group yet."
          : !title.trim()
            ? "Add a title."
            : !body.trim()
              ? "Write your message."
              : !linkOk
                ? "Fix the link."
                : null;

  const summary =
    audience === "selected"
      ? selected.length === 1
        ? selected[0].name
        : plural(selected.length, "person", "people")
      : audience === "agent_customers"
        ? `${chosenAgent?.name ?? "this agent"}'s customers (${(chosenAgent?.customers ?? 0).toLocaleString()})`
        : `${option.label.toLowerCase()}${reach != null ? ` (${reach.toLocaleString()})` : ""}`;

  async function send() {
    setSending(true);
    setError(null);
    try {
      const message = await onSend({
        audience,
        title: title.trim(),
        body: body.trim(),
        ...(link.trim() ? { link_url: link.trim() } : {}),
        ...(audience === "selected" ? { user_ids: selected.map((r) => r.id) } : {}),
        ...(audience === "agent_customers" ? { agent_id: agentId } : {}),
        ...(allowEmail && email ? { send_email: true } : {}),
      });
      setSent(`Sent to ${plural(message.recipient_count, "person", "people")}.`);
      setTitle("");
      setBody("");
      setLink("");
      setSelected([]);
      setEmail(false);
      onSent?.(message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send. Please try again.");
    } finally {
      setSending(false);
      setConfirming(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form
        className="min-w-0 space-y-6 rounded-2xl border border-border bg-card p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(null);
          if (!blocker) setConfirming(true);
        }}
      >
        {/* Who */}
        <fieldset className="space-y-3">
          <legend className="mb-3 text-sm font-semibold text-foreground">Who should get it?</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {options.map((o) => {
              const on = o.id === audience;
              const Icon = o.icon;
              return (
                <label
                  key={o.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                    on ? "border-primary bg-[#F6F4FE] ring-1 ring-primary" : "border-border hover:border-[#D4D4D8]",
                  )}
                >
                  <input type="radio" name="audience" value={o.id} checked={on} onChange={() => setAudience(o.id)} className="sr-only" />
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", on ? "bg-primary text-white" : "bg-muted text-[#52525B]")}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{o.label}</span>
                      {o.count !== undefined && (
                        <span className="text-xs font-medium text-muted-foreground">
                          {o.count === null ? <span className="skeleton inline-block h-3 w-6 rounded align-middle" /> : o.count.toLocaleString()}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{o.hint}</span>
                  </span>
                </label>
              );
            })}
          </div>

          {audience === "agent_customers" && (
            <div>
              <label htmlFor="msg-agent" className="mb-1.5 block text-sm font-medium text-foreground">
                Agent
              </label>
              <select id="msg-agent" value={agentId} onChange={(e) => setAgentId(e.target.value)} className={cn(inputCls, "h-10")}>
                <option value="">Choose an agent…</option>
                {(agents ?? []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {plural(a.customers, "customer", "customers")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {audience === "selected" && <RecipientPicker selected={selected} onChange={setSelected} search={searchRecipients} placeholder={pickerPlaceholder} />}
        </fieldset>

        {/* What */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Message</span>
            <span className="text-xs text-muted-foreground">Start from:</span>
            {starters.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  setTitle(s.title);
                  setBody(s.body);
                }}
                className="h-7 rounded-full border border-border bg-card px-3 text-xs font-medium text-[#52525B] hover:border-[#D4D4D8] hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          </div>
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="msg-title" className="text-sm font-medium text-foreground">
                Title
              </label>
              <span className="text-xs text-muted-foreground">
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <input id="msg-title" value={title} maxLength={TITLE_MAX} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New templates are here" className={cn(inputCls, "h-10")} />
          </div>
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="msg-body" className="text-sm font-medium text-foreground">
                Message
              </label>
              <span className="text-xs text-muted-foreground">
                {body.length}/{BODY_MAX}
              </span>
            </div>
            <textarea id="msg-body" value={body} maxLength={BODY_MAX} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Write what you want them to know…" className={cn(inputCls, "resize-y py-2.5 leading-relaxed")} />
          </div>
          <div>
            <label htmlFor="msg-link" className="mb-1.5 block text-sm font-medium text-foreground">
              Link <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="msg-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://… or a page like /dashboard/editor"
              aria-invalid={!linkOk}
              aria-describedby="msg-link-help"
              className={cn(inputCls, "h-10", !linkOk && "border-destructive focus:border-destructive focus:ring-destructive/20")}
            />
            <p id="msg-link-help" className={cn("mt-1.5 text-xs", linkOk ? "text-muted-foreground" : "text-destructive")}>
              {linkOk ? "Adds an “Open” button to the message." : "Use a full web address (https://…) or a page path starting with /."}
            </p>
          </div>
          {allowEmail && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:border-[#D4D4D8]">
              <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--primary,#5B3FE4)]" />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> Also send by email
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">People who turned off emails won&apos;t get one; they still see it in the app.</span>
              </span>
            </label>
          )}
        </div>

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {error}
          </p>
        )}
        {sent && (
          <p role="status" className="flex items-center gap-2 rounded-lg border border-[#BFE6CD] bg-[#E7F6EC] p-3 text-sm font-medium text-[#1E7B43]">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" /> {sent}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{blocker ?? <>Sending to <span className="font-semibold text-foreground">{summary}</span></>}</p>
          <button type="submit" disabled={!!blocker || sending} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
            <Send className="h-4 w-4" aria-hidden="true" /> Send message
          </button>
        </div>
      </form>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <MessagePreview sender={senderLabel} title={title} body={body} link={link} />
      </div>

      {confirming && <ConfirmDialog summary={summary} emailing={allowEmail && email} sending={sending} onCancel={() => setConfirming(false)} onConfirm={() => void send()} />}
    </div>
  );
}
