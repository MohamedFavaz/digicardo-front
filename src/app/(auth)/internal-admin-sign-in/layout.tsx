import type { Metadata } from "next";
import type { ReactNode } from "react";

// Reached only through the secret ADMIN_LOGIN_PATH (see middleware.ts); never indexed or linked.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false, nocache: true },
};

export default function HiddenAdminSignInLayout({ children }: { children: ReactNode }) {
  return children;
}
