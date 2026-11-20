"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Copy, ExternalLink, Globe, LayoutTemplate, Loader2, RefreshCw, ShieldCheck, Trash2, Zap } from "lucide-react";
import { StatusPill } from "@/components/console/ui";
import { adminAgentSiteApi, type AdminAgentSite } from "@/lib/api/agent-site";
import { cn } from "@/lib/utils";

function CopyValue({ value }: { value: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1E1DA] bg-white px-2 py-1 font-mono text-[13px] text-[#121212] hover:bg-[#EEF2E4]"
      aria-label={`Copy ${value}`}
    >
      {value}
      {done ? <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7B43]" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5 text-[#9A9C8F]" aria-hidden="true" />}
    </button>
  );
}

/**
 * Admin: an agent's own domain (cards at https://{domain}/{username}, landing page at the root)
 * and their landing page. Without a domain, everything stays on the main Digicardo domain.
 */
export function AgentSitePanel({ agentId }: { agentId: string }) {
  const [data, setData] = React.useState<AdminAgentSite | null>(null);
  const [domain, setDomain] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const apply = (d: AdminAgentSite) => {
    setData(d);
    setDomain(d.site.domain ?? "");
  };

  React.useEffect(() => {
    adminAgentSiteApi.get(agentId).then(apply).catch((e: Error) => setError(e.message));
  }, [agentId]);

  const run = async (key: string, fn: () => Promise<AdminAgentSite>) => {
    setBusy(key);
    setError(null);
    try {
      apply(await fn());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  if (!data) {
    return <section className="skeleton h-64 rounded-[22px]" aria-busy="true" />;
  }

  const { site, dns } = data;
  const status = site.domain_status;
  const pageLive = site.published && !site.landing_disabled;
  const isApex = site.domain ? site.domain.split(".").length <= 2 : true;

  return (
    <section className="overflow-hidden rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]" aria-labelledby="agent-site-title">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E9E9E2] px-5 py-4">
        <div>
          <h2 id="agent-site-title" className="flex items-center gap-2 text-[17px] font-normal text-[#121212]">
            <Globe className="h-4 w-4 text-[#5E6054]" aria-hidden="true" /> Domain & landing page
          </h2>
          <p className="mt-0.5 text-sm text-[#9A9C8F]">
            {data.customers} customer card{data.customers === 1 ? "" : "s"} · {data.leads} lead{data.leads === 1 ? "" : "s"}
          </p>
        </div>
        {status === "active" ? (
          <StatusPill tone="success">Domain live</StatusPill>
        ) : status === "pending" ? (
          <StatusPill tone="warning">Waiting for DNS</StatusPill>
        ) : status === "failed" ? (
          <StatusPill tone="danger">DNS not ready</StatusPill>
        ) : (
          <StatusPill tone="neutral">Main domain</StatusPill>
        )}
      </div>

      <div className="space-y-5 p-5">
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {error}
          </p>
        )}

        {/* Domain */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run("save", () => adminAgentSiteApi.setDomain(agentId, domain.trim() || null));
          }}
        >
          <label htmlFor="agent-domain" className="text-sm font-medium text-[#121212]">
            Agent domain
          </label>
          <p className="text-[13px] text-[#9A9C8F]">
            Optional. With a domain, this agent’s cards open at <b className="font-medium text-[#5E6054]">domain/username</b> and the landing page at the domain itself. Leave empty to keep everything on the main domain.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="agent-domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value.trim().toLowerCase())}
              placeholder="excellentcards.in"
              className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-card px-3.5 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={busy !== null || domain === (site.domain ?? "")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#343C22] px-5 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-50"
            >
              {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {site.domain ? "Change domain" : "Add domain"}
            </button>
          </div>
        </form>

        {site.domain && (
          <div className="space-y-4 rounded-2xl border border-[#E1E1DA] bg-white/70 p-4">
            {status !== "active" && (
              <div>
                <p className="text-sm font-medium text-[#121212]">Ask the agent to add this DNS record at their domain provider:</p>
                {dns.a_records.length === 0 && !dns.cname_target ? (
                  <p className="mt-2 text-[13px] text-[#9A3412]">
                    The server doesn’t know where agent domains should point yet. Set <span className="font-mono">AGENT_DOMAIN_A_RECORDS</span> and/or{" "}
                    <span className="font-mono">AGENT_DOMAIN_CNAME_TARGET</span> in the backend .env (see docs). Meanwhile you can use “Activate anyway”.
                  </p>
                ) : (
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-left text-[13px]">
                      <thead className="text-[#9A9C8F]">
                        <tr>
                          <th className="py-1.5 pr-4 font-medium">Type</th>
                          <th className="py-1.5 pr-4 font-medium">Name / Host</th>
                          <th className="py-1.5 font-medium">Value / Points to</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isApex && dns.a_records[0] && (
                          <tr>
                            <td className="py-1.5 pr-4 font-medium">A</td>
                            <td className="py-1.5 pr-4"><CopyValue value="@" /></td>
                            <td className="py-1.5"><CopyValue value={dns.a_records[0]} /></td>
                          </tr>
                        )}
                        {dns.cname_target && (
                          <tr>
                            <td className="py-1.5 pr-4 font-medium">CNAME</td>
                            <td className="py-1.5 pr-4"><CopyValue value={isApex ? "www" : site.domain.split(".")[0]} /></td>
                            <td className="py-1.5"><CopyValue value={dns.cname_target} /></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <p className="mt-2 text-xs text-[#9A9C8F]">DNS changes usually work within minutes, sometimes up to an hour.</p>
                  </div>
                )}
              </div>
            )}

            {site.domain_error && status !== "active" && (
              <p className="flex items-start gap-2 rounded-xl bg-[#FEF3C7] p-3 text-[13px] text-[#92400E]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {site.domain_error}
              </p>
            )}
            {status === "active" && (
              <p className="flex items-start gap-2 rounded-xl bg-[#EEF2E4] p-3 text-[13px] text-[#343C22]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  <b className="font-medium">{site.domain}</b> is live. This agent’s cards now use{" "}
                  <span className="font-mono">{site.domain}/username</span>; old links on the main domain redirect there.
                </span>
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {status !== "active" && (
                <>
                  <button type="button" disabled={busy !== null} onClick={() => void run("check", () => adminAgentSiteApi.check(agentId))} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#343C22] px-4 text-sm font-medium text-white hover:bg-[#4B5634] disabled:opacity-50">
                    {busy === "check" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />} Check DNS
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => {
                      if (confirm(`Make ${site.domain} live now without a DNS check? Only do this if the domain already points to Digicardo — otherwise this agent’s card links will break.`)) {
                        void run("activate", () => adminAgentSiteApi.activate(agentId));
                      }
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-input bg-card px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
                  >
                    {busy === "activate" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Zap className="h-4 w-4" aria-hidden="true" />} Activate anyway
                  </button>
                </>
              )}
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => {
                  if (confirm(`Remove ${site.domain}? This agent’s cards go back to the main domain.`)) void run("remove", () => adminAgentSiteApi.remove(agentId));
                }}
                className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-destructive hover:bg-[#FDECEC] disabled:opacity-50"
              >
                {busy === "remove" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />} Remove domain
              </button>
            </div>
          </div>
        )}

        {/* Landing page */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E1E1DA] bg-white/70 p-4 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2E4] text-[#343C22]">
            <LayoutTemplate className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#121212]">
              Landing page
              {site.landing_disabled ? <StatusPill tone="danger">Turned off</StatusPill> : pageLive ? <StatusPill tone="success">Live</StatusPill> : <StatusPill tone="neutral">Not published</StatusPill>}
            </p>
            <a href={site.page_url} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1 truncate text-[13px] text-[#5E6054] hover:underline", !pageLive && "pointer-events-none opacity-60")}>
              {site.page_url.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void run("landing", () => adminAgentSiteApi.setLandingDisabled(agentId, !site.landing_disabled))}
            className={cn(
              "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium disabled:opacity-50",
              site.landing_disabled ? "bg-[#343C22] text-white hover:bg-[#4B5634]" : "border border-[#F5C2C2] bg-card text-destructive hover:bg-[#FDECEC]"
            )}
          >
            {busy === "landing" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {site.landing_disabled ? "Turn page back on" : "Turn page off"}
          </button>
        </div>
      </div>
    </section>
  );
}
