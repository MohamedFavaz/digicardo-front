import { apiClient } from "./client";
import { ApiClientError } from "./errors";

/** Card address (username) — check availability and change it. Old addresses keep forwarding. */

export interface UsernameCheck {
  available: boolean;
  message: string | null;
}

export interface UsernameChangeResult {
  username: string;
  previous_username: string;
  version: number;
}

export const usernameApi = {
  check: (username: string, profileId?: string) =>
    apiClient.get<UsernameCheck>("/usernames/check", { params: { username, profile_id: profileId } }),
  /** The signed-in card owner. */
  changeOwn: (username: string) => apiClient.patch<UsernameChangeResult>("/profile/username", { username }),
  /** Admin: a user's card. */
  changeForUser: (userId: string, username: string) =>
    apiClient.patch<UsernameChangeResult>(`/admin/users/${encodeURIComponent(userId)}/username`, { username }),
  /** Agent: one of the agent's cards. */
  changeForAgentCard: (cardId: string, username: string) =>
    apiClient.patch<UsernameChangeResult>(`/agent/cards/${encodeURIComponent(cardId)}/username`, { username }),
  /** Franchise owner / staff: a card of their franchise. */
  changeForFranchiseCard: (cardId: string, username: string) =>
    apiClient.patch<UsernameChangeResult>(`/franchise/cards/${encodeURIComponent(cardId)}/username`, { username }),
};

/** The most useful message from a failed change (the field error when there is one). */
export function usernameErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    const field = error.details?.username;
    if (Array.isArray(field) && field[0]) return field[0];
    return error.message;
  }
  return error instanceof Error ? error.message : "Couldn't change the address. Please try again.";
}

/** Lower-case and keep only the characters an address may use. */
export function cleanUsername(value: string): string {
  return value.toLowerCase().replace(/^@+/, "").replace(/[^a-z0-9_-]/g, "").slice(0, 30);
}
