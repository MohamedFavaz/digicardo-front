"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  Globe,
  HelpCircle,
  LayoutTemplate,
  Link2,
  Loader2,
  MessageSquareQuote,
  Palette,
  Phone,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  Users,
  ListOrdered,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Switch } from "@/components/card-editor/fields";
import { ConsolePage, PageHeader, StatusPill } from "@/components/console/ui";
import { PartnerPreviewFrame } from "@/components/partner/editor/PartnerPreviewFrame";
import {
  AboutForm,
  BrandForm,
  ContactForm,
  FaqForm,
  HeroForm,
  PackagesForm,
  SeoForm,
  ShowcaseForm,
  StepsForm,
  TestimonialsForm,
} from "@/components/partner/editor/PartnerSectionForms";
import { agentSiteApi } from "@/lib/api/agent-site";
import type { PartnerCard, PartnerContent, PartnerSectionKey, PartnerSiteOwner } from "@/lib/partner/types";
import { cn } from "@/lib/utils";

const SECTION_META: Record<PartnerSectionKey, { title: string; hint: string; icon: LucideIcon }> = {
  about: { title: "About you", hint: "Who you are and why customers choose you", icon: Info },
  packages: { title: "Packages & pricing", hint: "Your plans and what’s included", icon: ShoppingBag },
  showcase: { title: "Your work", hint: "Show your customers’ cards", icon: Users },
  steps: { title: "How it works", hint: "Simple steps to get a card", icon: ListOrdered },
  testimonials: { title: "Reviews", hint: "What customers say", icon: MessageSquareQuote },
  faq: { title: "Questions", hint: "Answer common questions", icon: HelpCircle },
  contact: { title: "Contact & enquiry form", hint: "WhatsApp, phone, address and the form", icon: Phone },
};

function Card({
  title,
  hint,
  icon: Icon,
  open,
  onToggle,
  actions,
  muted,
  children,
}: {
  title: string;
  hint: string;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  actions?: React.ReactNode;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("overflow-hidden rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]", muted && "opacity-70")}>
      <div className="flex items-center gap-3 p-3 pl-4">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2E4] text-[#343C22]">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-[#121212]">{title}</span>
            <span className="block truncate text-[13px] text-[#9A9C8F]">{hint}</span>
          </span>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#9A9C8F] transition-transform", open && "rotate-180")} aria-hidden="true" />
        </button>
        {actions}
      </div>
      {open && <div className="border-t border-[#E9E9E2] p-4 sm:p-5">{children}</div>}
    </section>
  );
}

/** Agent: edit and publish the landing page, with a live phone / desktop preview. */
export default function AgentSitePage() {
  const [site, setSite] = React.useState<PartnerSiteOwner | null>(null);
  const [content, setContent] = React.useState<PartnerContent | null>(null);
  const [slug, setSlug] = React.useState("");
  const [customers, setCustomers] = React.useState<PartnerCard[]>([]);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"saved" | "unsaved" | "saving" | "error">("saved");
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<string>("brand");
  const [publishing, setPublishing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const revision = React.useRef(0);

  React.useEffect(() => {
    agentSiteApi
      .get()
      .then((d) => {
        setSite(d.site);
        setContent(d.site.content);
        setSlug(d.site.slug);
        setCustomers(d.customers);
      })
      .catch((e: Error) => setLoadError(e.message));
  }, []);

  // Autosave 900 ms after the last change.
  React.useEffect(() => {
    if (status !== "unsaved" || !content) return;
    const rev = revision.current;
    const t = setTimeout(async () => {
      setStatus("saving");
      try {
        const res = await agentSiteApi.save(content, slug !== site?.slug ? slug : undefined);
        setSite(res.site);
        if (revision.current === rev) {
          setStatus("saved");
          setSaveError(null);
        } else {
          setStatus("unsaved");
        }
      } catch (e) {
        setStatus("error");
        setSaveError(e instanceof Error ? e.message : "Couldn't save.");
      }
    }, 900);
    return () => clearTimeout(t);
  }, [status, content, slug, site?.slug]);

  const set = React.useCallback(<K extends keyof PartnerContent>(key: K, value: PartnerContent[K]) => {
    revision.current += 1;
    setContent((c) => (c ? { ...c, [key]: value } : c));
    setStatus("unsaved");
  }, []);

  const showcase = React.useMemo(() => {
    if (!content) return [];
    const byId = new Map(customers.map((c) => [c.id, c]));
    return content.showcase.profile_ids.map((id) => byId.get(id)).filter((c): c is PartnerCard => !!c && c.is_public);
  }, [content, customers]);

  if (loadError) {
    return (
      <ConsolePage>
        <p className="flex items-center gap-2 rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-4 text-sm text-[#991B1B]">
          <AlertCircle className="h-4 w-4" aria-hidden="true" /> {loadError}
        </p>
      </ConsolePage>
    );
  }
  if (!site || !content) {
    return (
      <ConsolePage>
        <div className="skeleton h-16 rounded-2xl" />
        <div className="grid gap-5 lg:grid-cols-[440px_1fr]">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton h-[600px] rounded-2xl" />
        </div>
      </ConsolePage>
    );
  }

  const live = site.published && !site.landing_disabled;
  const move = (key: PartnerSectionKey, delta: number) => {
    const order = [...content.layout];
    const i = order.indexOf(key);
    const j = i + delta;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    set("layout", order);
  };
  const toggleSection = (key: PartnerSectionKey, enabled: boolean) => set(key, { ...(content[key] as object), enabled } as never);

  const publish = async (value: boolean) => {
    setPublishing(true);
    try {
      if (status !== "saved") await agentSiteApi.save(content, slug !== site.slug ? slug : undefined);
      const res = await agentSiteApi.publish(value);
      setSite(res.site);
      setStatus("saved");
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Couldn't publish.");
      setStatus("error");
    } finally {
      setPublishing(false);
    }
  };

  const saveLabel =
    status === "saving" ? "Saving…" : status === "unsaved" ? "Unsaved changes" : status === "error" ? "Not saved" : "All changes saved";

  const forms: Record<PartnerSectionKey, React.ReactNode> = {
    about: <AboutForm content={content} set={set} />,
    packages: <PackagesForm content={content} set={set} />,
    showcase: <ShowcaseForm content={content} set={set} customers={customers} />,
    steps: <StepsForm content={content} set={set} />,
    testimonials: <TestimonialsForm content={content} set={set} />,
    faq: <FaqForm content={content} set={set} />,
    contact: <ContactForm content={content} set={set} />,
  };

  return (
    <ConsolePage className="max-w-[1600px]">
      <PageHeader
        title="Landing page"
        meta={
          site.landing_disabled ? (
            <StatusPill tone="danger">Turned off by admin</StatusPill>
          ) : live ? (
            <StatusPill tone="success">Live</StatusPill>
          ) : (
            <StatusPill tone="neutral">Draft</StatusPill>
          )
        }
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            Your page:
            <a href={site.page_url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#343C22] underline-offset-4 hover:underline">
              {site.page_url.replace(/^https?:\/\//, "")}
            </a>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(site.page_url).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              aria-label="Copy page link"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-white"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-[#1E7B43]" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          </span>
        }
        actions={
          <>
            <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-1.5 text-sm", status === "error" ? "text-destructive" : "text-muted-foreground")}>
              {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : status === "error" ? <AlertCircle className="h-4 w-4" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
              {saveLabel}
            </span>
            {live && (
              <a href={site.page_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-white bg-white/80 px-4 text-sm font-medium text-[#121212] hover:bg-white">
                <ExternalLink className="h-4 w-4" aria-hidden="true" /> View page
              </a>
            )}
            <button
              type="button"
              disabled={publishing || site.landing_disabled}
              onClick={() => void publish(!site.published)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium disabled:opacity-60",
                site.published ? "border border-input bg-card text-[#121212] hover:bg-muted" : "bg-[#343C22] text-white hover:bg-[#4B5634]"
              )}
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Rocket className="h-4 w-4" aria-hidden="true" />}
              {site.published ? "Unpublish" : "Publish"}
            </button>
          </>
        }
      />

      {saveError && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {saveError}
        </p>
      )}
      {site.landing_disabled && (
        <p className="flex items-start gap-2 rounded-2xl border border-[#F5C2C2] bg-[#FDECEC] p-3 text-sm text-[#991B1B]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> An admin has turned your page off. You can keep editing; contact the Digicardo team to turn it back on.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
        {/* ── Editor ── */}
        <div className="space-y-3">
          <Card title="Brand & design" hint="Name, logo, colours" icon={Palette} open={open === "brand"} onToggle={() => setOpen(open === "brand" ? "" : "brand")}>
            <BrandForm content={content} set={set} />
          </Card>
          <Card title="Top of page" hint="Headline, buttons and photo" icon={Sparkles} open={open === "hero"} onToggle={() => setOpen(open === "hero" ? "" : "hero")}>
            <HeroForm content={content} set={set} />
          </Card>

          <p className="px-1 pt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A9C8F]">Sections — in page order</p>
          {content.layout.map((key, i) => {
            const meta = SECTION_META[key];
            const enabled = Boolean((content[key] as { enabled?: boolean }).enabled);
            return (
              <Card
                key={key}
                title={meta.title}
                hint={enabled ? meta.hint : "Hidden on your page"}
                icon={meta.icon}
                muted={!enabled}
                open={open === key}
                onToggle={() => setOpen(open === key ? "" : key)}
                actions={
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button type="button" onClick={() => move(key, -1)} disabled={i === 0} aria-label={`Move ${meta.title} up`} className="flex h-8 w-8 items-center justify-center rounded-full text-[#5E6054] hover:bg-white disabled:opacity-30">
                      <ArrowUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => move(key, 1)} disabled={i === content.layout.length - 1} aria-label={`Move ${meta.title} down`} className="flex h-8 w-8 items-center justify-center rounded-full text-[#5E6054] hover:bg-white disabled:opacity-30">
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="ml-1">
                      <Switch label={`Show ${meta.title}`} checked={enabled} onChange={(v) => toggleSection(key, v)} />
                    </span>
                  </div>
                }
              >
                {forms[key]}
              </Card>
            );
          })}

          <p className="px-1 pt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A9C8F]">Settings</p>
          <Card title="Address & Google" hint="Your page link and search listing" icon={Search} open={open === "seo"} onToggle={() => setOpen(open === "seo" ? "" : "seo")}>
            <div className="space-y-5">
              {site.domain && site.domain_status === "active" ? (
                <div className="flex items-start gap-3 rounded-2xl bg-[#EEF2E4] p-4">
                  <Globe className="mt-0.5 h-5 w-5 shrink-0 text-[#343C22]" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-medium text-[#121212]">{site.domain}</p>
                    <p className="text-[#5E6054]">Your own domain is live. Your page is at the root and your customers’ cards at {site.domain}/name.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="lp-slug" className="text-sm font-medium text-foreground">
                    Page address
                  </label>
                  <div className="mt-1.5 flex items-center overflow-hidden rounded-xl border border-input bg-card focus-within:border-primary">
                    <span className="flex h-11 items-center gap-1.5 border-r border-input bg-muted/60 px-3 text-sm text-muted-foreground">
                      <Link2 className="h-4 w-4" aria-hidden="true" />
                      {site.default_url.replace(/^https?:\/\//, "").replace(/[^/]+$/, "")}
                    </span>
                    <input
                      id="lp-slug"
                      value={slug}
                      maxLength={40}
                      onChange={(e) => {
                        revision.current += 1;
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                        setStatus("unsaved");
                      }}
                      className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                    />
                  </div>
                  <p className="mt-1.5 text-[13px] text-muted-foreground">
                    {site.domain ? `Your domain ${site.domain} is being connected by the Digicardo team.` : "Want your own domain (like yourbrand.in)? Ask the Digicardo team — they can connect it for you."}
                  </p>
                </div>
              )}
              <SeoForm content={content} set={set} />
            </div>
          </Card>
        </div>

        {/* ── Preview ── */}
        <div className="xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)]">
          <div className="h-[640px] xl:h-full">
            <PartnerPreviewFrame content={content} showcase={showcase} slug={site.slug} />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <LayoutTemplate className="h-3.5 w-3.5" aria-hidden="true" /> Changes show here instantly and save by themselves. Press Publish to put the page online.
          </p>
        </div>
      </div>
    </ConsolePage>
  );
}
