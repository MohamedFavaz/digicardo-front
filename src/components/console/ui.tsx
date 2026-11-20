import * as React from "react";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Building blocks shared by the admin console and the agent portal. */

export function ConsolePage({ children, className, width = "wide" }: { children: React.ReactNode; className?: string; width?: "wide" | "narrow" }) {
  return (
    <div className={cn("mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8", width === "wide" ? "max-w-7xl" : "max-w-3xl", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
  meta,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  meta?: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[30px] font-normal leading-tight tracking-tight text-[#121212]">{title}</h1>
            {meta}
          </div>
          {description && <p className="text-[15px] text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

type Tone = "neutral" | "primary" | "success" | "warning" | "danger";

const TONE_PILL: Record<Tone, string> = {
  neutral: "bg-muted text-[#52525B]",
  primary: "bg-primary/10 text-primary",
  success: "bg-[#E7F6EC] text-[#1E7B43]",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  danger: "bg-[#FDECEC] text-destructive",
};

const TONE_DOT: Record<Tone, string> = {
  neutral: "bg-[#A1A1AA]",
  primary: "bg-primary",
  success: "bg-[#22A55A]",
  warning: "bg-[#F59E0B]",
  danger: "bg-destructive",
};

export function StatusPill({ tone = "neutral", children, dot = true, className }: { tone?: Tone; children: React.ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium", TONE_PILL[tone], className)}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", TONE_DOT[tone])} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "neutral",
  loading,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
  tone?: Tone;
  loading?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", TONE_PILL[tone])}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-[30px] font-light leading-9 tracking-tight text-[#121212] sm:text-[34px] sm:leading-10">
        {loading ? <span className="skeleton inline-block h-7 w-16 rounded-md align-middle" /> : value}
      </p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </>
  );
  const cls = "block min-w-0 rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]/95 p-4 shadow-[0_14px_34px_-28px_rgba(52,60,34,0.55)] sm:p-5";
  return href ? (
    <Link href={href} className={cn(cls, "transition-colors hover:border-[#D4D4D8]")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  icon: Icon,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  icon?: LucideIcon;
}) {
  return (
    <section className={cn("overflow-hidden rounded-[22px] border border-[#E9E9E2] bg-[#FBFBF8]/95 shadow-[0_14px_34px_-28px_rgba(52,60,34,0.55)]", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h2 className="flex items-center gap-2 text-[17px] font-normal text-[#121212]">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                {title}
              </h2>
            )}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn(bodyClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  text?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      {Icon && (
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <p className="text-[15px] font-semibold text-foreground">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Link styled as the standard primary / secondary button. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon: Icon,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
        variant === "primary" ? "bg-[#343C22] text-white hover:bg-[#4B5634]" : "border border-white bg-white/80 text-[#121212] shadow-[0_6px_16px_-12px_rgba(52,60,34,0.6)] hover:bg-white",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
    </Link>
  );
}

/** Table wrapper with the standard header style. */
export function DataTable({ head, children, className }: { head: React.ReactNode[]; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {head.map((h, i) => (
              <th key={i} scope="col" className="whitespace-nowrap px-5 py-3 text-xs font-medium text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}
