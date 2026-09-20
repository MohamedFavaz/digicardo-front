"use client";

import * as React from "react";
import { Copy, Check, Info, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DomainDnsInstructionsProps {
  dnsRecordType: string;
  dnsRecordName: string;
  dnsRecordValue: string;
}

export function DomainDnsInstructions({
  dnsRecordType,
  dnsRecordName,
  dnsRecordValue,
}: DomainDnsInstructionsProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-brand-200/80 bg-brand-50/40 p-4 sm:p-5 space-y-3.5">
      <div className="flex items-center gap-2">
        <Server className="w-4 h-4 text-brand-600 flex-shrink-0" />
        <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
          DNS Verification Instructions
        </h4>
      </div>

      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
        Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.) and add the following DNS verification record:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Record Type */}
        <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Type
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black text-brand-700">
              {dnsRecordType || "TXT"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(dnsRecordType || "TXT", "type")}
              className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
            >
              {copiedKey === "type" ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Host / Name */}
        <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Host / Name
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black text-brand-700 truncate mr-1">
              {dnsRecordName || "@"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(dnsRecordName || "@", "name")}
              className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
            >
              {copiedKey === "name" ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Target / Value */}
        <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Value / Content
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black text-brand-700 truncate mr-1">
              {dnsRecordValue || "Digicardo-verify=..."}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(dnsRecordValue, "val")}
              className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              {copiedKey === "val" ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground font-medium pt-1">
        <Info className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
        <span>
          DNS propagation typically takes 1–5 minutes. Once added, click <strong>Verify Domain</strong> below.
        </span>
      </div>
    </div>
  );
}
