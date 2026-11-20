"use client";

import * as React from "react";
import { PartnerLanding } from "@/components/partner/PartnerLanding";
import type { PartnerCard, PartnerContent } from "@/lib/partner/types";

type Draft = { content: PartnerContent; showcase: PartnerCard[]; slug: string };

/**
 * Live preview of the agent's landing page inside the editor's iframe (real phone / desktop
 * widths). The editor posts the unsaved draft here; nothing is fetched.
 */
export default function PartnerPreviewPage() {
  const [draft, setDraft] = React.useState<Draft | null>(null);

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; draft?: Draft };
      if (data?.type === "partner-draft" && data.draft) setDraft(data.draft);
    };
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "partner-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!draft) return <div className="min-h-screen bg-[#F3F2EE]" />;
  return <PartnerLanding content={draft.content} showcase={draft.showcase} slug={draft.slug} preview />;
}
