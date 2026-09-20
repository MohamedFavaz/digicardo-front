"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, X, Plus, AlertCircle } from "lucide-react";
import { validateDomainInput } from "@/lib/domains/utils";

export interface ConnectDomainDialogProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (domain: string) => Promise<void>;
}

export function ConnectDomainDialog({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: ConnectDomainDialogProps) {
  const [domainInput, setDomainInput] = React.useState("");
  const [inputError, setInputError] = React.useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const validation = validateDomainInput(domainInput);
    if (!validation.isValid) {
      setInputError(validation.error || "Invalid domain format.");
      return;
    }

    try {
      await onSubmit(domainInput.trim());
      setDomainInput("");
      onClose();
    } catch (err: unknown) {
      setInputError(err instanceof Error ? err.message : "Failed to register domain.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="relative w-full max-w-lg rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-float space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">
                Connect Custom Domain
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Route your custom web address directly to your Digicardo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-foreground">
              Domain Name
            </label>
            <Input
              type="text"
              placeholder="e.g. alexrivers.com or links.mystudio.io"
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              className="h-11 rounded-2xl border-input bg-card font-mono text-sm px-4"
              autoFocus
              required
            />
            <p className="text-[11px] text-muted-foreground font-medium">
              Enter an apex domain (<strong className="text-foreground">example.com</strong>) or subdomain (<strong className="text-foreground">links.example.com</strong>).
            </p>
          </div>

          {inputError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full text-xs font-bold h-10 px-5 bg-card"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="pill"
              size="sm"
              disabled={isSubmitting || !domainInput.trim()}
              className="h-10 px-6 gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-cta"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Continue to DNS Setup</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
