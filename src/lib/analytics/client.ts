import type { TrackEventInput } from "./types";

const ANALYTICS_ENDPOINT = "/api/bff/v1/analytics/events";

/**
 * Dispatches an analytics event asynchronously without blocking browser navigation.
 * Uses navigator.sendBeacon where available, falling back to fetch with keepalive: true.
 */
export function sendEventBeacon(event: TrackEventInput): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const payload = {
    profile_id: event.profile_id,
    event_type: event.event_type,
    block_id: event.block_id || null,
    referrer: event.referrer || (typeof document !== "undefined" ? document.referrer : null),
    metadata: event.metadata || null,
    occurred_at: event.occurred_at || new Date().toISOString(),
  };

  const jsonString = JSON.stringify(payload);

  try {
    // Priority 1: navigator.sendBeacon
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([jsonString], { type: "application/json" });
      const queued = navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
      if (queued) {
        return true;
      }
    }

    // Priority 2: fetch with keepalive
    if (typeof fetch === "function") {
      fetch(ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
        keepalive: true,
      }).catch(() => {
        // Suppress analytics network errors to avoid breaking user interactions
      });
      return true;
    }
  } catch {
    // Non-blocking fire-and-forget fallback
  }

  return false;
}
