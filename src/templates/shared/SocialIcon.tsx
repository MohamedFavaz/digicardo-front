import * as React from "react";
import type { SocialPlatform } from "@/lib/zod/content";

/**
 * One line-icon set for social links on every card (24px grid, 1.8 stroke, round caps) —
 * the same style as lucide, which the rest of the card uses.
 */

type IconParts = React.ReactNode;

const PATHS: Record<SocialPlatform, IconParts> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  facebook: <path d="M15 3h-2a4 4 0 0 0-4 4v14M6 11h8" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
  x: <path d="M5 4l14 16M19 4L5 20" />,
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.6 2.3 4.3 5 4.6" />,
  whatsapp: (
    <>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
      <path d="M9.5 9.5c0 2.5 2.5 5 5 5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z" />
    </>
  ),
  whatsapp_channel: (
    <>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  telegram: <path d="M21 4L3 11l6 2 2 6 3-4 5 4zM9 13l12-9" />,
  github: (
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.3-.3-2.5-1-3.5.3-1.2.3-2.4 0-3.5 0 0-1 0-3 1.5a14 14 0 0 0-8 0C6 2 5 2 5 2c-.3 1.1-.3 2.3 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1-.9 1.6-.2.6-.2 1.2-.1 1.9v4M9 18c-4.5 2-5-2-7-2" />
  ),
  snapchat: (
    <path d="M12 3c2.8 0 5 2.1 5 5v2.4l2 .8-1.6 1.4c.6 1.4 1.8 2.4 3.1 2.8-.6.8-1.8 1-2.8 1.1-.3.6-.4 1.2-1.1 1.2-.8 0-1.6-.6-3-.6s-2 1.4-3.6 1.4-2.2-1.4-3.6-1.4c-.7 0-.8-.6-1.1-1.2-1-.1-2.2-.3-2.8-1.1 1.3-.4 2.5-1.4 3.1-2.8L3.6 11.2l2-.8V8c0-2.9 2.2-5 5-5z" />
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M11 8h2.5a3 3 0 0 1 0 6H11M11 8v13" />
    </>
  ),
  threads: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
    </>
  ),
  discord: (
    <>
      <path d="M8.5 7.5a12 12 0 0 1 7 0M7.5 16.5c3 1.3 6 1.3 9 0M8 7c-2 .3-3.5 1-3.5 1S3 11 3 16c1.5 1.6 3.5 2 3.5 2l1-2M16 7c2 .3 3.5 1 3.5 1S21 11 21 16c-1.5 1.6-3.5 2-3.5 2l-1-2" />
      <circle cx="9.5" cy="12.5" r="1" />
      <circle cx="14.5" cy="12.5" r="1" />
    </>
  ),
  twitch: <path d="M4 3h16v11l-4 4h-4l-3 3v-3H4zM11 7v4M15 7v4" />,
  spotify: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 10c3-1 6.5-.8 9 .7M8 13.3c2.5-.7 5-.5 7 .6M8.6 16.3c2-.5 3.8-.3 5.4.5" />
    </>
  ),
  behance: <path d="M3 7h5a2.5 2.5 0 0 1 0 5H3zM3 12h5.5a2.5 2.5 0 0 1 0 5H3zM15 7.5h4.5M14 14h7a3.5 3.5 0 1 0-1.2 2.6" />,
  dribbble: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9.5c5 .5 11-1 15-5M8 3.8c3 4 5 9.5 6 16.6M3.2 13.5c4-3 10-3.5 17.6-1" />
    </>
  ),
  medium: (
    <>
      <circle cx="7" cy="12" r="4.5" />
      <ellipse cx="15.5" cy="12" rx="2" ry="4.2" />
      <path d="M20.5 8v8" />
    </>
  ),
  reddit: (
    <>
      <ellipse cx="12" cy="14.5" rx="8" ry="5.5" />
      <circle cx="18.5" cy="5.5" r="1.5" />
      <path d="M12 9l1.5-5 3.5 1M9.5 17c1.5 1 3.5 1 5 0M9 13.5v.01M15 13.5v.01" />
    </>
  ),
  google_business: <path d="M20 12h-8M20.6 12A8.6 8.6 0 1 1 18 5.9" />,
  website: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  other: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  whatsapp_channel: "WhatsApp channel",
  telegram: "Telegram",
  github: "GitHub",
  snapchat: "Snapchat",
  pinterest: "Pinterest",
  threads: "Threads",
  discord: "Discord",
  twitch: "Twitch",
  spotify: "Spotify",
  behance: "Behance",
  dribbble: "Dribbble",
  medium: "Medium",
  reddit: "Reddit",
  google_business: "Google reviews",
  website: "Website",
  other: "Link",
};

export function SocialIcon({ platform, className = "h-5 w-5" }: { platform: SocialPlatform; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[platform] ?? PATHS.other}
    </svg>
  );
}

/** Any icon a card button can show (lucide icons and the social glyphs). */
export type CardIcon = React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

export function WhatsAppGlyph({ className }: { className?: string }) {
  return <SocialIcon platform="whatsapp" className={className} />;
}
