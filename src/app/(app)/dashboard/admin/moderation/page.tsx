import { redirect } from "next/navigation";

export default function LegacyAdminModerationPage() {
  redirect("/admin/dashboard");
}
