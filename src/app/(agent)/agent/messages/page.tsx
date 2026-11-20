"use client";

import * as React from "react";
import { PlusCircle, UserCheck, Users } from "lucide-react";
import { ButtonLink, ConsolePage, EmptyState, PageHeader } from "@/components/console/ui";
import { MessageComposer, type Starter } from "@/components/messages/MessageComposer";
import { SentMessages } from "@/components/messages/SentMessages";
import { agentMessagesApi } from "@/lib/api/broadcasts";

const STARTERS: Starter[] = [
  {
    label: "Card is ready",
    title: "Your digital card is ready",
    body: "Your Digicardo card is live. Share your card link with customers, and open your dashboard any time to update it.",
  },
  {
    label: "Renewal reminder",
    title: "Time to renew your card",
    body: "Your card plan is ending soon. Reply to me or call me to renew and keep your card online.",
  },
  {
    label: "Offer",
    title: "A special offer for you",
    body: "This month I can add a custom design and NFC card at a special price. Contact me to know more.",
  },
];

export default function AgentMessagesPage() {
  const [customers, setCustomers] = React.useState<number | null>(null);
  const [me, setMe] = React.useState("Your agent");
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    fetch("/api/bff/v1/agent/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const user = json?.data?.user || json?.data;
        if (user?.name) setMe(user.name);
      })
      .catch(() => {});
  }, []);

  return (
    <ConsolePage>
      <PageHeader title="Message customers" description="Send a notification to the customers you created. Only your own customers can receive it." />
      {customers === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState
            icon={Users}
            title="No customers yet"
            text="Once you create cards for customers, you can message them from here."
            action={
              <ButtonLink href="/agent/cards/create" icon={PlusCircle}>
                Create a card
              </ButtonLink>
            }
          />
        </div>
      ) : (
        <MessageComposer
          options={[
            { id: "my_customers", label: "All my customers", hint: "Everyone you created a card for", icon: Users, count: customers },
            { id: "selected", label: "Specific customers", hint: "Pick customers by name", icon: UserCheck },
          ]}
          searchRecipients={async (q) => (await agentMessagesApi.recipients(q)).items}
          onSend={async (payload) => (await agentMessagesApi.send(payload)).message}
          onSent={() => setRefreshKey((k) => k + 1)}
          senderLabel={me}
          starters={STARTERS}
          pickerPlaceholder="Search your customers"
        />
      )}
      <SentMessages
        refreshKey={refreshKey}
        load={async (page) => {
          const res = await agentMessagesApi.list(page);
          setCustomers(res.customers);
          return res;
        }}
        unsend={(id) => agentMessagesApi.unsend(id)}
        emptyText="Messages you send to your customers are listed here."
      />
    </ConsolePage>
  );
}
