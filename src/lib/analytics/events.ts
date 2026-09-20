import { sendEventBeacon } from "./client";

/**
 * Extract hostname cleanly from URL for safe analytics metadata.
 */
function extractHostname(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

/**
 * Track a page view on a public profile.
 */
export function trackProfileView(profileId: string, referrer?: string): void {
  sendEventBeacon({
    profile_id: profileId,
    event_type: "profile_view",
    referrer,
  });
}

/**
 * Track when a user clicks a link block.
 */
export function trackLinkClick(profileId: string, blockId: string, url?: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "link_click",
    metadata: {
      destination_host: extractHostname(url),
    },
  });
}

/**
 * Track when a user clicks a social block.
 */
export function trackSocialClick(profileId: string, blockId: string, platform?: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "social_click",
    metadata: {
      provider: platform,
    },
  });
}

/**
 * Track when a user clicks a call-to-action block.
 */
export function trackCtaClick(profileId: string, blockId: string, url?: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "cta_click",
    metadata: {
      destination_host: extractHostname(url),
    },
  });
}

/**
 * Track when a user clicks an email action block.
 */
export function trackEmailClick(profileId: string, blockId: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "email_click",
  });
}

/**
 * Track when a user clicks a phone call action block.
 */
export function trackPhoneClick(profileId: string, blockId: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "phone_click",
  });
}

/**
 * Track when a user clicks a WhatsApp chat action block.
 */
export function trackWhatsAppClick(profileId: string, blockId: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "whatsapp_click",
  });
}

/**
 * Track when a user clicks an appointment booking block.
 */
export function trackBookingClick(profileId: string, blockId: string, provider?: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "booking_click",
    metadata: {
      provider,
    },
  });
}

/**
 * Track when a user clicks an image block.
 */
export function trackImageClick(profileId: string, blockId: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "image_click",
  });
}

/**
 * Track when a user plays a video block.
 */
export function trackVideoPlay(profileId: string, blockId: string, provider?: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "video_play",
    metadata: {
      provider,
    },
  });
}

/**
 * Track when a user opens an image in the gallery lightbox.
 */
export function trackGalleryOpen(profileId: string, blockId: string, imageIndex?: number): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "gallery_open",
    metadata: {
      image_index: imageIndex,
    },
  });
}

/**
 * Track when a user expands a FAQ item.
 */
export function trackFaqOpen(profileId: string, blockId: string, itemIndex?: number): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "faq_open",
    metadata: {
      item_index: itemIndex,
    },
  });
}

/**
 * Track when a countdown timer finishes.
 */
export function trackCountdownComplete(profileId: string, blockId: string): void {
  sendEventBeacon({
    profile_id: profileId,
    block_id: blockId,
    event_type: "countdown_complete",
  });
}
