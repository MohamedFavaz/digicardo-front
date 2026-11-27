"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import * as React from "react";

/**
 * Meta (Facebook/Instagram) Pixel. Loads only when NEXT_PUBLIC_META_PIXEL_ID is set (Vercel env),
 * and only on public pages — never inside the dashboard, admin or partner panels.
 * Lets Meta Ads measure which ads bring visits, WhatsApp contacts and sign-ups.
 */
const PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || "").trim();
const PRIVATE = /^\/(dashboard|admin|agent|setup|partner-preview|internal-admin-sign-in|admin-login)(\/|$)/;

type Fbq = (...args: unknown[]) => void;

/** Send a standard Meta event (e.g. "Contact", "Lead"). Safe to call when the Pixel is off. */
export function trackMeta(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (fbq) fbq("track", event, params);
}

export function MetaPixel() {
  const pathname = usePathname() || "/";
  const enabled = /^\d{6,20}$/.test(PIXEL_ID) && !PRIVATE.test(pathname);
  const first = React.useRef(true);

  // Page views after client-side navigation (the first one is sent by the init script).
  React.useEffect(() => {
    if (!enabled) return;
    if (first.current) {
      first.current = false;
      return;
    }
    trackMeta("PageView");
  }, [pathname, enabled]);

  if (!enabled) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
