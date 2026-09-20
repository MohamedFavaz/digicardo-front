import React from "react";
import type { TextBlockConfig } from "@/types/blocks";

interface TextBlockProps {
  config: TextBlockConfig;
}

export function TextBlock({ config }: TextBlockProps) {
  const alignClass =
    config.align === "left"
      ? "text-left"
      : config.align === "right"
      ? "text-right"
      : "text-center";

  return (
    <div className={`w-full py-1 text-sm leading-relaxed text-slate-300 ${alignClass}`}>
      <p className="whitespace-pre-line">{config.content}</p>
    </div>
  );
}
