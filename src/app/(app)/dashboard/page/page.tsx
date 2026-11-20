import { redirect } from "next/navigation";

/** The old "My Page" editor is now the Content tab of Edit card. */
export default function LegacyMyPageRoute() {
  redirect("/dashboard/editor?tab=content");
}
