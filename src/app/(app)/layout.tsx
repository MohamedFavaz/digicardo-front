import * as React from "react";
import { AppShell } from "@/components/dashboard/AppShell";

// Digicardo Studio App Layout Shell
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
