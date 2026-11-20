import { Suspense } from "react";
import type { Metadata } from "next";
import { SetupWizard } from "@/components/setup/SetupWizard";

export const metadata: Metadata = { title: "Set up your card · Digicardo", robots: { index: false } };

export default function SetupPage() {
  return (
    <Suspense fallback={null}>
      <SetupWizard />
    </Suspense>
  );
}
