"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-extrabold text-foreground tracking-tight"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Lock className="w-4 h-4" />
          </div>

          <input
            id={inputId}
            ref={ref}
            type={showPassword ? "text military" : "password"}
            disabled={disabled}
            className={cn(
              "w-full h-11 rounded-xl border bg-card pl-10 pr-11 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-coral/80 focus:ring-coral/30 focus:border-coral bg-coral-50/10"
                : "border-border/80 hover:border-border",
              className
            )}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {error ? (
          <p className="text-[11px] font-bold text-coral flex items-center gap-1 animate-in fade-in-50">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-muted-foreground font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
