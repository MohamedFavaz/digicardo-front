"use client";

import * as React from "react";

/** "09:00 AM – 06:00 PM" / "9-18" → minutes since midnight, or null when it isn't a simple range. */
export function parseHours(text: string): { open: number; close: number } | null {
  const times = [...text.matchAll(/(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?/gi)].slice(0, 2);
  if (times.length < 2) return null;
  const toMinutes = (m: RegExpMatchArray) => {
    let h = Number(m[1]);
    const min = Number(m[2] ?? 0);
    const ampm = m[3]?.toLowerCase();
    if (h > 24 || min > 59) return null;
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    return h * 60 + min;
  };
  const open = toMinutes(times[0]);
  const close = toMinutes(times[1]);
  return open === null || close === null || open === close ? null : { open, close };
}

/** Open / closed right now (computed in the browser only, so server HTML stays stable). */
export function useOpenNow(hours: string): boolean | null {
  const [open, setOpen] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const range = parseHours(hours);
    if (!range) return setOpen(null);
    const check = () => {
      const now = new Date();
      const m = now.getHours() * 60 + now.getMinutes();
      setOpen(range.close > range.open ? m >= range.open && m < range.close : m >= range.open || m < range.close);
    };
    check();
    const timer = window.setInterval(check, 60_000);
    return () => window.clearInterval(timer);
  }, [hours]);
  return open;
}
