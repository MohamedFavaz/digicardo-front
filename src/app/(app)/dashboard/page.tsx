"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { profileApi } from "@/lib/api/profile";
import { blocksApi } from "@/lib/api/blocks";
import { analyticsApi } from "@/lib/api/analytics";
import { contactApi, type ContactSubmissionItem } from "@/lib/api/contact";
import {
  ApiClientError,
  ApiNotFoundError,
} from "@/lib/api/errors";
import type { Profile } from "@/types/profile";
import type { ProfileBlock } from "@/types/blocks";
import type { AnalyticsOverview, AnalyticsTimeseriesPoint } from "@/types/analytics";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { MetricCardsGrid } from "@/components/dashboard/MetricCardsGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ProfileCompactPreview } from "@/components/dashboard/ProfileCompactPreview";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { ShareProfileCard } from "@/components/dashboard/ShareProfileCard";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  // Data states
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [blocks, setBlocks] = React.useState<ProfileBlock[]>([]);
  const [submissions, setSubmissions] = React.useState<ContactSubmissionItem[]>([]);
  const [analyticsOverview, setAnalyticsOverview] = React.useState<AnalyticsOverview | null>(null);
  const [analyticsTimeseries, setAnalyticsTimeseries] = React.useState<AnalyticsTimeseriesPoint[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dashboardError, setDashboardError] = React.useState<string | null>(null);

  // Load all initial data in parallel for maximum speed
  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setDashboardError(null);

    try {
      // Fire all requests in parallel — don't block each on the previous
      const [profileResult, blocksResult, submissionsResult, analyticsResult] =
        await Promise.allSettled([
          profileApi.getProfile(),
          blocksApi.getBlocks(),
          contactApi.getSubmissions(),
          Promise.all([
            analyticsApi.getOverview({ period: "7d" }),
            analyticsApi.getTimeseries({ period: "7d" }),
          ]),
        ]);

      // Profile
      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value);
      } else {
        const err = profileResult.reason;
        if (err instanceof ApiNotFoundError) {
          setProfile(null);
          setIsLoading(false);
          return;
        }
        if (err instanceof ApiClientError) {
          setDashboardError(err.message);
        }
      }

      // Blocks
      if (blocksResult.status === "fulfilled") {
        setBlocks(blocksResult.value);
      } else {
        setBlocks([]);
      }

      // Submissions
      if (submissionsResult.status === "fulfilled") {
        setSubmissions(submissionsResult.value);
      } else {
        setSubmissions([]);
      }

      // Analytics
      if (analyticsResult.status === "fulfilled") {
        const [overview, timeseries] = analyticsResult.value;
        setAnalyticsOverview(overview);
        setAnalyticsTimeseries(timeseries);
      }
      // Analytics failure is silent / non-blocking
    } finally {
      setIsLoading(false);
    }
  }, []);


  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/dashboard");
    } else if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthLoading, isAuthenticated, router, loadDashboardData]);

  // Handle Contact Submission Deletion
  const handleDeleteSubmission = async (id: string) => {
    try {
      await contactApi.deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // Non-blocking
    }
  };

  if (isAuthLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  // ── Case A: Brand New User without a Profile ──
  if (!profile) {
    return (
      <OnboardingWizard
        onComplete={(newlyCreated) => {
          setProfile(newlyCreated);
          loadDashboardData();
        }}
      />
    );
  }

  // ── Case B: Standard Active Dashboard ──
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      
      {/* ── Section 1: Welcome Banner ── */}
      <DashboardWelcome user={user} profile={profile} />

      {/* ── Section 2: Profile Completion Progress Checklist ── */}
      <ProfileCompletionCard profile={profile} blocks={blocks} />

      {/* ── Section 3: Key Performance Metric Cards (Views, Clicks, CTR) ── */}
      <MetricCardsGrid overview={analyticsOverview} />

      {/* ── Section 4: Main 2-Column Responsive Workspace Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Main Column: Analytics Timeseries + Recent Activity (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <PerformanceOverview
            timeseries={analyticsTimeseries}
          />

          <RecentActivityFeed
            submissions={submissions}
            onDeleteSubmission={handleDeleteSubmission}
          />
        </div>

        {/* Right Sidebar Column: Live Profile Phone Preview + Share (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <ProfileCompactPreview profile={profile} blocks={blocks} />

          <ShareProfileCard username={profile.username} />
        </div>

      </div>

      {/* ── Floating Quick Studio Tools Dock (No box container) ── */}
      <QuickActions />



    </div>
  );
}
