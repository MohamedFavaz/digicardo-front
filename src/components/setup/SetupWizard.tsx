"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, CheckCircle2, Copy, Download, Loader2, Share2 } from "lucide-react";
import { profileApi, type EditorData } from "@/lib/api/profile";
import { ApiClientError } from "@/lib/api/errors";
import { normalizeCardContent, phoneSchema, type CardContent } from "@/lib/zod/content";
import { TEMPLATE_MANIFESTS, getManifest } from "@/templates/manifests";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import { CardQr, downloadQrPng } from "@/templates/shared/CardQr";
import { cardPublicUrl } from "@/lib/content/resolve";
import { DigicardoLogo } from "@/components/ui/DigicardoLogo";
import { ImageField, PhoneField, TextField } from "@/components/card-editor/fields";
import type { ThemeTokens } from "@/types/profile";
import { cn } from "@/lib/utils";

type Step = "template" | "details" | "share";
const STEPS: { id: Step; label: string }[] = [
  { id: "template", label: "Template" },
  { id: "details", label: "Your details" },
  { id: "share", label: "Share" },
];

function Stepper({ step }: { step: Step }) {
  const index = STEPS.findIndex((s) => s.id === step);
  return (
    <ol className="flex items-center gap-2" aria-label="Setup steps">
      {STEPS.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2">
          <span
            aria-current={i === index ? "step" : undefined}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
              i < index ? "bg-success text-white" : i === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {i < index ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
          </span>
          <span className={cn("hidden text-sm sm:inline", i === index ? "font-semibold text-foreground" : "text-muted-foreground")}>{s.label}</span>
          {i < STEPS.length - 1 && <span className="h-px w-6 bg-border sm:w-10" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

function Preview({ data, content, templateId, theme, scale = 1 }: { data: EditorData; content: CardContent; templateId: string; theme: ThemeTokens; scale?: number }) {
  return (
    <div className="pointer-events-none relative overflow-hidden" style={{ height: 640 * scale }} aria-hidden="true" inert>
      <div className="absolute left-1/2 top-0 w-[375px] origin-top -translate-x-1/2" style={{ transform: `translateX(-50%) scale(${scale})` }}>
        <ProfileRenderer mode="preview" profile={{ ...data.profile, content, show_branding: false }} blocks={data.blocks.filter((b) => b.is_visible)} templateId={templateId} themeTokens={theme} />
      </div>
    </div>
  );
}

/** First-run setup: pick a template, add the basics, share (plan §3.7 flow 1). */
export function SetupWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const step: Step = (STEPS.find((s) => s.id === params.get("step"))?.id ?? "template") as Step;
  const go = (next: Step) => router.push(`/setup?step=${next}`, { scroll: true });

  const [data, setData] = React.useState<EditorData | null>(null);
  const [content, setContent] = React.useState<CardContent>(normalizeCardContent({}));
  const [templateId, setTemplateId] = React.useState("vcard");
  const [sameWhatsapp, setSameWhatsapp] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [origin, setOrigin] = React.useState<string>();

  React.useEffect(() => setOrigin(window.location.origin), []);
  React.useEffect(() => {
    profileApi
      .getEditor()
      .then((d) => {
        setData(d);
        setContent(normalizeCardContent(d.content));
        setTemplateId(d.template_id);
        setSameWhatsapp(!d.content.contact.whatsapp || d.content.contact.whatsapp === d.content.contact.phone);
      })
      .catch((err) => {
        if (err instanceof ApiClientError && err.status === 401) router.replace("/login?returnUrl=/setup");
        else setError("We couldn't load your card. Refresh the page to try again.");
      });
  }, [router]);

  const theme = React.useMemo<ThemeTokens>(() => {
    if (!data) return getManifest(templateId).default_theme as ThemeTokens;
    return templateId === data.template_id && data.theme_tokens
      ? ({ ...getManifest(templateId).default_theme, ...data.theme_tokens } as ThemeTokens)
      : ({ ...getManifest(templateId).default_theme, template_style: {} } as ThemeTokens);
  }, [data, templateId]);

  const identity = content.identity;
  const contact = content.contact;
  const setIdentity = (p: Partial<CardContent["identity"]>) => setContent((c) => ({ ...c, identity: { ...c.identity, ...p } }));
  const setContact = (p: Partial<CardContent["contact"]>) =>
    setContent((c) => {
      const next = { ...c.contact, ...p };
      if (sameWhatsapp && p.phone !== undefined) next.whatsapp = p.phone;
      return { ...c, contact: next };
    });

  const saveTemplate = async () => {
    if (!data) return;
    setBusy(true);
    setError(null);
    try {
      if (templateId !== data.template_id) {
        const updated = await profileApi.updateAppearance({ template_id: templateId, version: data.version, theme_tokens: theme });
        setData({ ...data, template_id: templateId, theme_tokens: updated.theme_tokens, version: updated.version });
      }
      go("details");
    } catch {
      setError("Couldn't save the template. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const phoneOk = phoneSchema.safeParse(contact.phone).success && contact.phone.trim() !== "";
  const detailsOk = identity.name.trim().length > 0 && phoneOk;

  const saveDetails = async () => {
    if (!data || !detailsOk) return;
    setBusy(true);
    setError(null);
    try {
      const res = await profileApi.updateContent({
        version: data.version,
        sections: { identity, contact: { ...contact, whatsapp: sameWhatsapp ? contact.phone : contact.whatsapp } },
      });
      setData({ ...data, version: res.version, content: res.content, content_stored: true });
      setContent(normalizeCardContent(res.content));
      window.dispatchEvent(new Event("digicardo_profile_updated"));
      go("share");
    } catch (err) {
      const detail = err instanceof ApiClientError && err.details ? Object.values(err.details)[0]?.[0] : null;
      setError(detail ?? "Couldn't save your details. Check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const url = data ? cardPublicUrl(data.profile, origin) : "";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <DigicardoLogo />
          <Stepper step={step} />
          <Link href="/dashboard" className="text-sm font-semibold text-[#52525B] hover:text-foreground">
            Skip for now
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-12">
        <section className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Step {STEPS.findIndex((s) => s.id === step) + 1} of 3 · about a minute
          </p>

          {!data ? (
            error ? (
              <p role="alert" className="mt-6 text-sm text-destructive">{error}</p>
            ) : (
              <div className="mt-6 space-y-3" aria-busy="true">
                <div className="skeleton h-8 w-64 rounded" />
                <div className="skeleton h-64 rounded-xl" />
              </div>
            )
          ) : step === "template" ? (
            <>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Pick a template</h1>
              <p className="mt-1 text-[15px] text-muted-foreground">You can switch any time — your details stay.</p>
              <div role="radiogroup" aria-label="Template" className="mt-6 grid gap-4 sm:grid-cols-2">
                {Object.values(TEMPLATE_MANIFESTS).map((m) => (
                  <div
                    key={m.id}
                    role="radio"
                    tabIndex={0}
                    aria-checked={templateId === m.id}
                    aria-label={m.name}
                    onClick={() => setTemplateId(m.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setTemplateId(m.id);
                      }
                    }}
                    className={cn("flex cursor-pointer flex-col gap-3 rounded-xl border bg-card p-3 text-left outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/40", templateId === m.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:shadow-sm")}
                  >
                    <div className="overflow-hidden rounded-lg border border-border bg-muted">
                      <Preview data={data} content={content} templateId={m.id} theme={m.id === templateId ? theme : (m.default_theme as ThemeTokens)} scale={0.62} />
                    </div>
                    <div className="flex items-start justify-between gap-2 px-1 pb-1">
                      <div>
                        <div className="text-[15px] font-semibold text-foreground">{m.name}</div>
                        <div className="text-[13px] text-muted-foreground">{m.description}</div>
                      </div>
                      {templateId === m.id && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button type="button" onClick={saveTemplate} disabled={busy} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:bg-[#4A32C0] disabled:opacity-60">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Continue
                </button>
              </div>
            </>
          ) : step === "details" ? (
            <>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Add your details</h1>
              <p className="mt-1 text-[15px] text-muted-foreground">This is what people see when they open your card. You can change everything later.</p>
              <div className="mt-6 max-w-xl space-y-5 rounded-xl border border-border bg-card p-5">
                <ImageField id="s-photo" label="Photo or logo" hint="Cards with a photo get more saves." value={identity.avatar_url} onChange={(v) => setIdentity({ avatar_url: v })} />
                <TextField id="s-name" label="Full name" value={identity.name} maxLength={100} onChange={(v) => setIdentity({ name: v })} autoComplete="name" />
                <TextField id="s-role" label="What you do" optional value={identity.role} maxLength={100} onChange={(v) => setIdentity({ role: v })} hint="For example: Interior Designer, Bakery, Tax Consultant." />
                <div className="space-y-2">
                  <PhoneField id="s-phone" label="Mobile number" value={contact.phone} onChange={(v) => setContact({ phone: v })} />
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input type="checkbox" checked={sameWhatsapp} onChange={(e) => setSameWhatsapp(e.target.checked)} className="h-4 w-4 rounded border-input accent-[#5B3FE4]" />
                    Use this number for WhatsApp too
                  </label>
                  {!sameWhatsapp && <PhoneField id="s-wa" label="WhatsApp number" value={contact.whatsapp} onChange={(v) => setContact({ whatsapp: v })} />}
                </div>
                <TextField id="s-email" label="Email" optional type="email" inputMode="email" autoComplete="email" value={contact.email} onChange={(v) => setContact({ email: v.trim() })} />
              </div>
              {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
              <div className="mt-8 flex max-w-xl items-center justify-between">
                <button type="button" onClick={() => go("template")} className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#52525B] hover:bg-muted">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                </button>
                <button type="button" onClick={saveDetails} disabled={busy || !detailsOk} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:bg-[#4A32C0] disabled:bg-[#E4E4E7] disabled:text-[#6B6B76]">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Continue
                </button>
              </div>
              {!detailsOk && <p className="mt-2 max-w-xl text-right text-[13px] text-muted-foreground">Add your name and mobile number to continue.</p>}
            </>
          ) : (
            <>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Your card is live 🎉</h1>
              <p className="mt-1 text-[15px] text-muted-foreground">Send the link or let people scan the code.</p>
              <div className="mt-6 max-w-xl space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{url.replace(/^https?:\/\//, "")}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(url).catch(() => undefined);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-input bg-card px-3.5 text-sm font-semibold hover:bg-muted"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${identity.name} — ${url}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground hover:bg-[#4A32C0]"
                >
                  <Share2 className="h-5 w-5" aria-hidden="true" /> Share on WhatsApp
                </a>
                <div className="flex items-center gap-5 rounded-xl border border-border bg-card p-4">
                  <CardQr value={url} size={112} />
                  <div>
                    <div className="text-[15px] font-semibold">Your QR code</div>
                    <p className="text-[13px] text-muted-foreground">Print it on your visiting card, shop counter or brochure.</p>
                    <button type="button" onClick={() => downloadQrPng(url, data.profile.username)} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      <Download className="h-4 w-4" aria-hidden="true" /> Download QR
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                  <Link href="/dashboard/editor" className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-input bg-card text-sm font-semibold hover:bg-muted">
                    Add more to my card
                  </Link>
                  <Link href="/dashboard" className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#18181B] text-sm font-semibold text-white hover:bg-black">
                    Go to Home
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-8 flex flex-col items-center gap-3">
            <div className="h-[640px] w-[340px] overflow-hidden rounded-[40px] border-[8px] border-[#18181B] bg-white shadow-[0_24px_60px_rgba(16,24,40,0.18)]">
              {data && <Preview data={data} content={content} templateId={templateId} theme={theme} scale={324 / 375} />}
            </div>
            <p className="text-[13px] text-muted-foreground">Live preview — only buttons you fill in appear.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
