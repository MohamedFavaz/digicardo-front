"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Download, ExternalLink, Mail, MessageSquare, Nfc, Printer, Share2 } from "lucide-react";
import { useShellProfile } from "@/lib/hooks/use-shell-profile";
import { cardPublicUrl } from "@/lib/content/resolve";
import { encodeQr, qrPath } from "@/lib/qr/encoder";
import { CardQr, downloadQrPng } from "@/templates/shared/CardQr";
import { SocialIcon } from "@/templates/shared/SocialIcon";
import { cn } from "@/lib/utils";

const QR_COLOURS = [
  { id: "black", label: "Black", value: "#18181B" },
  { id: "violet", label: "Violet", value: "#5B3FE4" },
  { id: "teal", label: "Teal", value: "#0F766E" },
  { id: "navy", label: "Navy", value: "#1E3A8A" },
];

function downloadQrSvg(value: string, color: string, fileName: string) {
  const matrix = encodeQr(value, "M");
  const n = matrix.length + 8;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><path fill="${color}" d="${qrPath(matrix, 4)}"/></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}-qr.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

function Card({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-5 sm:p-6", className)}>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Share: link, one-tap sending, a QR code that scans, and NFC (plan §3.4). */
export default function SharePage() {
  const { profile, isLoading } = useShellProfile();
  const [origin, setOrigin] = React.useState<string>();
  const [copied, setCopied] = React.useState(false);
  const [colour, setColour] = React.useState(QR_COLOURS[0].value);
  const [canNativeShare, setCanNativeShare] = React.useState(false);

  React.useEffect(() => {
    setOrigin(window.location.origin);
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="grid gap-5 lg:grid-cols-2" aria-busy="true">
        <div className="skeleton h-48 rounded-xl" />
        <div className="skeleton h-80 rounded-xl lg:row-span-2" />
        <div className="skeleton h-40 rounded-xl" />
      </div>
    );
  }

  const url = cardPublicUrl(profile, origin);
  const name = profile.display_name || profile.username;
  const message = `Here's my digital card: ${url}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The link stays visible and selectable.
    }
  };

  const sendOptions = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(message)}`, icon: <SocialIcon platform="whatsapp" className="h-5 w-5" /> },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`, icon: <Mail className="h-5 w-5" aria-hidden="true" /> },
    { label: "Text message", href: `sms:?&body=${encodeURIComponent(message)}`, icon: <MessageSquare className="h-5 w-5" aria-hidden="true" /> },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, icon: <SocialIcon platform="linkedin" className="h-5 w-5" /> },
  ];

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-5">
        <Card title="Your card link" description="Anyone with this link can open your card.">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-success" aria-hidden="true" />
              <span className="truncate py-2.5 text-[15px] font-medium text-foreground">{url.replace(/^https?:\/\//, "")}</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={copy} className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[#4A32C0] sm:flex-none">
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Copied" : "Copy link"}
              </button>
              <Link href={`/${profile.username}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-input bg-card px-4 text-sm font-semibold hover:bg-muted">
                Open <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Card>

        <Card title="Send it" description="Opens the app with your link ready to send.">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {sendOptions.map((o) => (
              <a key={o.label} href={o.href} target={o.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl border border-border text-[13px] font-semibold text-foreground transition-colors hover:border-[#D4D4D8] hover:bg-muted">
                {o.icon}
                {o.label}
              </a>
            ))}
          </div>
          {canNativeShare && (
            <button type="button" onClick={() => void navigator.share({ title: name, url }).catch(() => undefined)} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-lg border border-input px-3.5 text-sm font-semibold hover:bg-muted">
              <Share2 className="h-4 w-4" aria-hidden="true" /> More apps
            </button>
          )}
        </Card>

        <Card title="Tap to share with NFC" description="Put your link on an NFC card or sticker — phones open your card with a tap.">
          <ol className="space-y-3 text-sm text-foreground">
            {[
              "Get a blank NFC card or sticker (NTAG213 or NTAG215 works).",
              "Install a free app such as “NFC Tools” on your phone.",
              "Choose Write → Add a record → URL, paste your card link, then hold the card to your phone.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFECFD] text-xs font-bold text-[#3D2AAD]">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-[13px] text-muted-foreground">
            <Nfc className="h-4 w-4 shrink-0" aria-hidden="true" />
            Your link never changes, so a card you write today keeps working when you edit your details.
          </div>
        </Card>
      </div>

      <Card title="QR code" description="Scan with any phone camera to open your card." className="lg:sticky lg:top-24">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border border-border bg-white p-4">
            <CardQr value={url} size={220} color={colour} label={`QR code for ${url}`} />
          </div>
          <div role="radiogroup" aria-label="QR colour" className="flex gap-2">
            {QR_COLOURS.map((c) => (
              <button key={c.id} type="button" role="radio" aria-checked={colour === c.value} aria-label={c.label} onClick={() => setColour(c.value)} className={cn("h-8 w-8 rounded-full border-2", colour === c.value ? "border-foreground" : "border-transparent")}>
                <span className="block h-full w-full rounded-full border-2 border-white" style={{ background: c.value }} />
              </button>
            ))}
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            <button type="button" onClick={() => downloadQrPng(url, profile.username, colour)} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#18181B] text-sm font-semibold text-white hover:bg-black">
              <Download className="h-4 w-4" aria-hidden="true" /> PNG
            </button>
            <button type="button" onClick={() => downloadQrSvg(url, colour, profile.username)} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-input text-sm font-semibold hover:bg-muted">
              <Download className="h-4 w-4" aria-hidden="true" /> SVG (for print)
            </button>
          </div>
          <p className="flex items-start gap-2 text-[13px] text-muted-foreground">
            <Printer className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Print at least 2 cm wide. Keep a white border around the code.
          </p>
        </div>
      </Card>
    </div>
  );
}
