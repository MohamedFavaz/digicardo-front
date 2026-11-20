"use client";

import { TemplatePhone } from "./TemplatePhone";

/** A phone showing a live Classic card with example content (sign-in panel). */
export function ExampleCardPhone({ className = "" }: { className?: string }) {
  return <TemplatePhone template="vcard" width={300} className={className} />;
}
