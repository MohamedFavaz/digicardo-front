"use client";

import * as React from "react";
import {
  ShieldCheck,
  Mail,
  CreditCard,
  Globe,
  MessageSquare,
  Bell,
  Megaphone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/api/notification-preferences";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import type { NotificationPreferences } from "@/types/notifications";
import { cn } from "@/lib/utils";

interface PreferenceRow {
  key: keyof Omit<NotificationPreferences, "updated_at">;
  label: string;
  description: string;
  icon: React.ReactNode;
  locked?: boolean;
  lockedReason?: string;
  badgeBg: string;
  badgeText: string;
}

const PREFERENCES: PreferenceRow[] = [
  {
    key: "email_enabled",
    label: "Email Notifications (Master)",
    description: "Master switch for all incoming email alerts. Disabling this turns off all category emails.",
    icon: <Mail className="h-4 w-4" />,
    badgeBg: "bg-brand-50 border-brand-200/80",
    badgeText: "text-brand-600",
  },
  {
    key: "security_email_enabled",
    label: "Security Alerts",
    description: "Account security alerts, password changes, and login verifications. Mandatory for account safety.",
    icon: <ShieldCheck className="h-4 w-4" />,
    locked: true,
    lockedReason: "Security notifications are required for your account safety and cannot be disabled.",
    badgeBg: "bg-rose-50 border-rose-200/80",
    badgeText: "text-rose-600",
  },
  {
    key: "subscription_email_enabled",
    label: "Subscription & Billing",
    description: "Plan upgrades, monthly/annual invoices, payment confirmations, and renewal reminders.",
    icon: <CreditCard className="h-4 w-4" />,
    badgeBg: "bg-emerald-50 border-emerald-200/80",
    badgeText: "text-emerald-600",
  },
  {
    key: "domain_email_enabled",
    label: "Domain & SSL Alerts",
    description: "Custom domain DNS verification results, SSL provisioning status, and renewal notices.",
    icon: <Globe className="h-4 w-4" />,
    badgeBg: "bg-sky-50 border-sky-200/80",
    badgeText: "text-sky-600",
  },
  {
    key: "contact_email_enabled",
    label: "Contact Inquiries",
    description: "Instant email alerts when visitors submit your profile contact form or lead magnets.",
    icon: <MessageSquare className="h-4 w-4" />,
    badgeBg: "bg-amber-50 border-amber-200/80",
    badgeText: "text-amber-700",
  },
  {
    key: "marketing_email_enabled",
    label: "Product News & Tips",
    description: "Creator growth tips, template announcements, and new feature walkthroughs.",
    icon: <Megaphone className="h-4 w-4" />,
    badgeBg: "bg-purple-50 border-purple-200/80",
    badgeText: "text-purple-600",
  },
  {
    key: "in_app_enabled",
    label: "Dashboard In-App Feed",
    description: "Real-time alerts displayed inside the Digicardo bell icon notification center.",
    icon: <Bell className="h-4 w-4" />,
    badgeBg: "bg-brand-50 border-brand-200/80",
    badgeText: "text-brand-600",
  },
];

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = React.useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getNotificationPreferences();
        setPrefs(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load notification preferences.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleToggle = async (
    key: keyof Omit<NotificationPreferences, "updated_at">,
    value: boolean
  ) => {
    if (!prefs) return;
    setIsSaving(key);
    setError(null);
    setSuccessMessage(null);

    const optimistic: NotificationPreferences = { ...prefs, [key]: value };
    setPrefs(optimistic);

    try {
      const updated = await updateNotificationPreferences({ [key]: value });
      setPrefs(updated);
      setSuccessMessage("Preferences saved automatically ✓");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      setPrefs(prefs); // Rollback
      setError(err instanceof Error ? err.message : "Failed to update preference.");
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* ── Studio Header & Sub-Navigation ── */}
      <SettingsHeader />

      {/* ── Feedback Banners ── */}
      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Main Preferences Card ── */}
      <div className="rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center shadow-2xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-foreground">
              Communication Channels
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              Control how and when Digicardo sends you alerts and summary reports.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted/40" />
            ))}
          </div>
        ) : prefs ? (
          <div className="space-y-3" role="list">
            {PREFERENCES.map((pref) => {
              const isChecked = !!prefs[pref.key];
              const isBusy = isSaving === pref.key;

              return (
                <div
                  key={pref.key}
                  role="listitem"
                  className={cn(
                    "flex items-start justify-between p-4 sm:p-5 rounded-2xl border transition-all select-none gap-4",
                    pref.locked
                      ? "border-border/60 bg-muted/20 opacity-80"
                      : "border-border/80 bg-card hover:border-brand-300 hover:bg-muted/10 shadow-2xs"
                  )}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={cn(
                        "mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border shadow-2xs",
                        pref.badgeBg,
                        pref.badgeText
                      )}
                    >
                      {pref.icon}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <label
                          htmlFor={`pref-${pref.key}`}
                          className="text-xs font-black text-foreground cursor-pointer"
                        >
                          {pref.label}
                        </label>
                        {pref.locked && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-black uppercase text-rose-600">
                            <ShieldCheck className="h-3 w-3" />
                            Required
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                        {pref.description}
                      </p>
                    </div>
                  </div>

                  {/* Switch Toggle Button */}
                  <div className="flex-shrink-0 pt-1">
                    {isBusy ? (
                      <div className="h-6 w-11 rounded-full bg-muted animate-pulse" />
                    ) : (
                      <button
                        id={`pref-${pref.key}`}
                        type="button"
                        role="switch"
                        aria-checked={isChecked}
                        disabled={pref.locked}
                        onClick={() => !pref.locked && handleToggle(pref.key, !isChecked)}
                        className={cn(
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          isChecked ? "bg-brand-600" : "bg-muted",
                          pref.locked && "cursor-not-allowed opacity-60"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            isChecked ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <p className="text-[11px] text-muted-foreground text-center font-medium pt-2">
          Notification preferences are synced automatically across all your devices.
        </p>
      </div>

    </div>
  );
}
