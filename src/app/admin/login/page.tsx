import { redirect } from "next/navigation";

// Admin login is now the same as the regular login page.
// Admins are auto-redirected to /admin/dashboard after successful login.
export default function AdminLoginRedirect() {
  redirect("/login");
}
