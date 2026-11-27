"use client";
import { createContext, useContext } from "react";

export interface FranchiseSession {
  user: { id: string; name: string; email: string; mobile?: string | null; avatar_url?: string | null; role: "franchise" | "franchise_staff" };
  is_owner: boolean;
  franchise: { id: string; name: string };
  quota: { card_limit: number; cards_used: number; remaining_credits: number };
}

const FranchiseContext = createContext<FranchiseSession | null>(null);

export const FranchiseProvider = FranchiseContext.Provider;

/** The signed-in franchise owner or staff member (set by the franchise layout). */
export function useFranchise(): FranchiseSession {
  const value = useContext(FranchiseContext);
  if (!value) throw new Error("useFranchise must be used inside the franchise panel");
  return value;
}
