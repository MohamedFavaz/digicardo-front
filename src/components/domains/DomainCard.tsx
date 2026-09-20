"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  PowerOff,
  Star,
  Copy,
  Check,
} from "lucide-react";
import { DomainDnsInstructions } from "./DomainDnsInstructions";
import type { ProfileDomain } from "@/types/domain";
import { cn } from "@/lib/utils";

export interface DomainCardProps {
  domain: ProfileDomain;
  isVerifying: boolean;
  isActivating: boolean;
  isSettingPrimary: boolean;
  onVerify: (id: string) => void;
  onActivate: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onOpenDisconnectDialog: (domain: ProfileDomain, mode: "delete" | "disable") => void;
}

export function DomainCard({
  domain,
  isVerifying,
  isActivating,
  isSettingPrimary,
  onVerify,
  onActivate,
  onSetPrimary,
  onOpenDisconnectDialog,
}: DomainCardProps) {
  const [showDns, setShowDns] = React.useState(
    domain.status === "pending" || domain.status === "failed" || domain.status === "verifying"
  );
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${domain.domain}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (domain.status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active &amp; Routing</span>
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-sky-50 text-sky-700 border border-sky-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Verified Ready</span>
          </span>
        );
      case "verifying":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200/80">
            <RotateCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>Checking DNS...</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200/80">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending DNS Setup</span>
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200/80">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Verification Failed</span>
          </span>
        );
      case "disabled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-muted text-muted-foreground border border-border">
            <span>Disabled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-[32px] border border-border/80 bg-card p-6 sm:p-7 shadow-card space-y-5 transition-all select-none">
      {/* Top Row: Domain Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Globe className="w-5 h-5" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-base sm:text-lg font-black text-foreground truncate">
                {domain.domain}
              </span>
              {domain.is_primary && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-black">
                  <Star className="w-3 h-3 fill-brand-600 text-brand-600" />
                  <span>Primary Domain</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Quick View Link & Copy */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="rounded-full text-xs font-bold gap-1 h-9 px-3.5 bg-card hover:bg-muted"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>

          <a
            href={`https://${domain.domain}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-bold border border-border/80 bg-card hover:bg-muted text-foreground transition-colors shadow-2xs"
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Verification Failure Alert if exists */}
      {domain.failure_reason && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{domain.failure_reason}</span>
        </div>
      )}

      {/* DNS Instructions Toggle & Content */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowDns(!showDns)}
          className="flex items-center justify-between w-full py-1 text-xs font-extrabold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <span>{showDns ? "Hide DNS Configuration" : "Show DNS Setup Instructions →"}</span>
          {showDns ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDns && (
          <div className="animate-in fade-in-50">
            <DomainDnsInstructions
              dnsRecordType={domain.verification_instructions?.record_type || "TXT"}
              dnsRecordName={domain.verification_instructions?.host || "@"}
              dnsRecordValue={domain.verification_instructions?.value || `Digicardo-verify=${domain.id}`}
            />
          </div>
        )}
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/70">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Verify Action */}
          {(domain.status === "pending" || domain.status === "failed" || domain.status === "verifying") && (
            <Button
              type="button"
              size="sm"
              onClick={() => onVerify(domain.id)}
              disabled={isVerifying}
              variant="pill"
              className="h-9 px-4 gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-cta"
            >
              <RotateCw className={cn("w-3.5 h-3.5", isVerifying && "animate-spin")} />
              <span>{isVerifying ? "Verifying DNS..." : "Verify DNS Connection"}</span>
            </Button>
          )}

          {/* Activate Action */}
          {domain.status === "verified" && (
            <Button
              type="button"
              size="sm"
              onClick={() => onActivate(domain.id)}
              disabled={isActivating}
              variant="pill"
              className="h-9 px-4 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-cta"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isActivating ? "Activating..." : "Activate Domain Now"}</span>
            </Button>
          )}

          {/* Set as Primary Action */}
          {domain.status === "active" && !domain.is_primary && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onSetPrimary(domain.id)}
              disabled={isSettingPrimary}
              className="rounded-full text-xs font-bold gap-1.5 h-9 px-4 bg-card hover:bg-muted"
            >
              <Star className="w-3.5 h-3.5 text-brand-600" />
              <span>{isSettingPrimary ? "Setting..." : "Set as Primary"}</span>
            </Button>
          )}

          {/* Disable Action */}
          {domain.status === "active" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onOpenDisconnectDialog(domain, "disable")}
              className="rounded-full text-xs font-bold gap-1.5 h-9 px-4 bg-card text-muted-foreground hover:text-foreground"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span>Disable</span>
            </Button>
          )}
        </div>

        {/* Delete / Remove Action */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onOpenDisconnectDialog(domain, "delete")}
          className="rounded-full text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-9 px-3 gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </Button>
      </div>
    </div>
  );
}
