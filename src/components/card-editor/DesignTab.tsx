"use client";

import * as React from "react";
import { AlertTriangle, Check, CheckCircle2, ImageUp, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCardEditor } from "@/lib/editor/store";
import { TEMPLATE_MANIFESTS, getManifest, resolveTemplateStyle } from "@/templates/manifests";
import { ProfileRenderer } from "@/components/profile/ProfileRenderer";
import { CardFonts } from "@/templates/shared/CardChrome";
import { contrastRatio, isHex } from "@/templates/shared/palette";
import { FONT_ALLOWLIST, type AnimationType, type ButtonRadius, type ButtonStyle, type FontFamily, type ThemeTokens } from "@/types/profile";
import type { SectionKey } from "@/lib/zod/content";
import { cn } from "@/lib/utils";
import { Switch, ToggleRow } from "./fields";

const FONT_NAMES: Record<FontFamily, string> = {
  inter: "Inter",
  poppins: "Poppins",
  montserrat: "Montserrat",
  outfit: "Outfit",
  roboto: "Roboto",
  "playfair-display": "Playfair",
  raleway: "Raleway",
  lato: "Lato",
  nunito: "Nunito",
  "system-ui": "System",
};
const FONT_CSS: Record<FontFamily, string> = {
  inter: "var(--font-sans)",
  poppins: "Poppins",
  montserrat: "Montserrat",
  outfit: "Outfit",
  roboto: "Roboto",
  "playfair-display": "'Playfair Display'",
  raleway: "Raleway",
  lato: "Lato",
  nunito: "Nunito",
  "system-ui": "system-ui",
};
const SHAPES: { value: ButtonRadius; label: string; radius: string }[] = [
  { value: "none", label: "Square", radius: "3px" },
  { value: "medium", label: "Soft", radius: "8px" },
  { value: "large", label: "Rounded", radius: "12px" },
  { value: "pill", label: "Pill", radius: "999px" },
];
const STYLES: { value: ButtonStyle; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
  { value: "soft", label: "Soft" },
];
const ANIMATIONS: { value: AnimationType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade in" },
  { value: "slide", label: "Slide up" },
  { value: "scale", label: "Zoom in" },
];
const SECTION_NAMES: Record<SectionKey, string> = {
  services: "Services",
  products: "Products",
  payments: "Payments",
  gallery: "Photo gallery",
  links: "Links",
  documents: "Documents",
  review: "Review prompt",
  qr: "QR code",
};

function Block({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="text-[13px] text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-[10px] bg-muted p-[3px]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn("h-9 rounded-lg px-3.5 text-sm transition-colors", value === o.value ? "bg-card font-semibold text-foreground shadow-xs" : "font-medium text-[#52525B] hover:text-foreground")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A small, non-interactive render of the owner's card in a template. */
function TemplateThumb({ templateId }: { templateId: string }) {
  const profile = useCardEditor((s) => s.profile);
  const content = useCardEditor((s) => s.content);
  const blocks = useCardEditor((s) => s.blocks);
  const current = useCardEditor((s) => s.templateId);
  const theme = useCardEditor((s) => s.theme);
  const manifest = getManifest(templateId);
  if (!profile) return null;
  const tokens = templateId === current ? theme : ({ ...manifest.default_theme, template_style: {} } as ThemeTokens);
  return (
    <div aria-hidden="true" inert className="pointer-events-none relative h-[300px] w-full overflow-hidden rounded-lg border border-border bg-muted">
      {/* Own clipping box at the unscaled height (300 / 0.46) so bottom-sticky bars stay at the bottom. */}
      <div className="absolute left-1/2 top-0 h-[653px] w-[390px] origin-top -translate-x-1/2 scale-[0.46] overflow-hidden">
        <ProfileRenderer mode="preview" profile={{ ...profile, content, show_branding: false }} blocks={blocks.filter((b) => b.is_visible)} templateId={templateId} themeTokens={tokens} />
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [text, setText] = React.useState(value);
  React.useEffect(() => setText(value), [value]);
  return (
    <label className="flex items-center gap-2.5 rounded-lg border border-border p-2">
      <input type="color" value={isHex(value) && value.length === 7 ? value : "#000000"} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-9 w-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5" aria-label={label} />
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-foreground">{label}</span>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value.toUpperCase());
          }}
          aria-label={`${label} hex code`}
          className="w-20 bg-transparent text-xs uppercase text-muted-foreground outline-none focus:text-foreground"
        />
      </span>
    </label>
  );
}

export function DesignTab() {
  const router = useRouter();
  // "Your photo" uses the first cover photo, which is uploaded in Content → Business details.
  const onEditPhoto = () => router.replace("/dashboard/editor?tab=content&section=identity", { scroll: false });
  const templateId = useCardEditor((s) => s.templateId);
  const theme = useCardEditor((s) => s.theme);
  const setTheme = useCardEditor((s) => s.setTheme);
  const setTemplate = useCardEditor((s) => s.setTemplate);
  const content = useCardEditor((s) => s.content);
  const manifest = getManifest(templateId);
  const style = resolveTemplateStyle(manifest, theme.template_style);

  const hidden = (id: string) => {
    const supported = getManifest(id).sections;
    return content.layout
      .filter((e) => e.visible && !supported.includes(e.key))
      .map((e) => SECTION_NAMES[e.key]);
  };

  const textContrast = contrastRatio(theme.color_text_primary, theme.color_background);
  const cardContrast = contrastRatio(theme.color_text_primary, theme.color_surface);
  const lowContrast = Math.min(textContrast, cardContrast) < 4.5;

  return (
    <div className="space-y-4">
      <CardFonts fonts={[...FONT_ALLOWLIST]} />

      <Block title="Template" description="The layout of your card. Switching is safe — your content stays.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.values(TEMPLATE_MANIFESTS).map((m) => {
            const active = m.id === templateId;
            const missing = hidden(m.id);
            return (
              <div key={m.id} className={cn("flex flex-col gap-3 rounded-xl border p-3", active ? "border-primary ring-2 ring-primary/20" : "border-border")}>
                <TemplateThumb templateId={m.id} />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{m.name}</div>
                    <p className="text-[13px] leading-5 text-muted-foreground">{m.description}</p>
                  </div>
                </div>
                {active ? (
                  <span className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#EFECFD] text-sm font-semibold text-[#3D2AAD]">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> In use
                  </span>
                ) : (
                  <button type="button" onClick={() => setTemplate(m.id)} className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-card text-sm font-semibold hover:bg-muted">
                    Use {m.name}
                  </button>
                )}
                {!active && missing.length > 0 && (
                  <p className="text-xs text-muted-foreground">{m.name} doesn&apos;t show {missing.join(", ")}. They stay saved.</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] text-muted-foreground">Changed your mind? Press Undo at the top.</p>
      </Block>

      <Block title="Colour theme" description="One click changes every colour on your card.">
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {manifest.presets.map((preset) => {
            const t = preset.tokens;
            const active = theme.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setTheme({ ...t, preset: preset.id })}
                aria-pressed={active}
                className={cn("flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-colors", active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-[#D4D4D8]")}
              >
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10" style={{ background: t.color_background }}>
                  <span className="h-5 w-5 rounded-full" style={{ background: t.color_accent }} />
                  {active && <Check className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary p-0.5 text-white" aria-hidden="true" />}
                </span>
                <span className="text-xs font-semibold text-foreground">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </Block>

      <Block
        title="Fine-tune"
        description="Optional. Changes here override the colour theme."
        action={
          <button
            type="button"
            onClick={() => setTheme({ ...(manifest.default_theme as ThemeTokens), template_style: {}, preset: undefined })}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-[#52525B] hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
          </button>
        }
      >
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-[13px] font-semibold text-foreground">Colours</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <ColorInput label="Background" value={theme.color_background} onChange={(v) => setTheme({ color_background: v, preset: undefined }, "bg")} />
              <ColorInput label="Cards" value={theme.color_surface} onChange={(v) => setTheme({ color_surface: v, preset: undefined }, "surface")} />
              <ColorInput label="Text" value={theme.color_text_primary} onChange={(v) => setTheme({ color_text_primary: v, preset: undefined }, "text")} />
              <ColorInput label="Soft text" value={theme.color_text_secondary} onChange={(v) => setTheme({ color_text_secondary: v, preset: undefined }, "text2")} />
              <ColorInput label="Accent" value={theme.color_accent} onChange={(v) => setTheme({ color_accent: v, preset: undefined }, "accent")} />
            </div>
            <p className={cn("mt-2 flex items-center gap-1.5 text-[13px] font-medium", lowContrast ? "text-warning" : "text-success")}>
              {lowContrast ? <AlertTriangle className="h-4 w-4" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
              {lowContrast ? "Text may be hard to read on this background. Try a darker text colour." : "Text and buttons are easy to read with these colours."}
            </p>
          </div>

          <div>
            <div className="mb-2 text-[13px] font-semibold text-foreground">Font</div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {FONT_ALLOWLIST.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setTheme({ font_family: font })}
                  aria-pressed={theme.font_family === font}
                  className={cn("flex flex-col items-center rounded-lg border px-2 py-2", theme.font_family === font ? "border-primary bg-[#EFECFD]" : "border-border hover:border-[#D4D4D8]")}
                >
                  <span className="text-xl leading-7 text-foreground" style={{ fontFamily: FONT_CSS[font] }}>Aa</span>
                  <span className="text-xs font-medium text-muted-foreground">{FONT_NAMES[font]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-[13px] font-semibold text-foreground">Button shape</div>
              <div className="flex flex-wrap gap-2">
                {SHAPES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setTheme({ button_radius: s.value })}
                    aria-pressed={theme.button_radius === s.value}
                    className={cn("flex h-11 items-center gap-2 rounded-lg border px-3 text-[13px] font-semibold", theme.button_radius === s.value ? "border-primary bg-[#EFECFD] text-[#3D2AAD]" : "border-border text-foreground")}
                  >
                    <span className="h-4 w-7 border-2 border-current" style={{ borderRadius: s.radius }} aria-hidden="true" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-[13px] font-semibold text-foreground">Button style</div>
                <Segmented label="Button style" value={(STYLES.some((s) => s.value === theme.button_style) ? theme.button_style : "soft") as ButtonStyle} options={STYLES} onChange={(v) => setTheme({ button_style: v })} />
              </div>
              <div>
                <div className="mb-2 text-[13px] font-semibold text-foreground">Opening animation</div>
                <Segmented label="Opening animation" value={theme.animation} options={ANIMATIONS} onChange={(v) => setTheme({ animation: v })} />
              </div>
            </div>
          </div>
        </div>
      </Block>

      {manifest.controls.length > 0 && (
        <Block title={`${manifest.name} extras`}>
          <div className="space-y-4">
            {manifest.controls.map((control) =>
              control.type === "toggle" ? (
                <ToggleRow
                  key={control.key}
                  label={control.label}
                  checked={Boolean(style[control.key])}
                  onChange={(v) => setTheme({ template_style: { ...style, [control.key]: v } })}
                />
              ) : control.type === "choice" && control.options.some((o) => o.image) ? (
                <div key={control.key}>
                  <div className="mb-2 text-[13px] font-semibold text-foreground">{control.label}</div>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {control.options.map((o) => {
                      const selected = style[control.key] === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setTheme({ template_style: { ...style, [control.key]: o.value } }, `style.${control.key}`)}
                          aria-pressed={selected}
                          title={o.label}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-xl border p-1.5 text-[11px] font-semibold transition-colors",
                            selected ? "border-primary bg-[#EFECFD] text-[#3D2AAD]" : "border-border text-foreground hover:border-[#D4D4D8]"
                          )}
                        >
                          <span className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted">
                            {o.image ? (
                              // eslint-disable-next-line @next/next/no-img-element -- small static illustration
                              <img src={o.image} alt="" className="h-[85%] w-[85%] object-contain" />
                            ) : (
                              <ImageUp className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                            )}
                          </span>
                          <span className="w-full truncate text-center">{o.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {style[control.key] === "photo" && (
                    <p className="mt-2 text-[13px] text-muted-foreground">
                      Uses your first cover photo — a product photo with a see-through background looks best.{" "}
                      <button type="button" onClick={onEditPhoto} className="font-semibold text-primary hover:underline">
                        Upload your photo
                      </button>
                    </p>
                  )}
                </div>
              ) : control.type === "choice" ? (
                <div key={control.key}>
                  <div className="mb-2 text-[13px] font-semibold text-foreground">{control.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {control.options.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setTheme({ template_style: { ...style, [control.key]: o.value } })}
                        aria-pressed={style[control.key] === o.value}
                        className={cn("h-9 rounded-lg border px-3 text-[13px] font-semibold", style[control.key] === o.value ? "border-primary bg-[#EFECFD] text-[#3D2AAD]" : "border-border text-foreground hover:border-[#D4D4D8]")}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <ColorInput key={control.key} label={control.label} value={String(style[control.key])} onChange={(v) => setTheme({ template_style: { ...style, [control.key]: v } })} />
              )
            )}
          </div>
        </Block>
      )}

      <Block title="Branding">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-foreground">Show “Made with Digicardo”</div>
            <div className="text-[13px] text-muted-foreground">A small link at the bottom of your card.</div>
          </div>
          <Switch checked={!theme.hide_branding} onChange={(v) => setTheme({ hide_branding: !v })} label="Show Made with Digicardo" />
        </div>
      </Block>
    </div>
  );
}
