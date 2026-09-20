"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";
import type { ProfileDomain } from "@/types/domain";

export interface DisconnectDomainDialogProps {
  open: boolean;
  domain: ProfileDomain | null;
  mode: "delete" | "disable";
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DisconnectDomainDialog({
  open,
  domain,
  mode,
  isLoading,
  onClose,
  onConfirm,
}: DisconnectDomainDialogProps) {
  if (!open || !domain) return null;

  const isDelete = mode === "delete";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="relative w-full max-w-md rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-float space-y-5 animate-in zoom-in-95">
        {/* Header with Danger Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                {isDelete ? "Delete Custom Domain?" : "Disable Custom Domain?"}
              </h3>
              <p className="text-xs text-muted-foreground font-mono font-bold">
                {domain.domain || domain.normalized_domain}
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

        {/* Warning Explanation */}
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          {isDelete
            ? `Are you sure you want to completely remove "${domain.domain}"? This will unbind the domain and remove all verification records. Public traffic will no longer route through this address.`
            : `Are you sure you want to disable "${domain.domain}"? Public traffic will no longer route through this address until re-enabled.`}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full text-xs font-bold h-9 px-4 bg-card"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-full text-xs font-black h-9 px-5 bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin mr-1.5" />
            ) : isDelete ? (
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            ) : null}
            <span>{isDelete ? "Yes, Delete Domain" : "Yes, Disable"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
