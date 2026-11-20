import type { CardContent } from "@/lib/zod/content";

/**
 * Links the card builds from stored values. tel:, mailto:, wa.me and upi: links are always
 * built here from validated phone numbers / emails / UPI ids — never stored (ADR-030).
 */

export const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function telHref(phone: string): string | null {
  const clean = phone.replace(/[^\d+]/g, "");
  return digitsOnly(clean).length >= 7 ? `tel:${clean}` : null;
}

export function whatsappHref(phone: string, message?: string): string | null {
  const digits = digitsOnly(phone);
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function mailHref(email: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : null;
}

export function directionsHref(contact: CardContent["contact"]): string | null {
  if (/^https?:\/\//i.test(contact.map_url)) return contact.map_url;
  if (contact.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
  return null;
}

export function upiHref(upiId: string, payeeName: string): string | null {
  if (!/^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) return null;
  // The UPI id is validated above, so it is used as-is: some UPI apps reject an encoded "@".
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName.slice(0, 50))}&cu=INR`;
}

/** "{item}" in the owner's enquiry message is replaced by the service/product name. */
export function enquiryMessage(template: string, item: string): string {
  const base = template.trim() || "Hello! I'm interested in {item}. Could you share more details?";
  return base.includes("{item}") ? base.replaceAll("{item}", item) : `${base} (${item})`;
}

/** The number enquiries and bookings go to: WhatsApp first, then the main phone. */
export function enquiryNumber(contact: CardContent["contact"]): string {
  return contact.whatsapp || contact.phone;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts.length === 1 ? parts[0].slice(0, 2) : `${parts[0][0]}${parts[parts.length - 1][0]}`).toUpperCase();
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;
