import type { Metadata } from "next";
import type { ReactNode } from "react";

// Reached through /admin-login (see middleware.ts); never indexed.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false, nocache: true },
};

export default function HiddenAdminSignInLayout({ children }: { children: ReactNode }) {
  return children;
}
