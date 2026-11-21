/**
 * Site-wide SEO constants. The public URL comes from NEXT_PUBLIC_APP_URL (set it to the real
 * domain on Vercel, e.g. https://digicardo.in) so canonical links, the sitemap and social
 * previews all point at one address.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://digicardo.in").replace(/\/+$/, "").toLowerCase();

export const SITE_NAME = "Digicardo";

export const SEO_TITLE = "Digicardo – Digital Business Card & NFC Visiting Card in India";

export const SEO_DESCRIPTION =
  "Create your digital business card with WhatsApp, call, UPI, location and QR code. Share it by link or an NFC tap — no app needed. Plans from ₹1,000 a year.";

export const SEO_KEYWORDS = [
  "digital business card",
  "digital visiting card",
  "digital business card India",
  "NFC business card",
  "NFC visiting card",
  "online visiting card",
  "QR code business card",
  "smart business card",
  "WhatsApp business card",
  "virtual business card",
  "contactless business card",
  "digital card for doctors",
  "digital card for small business",
  "Digicardo",
];

export const CONTACT_PHONES = [
  { type: "customer support", tel: "+91-85930-48536" },
  { type: "sales", tel: "+91-95263-90381" },
];

/** FAQ shown on the home page — also published as FAQPage structured data, so keep them identical. */
export const HOME_FAQS = [
  {
    q: "What is a digital visiting card?",
    a: "A digital visiting card is an online version of your business card. It has its own link and QR code, and opens in any phone's browser so people can save your contact, call or WhatsApp you, see your services and pay you — no printing and no app.",
  },
  {
    q: "How does Digicardo work?",
    a: "You get a digital business card with its own link and QR code. When someone opens it — from the link, the QR code or an NFC card — they can save your contact, call or WhatsApp you, see your services and pay you.",
  },
  { q: "Do my customers need an app?", a: "No. Your card opens in the web browser on any phone, tablet or computer." },
  {
    q: "How much does a digital business card cost?",
    a: "Digicardo has two plans with the same features: 1 Year for ₹1,000, or Lifelong for a one-time ₹4,000 with all future updates included.",
  },
  {
    q: "Can I change my details after I've shared my card?",
    a: "Yes. Edit anything from your dashboard and it updates on your live card straight away. Your link and QR code stay the same, so there's nothing to reprint.",
  },
  {
    q: "Can I use a physical NFC card?",
    a: "Yes. Your card's link can be written to any standard NFC card or tag, so a tap on a phone opens your card. Contact us for custom-printed NFC cards.",
  },
  { q: "Can I switch templates later?", a: "Any time. All templates show the same details, so switching only changes the look — nothing needs retyping." },
];
