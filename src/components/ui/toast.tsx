import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id?: string;
  type?: ToastType;
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles: Record<ToastType, { wrapper: string; iconColor: string; badge: string }> = {
  success: {
    wrapper: "border-mint/30 bg-card text-foreground shadow-soft",
    iconColor: "text-mint",
    badge: "bg-mint-50 text-mint-700 border-mint/20",
  },
  error: {
    wrapper: "border-coral/30 bg-card text-foreground shadow-soft",
    iconColor: "text-coral",
    badge: "bg-coral-50 text-coral-700 border-coral/20",
  },
  warning: {
    wrapper: "border-amber/40 bg-card text-foreground shadow-soft",
    iconColor: "text-amber",
    badge: "bg-amber-50 text-amber-700 border-amber/30",
  },
  info: {
    wrapper: "border-brand-200 bg-card text-foreground shadow-soft",
    iconColor: "text-brand-600",
    badge: "bg-brand-50 text-brand-700 border-brand-200",
  },
};

export function Toast({
  type = "info",
  title,
  description,
  onClose,
  className,
}: ToastProps) {
  const Icon = toastIcons[type];
  const styles = toastStyles[type];

  return (
    <div
      className={cn(
        "flex items-start gap-3.5 rounded-2xl border p-4 shadow-float transition-all duration-200 animate-in fade-in slide-in-from-top-3 max-w-md w-full bg-card",
        styles.wrapper,
        className
      )}
      role="alert"
    >
      <div className={cn("mt-0.5 rounded-xl p-1.5", styles.badge)}>
        <Icon className={cn("h-5 w-5", styles.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-foreground leading-snug">{title}</h4>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
