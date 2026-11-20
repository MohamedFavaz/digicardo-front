import { headers } from "next/headers";
import { CardNotFound } from "@/components/landing/CardNotFound";

/** /{handle} with no card behind it. On an agent's own domain the page is white-label. */
export default async function ProfileNotFound() {
  const agentDomain = (await headers()).get("x-agent-domain");
  return <CardNotFound whiteLabel={Boolean(agentDomain)} />;
}
