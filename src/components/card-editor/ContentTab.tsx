"use client";

import * as React from "react";
import {
  AtSign,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Images,
  LayoutList,
  Link2,
  MousePointerClick,
  Phone,
  ShoppingBag,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useCardEditor } from "@/lib/editor/store";
import { getManifest } from "@/templates/manifests";
import type { CardContent, SectionKey } from "@/lib/zod/content";
import { cn } from "@/lib/utils";
import { Switch } from "./fields";
import {
  ActionsForm,
  CatalogForm,
  ContactForm,
  DocumentsForm,
  GalleryForm,
  IdentityForm,
  LinksForm,
  PaymentsForm,
  SocialsForm,
  sectionSummary,
} from "./ContentSections";
import { BlocksSection } from "./BlocksSection";

interface PanelDef {
  title: string;
  icon: LucideIcon;
  Form: React.ComponentType;
  /** Card sections this panel controls (order + show/hide). */
  layoutKeys?: SectionKey[];
}

export const PANELS: Record<string, PanelDef> = {
  identity: { title: "Business details", icon: UserRound, Form: IdentityForm },
  contact: { title: "Contact buttons", icon: Phone, Form: ContactForm },
  socials: { title: "Social links", icon: AtSign, Form: SocialsForm },
  catalog: { title: "Services & products", icon: ShoppingBag, Form: CatalogForm, layoutKeys: ["services", "products"] },
  payments: { title: "Payments", icon: CreditCard, Form: PaymentsForm, layoutKeys: ["payments"] },
  gallery: { title: "Photo gallery", icon: Images, Form: GalleryForm, layoutKeys: ["gallery"] },
  links: { title: "Links & booking", icon: Link2, Form: LinksForm, layoutKeys: ["links"] },
  documents: { title: "Documents", icon: FileText, Form: DocumentsForm, layoutKeys: ["documents"] },
  actions: { title: "Buttons on your card", icon: MousePointerClick, Form: ActionsForm },
  blocks: { title: "More blocks", icon: LayoutList, Form: BlocksSection },
};

const TOP = ["identity", "contact", "socials"];
const BOTTOM = ["actions", "blocks"];
const BODY = ["catalog", "payments", "gallery", "links", "documents"];

/** Body panels in the owner's section order (position of each panel's first section). */
function bodyOrder(layout: CardContent["layout"]): string[] {
  const index = (key: string) => layout.findIndex((e) => e.key === PANELS[key].layoutKeys?.[0]);
  return [...BODY].sort((a, b) => index(a) - index(b));
}

/** Setup progress, shown at the top of the Content tab. */
function progress(content: CardContent) {
  const steps = [
    { done: Boolean(content.identity.name && content.identity.role), next: "Add what you do", section: "identity" },
    { done: Boolean(content.identity.avatar_url), next: "Add a profile photo", section: "identity" },
    { done: Boolean(content.contact.phone || content.contact.whatsapp), next: "Add your phone or WhatsApp", section: "contact" },
    { done: Boolean(content.contact.email || content.contact.website), next: "Add an email or website", section: "contact" },
    { done: content.socials.length > 0, next: "Add a social link", section: "socials" },
    {
      done: content.catalog.services.length + content.catalog.products.length + content.links.length > 0,
      next: "Add a service, product or link",
      section: "catalog",
    },
  ];
  const done = steps.filter((s) => s.done).length;
  return { done, total: steps.length, next: steps.find((s) => !s.done) };
}

export function ContentTab() {
  const content = useCardEditor((s) => s.content);
  const templateId = useCardEditor((s) => s.templateId);
  const openSection = useCardEditor((s) => s.openSection);
  const setOpenSection = useCardEditor((s) => s.setOpenSection);
  const setPart = useCardEditor((s) => s.setPart);
  const manifest = getManifest(templateId);
  const order = [...TOP, ...bodyOrder(content.layout), ...BOTTOM];
  const p = progress(content);
  const percent = Math.round((p.done / p.total) * 100);

  const setVisible = (keys: SectionKey[], visible: boolean) =>
    setPart("layout", content.layout.map((e) => (keys.includes(e.key) ? { ...e, visible } : e)));

  const move = (panel: string, delta: number) => {
    const body = bodyOrder(content.layout);
    const i = body.indexOf(panel);
    const j = i + delta;
    if (j < 0 || j >= body.length) return;
    [body[i], body[j]] = [body[j], body[i]];
    // Rebuild the layout in the new panel order, keeping each panel's sections together.
    const keys = body.flatMap((b) => PANELS[b].layoutKeys ?? []);
    const rest = content.layout.filter((e) => !keys.includes(e.key));
    const byKey = new Map(content.layout.map((e) => [e.key, e]));
    setPart("layout", [...keys.map((k) => byKey.get(k)!).filter(Boolean), ...rest]);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-foreground">
            {p.next ? `Your card is ${percent}% done` : "Your card is ready to share"}
          </div>
          <div className="text-[13px] text-muted-foreground">{p.done} / {p.total}</div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Card setup">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
        {p.next && (
          <button type="button" onClick={() => setOpenSection(p.next!.section)} className="mt-2 text-[13px] font-semibold text-primary hover:underline">
            Next: {p.next.next} →
          </button>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground">What&apos;s on your card</h2>
        <p className="text-[13px] text-muted-foreground">Sections appear in this order. Use the arrows to move them; switch one off to hide it.</p>
      </div>

      <div className="space-y-2.5">
        {order.map((key) => {
          const panel = PANELS[key];
          const isOpen = openSection === key;
          const summary = sectionSummary(key, content);
          const keys = panel.layoutKeys;
          const visible = keys ? keys.some((k) => content.layout.find((e) => e.key === k)?.visible) : true;
          const supported = !keys || keys.some((k) => manifest.sections.includes(k));
          const bodyIndex = bodyOrder(content.layout).indexOf(key);
          const Icon = panel.icon;
          return (
            <section key={key} id={`panel-${key}`} className={cn("scroll-mt-24 rounded-xl border bg-card transition-shadow", isOpen ? "border-primary/40 shadow-sm" : "border-border")}>
              <div className="flex items-center gap-1 pr-2">
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : key)}
                  aria-expanded={isOpen}
                  aria-controls={`panel-body-${key}`}
                  className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", isOpen ? "bg-[#EFECFD] text-[#3D2AAD]" : "bg-muted text-[#52525B]")}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">{panel.title}</span>
                    <span className="flex items-center gap-1.5 truncate text-[13px] text-muted-foreground">
                      {key !== "blocks" && <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", summary.filled ? "bg-success" : "bg-[#D4D4D8]")} aria-hidden="true" />}
                      {!supported ? `Not shown in ${manifest.name} — kept for other templates` : key === "blocks" ? "Text, video, FAQ, contact form and more" : summary.text}
                    </span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                </button>
                {bodyIndex >= 0 && (
                  <span className="hidden items-center sm:flex">
                    <button type="button" aria-label={`Move ${panel.title} up`} disabled={bodyIndex === 0} onClick={() => move(key, -1)} className="inline-flex h-9 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30">
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" aria-label={`Move ${panel.title} down`} disabled={bodyIndex === BODY.length - 1} onClick={() => move(key, 1)} className="inline-flex h-9 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30">
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </span>
                )}
                {keys && <Switch checked={visible} onChange={(v) => setVisible(keys, v)} label={`Show ${panel.title} on card`} />}
              </div>
              {isOpen && (
                <div id={`panel-body-${key}`} className="border-t border-border px-4 pb-5 pt-4">
                  <panel.Form />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
