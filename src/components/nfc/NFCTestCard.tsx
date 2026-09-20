"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Radio, Smartphone } from "lucide-react";

export interface NFCTestCardProps {
  username: string;
}

export function NFCTestCard({ username }: NFCTestCardProps) {
  const [simulating, setSimulating] = React.useState(false);
  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `https://Digicardo.app/${username}`;

  const handleSimulateTap = () => {
    setSimulating(true);
    setTimeout(() => {
      window.open(publicUrl, "_blank");
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="rounded-[36px] border border-border/80 bg-gradient-to-br from-card via-card to-brand-50/20 p-6 sm:p-7 shadow-card space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shadow-2xs">
          <Smartphone className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-black text-sm text-foreground">
            Contactless Tap Simulator
          </h3>
          <p className="text-[11px] text-muted-foreground font-medium">
            Test what visitors experience when tapping your NFC smart card.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-muted/20 border border-border/60">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="block text-xs font-black text-foreground">
            Instant Browser Launch
          </span>
          <span className="block text-[11px] text-muted-foreground font-medium">
            Opens directly in Mobile Safari or Chrome with 0 latency.
          </span>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleSimulateTap}
          variant="pill"
          className="h-9 px-5 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-cta flex-shrink-0"
        >
          <Radio className={`w-3.5 h-3.5 ${simulating ? "animate-ping" : ""}`} />
          <span>{simulating ? "Simulating Tap..." : "Simulate Phone Tap ↗"}</span>
        </Button>
      </div>
    </div>
  );
}
