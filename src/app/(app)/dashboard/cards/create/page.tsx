import { CreateCardWizard } from "@/components/cards/CreateCardWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Digital Card | Digicardo",
  description: "Create and publish a new digital business card with custom category and template.",
};

export default function CreateCardPage() {
  return (
    <div className="py-4 sm:py-6 px-4 sm:px-6">
      <CreateCardWizard />
    </div>
  );
}
