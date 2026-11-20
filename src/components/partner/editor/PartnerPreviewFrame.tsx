"use client";

import * as React from "react";
import { Monitor, Smartphone } from "lucide-react";
import type { PartnerCard, PartnerContent } from "@/lib/partner/types";
import { cn } from "@/lib/utils";

const DESKTOP_WIDTH = 1280;

/**
 * Live preview of the landing page in an iframe at a real phone or desktop width (so the page's
 * own responsive layout is what you see). The draft is posted into the frame on every change.
 */
export function PartnerPreviewFrame({ content, showcase, slug }: { content: PartnerContent; showcase: PartnerCard[]; slug: string }) {
  const [device, setDevice] = React.useState<"desktop" | "phone">("desktop");
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [box, setBox] = React.useState({ w: 800, h: 700 });

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && (e.data as { type?: string })?.type === "partner-preview-ready") setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    frameRef.current?.contentWindow?.postMessage({ type: "partner-draft", draft: { content, showcase, slug } }, window.location.origin);
  }, [ready, content, showcase, slug, device]);

  React.useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = device === "desktop" ? Math.min(1, box.w / DESKTOP_WIDTH) : 1;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Live preview</p>
        <div role="tablist" aria-label="Preview size" className="inline-flex rounded-full bg-muted p-1">
          {(
            [
              ["desktop", Monitor, "Desktop"],
              ["phone", Smartphone, "Phone"],
            ] as const
          ).map(([id, Icon, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={device === id}
              onClick={() => {
                setReady(false);
                setDevice(id);
              }}
              className={cn("inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px]", device === id ? "bg-card font-medium text-foreground shadow-xs" : "text-muted-foreground")}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={boxRef} className="relative min-h-0 flex-1 overflow-hidden rounded-[24px] border border-border bg-[#E9E9E2]">
        {device === "desktop" ? (
          <iframe
            key="desktop"
            ref={frameRef}
            src="/partner-preview"
            title="Landing page preview (desktop)"
            className="absolute left-0 top-0 origin-top-left border-0 bg-white"
            style={{ width: DESKTOP_WIDTH, height: box.h / scale, transform: `scale(${scale})` }}
          />
        ) : (
          <div className="flex h-full items-start justify-center overflow-auto p-4">
            <iframe
              key="phone"
              ref={frameRef}
              src="/partner-preview"
              title="Landing page preview (phone)"
              className="h-[760px] w-[390px] shrink-0 rounded-[36px] border-[8px] border-[#121212] bg-white shadow-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
