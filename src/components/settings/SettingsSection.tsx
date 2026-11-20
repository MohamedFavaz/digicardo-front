import * as React from "react";
import { AlertTriangle, CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One settings block: title and a plain explanation on the left (desktop), the form or list in a
 * card on the right. On phones they stack.
 */
export function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  tone = "default",
  aside,
}: {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  tone?: "default" | "danger";
  /** Extra content under the description (e.g. a button). */
  aside?: React.ReactNode;
}) {
  const danger = tone === "danger";
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
      <div className="flex items-start gap-3 lg:block">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl lg:mb-3",
            danger ? "bg-[#FDECEC] text-destructive" : "bg-[#EFECFD] text-primary"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className={cn("text-base font-semibold", danger ? "text-destructive" : "text-foreground")}>{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          {aside && <div className="mt-3">{aside}</div>}
        </div>
      </div>
      <div className={cn("min-w-0 rounded-2xl border bg-card p-5 sm:p-6", danger ? "border-[#F5C2C2]" : "border-border")}>{children}</div>
    </section>
  );
}

/** Success / error line shown inside a settings card. */
export function SettingsMessage({ message }: { message: { type: "success" | "error"; text: string } | null }) {
  if (!message) return null;
  const ok = message.type === "success";
  return (
    <p
      role={ok ? "status" : "alert"}
      className={cn(
        "mb-4 flex items-start gap-2 rounded-xl border p-3 text-sm",
        ok ? "border-[#BFE6CD] bg-[#E7F6EC] text-[#1E7B43]" : "border-[#F5C2C2] bg-[#FDECEC] text-[#991B1B]"
      )}
    >
      {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
      {message.text}
    </p>
  );
}

export const settingsInput =
  "block h-11 w-full rounded-xl border border-input bg-card px-3.5 text-base text-foreground outline-none transition-colors placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm";

export const settingsLabel = "mb-1.5 block text-sm font-medium text-foreground";

export const settingsPrimaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60";

export function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />;
}
