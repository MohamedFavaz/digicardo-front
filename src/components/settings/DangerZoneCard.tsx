"use client";

import * as React from "react";
import { Trash2, TriangleAlert } from "lucide-react";
import { SettingsSection } from "./SettingsSection";

export interface DangerZoneCardProps {
  onOpenDeleteModal: () => void;
}

export function DangerZoneCard({ onOpenDeleteModal }: DangerZoneCardProps) {
  return (
    <SettingsSection icon={TriangleAlert} tone="danger" title="Delete account" description="Removes your account and card for good. This can't be undone.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[#52525B]">
          Your card goes offline straight away, and its link, photos, messages and custom domain are deleted. Any plan you have is cancelled.
        </p>
        <button
          id="open-delete-account-modal-btn"
          type="button"
          onClick={onOpenDeleteModal}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#F5C2C2] bg-card px-4 text-sm font-semibold text-destructive transition-colors hover:bg-[#FDECEC]"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete account
        </button>
      </div>
    </SettingsSection>
  );
}
