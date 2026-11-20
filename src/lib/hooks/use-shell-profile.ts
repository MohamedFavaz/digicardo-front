"use client";

import * as React from "react";
import useSWR from "swr";
import { profileApi } from "@/lib/api/profile";
import type { Profile } from "@/types/profile";

/** SWR key shared by every dashboard chrome component (sidebar, top bar, phone nav). */
export const SHELL_PROFILE_KEY = "dashboard-shell-profile";

/**
 * The signed-in owner's profile for the dashboard chrome.
 *
 * Previously the sidebar, top bar, phone header and phone nav each fetched the profile
 * on every page (4 requests per navigation). SWR de-duplicates them into one request and
 * refreshes on window focus or when a page fires `digicardo_profile_updated`.
 */
export function useShellProfile() {
  const { data, mutate, isLoading } = useSWR<Profile | null>(
    SHELL_PROFILE_KEY,
    () => profileApi.getProfile().catch(() => null),
    { dedupingInterval: 30_000, revalidateOnFocus: true }
  );

  React.useEffect(() => {
    const refresh = () => void mutate();
    window.addEventListener("digicardo_profile_updated", refresh);
    return () => window.removeEventListener("digicardo_profile_updated", refresh);
  }, [mutate]);

  // Host is only known in the browser; render a stable value on the server.
  const [host, setHost] = React.useState<string | null>(null);
  React.useEffect(() => {
    setHost(window.location.host);
  }, []);

  const username = data?.username ?? null;

  return {
    profile: data ?? null,
    isLoading,
    username,
    /** e.g. "digicardo.in/aisha" — null until both host and username are known. */
    publicLinkLabel: username && host ? `${data?.agent_domain || host}/${username}` : null,
    publicUrl: username && host ? (data?.agent_domain ? `https://${data.agent_domain}/${username}` : `${window.location.protocol}//${host}/${username}`) : null,
    refresh: mutate,
  };
}
