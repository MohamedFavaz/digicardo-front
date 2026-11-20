"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  CloudOff,
  ExternalLink,
  Eye,
  ListChecks,
  Loader2,
  Palette,
  Redo2,
  RefreshCw,
  Undo2,
} from "lucide-react";
import { profileApi } from "@/lib/api/profile";
import { ApiClientError } from "@/lib/api/errors";
import { useCardEditor, type EditorTab } from "@/lib/editor/store";
import { useAutosave } from "@/lib/editor/autosave";
import { cn } from "@/lib/utils";
import { ContentTab } from "./ContentTab";
import { DesignTab } from "./DesignTab";
import { PreviewPanel } from "./PreviewPanel";

function SaveIndicator({ onRetry }: { onRetry: () => void }) {
  const status = useCardEditor((s) => s.status);
  const error = useCardEditor((s) => s.error);
  const map = {
    saved: { icon: CheckCircle2, text: "All changes saved", cls: "text-success" },
    unsaved: { icon: Loader2, text: "Saving soon…", cls: "text-muted-foreground" },
    saving: { icon: Loader2, text: "Saving…", cls: "text-muted-foreground" },
    error: { icon: AlertTriangle, text: error ?? "Couldn't save", cls: "text-destructive" },
    offline: { icon: CloudOff, text: error ?? "Offline — will retry", cls: "text-warning" },
  } as const;
  const { icon: Icon, text, cls } = map[status];
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex min-w-0 items-center gap-1.5 text-[13px] font-medium", cls)}>
      <Icon className={cn("h-4 w-4 shrink-0", status === "saving" && "animate-spin", status === "unsaved" && "opacity-0")} aria-hidden="true" />
      <span className="truncate" title={text}>{text}</span>
      {status === "error" && (
        <button type="button" onClick={onRetry} className="ml-1 inline-flex items-center gap-1 font-semibold text-foreground underline-offset-4 hover:underline">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
        </button>
      )}
    </span>
  );
}

/** Full-width notice when saving is blocked by something retrying can't fix. */
function SaveBlockedBanner() {
  const permanent = useCardEditor((s) => s.status === "error" && s.errorPermanent);
  const error = useCardEditor((s) => s.error);
  if (!permanent || !error) return null;
  return (
    <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">Your changes aren&apos;t being saved</p>
        <p className="mt-0.5 text-[#52525B]">{error} Your edits stay in this tab until then — press Retry once it&apos;s fixed.</p>
      </div>
    </div>
  );
}

function Tabs({ tab, onChange }: { tab: EditorTab; onChange: (t: EditorTab) => void }) {
  const tabs = [
    { id: "content" as const, label: "Content", icon: ListChecks },
    { id: "design" as const, label: "Design", icon: Palette },
  ];
  return (
    <div role="tablist" aria-label="Editor" className="inline-flex rounded-[10px] bg-muted p-[3px]">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => onChange(id)}
          className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm transition-colors", tab === id ? "bg-card font-semibold text-foreground shadow-xs" : "font-medium text-[#52525B] hover:text-foreground")}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]" aria-busy="true" aria-label="Loading editor">
      <div className="space-y-3">
        <div className="skeleton h-24 rounded-xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
      <div className="skeleton hidden h-[640px] w-[375px] rounded-[40px] lg:block" />
    </div>
  );
}

/** Edit card: one page for content and design, with a live preview (plan §3.3). */
export function CardEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const loaded = useCardEditor((s) => s.loaded);
  const load = useCardEditor((s) => s.load);
  const undo = useCardEditor((s) => s.undo);
  const redo = useCardEditor((s) => s.redo);
  const canUndo = useCardEditor((s) => s.past.length > 0);
  const canRedo = useCardEditor((s) => s.future.length > 0);
  const setOpenSection = useCardEditor((s) => s.setOpenSection);
  const username = useCardEditor((s) => s.profile?.username);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");
  const { saveNow } = useAutosave();

  const tab: EditorTab = params.get("tab") === "design" ? "design" : "content";
  const setTab = (next: EditorTab) => {
    const q = new URLSearchParams(params.toString());
    q.set("tab", next);
    q.delete("section");
    router.replace(`/dashboard/editor?${q.toString()}`, { scroll: false });
    setMobileView("edit");
  };

  const fetchEditor = React.useCallback(async () => {
    setLoadError(null);
    try {
      load(await profileApi.getEditor());
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.replace(`/login?returnUrl=${encodeURIComponent("/dashboard/editor")}`);
        return;
      }
      setLoadError(err instanceof ApiClientError ? err.message : "We couldn't load your card. Check your connection.");
    }
  }, [load, router]);

  // Load once per visit (React may run effects twice in development).
  const requested = React.useRef(false);
  React.useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    void fetchEditor();
  }, [fetchEditor]);

  // Deep links from Home ("Add WhatsApp" → ?section=contact).
  const sectionParam = params.get("section");
  React.useEffect(() => {
    if (!loaded || !sectionParam) return;
    setOpenSection(sectionParam);
    window.setTimeout(() => document.getElementById(`panel-${sectionParam}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }, [loaded, sectionParam, setOpenSection]);

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (not while typing in a field: the browser undoes text there).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "z") return;
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || (el as HTMLElement).isContentEditable)) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  if (loadError) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-warning" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold">Couldn&apos;t open the editor</h2>
        <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
        <button type="button" onClick={() => void fetchEditor()} className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-0">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 -mx-4 mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-16">
        <div className="hidden sm:block">
          <Tabs tab={tab} onChange={setTab} />
        </div>
        <div className="min-w-0 flex-1">{loaded && <SaveIndicator onRetry={() => void saveNow()} />}</div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo (Ctrl+Z)" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-[#52525B] hover:bg-muted disabled:opacity-40">
            <Undo2 className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Undo</span>
          </button>
          <button type="button" onClick={redo} disabled={!canRedo} aria-label="Redo" title="Redo (Ctrl+Shift+Z)" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#52525B] hover:bg-muted disabled:opacity-40">
            <Redo2 className="h-4 w-4" aria-hidden="true" />
          </button>
          {username && (
            <Link href={`/${username}`} target="_blank" rel="noopener noreferrer" className="ml-1 hidden h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-sm font-semibold hover:bg-muted sm:inline-flex md:hidden">
              View card <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      <SaveBlockedBanner />

      {!loaded ? (
        <EditorSkeleton />
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className={cn("min-w-0 max-w-3xl", mobileView === "preview" && "hidden lg:block")}>
            {tab === "content" ? <ContentTab /> : <DesignTab />}
          </div>
          <PreviewPanel
            className={cn("lg:sticky lg:top-[136px]", mobileView === "edit" && "hidden lg:flex")}
            onEditRequest={() => {
              setMobileView("edit");
              if (tab !== "content") setTab("content");
            }}
          />
        </div>
      )}

      {/* Phone: Content · Design · Preview */}
      <nav aria-label="Editor views" className="fixed inset-x-0 bottom-[64px] z-30 border-t border-border bg-card/95 px-3 py-2 backdrop-blur md:bottom-0 lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-1 rounded-[12px] bg-muted p-1">
          {[
            { id: "content", label: "Content", icon: ListChecks, active: mobileView === "edit" && tab === "content", go: () => setTab("content") },
            { id: "design", label: "Design", icon: Palette, active: mobileView === "edit" && tab === "design", go: () => setTab("design") },
            { id: "preview", label: "Preview", icon: Eye, active: mobileView === "preview", go: () => setMobileView("preview") },
          ].map(({ id, label, icon: Icon, active, go }) => (
            <button key={id} type="button" onClick={go} aria-pressed={active} className={cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-lg text-sm", active ? "bg-card font-semibold text-foreground shadow-xs" : "font-medium text-[#52525B]")}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
