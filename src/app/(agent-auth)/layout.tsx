"use client";
import { ReactNode } from "react";

export default function AgentAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      {children}
    </div>
  );
}

