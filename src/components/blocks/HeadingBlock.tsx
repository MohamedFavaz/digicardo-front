import React from "react";
import type { HeadingBlockConfig } from "@/types/blocks";

interface HeadingBlockProps {
  config: HeadingBlockConfig;
}

export function HeadingBlock({ config }: HeadingBlockProps) {
  const level = config.level || "h2";

  if (level === "h1") {
    return (
      <h1 className="w-full pt-4 pb-2 text-center text-2xl font-bold tracking-tight text-white">
        {config.text}
      </h1>
    );
  }

  if (level === "h3") {
    return (
      <h3 className="w-full pt-2 pb-1 text-center text-base font-semibold tracking-wide text-slate-300">
        {config.text}
      </h3>
    );
  }

  return (
    <h2 className="w-full pt-3 pb-1.5 text-center text-lg font-bold tracking-tight text-indigo-400">
      {config.text}
    </h2>
  );
}
