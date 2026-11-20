"use client";

import { create } from "zustand";
import type { Profile, ThemeTokens } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";
import type { EditorData } from "@/lib/api/profile";
import { legacyToCardContent } from "@/lib/content/legacy";
import { CONTENT_PARTS, normalizeCardContent, type CardContent, type ContentPart } from "@/lib/zod/content";
import { getManifest } from "@/templates/manifests";

/**
 * Card editor state (ADR-016: Zustand for editor state).
 *
 * The draft is what the preview shows. Every change marks its part dirty; the autosave hook
 * (lib/editor/autosave.ts) sends dirty parts and clears them. Undo/redo keep up to 50
 * snapshots; quick successive edits of the same field are merged into one step.
 */

export type EditorTab = "content" | "design";
export type SaveStatus = "saved" | "unsaved" | "saving" | "error" | "offline";

interface Snapshot {
  content: CardContent;
  theme: ThemeTokens;
  templateId: string;
}

const HISTORY_LIMIT = 50;
const COALESCE_MS = 1200;

export interface CardEditorState extends Snapshot {
  loaded: boolean;
  profile: Profile | null;
  blocks: ProfileBlock[];
  /** Blocks whose data the legacy mapping moved into the content (hidden after the first save). */
  liftedBlockIds: string[];
  contentStored: boolean;
  version: number;
  dirtyParts: ContentPart[];
  themeDirty: boolean;
  /** Bumped on every change so the autosave knows whether a save is still current. */
  revision: number;
  status: SaveStatus;
  error: string | null;
  /** True when retrying can't help (e.g. the server's database needs updating). */
  errorPermanent: boolean;
  past: Snapshot[];
  future: Snapshot[];
  lastEditKey: string | null;
  lastEditAt: number;
  openSection: string | null;
  focusField: string | null;

  load: (data: EditorData) => void;
  setPart: <K extends ContentPart>(part: K, value: CardContent[K], editKey?: string) => void;
  setTheme: (patch: Partial<ThemeTokens>, editKey?: string) => void;
  setTemplate: (templateId: string) => void;
  undo: () => void;
  redo: () => void;
  setBlocks: (blocks: ProfileBlock[]) => void;
  setOpenSection: (section: string | null, field?: string | null) => void;
  /** Called by autosave. */
  markSaving: () => void;
  markSaved: (args: { version: number; parts: ContentPart[]; theme: boolean; revision: number; contentStored?: boolean }) => void;
  markError: (status: "error" | "offline", message: string, permanent?: boolean) => void;
  setVersion: (version: number) => void;
}

function snapshot(s: Snapshot): Snapshot {
  return { content: s.content, theme: s.theme, templateId: s.templateId };
}

export const useCardEditor = create<CardEditorState>((set, get) => {
  /** Records the current state for undo (merging rapid edits of the same field). */
  const remember = (editKey: string | undefined) => {
    const state = get();
    const now = Date.now();
    const merge = editKey && state.lastEditKey === editKey && now - state.lastEditAt < COALESCE_MS;
    if (!merge) {
      set({ past: [...state.past, snapshot(state)].slice(-HISTORY_LIMIT), future: [] });
    }
    set({ lastEditKey: editKey ?? null, lastEditAt: now });
  };

  /** Marks everything that differs between two snapshots as dirty. */
  const diffDirty = (from: Snapshot, to: Snapshot) => {
    const state = get();
    const parts = new Set(state.dirtyParts);
    for (const part of CONTENT_PARTS) {
      if (JSON.stringify(from.content[part]) !== JSON.stringify(to.content[part])) parts.add(part);
    }
    const themeChanged =
      from.templateId !== to.templateId || JSON.stringify(from.theme) !== JSON.stringify(to.theme);
    return { dirtyParts: [...parts], themeDirty: state.themeDirty || themeChanged };
  };

  return {
    loaded: false,
    profile: null,
    blocks: [],
    liftedBlockIds: [],
    contentStored: false,
    version: 1,
    content: normalizeCardContent({}),
    theme: getManifest("vcard").default_theme as ThemeTokens,
    templateId: "vcard",
    dirtyParts: [],
    themeDirty: false,
    revision: 0,
    status: "saved",
    error: null,
    errorPermanent: false,
    past: [],
    future: [],
    lastEditKey: null,
    lastEditAt: 0,
    openSection: "identity",
    focusField: null,

    load: (data) => {
      const current = get();
      // Never let a late (re)load replace edits that haven't been saved yet.
      if (current.loaded && current.profile?.id === data.profile.id && (current.dirtyParts.length > 0 || current.themeDirty || current.status === "saving")) {
        set({ version: Math.max(current.version, data.version), blocks: data.blocks });
        return;
      }
      const manifest = getManifest(data.template_id);
      const theme = { ...manifest.default_theme, ...(data.theme_tokens ?? {}) } as ThemeTokens;
      const lifted = data.content_stored
        ? []
        : legacyToCardContent(data.profile, data.theme_tokens?.custom_options, data.blocks).liftedBlockIds;
      set({
        loaded: true,
        profile: data.profile,
        blocks: data.blocks,
        liftedBlockIds: lifted,
        contentStored: data.content_stored,
        version: data.version,
        content: normalizeCardContent(data.content),
        theme,
        templateId: data.template_id,
        dirtyParts: [],
        themeDirty: false,
        status: "saved",
        error: null,
        past: [],
        future: [],
      });
    },

    setPart: (part, value, editKey) => {
      remember(editKey ? `${part}.${editKey}` : part);
      const state = get();
      set({
        content: { ...state.content, [part]: value },
        dirtyParts: state.dirtyParts.includes(part) ? state.dirtyParts : [...state.dirtyParts, part],
        revision: state.revision + 1,
        status: "unsaved",
      });
    },

    setTheme: (patch, editKey) => {
      remember(editKey ? `theme.${editKey}` : "theme");
      const state = get();
      set({ theme: { ...state.theme, ...patch }, themeDirty: true, revision: state.revision + 1, status: "unsaved" });
    },

    setTemplate: (templateId) => {
      const state = get();
      if (templateId === state.templateId) return;
      remember("template");
      const manifest = getManifest(templateId);
      set({
        templateId,
        // Each template has its own look; content is untouched (switching is always safe).
        theme: {
          ...(manifest.default_theme as ThemeTokens),
          custom_options: state.theme.custom_options,
          hide_branding: state.theme.hide_branding,
          template_style: {},
        },
        themeDirty: true,
        revision: state.revision + 1,
        status: "unsaved",
      });
    },

    undo: () => {
      const state = get();
      const previous = state.past[state.past.length - 1];
      if (!previous) return;
      const dirty = diffDirty(snapshot(state), previous);
      set({
        ...previous,
        ...dirty,
        past: state.past.slice(0, -1),
        future: [snapshot(state), ...state.future].slice(0, HISTORY_LIMIT),
        lastEditKey: null,
        revision: state.revision + 1,
        status: "unsaved",
      });
    },

    redo: () => {
      const state = get();
      const next = state.future[0];
      if (!next) return;
      const dirty = diffDirty(snapshot(state), next);
      set({
        ...next,
        ...dirty,
        past: [...state.past, snapshot(state)].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
        lastEditKey: null,
        revision: state.revision + 1,
        status: "unsaved",
      });
    },

    setBlocks: (blocks) => set({ blocks }),

    setOpenSection: (section, field = null) => set({ openSection: section, focusField: field }),

    markSaving: () => set({ status: "saving", error: null, errorPermanent: false }),

    markSaved: ({ version, parts, theme, revision, contentStored }) => {
      const state = get();
      // Only clear what was sent, and only if nothing changed while the request was running.
      const unchanged = state.revision === revision;
      set({
        version,
        dirtyParts: unchanged ? state.dirtyParts.filter((p) => !parts.includes(p)) : state.dirtyParts,
        themeDirty: unchanged && theme ? false : state.themeDirty,
        contentStored: contentStored ?? state.contentStored,
        status: unchanged ? "saved" : "unsaved",
        error: null,
      });
    },

    markError: (status, message, permanent = false) => set({ status, error: message, errorPermanent: permanent }),

    setVersion: (version) => set({ version }),
  };
});
