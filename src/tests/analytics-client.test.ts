import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEventBeacon } from "@/lib/analytics/client";

describe("sendEventBeacon", () => {
  const mockEvent = {
    profile_id: "01J5K2PROFILE000000000001",
    event_type: "profile_view" as const,
    referrer: "https://google.com",
    occurred_at: "2026-08-15T12:00:00Z",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { referrer: "https://google.com" });
  });

  it("uses navigator.sendBeacon when available", () => {
    const sendBeaconMock = vi.fn().mockReturnValue(true);
    vi.stubGlobal("navigator", { sendBeacon: sendBeaconMock });

    const result = sendEventBeacon(mockEvent);

    expect(result).toBe(true);
    expect(sendBeaconMock).toHaveBeenCalledTimes(1);
    const [endpoint, blob] = sendBeaconMock.mock.calls[0];
    expect(endpoint).toBe("/api/bff/v1/analytics/events");
    expect(blob).toBeInstanceOf(Blob);
  });

  it("falls back to fetch with keepalive when sendBeacon is unavailable", () => {
    vi.stubGlobal("navigator", { sendBeacon: undefined });
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ accepted: true })));
    vi.stubGlobal("fetch", fetchMock);

    const result = sendEventBeacon(mockEvent);

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/bff/v1/analytics/events",
      expect.objectContaining({
        method: "POST",
        keepalive: true,
      })
    );
  });

  it("does not throw or break when network fails", () => {
    vi.stubGlobal("navigator", { sendBeacon: undefined });
    const fetchMock = vi.fn().mockRejectedValue(new Error("Network connection dropped"));
    vi.stubGlobal("fetch", fetchMock);

    expect(() => {
      const result = sendEventBeacon(mockEvent);
      expect(result).toBe(true);
    }).not.toThrow();
  });
});
