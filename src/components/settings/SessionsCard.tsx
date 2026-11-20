"use client";

import * as React from "react";
import { SettingsMessage, SettingsSection } from "./SettingsSection";
import {
  Laptop,
  Smartphone,
  Tablet,
  LogOut,
  CheckCircle2,
  MonitorSmartphone,
} from "lucide-react";
import type { AccountSession } from "@/types/security";

function timeAgo(isoString: string | null): string {
  if (!isoString) return "Unknown";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDeviceIcon(device: string) {
  const d = device.toLowerCase();
  if (d.includes("mobile") || d.includes("phone")) return <Smartphone className="h-4 w-4" />;
  if (d.includes("tablet") || d.includes("ipad")) return <Tablet className="h-4 w-4" />;
  return <Laptop className="h-4 w-4" />;
}

export interface SessionsCardProps {
  sessions: AccountSession[];
  isLoading: boolean;
  revokingId: string | null;
  isRevokingOthers: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onRevokeSession: (id: string) => void;
  onRevokeOthers: () => void;
}

export function SessionsCard({
  sessions,
  isLoading,
  revokingId,
  isRevokingOthers,
  message,
  onRevokeSession,
  onRevokeOthers,
}: SessionsCardProps) {
  const otherSessionsCount = sessions.filter((s) => !s.is_current).length;

  return (
    <SettingsSection
      icon={MonitorSmartphone}
      title="Signed-in devices"
      description="Phones and computers where you're signed in. Sign out of any you don't recognise."
      aside={
        otherSessionsCount > 0 ? (
          <button
            type="button"
            onClick={onRevokeOthers}
            disabled={isRevokingOthers}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#F5C2C2] bg-card px-3.5 text-sm font-semibold text-destructive transition-colors hover:bg-[#FDECEC] disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {isRevokingOthers ? "Signing out…" : "Sign out everywhere else"}
          </button>
        ) : undefined
      }
    >
      <SettingsMessage message={message} />
      {isLoading ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-14 rounded-xl" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No signed-in devices found.</p>
      ) : (
        <ul className="divide-y divide-border" role="list">
          {sessions.map((sess) => (
            <li key={sess.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sess.is_current ? "bg-[#E7F6EC] text-[#1E7B43]" : "bg-muted text-[#52525B]"}`}>
                  {getDeviceIcon(sess.device_name)}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="truncate">
                      {sess.browser} on {sess.platform}
                    </span>
                    {sess.is_current && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F6EC] px-2 py-0.5 text-xs font-medium text-[#1E7B43]">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> This device
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[13px] text-muted-foreground">
                    {sess.device_name} · Active {timeAgo(sess.last_activity_at)}
                  </p>
                </div>
              </div>
              {!sess.is_current && (
                <button
                  type="button"
                  onClick={() => onRevokeSession(sess.id)}
                  disabled={revokingId === sess.id}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-destructive hover:bg-[#FDECEC] disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {revokingId === sess.id ? "Signing out…" : "Sign out"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </SettingsSection>
  );
}
