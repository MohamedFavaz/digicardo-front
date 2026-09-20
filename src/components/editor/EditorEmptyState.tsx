"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layers, Palette } from "lucide-react";
import { DoodleSparkle } from "@/components/ui/playful/Doodles";

export function EditorEmptyState() {
  return (
    <div className="rounded-[36px] border border-dashed border-border bg-card/60 p-10 sm:p-14 text-center space-y-5 shadow-xs select-none">
      <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-cta">
        <Layers className="w-8 h-8" />
        <DoodleSparkle className="absolute -top-3 -right-3 w-6 h-6 text-amber-400" />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
          No extra blocks on your page ✨
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          Your card contact details, links, services, and profile settings are configured directly in the Appearance studio.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/dashboard/appearance">
          <Button
            variant="pill"
            size="lg"
            className="gap-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-cta h-12 px-7 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0"
          >
            <Palette className="w-4 h-4" />
            <span>Customize in Appearance</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

