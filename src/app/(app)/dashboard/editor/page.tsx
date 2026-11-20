import { Suspense } from "react";
import type { Metadata } from "next";
import { CardEditor } from "@/components/card-editor/CardEditor";

export const metadata: Metadata = { title: "Edit card · Digicardo" };

export default function EditCardPage() {
  return (
    <Suspense fallback={null}>
      <CardEditor />
    </Suspense>
  );
}
