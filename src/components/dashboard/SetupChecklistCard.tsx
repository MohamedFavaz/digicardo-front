"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  X,
  ChevronRight,
} from "lucide-react";
import type { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface SetupChecklistCardProps {
  profile: Profile | null;
  className?: string;
}

export function SetupChecklistCard({ profile, className }: SetupChecklistCardProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = localStorage.getItem("digicardo_checklist_dismissed") === "true";
      setDismissed(isDismissed);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("digicardo_checklist_dismissed", "true");
    }
  };

  const tasks = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const custom = (profile?.theme_tokens?.custom_options as Record<string, any>) || {};
    const hasSocials =
      (Array.isArray(custom.social_links) && custom.social_links.some((s: { url?: string; is_active?: boolean }) => Boolean(s?.url) && s?.is_active !== false)) ||
      (custom.social_urls && Object.keys(custom.social_urls).length > 0);
    const hasContact = Boolean(
      custom.phone_number ||
      custom.email_address ||
      custom.website_url ||
      custom.whatsapp_number ||
      custom.address_text ||
      custom.map_url
    );
    const hasQuickActions =
      (Array.isArray(custom.quick_actions) && custom.quick_actions.length > 0) ||
      (typeof custom.quick_actions === "object" && custom.quick_actions !== null && Object.values(custom.quick_actions).some(Boolean));
    const hasContentLinks = Array.isArray(custom.content_links) && custom.content_links.length > 0;

    return [
      {
        id: "identity",
        title: "Set username & display name",
        desc: "Unique profile handle and your display name",
        completed: Boolean(profile?.username && profile?.display_name),
        href: "/dashboard/settings",
      },
      {
        id: "avatar",
        title: "Upload profile picture",
        desc: "Personal avatar photo or company logo",
        completed: Boolean(
          profile?.avatar_url ||
          custom.profile_image_url ||
          custom.custom_avatar_url
        ),
        href: "/dashboard/appearance",
      },
      {
        id: "bio",
        title: "Write bio description",
        desc: "Tell visitors what you or your business do",
        completed: Boolean(profile?.bio && profile.bio.trim().length > 0),
        href: "/dashboard/page",
      },
      {
        id: "template",
        title: "Choose a layout template",
        desc: "Select VCard Business or Botanical Corporate",
        completed: Boolean(profile?.template_id),
        href: "/dashboard/appearance",
      },
      {
        id: "theme",
        title: "Customize theme & colors",
        desc: "Pick brand color palette and button shapes",
        completed: Boolean(
          profile?.theme_tokens?.color_accent ||
          profile?.theme_tokens?.color_background ||
          custom.color_palette ||
          custom.primary_button_color
        ),
        href: "/dashboard/appearance",
      },
      {
        id: "links",
        title: "Add links or contact details",
        desc: "Connect WhatsApp, phone, email, or socials",
        completed: Boolean(hasSocials || hasContact || hasQuickActions || hasContentLinks),
        href: "/dashboard/page",
      },
    ];
  }, [profile]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const percentage = Math.round((completedCount / totalTasks) * 100);
  const isComplete = percentage === 100;
  const username = profile?.username;

  if (dismissed || !profile) return null;

  return (
    <>
      {/* ── Sidebar Floating Card ── */}
      <div className={cn("px-3.5 pb-2 flex-shrink-0", className)}>
        <div
          onClick={() => setModalOpen(true)}
          className="group relative rounded-2xl border border-slate-200/80 p-3.5 bg-white shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
        >
          {/* Top Row: Gauge & Dismiss Button */}
          <div className="flex items-center justify-between">
            {/* Circular Progress Gauge */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  strokeWidth="3"
                  className="stroke-slate-100"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  strokeWidth="3"
                  strokeDasharray={88}
                  strokeDashoffset={88 - (88 * percentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-500 stroke-slate-900"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-900">
                {percentage}%
              </span>
            </div>

            {/* Dismiss button */}
            {isComplete && (
              <button
                type="button"
                onClick={handleDismiss}
                title="Dismiss checklist"
                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Texts */}
          <p className="text-xs font-bold text-slate-900 mt-2 leading-tight">
            {isComplete ? "Profile Complete!" : "Your setup checklist"}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 mb-3 leading-tight">
            {isComplete ? "All 6 steps completed" : `${completedCount} of ${totalTasks} complete`}
          </p>

          {/* Action Button */}
          {isComplete && username ? (
            <Link
              href={`/${username}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white rounded-full py-2 text-xs font-bold w-full transition-all shadow-xs active:scale-98"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              className="bg-slate-900 hover:bg-black text-white rounded-full py-2 text-xs font-bold w-full transition-all text-center block shadow-xs active:scale-98 cursor-pointer"
            >
              Finish setup
            </button>
          )}
        </div>
      </div>

      {/* ── Interactive Checklist Modal ── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-50 duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200/60 shadow-2xs flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Profile Setup Checklist
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Complete these steps to make your digital profile look high-impact
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar & Status */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  {completedCount} of {totalTasks} steps completed
                </span>
                <span
                  className={cn(
                    "font-bold px-2 py-0.5 rounded-full text-[11px]",
                    isComplete
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-800"
                  )}
                >
                  {percentage}% Done
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-slate-900"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {tasks.map((task, idx) => (
                <Link
                  key={task.id}
                  href={task.href}
                  onClick={() => setModalOpen(false)}
                  className={cn(
                    "flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all group",
                    task.completed
                      ? "bg-slate-50/60 border-slate-100 hover:bg-slate-50"
                      : "bg-white border-slate-200 hover:border-slate-400 hover:shadow-2xs"
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex-shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-slate-600 flex items-center justify-center text-[9px] font-bold text-slate-400">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-xs font-bold leading-tight truncate",
                          task.completed
                            ? "text-slate-600 line-through"
                            : "text-slate-900"
                        )}
                      >
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                        {task.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 flex-shrink-0">
                    {task.completed ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full font-semibold">
                        Done
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Set up</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Close
              </button>

              {isComplete && username ? (
                <Link
                  href={`/${username}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>View Live Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href={tasks.find((t) => !t.completed)?.href || "/dashboard/page"}
                  onClick={() => setModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span>Continue Setup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

