import * as React from "react";
import { LogoMark } from "@/components/ui/DigicardoLogo";
import Link from "next/link";
import type { FontFamily } from "@/types/profile";
import { GOOGLE_FONT_FAMILIES } from "./palette";

/**
 * Loads the card's font from Google Fonts. Only allowlisted family names are possible
 * (FONT_ALLOWLIST), so the URL never contains user text. React 19 hoists the stylesheet
 * into <head> and de-duplicates it.
 */
export function CardFonts({ fonts }: { fonts: FontFamily[] }) {
  const families = [...new Set(fonts)].map((f) => GOOGLE_FONT_FAMILIES[f]).filter(Boolean);
  if (families.length === 0) return null;
  const href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
  return <link rel="stylesheet" href={href} precedence="default" />;
}

/** Footer for cards made by an agent: "Card by {brand}", linking to the agent's page. */
export function AgentBranding({ name, url }: { name: string; url: string }) {
  return (
    <div className="flex justify-center px-5 pb-6 pt-7" data-testid="agent-branding-badge">
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--c-ink3,#6B6B76)] transition-colors hover:text-[var(--c-ink,#18181B)]"
      >
        Card by <span className="font-semibold text-[var(--c-ink,#18181B)]">{name}</span>
      </a>
    </div>
  );
}

/** "Made with Digicardo" footer link. */
export function CardBranding() {
  return (
    <div className="flex justify-center px-5 pb-6 pt-7" data-testid="digicardo-branding-badge">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--c-ink3,#6B6B76)] transition-colors hover:text-[var(--c-ink,#18181B)]"
      >
        Made with
        <LogoMark size={14} />
        <span className="font-semibold text-[var(--c-ink,#18181B)]">Digicardo</span>
      </Link>
    </div>
  );
}
