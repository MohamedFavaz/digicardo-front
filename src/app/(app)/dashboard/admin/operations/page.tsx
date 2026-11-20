import { redirect } from "next/navigation";

export default function LegacyAdminOperationsPage() {
  redirect("/admin/system");
  return null;
}
