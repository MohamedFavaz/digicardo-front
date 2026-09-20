"use client";

import * as React from "react";
import { trackProfileView } from "@/lib/analytics/events";

interface ProfileViewTrackerProps {
  profileId: string;
}

export function ProfileViewTracker({ profileId }: ProfileViewTrackerProps) {
  const hasTrackedRef = React.useRef(false);

  React.useEffect(() => {
    if (!profileId || hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;
    const referrer = typeof document !== "undefined" ? document.referrer : undefined;
    trackProfileView(profileId, referrer);
  }, [profileId]);

  return null;
}
