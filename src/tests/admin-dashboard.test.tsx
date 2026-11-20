import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AdminDashboardPage from "@/app/(app)/dashboard/admin/page";

const redirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirect(url),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

describe("AdminDashboardPage (legacy route)", () => {
  // The admin console moved to /admin/*; this old route only redirects there.
  it("redirects to the admin console", () => {
    redirect.mockClear();

    const html = renderToStaticMarkup(<AdminDashboardPage />);

    expect(redirect).toHaveBeenCalledWith("/admin/dashboard");
    expect(html).toBe("");
  });
});
