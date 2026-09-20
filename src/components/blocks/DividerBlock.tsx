import React from "react";
import type { DividerBlockConfig } from "@/types/blocks";

interface DividerBlockProps {
  config: DividerBlockConfig;
}

export function DividerBlock({ config }: DividerBlockProps) {
  const style = config.style || "line";

  if (style === "dots") {
    return (
      <div className="my-3 flex w-full items-center justify-center gap-1.5 py-1">
        <span className="h-1 w-1 rounded-full bg-slate-700" />
        <span className="h-1 w-1 rounded-full bg-slate-700" />
        <span className="h-1 w-1 rounded-full bg-slate-700" />
      </div>
    );
  }

  if (style === "space") {
    return <div className="h-6 w-full" aria-hidden="true" />;
  }

  return (
    <div className="my-3 flex w-full items-center py-1">
      <div className="w-full border-t border-slate-800/80" />
    </div>
  );
}
