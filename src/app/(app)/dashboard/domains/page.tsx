"use client";

import * as React from "react";
import { domainsApi } from "@/lib/api/domains";
import type { ProfileDomain } from "@/types/domain";
import { useEntitlements } from "@/lib/hooks/use-entitlements";
import { UpgradeDialog } from "@/components/billing/UpgradeDialog";
import { DomainsHeader } from "@/components/domains/DomainsHeader";
import { DomainCard } from "@/components/domains/DomainCard";
import { ConnectDomainDialog } from "@/components/domains/ConnectDomainDialog";
import { DisconnectDomainDialog } from "@/components/domains/DisconnectDomainDialog";
import { DomainsEmptyState } from "@/components/domains/DomainsEmptyState";
import { DomainsSkeleton } from "@/components/domains/DomainsSkeleton";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function DomainsDashboardPage() {
  const [domains, setDomains] = React.useState<ProfileDomain[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Modals state
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Disconnect Modal state
  const [disconnectModal, setDisconnectModal] = React.useState<{
    domain: ProfileDomain | null;
    mode: "delete" | "disable";
  }>({ domain: null, mode: "delete" });
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const { plan, limit, isFree } = useEntitlements();
  const domainLimit = limit("custom_domains");

  // Action loading states
  const [verifyingId, setVerifyingId] = React.useState<string | null>(null);
  const [activatingId, setActivatingId] = React.useState<string | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = React.useState<string | null>(null);

  const fetchDomains = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await domainsApi.list();
      setDomains(data || []);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load custom domains.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const handleAddDomain = async (domainName: string) => {
    try {
      setIsSubmitting(true);
      const data = await domainsApi.create({ domain: domainName });
      setSuccessMessage(`Custom domain "${data.normalized_domain}" registered. Please configure DNS verification.`);
      setTimeout(() => setSuccessMessage(null), 5000);
      await fetchDomains();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      setVerifyingId(id);
      setErrorMessage(null);
      setSuccessMessage(null);
      const data = await domainsApi.verify(id);
      if (data.status === "verified") {
        setSuccessMessage(`Domain "${data.normalized_domain}" verified successfully! Click Activate to start routing traffic.`);
      } else {
        setErrorMessage(data.failure_reason || "DNS TXT record not found yet. Note that DNS changes can take a few minutes to propagate.");
      }
      await fetchDomains();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Verification request failed.");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      setActivatingId(id);
      setErrorMessage(null);
      const data = await domainsApi.activate(id);
      setSuccessMessage(`Domain "${data.normalized_domain}" is now active and routing traffic! 🎉`);
      setTimeout(() => setSuccessMessage(null), 5000);
      await fetchDomains();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to activate domain.");
    } finally {
      setActivatingId(null);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      setSettingPrimaryId(id);
      setErrorMessage(null);
      await domainsApi.setPrimary(id);
      setSuccessMessage("Primary domain updated successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
      await fetchDomains();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to set primary domain.");
    } finally {
      setSettingPrimaryId(null);
    }
  };

  const handleConfirmDisconnect = async () => {
    if (!disconnectModal.domain) return;
    const { domain, mode } = disconnectModal;

    try {
      setIsDisconnecting(true);
      setErrorMessage(null);
      if (mode === "delete") {
        await domainsApi.remove(domain.id);
        setSuccessMessage(`Custom domain "${domain.domain}" deleted.`);
      } else {
        await domainsApi.disable(domain.id);
        setSuccessMessage(`Custom domain "${domain.domain}" disabled.`);
      }
      setTimeout(() => setSuccessMessage(null), 4000);
      setDisconnectModal({ domain: null, mode: "delete" });
      await fetchDomains();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : `Failed to ${mode} domain.`);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading && domains.length === 0) {
    return <DomainsSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* ── Studio Header ── */}
      <DomainsHeader
        domainCount={domains.length}
        domainLimit={domainLimit ?? 0}
        planName={typeof plan === "string" ? plan : (plan as { code?: string })?.code || "free"}
        isFreePlan={isFree}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenUpgradeModal={() => setShowUpgradeModal(true)}
      />

      {/* ── Success Toast Banner ── */}
      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Domains List or Empty State ── */}
      {domains.length > 0 ? (
        <div className="space-y-4">
          {domains.map((dom) => (
            <DomainCard
              key={dom.id}
              domain={dom}
              isVerifying={verifyingId === dom.id}
              isActivating={activatingId === dom.id}
              isSettingPrimary={settingPrimaryId === dom.id}
              onVerify={handleVerify}
              onActivate={handleActivate}
              onSetPrimary={handleSetPrimary}
              onOpenDisconnectDialog={(domain, mode) =>
                setDisconnectModal({ domain, mode })
              }
            />
          ))}
        </div>
      ) : (
        <DomainsEmptyState
          isFreePlan={isFree}
          onOpenConnectModal={() => setIsConnectModalOpen(true)}
          onOpenUpgradeModal={() => setShowUpgradeModal(true)}
        />
      )}

      {/* ── Connect Domain Modal ── */}
      <ConnectDomainDialog
        open={isConnectModalOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsConnectModalOpen(false)}
        onSubmit={handleAddDomain}
      />

      {/* ── Custom Disconnect / Delete Confirmation Modal ── */}
      <DisconnectDomainDialog
        open={Boolean(disconnectModal.domain)}
        domain={disconnectModal.domain}
        mode={disconnectModal.mode}
        isLoading={isDisconnecting}
        onClose={() => setDisconnectModal({ domain: null, mode: "delete" })}
        onConfirm={handleConfirmDisconnect}
      />

      {/* ── Pro Upgrade Dialog ── */}
      <UpgradeDialog
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        highlightFeature="custom_domains"
      />

    </div>
  );
}
