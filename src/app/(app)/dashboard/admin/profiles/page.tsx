import { redirect } from "next/navigation";

export default function LegacyAdminProfilesPage() {
  redirect("/admin/dashboard");
}
