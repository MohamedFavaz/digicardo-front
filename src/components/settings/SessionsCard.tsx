"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Smartphone,
  Tablet,
  LogOut,
  CheckCircle2,
  AlertTriangle,
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
    <div className="rounded-xl border border-border bg-white p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
            <Laptop className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Active Sessions
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              Devices and browsers currently logged into your Digicardo account.
            </p>
          </div>
        </div>

        {otherSessionsCount > 0 && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onRevokeOthers}
            disabled={isRevokingOthers}
            className="rounded-lg text-xs font-medium gap-1.5 h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
          >
            {isRevokingOthers ? (
              <div className="w-3 h-3 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mr-1" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span>Revoke Other Sessions</span>
          </Button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-2xl border p-3.5 text-xs font-bold flex items-center gap-2 ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Sessions List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted/40" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-xs text-muted-foreground font-medium">No active sessions found.</p>
      ) : (
        <ul className="divide-y divide-border/60" role="list">
          {sessions.map((sess) => (
            <li key={sess.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground shadow-2xs flex-shrink-0">
                  {getDeviceIcon(sess.device_name)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-foreground">
                      {sess.browser} on {sess.platform}
                    </span>
                    {sess.is_current && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {sess.device_name} · Last active {timeAgo(sess.last_activity_at)}
                  </p>
                </div>
              </div>

              {!sess.is_current && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRevokeSession(sess.id)}
                  disabled={revokingId === sess.id}
                  className="rounded-full text-xs font-bold text-rose-600 hover:bg-rose-50 h-8 px-3 gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{revokingId === sess.id ? "Revoking..." : "Revoke"}</span>
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
