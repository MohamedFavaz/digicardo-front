"use client";

import * as React from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Download, Mail } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
import type { CardContent } from "@/lib/zod/content";
import { Sheet } from "./Sheet";
import { CardQr, downloadQrPng } from "./CardQr";
import { SocialIcon } from "./SocialIcon";
import { upiHref } from "./actions";
import type { CardModel } from "./useCard";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the value is visible and selectable anyway.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[var(--c-btn-r)] bg-[var(--c-soft)] px-3.5 text-[13px] font-semibold text-[var(--c-accent)]"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--c-border)] py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-[var(--c-ink2)]">{label}</div>
        <div className="truncate text-[15px] font-semibold">{value}</div>
      </div>
      <CopyButton value={value} label={label} />
    </div>
  );
}

function ShareSheet({ card }: { card: CardModel }) {
  const name = card.content.identity.name;
  const message = `${name} — ${card.cardUrl}`;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-[14px] border border-[var(--c-border)] p-3">
        <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{card.cardUrl.replace(/^https?:\/\//, "")}</span>
        <CopyButton value={card.cardUrl} label="link" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-[var(--c-btn-r)] border border-[var(--c-border-strong)] text-[14px] font-semibold"
        >
          <SocialIcon platform="whatsapp" className="h-5 w-5" />
          WhatsApp
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`}
          className="flex h-12 items-center justify-center gap-2 rounded-[var(--c-btn-r)] border border-[var(--c-border-strong)] text-[14px] font-semibold"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          Email
        </a>
      </div>
    </div>
  );
}

function QrSheet({ card }: { card: CardModel }) {
  return (
    <div className="flex flex-col items-center gap-4 pb-1">
      <div className="rounded-[18px] border border-[var(--c-border)] bg-white p-3">
        <CardQr value={card.cardUrl} size={220} />
      </div>
      <p className="text-center text-[14px] text-[var(--c-ink2)]">Point a phone camera at the code to open this card.</p>
      <button
        type="button"
        onClick={() => downloadQrPng(card.cardUrl, card.content.identity.name || "card")}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--c-btn-r)] bg-[var(--c-accent)] text-[15px] font-semibold text-[var(--c-on-accent)]"
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        Download QR
      </button>
    </div>
  );
}

function BankSheet({ content }: { content: CardContent }) {
  const { payments, identity } = content;
  const { bank } = payments;
  const upi = upiHref(payments.upi_id, payments.upi_name || identity.name);
  return (
    <div className="flex flex-col">
      {payments.upi_id && <ValueRow label="UPI ID" value={payments.upi_id} />}
      {payments.payment_phone && <ValueRow label="UPI number" value={payments.payment_phone} />}
      {bank.holder && <ValueRow label="Account name" value={bank.holder} />}
      {bank.bank_name && <ValueRow label="Bank" value={bank.bank_name} />}
      {bank.account_number && <ValueRow label="Account number" value={bank.account_number} />}
      {bank.ifsc && <ValueRow label="IFSC" value={bank.ifsc} />}
      {upi && (
        <a
          href={upi}
          className="mt-4 inline-flex h-12 items-center justify-center rounded-[var(--c-btn-r)] bg-[var(--c-accent)] text-[15px] font-semibold text-[var(--c-on-accent)]"
        >
          Open a UPI app
        </a>
      )}
    </div>
  );
}

/** The full address, readable and copyable. Directions stay on the card's Location button. */
function AddressSheet({ content }: { content: CardContent }) {
  const address = content.contact.address.trim();
  return (
    <div className="flex items-start gap-3 py-1">
      <p className="min-w-0 flex-1 whitespace-pre-line break-words text-[16px] font-medium leading-6">{address}</p>
      <CopyButton value={address} label="address" />
    </div>
  );
}

function GallerySheet({ images, index, onIndex }: { images: string[]; index: number; onIndex: (i: number) => void }) {
  const count = images.length;
  const go = (delta: number) => onIndex((index + delta + count) % count);
  return (
    <div className="flex flex-col gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- owner-uploaded media of any size */}
      <img
        src={resolveMediaUrl(images[index])}
        alt={`Photo ${index + 1} of ${count}`}
        className="max-h-[56vh] w-full rounded-[14px] bg-[var(--c-soft)] object-contain"
      />
      {count > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--c-border-strong)]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-[13px] font-medium text-[var(--c-ink2)]">
            {index + 1} of {count}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--c-border-strong)]"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

/** The one sheet a card can have open at a time. */
export function CardSheets({ card }: { card: CardModel }) {
  const { sheet, closeSheet, isPreview, content } = card;
  if (!sheet) return null;

  const titles = {
    share: "Share this card",
    qr: "Scan to open this card",
    bank: "Payment details",
    address: "Address",
    gallery: content.gallery.title || "Photos",
  } as const;

  return (
    <Sheet open title={titles[sheet.kind]} onClose={closeSheet} contained={isPreview}>
      {sheet.kind === "share" && <ShareSheet card={card} />}
      {sheet.kind === "qr" && <QrSheet card={card} />}
      {sheet.kind === "bank" && <BankSheet content={content} />}
      {sheet.kind === "address" && <AddressSheet content={content} />}
      {sheet.kind === "gallery" && (
        <GallerySheet
          images={content.gallery.images}
          index={sheet.index}
          onIndex={(index) => card.setSheet({ kind: "gallery", index })}
        />
      )}
    </Sheet>
  );
}
