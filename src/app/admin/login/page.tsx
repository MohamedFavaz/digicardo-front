import { notFound } from "next/navigation";

// The admin sign-in page is hidden (secret ADMIN_LOGIN_PATH); this old address no longer exists.
export default function OldAdminLoginPage() {
  notFound();
}
