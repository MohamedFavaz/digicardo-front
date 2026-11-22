"use client";

import * as React from "react";
import { Link2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { usernameApi } from "@/lib/api/username";
import { ChangeUsernameDialog } from "@/components/shared/ChangeUsernameDialog";
import { SettingsMessage, SettingsSection, settingsPrimaryButton } from "./SettingsSection";

/** Card owner: shows the card's address (username) with a "Change" button. */
export function CardAddressCard() {
  const [username, setUsername] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const host = typeof window !== "undefined" ? window.location.host : "";

  React.useEffect(() => {
    apiClient
      .get<{ username?: string }>("/profile")
      .then((p) => setUsername(p?.username ?? null))
      .catch(() => setUsername(null));
  }, []);

  if (username === null) return null;

  return (
    <SettingsSection icon={Link2} title="Card address" description="The link people open to see your card. Old links keep working after a change.">
      <SettingsMessage message={message} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 truncate rounded-xl bg-muted/60 px-4 py-3 text-[15px] font-medium text-foreground">
          {host}/<span className="font-semibold">{username}</span>
        </p>
        <button type="button" onClick={() => setOpen(true)} className={settingsPrimaryButton}>
          Change address
        </button>
      </div>
      <ChangeUsernameDialog
        open={open}
        onClose={() => setOpen(false)}
        currentUsername={username}
        save={(name) => usernameApi.changeOwn(name)}
        onSaved={(name) => {
          setUsername(name);
          setMessage({ type: "success", text: `Your card is now at ${host}/${name}. The old link forwards here.` });
          // Sidebar and other widgets refresh their copy of the card.
          window.dispatchEvent(new Event("digicardo_profile_updated"));
        }}
      />
    </SettingsSection>
  );
}
