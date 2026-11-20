import * as React from "react";
import { Globe, MapPin, MessageCircle, Phone } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import type { PartnerCard } from "@/lib/partner/types";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "·"
  );
}

/** Illustrative example cards when an agent hasn't picked any yet (clearly sample content). */
export const SAMPLE_CARDS: PartnerCard[] = [
  { id: "s1", username: "", name: "Spice Garden", role: "Restaurant · Kochi", avatar_url: null, cover_url: null, template_id: "", is_public: true, url: "" },
  { id: "s2", username: "", name: "Dr. Anjali Rao", role: "Dentist", avatar_url: null, cover_url: null, template_id: "", is_public: true, url: "" },
  { id: "s3", username: "", name: "Urban Sole", role: "Shoe store", avatar_url: null, cover_url: null, template_id: "", is_public: true, url: "" },
];

const SWATCHES = ["#B0C08F", "#E9A77F", "#8DB4EE", "#C9B6E4", "#E8C27A"];

/** A small phone showing a digital card — used in the hero and the showcase. */
export function PartnerPhone({ card, index = 0, className = "" }: { card: PartnerCard; index?: number; className?: string }) {
  const cover = card.cover_url ? resolveMediaUrl(card.cover_url) : null;
  const avatar = card.avatar_url ? resolveMediaUrl(card.avatar_url) : null;
  const swatch = SWATCHES[index % SWATCHES.length];
  return (
    <div className={`overflow-hidden rounded-[30px] border-[6px] border-[#121212] bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] ${className}`}>
      <div className="relative h-[38%] min-h-[96px]" style={{ background: cover ? undefined : `linear-gradient(135deg, ${swatch}, #ffffff)` }}>
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element -- card cover
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/70" aria-hidden="true" />
      </div>
      <div className="relative -mt-8 flex flex-col items-center px-3 pb-4 text-center">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- card avatar
          <img src={avatar} alt="" className="h-16 w-16 rounded-full border-4 border-white object-cover shadow" />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-lg font-semibold text-[#121212] shadow" style={{ background: swatch }}>
            {initials(card.name)}
          </span>
        )}
        <p className="mt-2 line-clamp-1 text-[15px] font-semibold text-[#121212]">{card.name}</p>
        {card.role && <p className="line-clamp-1 text-[11px] text-[#6B6B76]">{card.role}</p>}
        <div className="mt-3 grid w-full grid-cols-2 gap-1.5">
          <span className="flex h-8 items-center justify-center gap-1 rounded-lg bg-[#121212] text-[10px] font-semibold text-white">
            <Phone className="h-3 w-3" aria-hidden="true" /> Call
          </span>
          <span className="flex h-8 items-center justify-center gap-1 rounded-lg bg-[#25D366] text-[10px] font-semibold text-white">
            <MessageCircle className="h-3 w-3" aria-hidden="true" /> WhatsApp
          </span>
        </div>
        <div className="mt-2.5 flex gap-2 text-[#6B6B76]" aria-hidden="true">
          {[Globe, MapPin, MessageCircle].map((Icon, i) => (
            <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F4F5]">
              <Icon className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
        <div className="mt-3 w-full space-y-1.5" aria-hidden="true">
          <span className="block h-2 rounded-full bg-[#F1F1F3]" />
          <span className="block h-2 w-4/5 rounded-full bg-[#F1F1F3]" />
        </div>
      </div>
    </div>
  );
}
