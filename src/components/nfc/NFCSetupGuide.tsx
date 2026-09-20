"use client";

import * as React from "react";
import { Copy, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NFCSetupGuideProps {
  username: string;
}

export function NFCSetupGuide({ username }: NFCSetupGuideProps) {
  const [copied, setCopied] = React.useState(false);
  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://Digicardo.app/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const steps = [
    {
      num: "01",
      title: "Get an NFC Tag or Card",
      desc: "Any standard NTAG213, NTAG215, or NTAG216 card, sticker, pop-socket, or keyfob.",
    },
    {
      num: "02",
      title: "Open NFC Tools App",
      desc: "Download the free 'NFC Tools' app on iOS App Store or Google Play Store.",
    },
    {
      num: "03",
      title: "Write Your Profile URL",
      desc: "Select 'Write > Add Record > Custom URL / URI', paste your link, and tap 'Write' to encode your card.",
    },
  ];

  return (
    <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base text-foreground">
              How to Program Your Physical NFC Card
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-extrabold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Universal Standard</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Encode any standard contactless NFC card, tag, or sticker in under 30 seconds.
          </p>
        </div>
      </div>

      {/* URL Copy Box */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/30 border border-border/80 gap-2">
        <div className="min-w-0 space-y-0.5">
          <span className="block text-[10px] uppercase font-mono font-bold text-muted-foreground">
            Target Destination URL
          </span>
          <span className="block font-mono text-xs font-black text-foreground truncate">
            {publicUrl}
          </span>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleCopy}
          variant="pill"
          className="h-8 px-3.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex-shrink-0 shadow-2xs gap-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-white" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy URL</span>
            </>
          )}
        </Button>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-4 rounded-2xl bg-muted/20 border border-border/70 space-y-1.5 select-none"
          >
            <span className="font-mono text-xs font-black text-brand-600 block">
              STEP {step.num}
            </span>
            <h4 className="text-xs font-black text-foreground">
              {step.title}
            </h4>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
