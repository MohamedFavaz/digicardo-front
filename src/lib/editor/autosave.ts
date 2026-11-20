"use client";

import * as React from "react";
import { profileApi } from "@/lib/api/profile";
import { blocksApi } from "@/lib/api/blocks";
import { ApiClientError, ApiConflictError } from "@/lib/api/errors";
import { ThemeTokensSchema } from "@/lib/validation/theme";
import { cardContentSchema, type CardContent, type ContentPart } from "@/lib/zod/content";
import { useCardEditor } from "./store";

const DEBOUNCE_MS = 800;
const RETRY_MS = 5000;
const RETRY_MAX_MS = 60_000;

const PART_LABELS: Record<ContentPart, string> = {
  identity: "Business details",
  contact: "Contact buttons",
  socials: "Social links",
  catalog: "Services & products",
  payments: "Payments",
  gallery: "Photo gallery",
  links: "Links & booking",
  documents: "Documents",
  actions: "Buttons",
  layout: "Section order",
};

const ITEM_NAMES: Record<string, string> = {
  services: "Service",
  products: "Product",
  socials: "Social link",
  links: "Link",
  documents: "Document",
  images: "Photo",
  cover_images: "Cover photo",
  badges: "Badge",
};

const FIELD_NAMES: Record<string, string> = {
  image_url: "Photo",
  avatar_url: "Profile photo",
  logo_url: "Business logo",
  buy_url: "Buy link",
  map_url: "Map link",
  url: "Link",
  upi_id: "UPI ID",
  ifsc: "IFSC",
  account_number: "Account number",
  review_url: "Review link",
};

/** ["catalog", "services", 0, "image_url"] → "Services & products · Service 1 · Photo". */
export function describePath(path: (string | number)[]): string {
  const [part, ...rest] = path.map(String);
  const words: string[] = [PART_LABELS[part as ContentPart] ?? part];
  for (let i = 0; i < rest.length; i++) {
    const key = rest[i];
    const next = rest[i + 1];
    if (next !== undefined && /^\d+$/.test(next)) {
      words.push(`${ITEM_NAMES[key] ?? key} ${Number(next) + 1}`);
      i++;
    } else if (/^\d+$/.test(key)) {
      words.push(`Item ${Number(key) + 1}`);
    } else {
      words.push(FIELD_NAMES[key] ?? key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()));
    }
  }
  return words.join(" · ");
}

/** The first thing stopping the draft from saving, in words ("Payments · UPI ID: Enter a UPI ID like name@bank."). */
export function firstProblem(content: CardContent, parts: ContentPart[]): string | null {
  for (const part of parts) {
    const result = cardContentSchema.shape[part].safeParse(content[part]);
    if (!result.success) {
      const issue = result.error.issues[0];
      return `${describePath([part, ...(issue?.path ?? []).map((p) => (typeof p === "symbol" ? String(p) : p))])}: ${issue?.message ?? "Check this value."}`;
    }
  }
  return null;
}

/** The first server validation error ("sections.catalog.services.0.image_url") in words. */
export function serverProblem(details: Record<string, string[]> | null): string | null {
  const first = details ? Object.entries(details)[0] : undefined;
  if (!first) return null;
  const path = first[0].replace(/^sections\./, "").split(".");
  return `${describePath(path)}: ${first[1]?.[0] ?? "Check this value."}`;
}

/** Parts of the draft that pass validation (invalid ones stay dirty until fixed). */
export function validParts(content: CardContent, parts: ContentPart[]): Partial<CardContent> {
  const out: Partial<CardContent> = {};
  for (const part of parts) {
    const result = cardContentSchema.shape[part].safeParse(content[part]);
    if (result.success) (out as Record<string, unknown>)[part] = result.data;
  }
  return out;
}

/**
 * Saves the editor draft automatically (ADR-032): 800 ms after the last change, dirty content
 * parts go to PATCH /profile/content and template/theme changes to PUT /profile/appearance.
 * A version conflict reloads the current version and retries once (saves are per part, so
 * the last writer of a part wins). Failed saves retry with back-off (5 s → 60 s); validation
 * errors and an outdated server database don't retry — the message says what to do.
 */
export function useAutosave() {
  const dirtyParts = useCardEditor((s) => s.dirtyParts);
  const themeDirty = useCardEditor((s) => s.themeDirty);
  const revision = useCardEditor((s) => s.revision);
  const loaded = useCardEditor((s) => s.loaded);
  const savingRef = React.useRef(false);
  const failuresRef = React.useRef(0);
  const [retryTick, setRetryTick] = React.useState(0);

  const save = React.useCallback(async () => {
    if (savingRef.current) return;
    const state = useCardEditor.getState();
    const parts = validParts(state.content, state.dirtyParts);
    const partKeys = Object.keys(parts) as ContentPart[];
    const sendTheme = state.themeDirty && ThemeTokensSchema.safeParse(state.theme).success;
    if (partKeys.length === 0 && !sendTheme) {
      if (state.dirtyParts.length > 0) {
        const problem = firstProblem(state.content, state.dirtyParts);
        state.markError("error", problem ? `Can't save yet — ${problem}` : "Some details need fixing before they can be saved.", true);
      }
      return;
    }

    savingRef.current = true;
    state.markSaving();
    const revisionAtStart = state.revision;
    const wasStored = state.contentStored;

    const attempt = async (version: number): Promise<number> => {
      let v = version;
      if (partKeys.length > 0) {
        const res = await profileApi.updateContent({ version: v, sections: parts });
        v = res.version;
      }
      if (sendTheme) {
        const current = useCardEditor.getState();
        const updated = await profileApi.updateAppearance({
          template_id: current.templateId,
          version: v,
          theme_tokens: current.theme,
        });
        v = updated.version;
      }
      return v;
    };

    try {
      let version: number;
      try {
        version = await attempt(state.version);
      } catch (err) {
        if (!(err instanceof ApiConflictError)) throw err;
        const fresh = await profileApi.getEditor();
        version = await attempt(fresh.version);
      }
      failuresRef.current = 0;
      useCardEditor.getState().markSaved({
        version,
        parts: partKeys,
        theme: sendTheme,
        revision: revisionAtStart,
        contentStored: partKeys.length > 0 ? true : undefined,
      });
      // The first content save hides contact blocks that moved into the content.
      if (!wasStored && partKeys.length > 0) {
        blocksApi
          .getBlocks()
          .then((blocks) => useCardEditor.getState().setBlocks(blocks))
          .catch(() => undefined);
      }
      if (typeof window !== "undefined") window.dispatchEvent(new Event("digicardo_profile_updated"));
    } catch (err) {
      const offline = typeof navigator !== "undefined" && navigator.onLine === false;
      const apiError = err instanceof ApiClientError ? err : null;
      // Retrying can't fix these: invalid data, or a server whose database isn't up to date.
      const permanent = apiError !== null && (apiError.status === 422 || apiError.code === "DATABASE_OUTDATED");
      const message =
        apiError?.status === 422
          ? (() => {
              const problem = serverProblem(apiError.details);
              return problem ? `Can't save yet — ${problem}` : "Some details need fixing before they can be saved.";
            })()
          : apiError?.code === "DATABASE_OUTDATED"
            ? apiError.message
            : offline
              ? "You're offline. Changes will save when you're back."
              : "Couldn't save. Retrying…";
      // Shown in full in the banner above the editor (the status line is truncated).
      useCardEditor.getState().markError(offline ? "offline" : "error", message, permanent);
      if (!permanent) {
        // Back off: 5 s, 10 s, 20 s, … up to a minute, so a broken server isn't flooded.
        const delay = Math.min(RETRY_MAX_MS, RETRY_MS * 2 ** failuresRef.current);
        failuresRef.current += 1;
        window.setTimeout(() => setRetryTick((t) => t + 1), delay);
      }
    } finally {
      savingRef.current = false;
    }
  }, []);

  React.useEffect(() => {
    if (!loaded || (dirtyParts.length === 0 && !themeDirty)) return;
    const timer = window.setTimeout(save, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [loaded, dirtyParts, themeDirty, revision, retryTick, save]);

  // Save right away when the tab is hidden or closed.
  React.useEffect(() => {
    const flush = () => {
      const s = useCardEditor.getState();
      if (document.visibilityState === "hidden" && (s.dirtyParts.length > 0 || s.themeDirty)) void save();
    };
    const warn = (event: BeforeUnloadEvent) => {
      const s = useCardEditor.getState();
      if (s.dirtyParts.length > 0 || s.themeDirty || s.status === "saving") {
        event.preventDefault();
      }
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("beforeunload", warn);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("beforeunload", warn);
    };
  }, [save]);

  return { saveNow: save };
}
