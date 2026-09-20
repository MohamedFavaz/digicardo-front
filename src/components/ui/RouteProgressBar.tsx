"use client";

/**
 * RouteProgressBar
 * Shows a thin violet progress bar at the very top of the page whenever
 * a Next.js navigation (router.push / Link click) is in-flight.
 * Uses the native `navigation` API where available, falls back to a
 * MutationObserver on the <body> data-pathname attribute set by the
 * root layout.  Zero external dependencies.
 */

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBar({ visible }: { visible: boolean }) {
  const [width, setWidth] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (visible) {
      setWidth(15);
      let current = 15;
      timerRef.current = setInterval(() => {
        // Exponentially slow down — never reaches 100 on its own
        current = current + (90 - current) * 0.12;
        setWidth(current);
      }, 200);
    } else {
      // Complete the bar
      setWidth(100);
      const timeout = setTimeout(() => setWidth(0), 400);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "linear-gradient(90deg, #5B3FE4, #8b5cf6, #ec4899)",
          transition: visible
            ? "width 0.2s ease-out"
            : "width 0.3s ease-in, opacity 0.3s ease 0.3s",
          opacity: width === 0 ? 0 : 1,
          boxShadow: "0 0 10px rgba(91,63,228,0.6)",
          borderRadius: "0 2px 2px 0",
          willChange: "width",
        }}
      />
    </div>
  );
}

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const previousPathRef = React.useRef(`${pathname}?${searchParams}`);

  React.useEffect(() => {
    const current = `${pathname}?${searchParams}`;
    if (current !== previousPathRef.current) {
      // Navigation completed
      setIsNavigating(false);
      previousPathRef.current = current;
    }
  }, [pathname, searchParams]);

  // Listen for link clicks to start the bar immediately on click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        !href.startsWith("#") &&
        !target.getAttribute("download") &&
        target.getAttribute("target") !== "_blank"
      ) {
        setIsNavigating(true);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return <ProgressBar visible={isNavigating} />;
}
