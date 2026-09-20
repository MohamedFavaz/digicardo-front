"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  getAccount,
  updateAccount,
  changePassword,
  deleteAccount,
} from "@/lib/api/account";
import {
  getSessions,
  revokeSession,
  revokeOtherSessions,
  getSecurityEvents,
} from "@/lib/api/security";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { ProfileSettingsCard } from "@/components/settings/ProfileSettingsCard";
import { PasswordSettingsCard } from "@/components/settings/PasswordSettingsCard";
import { SessionsCard } from "@/components/settings/SessionsCard";
import { SecurityAuditCard } from "@/components/settings/SecurityAuditCard";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog";
import { RecentAuthDialog } from "@/components/security/RecentAuthDialog";
import { SettingsSkeleton } from "@/components/settings/SettingsSkeleton";
import type { AccountUser } from "@/types/account";
import type { AccountSession, AccountSecurityEvent } from "@/types/security";

export default function AccountSettingsPage() {
  const router = useRouter();

  // Account details state
  const [account, setAccount] = React.useState<AccountUser | null>(null);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isAccountLoading, setIsAccountLoading] = React.useState(true);
  const [isSavingAccount, setIsSavingAccount] = React.useState(false);
  const [accountMessage, setAccountMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [passwordMessage, setPasswordMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sessions state
  const [sessions, setSessions] = React.useState<AccountSession[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = React.useState(true);
  const [revokingId, setRevokingId] = React.useState<string | null>(null);
  const [isRevokingOthers, setIsRevokingOthers] = React.useState(false);
  const [sessionMessage, setSessionMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Security events state
  const [events, setEvents] = React.useState<AccountSecurityEvent[]>([]);
  const [isEventsLoading, setIsEventsLoading] = React.useState(true);

  // Step-up Auth Dialog state
  const [isRecentAuthOpen, setIsRecentAuthOpen] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);

  // Delete Account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deletePassword, setDeletePassword] = React.useState("");
  const [deletePhrase, setDeletePhrase] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  // Fetch initial data
  const loadData = React.useCallback(async () => {
    try {
      const [acc, sessRes, evRes] = await Promise.all([
        getAccount(),
        getSessions(),
        getSecurityEvents({ per_page: 10 }),
      ]);
      setAccount(acc);
      setName(acc.name);
      setEmail(acc.email);
      setSessions(sessRes.items || []);
      setEvents(evRes.items || []);
    } catch {
      // Non-blocking
    } finally {
      setIsAccountLoading(false);
      setIsSessionsLoading(false);
      setIsEventsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Account Info Update
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAccount(true);
    setAccountMessage(null);

    try {
      const updated = await updateAccount({ name, email });
      setAccount(updated);
      setAccountMessage({ type: "success", text: "Account details saved successfully." });
      setTimeout(() => setAccountMessage(null), 3500);
    } catch (err: unknown) {
      setAccountMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update account details.",
      });
    } finally {
      setIsSavingAccount(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsChangingPassword(true);
    setPasswordMessage(null);

    try {
      await changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({
        type: "success",
        text: "Password changed successfully! All other active sessions logged out.",
      });
      setTimeout(() => setPasswordMessage(null), 4000);
      const s = await getSessions();
      setSessions(s.items || []);
    } catch (err: unknown) {
      setPasswordMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to change password.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle Revoking an Individual Session
  const handleRevokeSession = async (id: string) => {
    setRevokingId(id);
    setSessionMessage(null);
    try {
      await revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setSessionMessage({ type: "success", text: "Session revoked successfully." });
      setTimeout(() => setSessionMessage(null), 2500);
    } catch (err: unknown) {
      setSessionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to revoke session.",
      });
    } finally {
      setRevokingId(null);
    }
  };

  // Handle Revoking Other Sessions
  const handleRevokeOtherSessions = async () => {
    setIsRevokingOthers(true);
    setSessionMessage(null);
    try {
      const res = await revokeOtherSessions();
      setSessions((prev) => prev.filter((s) => s.is_current));
      setSessionMessage({
        type: "success",
        text: `Revoked ${res.revoked_count} other session(s).`,
      });
      setTimeout(() => setSessionMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to revoke sessions.";
      if (msg.includes("RECENT_AUTH_REQUIRED") || msg.includes("Recent authentication")) {
        setPendingAction(() => () => handleRevokeOtherSessions());
        setIsRecentAuthOpen(true);
      } else {
        setSessionMessage({ type: "error", text: msg });
      }
    } finally {
      setIsRevokingOthers(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePhrase !== "DELETE MY ACCOUNT") {
      setDeleteError("Please type 'DELETE MY ACCOUNT' exactly.");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteAccount({
        current_password: deletePassword,
        confirmation: deletePhrase,
      });
      router.push("/account-deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete account.";
      if (msg.includes("ACCOUNT_DELETION_BLOCKED")) {
        setDeleteError("Account deletion is blocked because you have an active paid subscription. Please cancel your subscription in Billing first.");
      } else if (msg.includes("RECENT_AUTH_REQUIRED")) {
        setIsDeleteModalOpen(false);
        setPendingAction(() => () => setIsDeleteModalOpen(true));
        setIsRecentAuthOpen(true);
      } else {
        setDeleteError(msg);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAccountLoading && !account) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* ── Studio Header & Sub-Navigation ── */}
      <SettingsHeader />

      {/* ── Section 1: Personal Details ── */}
      <ProfileSettingsCard
        account={account}
        name={name}
        email={email}
        isSaving={isSavingAccount}
        message={accountMessage}
        onNameChange={setName}
        onEmailChange={setEmail}
        onSubmit={handleUpdateAccount}
      />

      {/* ── Section 2: Password Update ── */}
      <PasswordSettingsCard
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        showCurrent={showCurrent}
        showNew={showNew}
        isChanging={isChangingPassword}
        message={passwordMessage}
        onCurrentChange={setCurrentPassword}
        onNewChange={setNewPassword}
        onConfirmChange={setConfirmPassword}
        onToggleShowCurrent={() => setShowCurrent(!showCurrent)}
        onToggleShowNew={() => setShowNew(!showNew)}
        onSubmit={handleChangePassword}
      />

      {/* ── Section 3: Active Sessions ── */}
      <SessionsCard
        sessions={sessions}
        isLoading={isSessionsLoading}
        revokingId={revokingId}
        isRevokingOthers={isRevokingOthers}
        message={sessionMessage}
        onRevokeSession={handleRevokeSession}
        onRevokeOthers={handleRevokeOtherSessions}
      />

      {/* ── Section 4: Security Audit Trail ── */}
      <SecurityAuditCard
        events={events}
        isLoading={isEventsLoading}
      />

      {/* ── Section 5: Danger Zone ── */}
      <DangerZoneCard
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
      />

      {/* ── Delete Account Confirmation Modal ── */}
      <DeleteAccountDialog
        open={isDeleteModalOpen}
        isDeleting={isDeleting}
        password={deletePassword}
        phrase={deletePhrase}
        error={deleteError}
        onPasswordChange={setDeletePassword}
        onPhraseChange={setDeletePhrase}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteAccount}
      />

      {/* ── Step-up Recent Authentication Modal ── */}
      <RecentAuthDialog
        isOpen={isRecentAuthOpen}
        onClose={() => {
          setIsRecentAuthOpen(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          if (pendingAction) {
            pendingAction();
          }
        }}
      />

    </div>
  );
}
