"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layers, Palette } from "lucide-react";
import { DoodleSparkle } from "@/components/ui/playful/Doodles";

export function EditorEmptyState() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-5 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-2xs flex-shrink-0">
            <Palette className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Card Content &amp; Actions
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Manage your contact buttons, services, and profile information.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/editor?tab=design"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-2xs transition-all active:scale-98"
        >
          <Palette className="w-3.5 h-3.5 text-zinc-300" />
          <span>Edit Card Details</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-zinc-100 text-xs">
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
          <span className="font-bold text-zinc-800 block">Contact Actions</span>
          <span className="text-[11px] text-zinc-500 block">Call, WhatsApp, Email, Location</span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
          <span className="font-bold text-zinc-800 block">Services &amp; Booking</span>
          <span className="text-[11px] text-zinc-500 block">Card services, payments, and modals</span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
          <span className="font-bold text-zinc-800 block">Colors &amp; Theme</span>
          <span className="text-[11px] text-zinc-500 block">Backgrounds, typography, and accents</span>
        </div>
      </div>
    </div>
  );
}

