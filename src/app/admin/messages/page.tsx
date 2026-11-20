"use client";

import * as React from "react";
import { Globe2, UserCheck, UserCog, Users, UsersRound } from "lucide-react";
import { ConsolePage, PageHeader } from "@/components/console/ui";
import { MessageComposer, type AudienceOption, type Starter } from "@/components/messages/MessageComposer";
import { SentMessages } from "@/components/messages/SentMessages";
import { adminMessagesApi, type AdminAudiences } from "@/lib/api/broadcasts";

const STARTERS: Starter[] = [
  {
    label: "New feature",
    title: "Something new for your card",
    body: "We've just added new templates and design options. Open your card editor to give your card a fresh look.",
  },
  {
    label: "Renewal reminder",
    title: "Your card plan renews soon",
    body: "Please renew your plan to keep your digital card live. Contact us or your agent if you need help.",
  },
  {
    label: "Maintenance",
    title: "Short maintenance break",
    body: "Digicardo will be briefly unavailable for maintenance. Your cards stay online; editing may pause for a few minutes.",
  },
];

export default function AdminMessagesPage() {
  const [aud, setAud] = React.useState<AdminAudiences | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    adminMessagesApi
      .audiences()
      .then(setAud)
      .catch(() => setAud({ counts: { everyone: 0, users: 0, agents: 0 }, agents: [] }));
  }, [refreshKey]);

  const options: AudienceOption[] = [
    { id: "everyone", label: "Everyone", hint: "All users and agents", icon: Globe2, count: aud ? aud.counts.everyone : null },
    { id: "users", label: "All users", hint: "Every card owner", icon: Users, count: aud ? aud.counts.users : null },
    { id: "agents", label: "All agents", hint: "Every reseller agent", icon: UserCog, count: aud ? aud.counts.agents : null },
    { id: "agent_customers", label: "An agent's customers", hint: "Users one agent created", icon: UsersRound },
    { id: "selected", label: "Specific people", hint: "Pick users or agents by name", icon: UserCheck },
  ];

  return (
    <ConsolePage>
      <PageHeader title="Messages" description="Send a notification to everyone, a group, or specific people. It shows up under their bell icon." />
      <MessageComposer
        options={options}
        agents={aud?.agents}
        searchRecipients={async (q) => (await adminMessagesApi.recipients(q)).items}
        onSend={async (payload) => (await adminMessagesApi.send(payload)).message}
        onSent={() => setRefreshKey((k) => k + 1)}
        senderLabel="Digicardo team"
        starters={STARTERS}
        allowEmail
      />
      <SentMessages
        refreshKey={refreshKey}
        showSender
        filters={[
          { id: "", label: "All" },
          { id: "admin", label: "Admin" },
          { id: "agent", label: "Agents" },
        ]}
        load={(page, filter) => adminMessagesApi.list(page, filter as "admin" | "agent" | undefined)}
        unsend={(id) => adminMessagesApi.unsend(id)}
        emptyText="Messages you send, and messages agents send to their customers, are listed here."
      />
    </ConsolePage>
  );
}
