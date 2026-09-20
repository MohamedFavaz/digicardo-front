import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — Digicardo",
  description: "Secure administrator login",
};

// The admin login page does NOT use the admin sidebar layout.
// It is a full-screen standalone page.
export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
