"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Crop, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { ImageCropper } from "./ImageCropper";
import type { ZodTypeAny } from "zod";
import { mediaApi } from "@/lib/api/media";
import { ApiClientError } from "@/lib/api/errors";
import { resolveMediaUrl, cn } from "@/lib/utils";
import { phoneSchema, webUrlSchema } from "@/lib/zod/content";

/**
 * Form fields for the card editor (plan §3.3 UX rules): visible labels, plain hints,
 * check-as-you-type messages, 16 px text on phones, 44 px touch targets.
 */

export const inputClass =
  "block w-full rounded-lg border border-input bg-card px-3 text-base text-foreground shadow-none outline-none transition-colors placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm";

export function fieldError(schema: ZodTypeAny, value: unknown): string | null {
  if (value === "" || value === null || value === undefined) return null;
  const result = schema.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? "Check this value.");
}

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  counter,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  error?: string | null;
  optional?: boolean;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-semibold text-foreground">
          {label}
          {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
        </label>
        {counter && <span className="text-xs text-muted-foreground">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p role="alert" className="text-[13px] font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[13px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  maxLength?: number;
  error?: string | null;
  type?: "text" | "email" | "tel" | "url";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onBlur?: () => void;
  autoComplete?: string;
}

export function TextField({ id, label, value, onChange, placeholder, hint, optional, maxLength, error, type = "text", inputMode, onBlur, autoComplete }: TextFieldProps) {
  return (
    <Field id={id} label={label} hint={hint} optional={optional} error={error}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={cn(inputClass, "h-11 sm:h-10", error && "border-destructive focus:border-destructive focus:ring-destructive/20")}
      />
    </Field>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  optional,
  maxLength,
  rows = 3,
}: Omit<TextFieldProps, "type" | "inputMode" | "error" | "onBlur" | "autoComplete"> & { rows?: number }) {
  return (
    <Field id={id} label={label} hint={hint} optional={optional} counter={maxLength ? `${value.length} / ${maxLength}` : undefined}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, "resize-y py-2.5 leading-6")}
      />
    </Field>
  );
}

/** Adds https:// to bare domains ("studio.in" → "https://studio.in") when the field loses focus. */
export function normalizeUrl(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)+([/?#:].*)?$/u.test(v.replace(/^\/\//, ""))) return `https://${v.replace(/^\/\//, "")}`;
  return v;
}

export function UrlField(props: Omit<TextFieldProps, "type" | "error" | "onBlur">) {
  const [touched, setTouched] = React.useState(false);
  const error = touched ? fieldError(webUrlSchema, props.value) : null;
  return (
    <TextField
      {...props}
      type="url"
      inputMode="url"
      error={error}
      onBlur={() => {
        setTouched(true);
        const fixed = normalizeUrl(props.value);
        if (fixed !== props.value) props.onChange(fixed);
      }}
    />
  );
}

export function PhoneField(props: Omit<TextFieldProps, "type" | "error" | "onBlur" | "inputMode">) {
  const [touched, setTouched] = React.useState(false);
  return (
    <TextField
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder={props.placeholder ?? "+91 98765 43210"}
      error={touched ? fieldError(phoneSchema, props.value) : null}
      onBlur={() => setTouched(true)}
    />
  );
}

export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange: (value: boolean) => void; label: string; id?: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        checked ? "bg-primary" : "bg-[#D4D4D8]"
      )}
    >
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
    </button>
  );
}

export function ToggleRow({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {description && <div className="text-[13px] text-muted-foreground">{description}</div>}
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

async function uploadFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file (JPG, PNG or WebP).");
  if (file.size > 5 * 1024 * 1024) throw new Error("This image is larger than 5 MB. Choose a smaller one.");
  try {
    const media = await mediaApi.uploadImage(file);
    return media.url;
  } catch (err) {
    throw new Error(err instanceof ApiClientError ? err.message : "Upload failed. Check your connection and try again.");
  }
}

/**
 * Uploaded images live on the API host; a canvas may only read same-origin pixels, so load
 * `…/storage/…` through the app's own `/storage` proxy. Other URLs are used as they are.
 */
function sameOriginMedia(url: string): string {
  const resolved = resolveMediaUrl(url);
  try {
    const u = new URL(resolved, window.location.origin);
    if (u.origin !== window.location.origin && u.pathname.startsWith("/storage/")) return u.pathname + u.search;
  } catch {
    // Not a URL: leave it.
  }
  return resolved;
}

/** One image: upload, replace or remove. */
export function ImageField({
  id,
  label,
  hint,
  value,
  onChange,
  shape = "circle",
  crop = false,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  shape?: "circle" | "square";
  /** Open a square crop dialog before uploading (and offer "Crop" on the current image). */
  crop?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cropping, setCropping] = React.useState<{ src: string; revoke: boolean } | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const closeCropper = () => {
    if (cropping?.revoke) URL.revokeObjectURL(cropping.src);
    setCropping(null);
  };

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!crop) return upload(file);
    if (!file.type.startsWith("image/")) return setError("Choose an image file (JPG, PNG or WebP).");
    if (file.size > 15 * 1024 * 1024) return setError("This image is larger than 15 MB. Choose a smaller one.");
    setError(null);
    setCropping({ src: URL.createObjectURL(file), revoke: true });
  };

  return (
    <div className="flex items-center gap-4">
      <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground", shape === "circle" ? "rounded-full" : "rounded-xl")}>
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media
          <img src={resolveMediaUrl(value)} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="h-6 w-6" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-[13px] text-muted-foreground">{error ? <span className="text-destructive">{error}</span> : hint}</div>
        <div className="mt-1.5 flex gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="inline-flex h-9 items-center rounded-lg border border-input bg-card px-3 text-[13px] font-semibold hover:bg-muted disabled:opacity-50">
            {value ? "Change" : "Upload"}
          </button>
          {value && crop && (
            <button
              type="button"
              onClick={() => setCropping({ src: sameOriginMedia(value), revoke: false })}
              disabled={busy}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-card px-3 text-[13px] font-semibold hover:bg-muted disabled:opacity-50"
            >
              <Crop className="h-4 w-4" aria-hidden="true" /> Crop
            </button>
          )}
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-semibold text-[#52525B] hover:bg-muted">
              Remove
            </button>
          )}
        </div>
        <input id={id} ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {cropping && (
        <ImageCropper
          src={cropping.src}
          shape={shape}
          title={`Crop ${label.toLowerCase()}`}
          onCancel={closeCropper}
          onDone={async (blob) => {
            const name = `${id.replace(/^f-/, "") || "image"}-${Date.now()}.png`;
            closeCropper();
            await upload(new File([blob], name, { type: "image/png" }));
          }}
        />
      )}
    </div>
  );
}

/** Several images: add (multi-select), reorder, remove. */
export function ImageListField({ id, label, hint, values, onChange, max }: { id: string; label: string; hint?: string; values: string[]; onChange: (urls: string[]) => void; max: number }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const latest = React.useRef(values);
  latest.current = values;

  const add = async (files: FileList | null) => {
    if (!files) return;
    const room = max - latest.current.length;
    const list = Array.from(files).slice(0, Math.max(0, room));
    if (list.length < files.length) setError(`You can add up to ${max} photos.`);
    else setError(null);
    for (const file of list) {
      setBusy((n) => n + 1);
      try {
        const url = await uploadFile(file);
        onChange([...latest.current, url]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy((n) => n - 1);
      }
    }
  };

  const move = (index: number, delta: number) => {
    const next = [...values];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{values.length} / {max}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {values.map((url, index) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media */}
            <img src={resolveMediaUrl(url)} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
            {index === 0 && <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 text-[11px] font-semibold text-white">1st</span>}
            <div className="absolute inset-x-1 bottom-1 flex justify-between">
              <button type="button" aria-label={`Move photo ${index + 1} earlier`} disabled={index === 0} onClick={() => move(index, -1)} className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-foreground disabled:opacity-0">
                <ArrowUp className="h-3.5 w-3.5 -rotate-90" aria-hidden="true" />
              </button>
              <button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => onChange(values.filter((_, i) => i !== index))} className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-destructive">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
        {values.length < max && (
          <button type="button" onClick={() => inputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-input text-[13px] font-semibold text-muted-foreground hover:border-primary hover:text-primary">
            {busy > 0 ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
            {busy > 0 ? "Uploading" : "Add"}
          </button>
        )}
      </div>
      {error ? <p className="text-[13px] text-destructive">{error}</p> : hint ? <p className="text-[13px] text-muted-foreground">{hint}</p> : null}
      <input id={id} ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { void add(e.target.files); e.target.value = ""; }} />
    </div>
  );
}

/** A list of items (services, links, …) with add, reorder and remove. */
export function ListEditor<T extends { id: string }>({
  items,
  onChange,
  max,
  addLabel,
  newItem,
  itemTitle,
  renderItem,
  emptyText,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  max: number;
  addLabel: string;
  newItem: () => T;
  itemTitle: (item: T, index: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  emptyText: string;
}) {
  const [open, setOpen] = React.useState<string | null>(null);
  const update = (index: number, patch: Partial<T>) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const move = (index: number, delta: number) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="rounded-lg border border-dashed border-input px-4 py-3 text-[13px] text-muted-foreground">{emptyText}</p>}
      {items.map((item, index) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-1 pl-3 pr-1.5">
              <button type="button" onClick={() => setOpen(isOpen ? null : item.id)} aria-expanded={isOpen} className="min-w-0 flex-1 truncate py-3 text-left text-sm font-semibold text-foreground">
                {itemTitle(item, index)}
              </button>
              <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30">
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Delete" onClick={() => onChange(items.filter((_, i) => i !== index))} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-[#FDECEC] hover:text-destructive">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {isOpen && <div className="space-y-3 border-t border-border p-3">{renderItem(item, (patch) => update(index, patch))}</div>}
          </div>
        );
      })}
      {items.length < max && (
        <button
          type="button"
          onClick={() => {
            const item = newItem();
            onChange([...items, item]);
            setOpen(item.id);
          }}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-input bg-card px-3.5 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
