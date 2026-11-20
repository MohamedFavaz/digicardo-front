import type { CardContent } from "@/lib/zod/content";

/** Escapes a vCard 3.0 text value (RFC 2426 §5): backslash, comma, semicolon, newline. */
export function vcfEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/** Builds a vCard 3.0 file for "Save contact". Only filled fields are included. */
export function buildVCard(content: CardContent, cardUrl?: string): string {
  const { identity, contact } = content;
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${vcfEscape(identity.name)}`];

  const parts = identity.name.trim().split(/\s+/);
  const family = parts.length > 1 ? parts[parts.length - 1] : "";
  const given = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] ?? "";
  lines.push(`N:${vcfEscape(family)};${vcfEscape(given)};;;`);

  if (identity.company) lines.push(`ORG:${vcfEscape(identity.company)}`);
  if (identity.role) lines.push(`TITLE:${vcfEscape(identity.role)}`);
  if (contact.phone) lines.push(`TEL;TYPE=CELL,VOICE:${contact.phone.replace(/[^\d+]/g, "")}`);
  if (contact.whatsapp && contact.whatsapp !== contact.phone) {
    lines.push(`TEL;TYPE=CELL:${contact.whatsapp.replace(/[^\d+]/g, "")}`);
  }
  if (contact.email) lines.push(`EMAIL;TYPE=INTERNET:${vcfEscape(contact.email)}`);
  if (contact.website) lines.push(`URL:${vcfEscape(contact.website)}`);
  if (contact.address) lines.push(`ADR;TYPE=WORK:;;${vcfEscape(contact.address)};;;;`);
  if (cardUrl) lines.push(`URL;TYPE=CARD:${vcfEscape(cardUrl)}`);
  if (identity.bio) lines.push(`NOTE:${vcfEscape(identity.bio)}`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
}

export function downloadVCard(content: CardContent, cardUrl?: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([buildVCard(content, cardUrl)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(content.identity.name || "contact").replace(/[^\w-]+/g, "_")}.vcf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
