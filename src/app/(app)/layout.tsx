import * as React from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { nestlyThemeClass } from "@/lib/fonts/nestly";

// Owner dashboard in the "Nestly" look (see `.theme-nestly` in globals.css).
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={nestlyThemeClass}>
      <AppShell>{children}</AppShell>
    </div>
  );
}
