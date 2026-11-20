import { startImpersonation } from "@/lib/auth/switch-account";

/**
 * Agent "Customize card": signs the agent in as the card's customer and opens the studio. The
 * banner there offers "Back to agent panel". Throws with a readable message on failure.
 */
export function agentImpersonate(cardId: string): Promise<void> {
  return startImpersonation(`/api/bff/v1/agent/cards/${encodeURIComponent(cardId)}/impersonate`, "agent");
}
