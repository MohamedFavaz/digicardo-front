"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Trash2 } from "lucide-react";

export interface DangerZoneCardProps {
  onOpenDeleteModal: () => void;
}

export function DangerZoneCard({ onOpenDeleteModal }: DangerZoneCardProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/20 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-rose-900">
            Danger Zone
          </h2>
          <p className="text-xs text-rose-700/80 font-medium">
            Permanently delete your account and all associated profiles.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-2xl">
        Deleting your account will immediately unpublish your profiles, revoke custom domains, purge all content blocks, and cancel active access. This action cannot be reversed.
      </p>

      <div>
        <Button
          id="open-delete-account-modal-btn"
          type="button"
          size="sm"
          onClick={onOpenDeleteModal}
          className="rounded-lg text-xs font-medium h-9 px-4 bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Account</span>
        </Button>
      </div>
    </div>
  );
}
