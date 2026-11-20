import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AdminOperationsPage from "@/app/(app)/dashboard/admin/operations/page";

const redirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirect(url),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

describe("AdminOperationsPage (legacy route)", () => {
  // The admin console moved to /admin/*; this old route redirects to its new home, System health.
  it("redirects to the admin console", () => {
    redirect.mockClear();

    const html = renderToStaticMarkup(<AdminOperationsPage />);

    expect(redirect).toHaveBeenCalledWith("/admin/system");
    expect(html).toBe("");
  });
});
