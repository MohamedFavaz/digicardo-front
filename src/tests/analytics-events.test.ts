import { describe, it, expect, vi, beforeEach } from "vitest";
import * as clientModule from "@/lib/analytics/client";
import {
  trackProfileView,
  trackLinkClick,
  trackCtaClick,
  trackSocialClick,
  trackEmailClick,
  trackPhoneClick,
  trackWhatsAppClick,
  trackBookingClick,
  trackVideoPlay,
  trackGalleryOpen,
  trackFaqOpen,
  trackCountdownComplete,
} from "@/lib/analytics/events";

describe("Analytics Event Helpers", () => {
  let beaconSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    beaconSpy = vi.spyOn(clientModule, "sendEventBeacon").mockReturnValue(true) as unknown as ReturnType<typeof vi.fn>;
  });

  it("trackProfileView dispatches correct profile_view payload", () => {
    trackProfileView("01J5K2PROFILE000000000001", "https://twitter.com");

    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "01J5K2PROFILE000000000001",
        event_type: "profile_view",
        referrer: "https://twitter.com",
      })
    );
  });

  it("trackLinkClick extracts normalized hostname and dispatches link_click", () => {
    trackLinkClick("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000001", "https://www.github.com/torvalds");

    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "01J5K2PROFILE000000000001",
        block_id: "01J5K2BLOCK0000000000001",
        event_type: "link_click",
        metadata: {
          destination_host: "github.com",
        },
      })
    );
  });

  it("trackCtaClick dispatches cta_click with destination host", () => {
    trackCtaClick("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000002", "https://store.example.com/checkout");

    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "01J5K2PROFILE000000000001",
        block_id: "01J5K2BLOCK0000000000002",
        event_type: "cta_click",
        metadata: {
          destination_host: "store.example.com",
        },
      })
    );
  });

  it("trackSocialClick dispatches social_click with provider", () => {
    trackSocialClick("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000003", "youtube");

    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "01J5K2PROFILE000000000001",
        block_id: "01J5K2BLOCK0000000000003",
        event_type: "social_click",
        metadata: {
          provider: "youtube",
        },
      })
    );
  });

  it("trackEmailClick and trackPhoneClick dispatch appropriate contact event types", () => {
    trackEmailClick("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000004");
    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "email_click",
      })
    );

    trackPhoneClick("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000005");
    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "phone_click",
      })
    );

    trackWhatsAppClick("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000006");
    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "whatsapp_click",
      })
    );
  });

  it("trackGalleryOpen, trackFaqOpen, trackCountdownComplete, trackBookingClick, and trackVideoPlay track rich interaction events", () => {
    trackBookingClick("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000006", "calendly");
    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "booking_click",
        metadata: { provider: "calendly" },
      })
    );

    trackVideoPlay("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000006", "youtube");
    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "video_play",
        metadata: { provider: "youtube" },
      })
    );

    trackGalleryOpen("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000007", 3);
    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "gallery_open",
        metadata: { image_index: 3 },
      })
    );

    trackFaqOpen("01J5K2PROFILE000000000001", "01J5K2BLOCK0000000000008", 1);
    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "faq_open",
        metadata: { item_index: 1 },
      })
    );

    trackCountdownComplete("01J5K2PROFILE000000000001", "01J5K2BLOCK000000000009");
    expect(beaconSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "countdown_complete",
      })
    );
  });
});
