import { redirect } from "next/navigation";

// Admin sign-in lives at /admin-login (the middleware also redirects this address).
export default function OldAdminLoginPage() {
  redirect("/admin-login");
}
