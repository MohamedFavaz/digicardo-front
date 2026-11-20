"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Download, FileImage, FileType2, Loader2, Nfc, Palette, RotateCcw } from "lucide-react";
import { useShellProfile } from "@/lib/hooks/use-shell-profile";
import { resolveCardData, cardPublicUrl } from "@/lib/content/resolve";
import { initials } from "@/templates/shared/actions";
import { resolveMediaUrl, cn } from "@/lib/utils";
import type { ThemeTokens } from "@/types/profile";
import {
  BLEED,
  DEFAULT_DESIGN,
  FRONT_LAYOUTS,
  THEMES,
  loadDesign,
  resolveTheme,
  saveDesign,
  type BackLayout,
  type Decor,
  type FrontLayout,
  type NfcCardDesign,
} from "@/components/nfc-card/design";
import { buildScene, type CardData } from "@/components/nfc-card/scene";
import { CardSvg, downloadPng, downloadSvg, makeMeasure } from "@/components/nfc-card/render";

/** NFC card designer: pick colours and a layout, preview both sides, download print files. */

function Section({ title, children, description }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="grid gap-1 rounded-xl bg-muted p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "h-9 rounded-lg text-sm font-medium transition-colors",
            value === o.value ? "bg-card font-semibold text-foreground shadow-sm" : "text-[#52525B] hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-2 text-sm text-foreground">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", checked ? "bg-primary" : "bg-[#D4D4D8]")}
      >
        <span className={cn("absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
      </button>
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm">
      <span className="text-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase text-muted-foreground">{value}</span>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-8 w-10 cursor-pointer rounded-md border border-border bg-transparent p-0.5" aria-label={label} />
      </span>
    </label>
  );
}

export default function NfcCardPage() {
  const { profile, isLoading } = useShellProfile();
  const [design, setDesign] = React.useState<NfcCardDesign>(DEFAULT_DESIGN);
  const [ready, setReady] = React.useState(false);
  const [bleed, setBleed] = React.useState(true);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [origin, setOrigin] = React.useState<string>();

  React.useEffect(() => {
    setDesign(loadDesign());
    setOrigin(window.location.origin);
    setReady(true);
  }, []);
  React.useEffect(() => {
    if (ready) saveDesign(design);
  }, [design, ready]);

  const update = (patch: Partial<NfcCardDesign>) => setDesign((d) => ({ ...d, ...patch }));

  const data: CardData | null = React.useMemo(() => {
    if (!profile) return null;
    const { content } = resolveCardData(profile, (profile.theme_tokens ?? {}) as ThemeTokens, []);
    const { identity, contact } = content;
    const url = cardPublicUrl(profile, origin);
    const logo = identity.logo_url || identity.avatar_url || "";
    return {
      name: identity.name || profile.display_name || profile.username,
      role: [identity.role, identity.company].filter(Boolean).join(" · "),
      brand: identity.company || identity.category_label || "",
      jobTitle: identity.role,
      initials: initials(identity.name || profile.username),
      logoUrl: logo ? resolveMediaUrl(logo) : null,
      url,
      urlLabel: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      phone: contact.phone,
      email: contact.email,
      website: contact.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
    };
  }, [profile, origin]);

  const measure = React.useMemo(() => makeMeasure(), []);
  const front = React.useMemo(() => (data ? buildScene("front", design, data, measure) : []), [data, design, measure]);
  const back = React.useMemo(() => (data ? buildScene("back", design, data, measure) : []), [data, design, measure]);
  // Live mini-previews of every front template with the owner's own details and colours.
  const templateFronts = React.useMemo(
    () => (data ? FRONT_LAYOUTS.map((l) => ({ ...l, shapes: buildScene("front", { ...design, front: l.id }, data, measure) })) : []),
    [data, design, measure]
  );
  const theme = resolveTheme(design);
  const slug = profile?.username ?? "card";

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };
  const b = bleed ? BLEED : 0;

  if (isLoading || !data) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="skeleton aspect-[85.6/54] rounded-2xl" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {/* Preview */}
        <div className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-border bg-[radial-gradient(120%_120%_at_0%_0%,#F4F1FF,#FAFAFA_60%)] p-5 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Front</p>
            <CardSvg
              shapes={front}
              label={`Front of the NFC card for ${data.name}`}
              className="aspect-[85.6/54] w-full rounded-[3.7%/5.9%] shadow-[0_24px_48px_-20px_rgba(28,18,69,0.45)] transition-transform duration-300 hover:-rotate-1 hover:scale-[1.01]"
            />
            <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Back</p>
            <CardSvg
              shapes={back}
              label="Back of the NFC card with a QR code"
              className="aspect-[85.6/54] w-full rounded-[3.7%/5.9%] shadow-[0_24px_48px_-20px_rgba(28,18,69,0.45)] transition-transform duration-300 hover:rotate-1 hover:scale-[1.01]"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            The QR code opens <span className="font-medium text-foreground">{data.urlLabel}</span>. Your name, role, logo and contact details come from your card — change them in{" "}
            <Link href="/dashboard/editor" className="font-medium text-primary hover:underline">
              Edit card
            </Link>
            .
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <Section title="Colours" description="Pick a theme, or make your own.">
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update({ themeId: t.id })}
                  aria-pressed={design.themeId === t.id}
                  title={t.name}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "relative flex aspect-[85.6/54] w-full items-center justify-center rounded-lg ring-offset-2 transition-shadow",
                      design.themeId === t.id ? "ring-2 ring-primary" : "ring-1 ring-black/10 group-hover:ring-black/25",
                    )}
                    style={{ background: `linear-gradient(135deg, ${t.bg}, ${t.bg2})` }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: t.accent }} />
                    {design.themeId === t.id && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">{t.name}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => update({ themeId: "custom" })}
                aria-pressed={design.themeId === "custom"}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "flex aspect-[85.6/54] w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                    design.themeId === "custom" ? "border-primary bg-primary/5 text-primary" : "border-[#D4D4D8] text-muted-foreground group-hover:border-[#A1A1AA]",
                  )}
                >
                  <Palette className="h-4 w-4" />
                </span>
                <span className="text-xs text-muted-foreground">Custom</span>
              </button>
            </div>

            {design.themeId === "custom" && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <ColorField label="Background" value={design.custom.bg} onChange={(v) => update({ custom: { ...design.custom, bg: v } })} />
                <ColorField label="Second colour" value={design.custom.bg2} onChange={(v) => update({ custom: { ...design.custom, bg2: v } })} />
                <ColorField label="Text" value={design.custom.fg} onChange={(v) => update({ custom: { ...design.custom, fg: v } })} />
                <ColorField label="Accent" value={design.custom.accent} onChange={(v) => update({ custom: { ...design.custom, accent: v } })} />
              </div>
            )}

            <div className="mt-4 space-y-3">
              <Segmented<"gradient" | "solid">
                value={design.gradient ? "gradient" : "solid"}
                onChange={(v) => update({ gradient: v === "gradient" })}
                options={[
                  { value: "gradient", label: "Gradient" },
                  { value: "solid", label: "Solid" },
                ]}
              />
              <Segmented<Decor>
                value={design.decor}
                onChange={(v) => update({ decor: v })}
                options={[
                  { value: "orbits", label: "Circles" },
                  { value: "waves", label: "Waves" },
                  { value: "none", label: "Plain" },
                ]}
              />
            </div>
          </Section>

          <Section title="Card template" description="The front of your card. Every template uses your name, logo and colours.">
            <div role="radiogroup" aria-label="Front template" className="grid grid-cols-2 gap-3">
              {templateFronts.map((t) => {
                const active = design.front === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => update({ front: t.id as FrontLayout })}
                    className="group text-left"
                  >
                    <span
                      className={cn(
                        "relative block overflow-hidden rounded-[10px] ring-offset-2 transition-all",
                        active ? "ring-2 ring-primary" : "ring-1 ring-black/10 group-hover:-translate-y-0.5 group-hover:ring-black/25"
                      )}
                    >
                      <CardSvg shapes={t.shapes} label={`${t.name} template`} className="block aspect-[85.6/54] w-full" />
                      {active && (
                        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{t.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{t.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Layout">
            <p className="mb-2 text-sm font-medium text-foreground">Back</p>
            <Segmented<BackLayout>
              value={design.back}
              onChange={(v) => update({ back: v })}
              options={[
                { value: "qr-left", label: "QR + details" },
                { value: "qr-center", label: "Big QR" },
              ]}
            />
            <div className="mt-3 divide-y divide-border">
              <Toggle label="Show logo or photo" checked={design.showLogo} onChange={(v) => update({ showLogo: v })} />
              <Toggle label="Show role and company" checked={design.showRole} onChange={(v) => update({ showRole: v })} />
              <Toggle label="Show phone, email and website on the back" checked={design.showContacts} onChange={(v) => update({ showContacts: v })} />
            </div>
            <button
              type="button"
              onClick={() => setDesign(DEFAULT_DESIGN)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset design
            </button>
          </Section>

          <Section title="Download" description="Print-ready files at 300 dpi. Send both sides to any card printer.">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["front-png", "Front · PNG", FileImage, () => downloadPng(front, `${slug}-nfc-card-front.png`, b)],
                  ["back-png", "Back · PNG", FileImage, () => downloadPng(back, `${slug}-nfc-card-back.png`, b)],
                  ["front-svg", "Front · SVG", FileType2, () => downloadSvg(front, `${slug}-nfc-card-front.svg`, b)],
                  ["back-svg", "Back · SVG", FileType2, () => downloadSvg(back, `${slug}-nfc-card-back.svg`, b)],
                ] as const
              ).map(([key, label, Icon, fn]) => (
                <button
                  key={key}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => run(key, fn)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-input bg-card text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                >
                  {busy === key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() =>
                run("both", async () => {
                  await downloadPng(front, `${slug}-nfc-card-front.png`, b);
                  await downloadPng(back, `${slug}-nfc-card-back.png`, b);
                })
              }
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy === "both" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download both sides
            </button>
            <div className="mt-2">
              <Toggle label="Add 3 mm bleed (most printers ask for it)" checked={bleed} onChange={setBleed} />
            </div>
          </Section>

          <Section title="Make it tap" description="After printing on a blank NFC card (NTAG213 / NTAG215):">
            <ol className="space-y-2.5 text-sm text-[#3F3F46]">
              {[
                "Install a free app such as “NFC Tools” on your phone.",
                <>
                  Choose <span className="font-semibold">Write → Add a record → URL</span> and enter <span className="font-semibold text-foreground">{data.url}</span>
                </>,
                "Hold the card to the back of your phone to write it. Test by tapping it on another phone.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm text-[#52525B]">
              <Nfc className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              Theme “{theme.name}” · your design is remembered on this device.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
