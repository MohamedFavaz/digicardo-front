import { redirect } from "next/navigation";

/** The old Appearance editor is now the Design tab of Edit card. */
export default function LegacyAppearanceRoute() {
  redirect("/dashboard/editor?tab=design");
}
