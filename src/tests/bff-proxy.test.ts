import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, PUT, PATCH, DELETE } from "@/app/api/bff/v1/[...path]/route";
import {
  splitSetCookies,
  rewriteUpstreamCookie,
} from "@/lib/api/bff-utils";

describe("BFF Proxy Security & Runtime Route Handler", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("splits multiple Set-Cookie headers correctly without breaking expires dates", () => {
    const rawHeaders =
      "laravel_session=session123; expires=Wed, 21-Oct-2026 07:28:00 GMT; Max-Age=7200; path=/; HttpOnly, XSRF-TOKEN=xsrf123; expires=Wed, 21-Oct-2026 07:28:00 GMT; Max-Age=7200; path=/";

    const cookies = splitSetCookies(rawHeaders);
    expect(cookies).toHaveLength(2);
    expect(cookies[0]).toContain("laravel_session=session123");
    expect(cookies[0]).toContain("expires=Wed, 21-Oct-2026 07:28:00 GMT");
    expect(cookies[1]).toContain("XSRF-TOKEN=xsrf123");
  });

  it("rewrites laravel_session and XSRF-TOKEN to Digicardo first-party cookies", () => {
    const laravelCookie = "laravel_session=xyz789; Path=/; Domain=api.Digicardo.app; HttpOnly";
    const rewrittenSession = rewriteUpstreamCookie(laravelCookie);
    expect(rewrittenSession).toContain("Digicardo_session=xyz789");
    expect(rewrittenSession).not.toContain("Domain=api.Digicardo.app");

    const xsrfCookie = "XSRF-TOKEN=token456; Path=/; SameSite=Lax";
    const rewrittenXsrf = rewriteUpstreamCookie(xsrfCookie);
    expect(rewrittenXsrf).toContain("Digicardo_xsrf=token456");
  });

  it("permits approved API paths and forwards GET request to upstream Laravel", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ success: true, data: { status: "ok" } }),
    } as unknown as Response);

    const request = new NextRequest("http://localhost:3000/api/bff/v1/health");
    const context = { params: Promise.resolve({ path: ["health"] }) };

    const response = await GET(request, context);
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.status).toBe("ok");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/v1/health",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("rejects unauthorized destination paths with 404 JSON error without calling upstream fetch", async () => {
    global.fetch = vi.fn();

    const request = new NextRequest("http://localhost:3000/api/bff/v1/unauthorized_test_path/secret");
    const context = { params: Promise.resolve({ path: ["unauthorized_test_path", "secret"] }) };

    const response = await GET(request, context);
    expect(response.status).toBe(404);

    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("NOT_FOUND");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects path traversal attempts with 404 JSON error", async () => {
    global.fetch = vi.fn();

    const request = new NextRequest("http://localhost:3000/api/bff/v1/health/../admin");
    const context = { params: Promise.resolve({ path: ["health", "..", "admin"] }) };

    const response = await GET(request, context);
    expect(response.status).toBe(404);

    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("NOT_FOUND");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("forwards POST, PUT, PATCH, and DELETE methods and preserves upstream status codes", async () => {
    // Test POST with 422 Unprocessable Entity
    global.fetch = vi.fn().mockResolvedValue({
      status: 422,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid email" },
      }),
    } as unknown as Response);

    const postReq = new NextRequest("http://localhost:3000/api/bff/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "invalid" }),
    });
    const postRes = await POST(postReq, {
      params: Promise.resolve({ path: ["auth", "register"] }),
    });
    expect(postRes.status).toBe(422);

    // Test PUT with 200 OK
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ success: true, data: { updated: true } }),
    } as unknown as Response);

    const putReq = new NextRequest("http://localhost:3000/api/bff/v1/profile", {
      method: "PUT",
      body: JSON.stringify({ display_name: "Jane" }),
    });
    const putRes = await PUT(putReq, {
      params: Promise.resolve({ path: ["profile"] }),
    });
    expect(putRes.status).toBe(200);

    // Test PATCH with 409 Conflict
    global.fetch = vi.fn().mockResolvedValue({
      status: 409,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: false,
        error: { code: "CONFLICT", current_version: 5 },
      }),
    } as unknown as Response);

    const patchReq = new NextRequest("http://localhost:3000/api/bff/v1/blocks/reorder", {
      method: "PATCH",
      body: JSON.stringify({ version: 4, ordered_ids: [] }),
    });
    const patchRes = await PATCH(patchReq, {
      params: Promise.resolve({ path: ["blocks", "reorder"] }),
    });
    expect(patchRes.status).toBe(409);

    // Test DELETE with 204 No Content
    global.fetch = vi.fn().mockResolvedValue({
      status: 204,
      headers: new Headers({ "content-type": "" }),
    } as unknown as Response);

    const deleteReq = new NextRequest("http://localhost:3000/api/bff/v1/blocks/01HZMD5R4GKJA7TFP4QYX8VBJN", {
      method: "DELETE",
    });
    const deleteRes = await DELETE(deleteReq, {
      params: Promise.resolve({ path: ["blocks", "01HZMD5R4GKJA7TFP4QYX8VBJN"] }),
    });
    expect(deleteRes.status).toBe(204);
  });

  it("handles upstream network connection failures gracefully with 502 Bad Gateway", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("ECONNREFUSED 127.0.0.1:8000"));

    const request = new NextRequest("http://localhost:3000/api/bff/v1/health");
    const context = { params: Promise.resolve({ path: ["health"] }) };

    const response = await GET(request, context);
    expect(response.status).toBe(502);

    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("SERVER_ERROR");
  });

  it("translates multiple Set-Cookie headers on login response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
        "set-cookie":
          "laravel_session=sessiontoken123; Path=/; HttpOnly, XSRF-TOKEN=xsrftoken456; Path=/; SameSite=Lax",
      }),
      json: async () => ({ success: true, data: { user: "Jane" } }),
    } as unknown as Response);

    const request = new NextRequest("http://localhost:3000/api/bff/v1/auth/login", {
      method: "POST",
    });
    const response = await POST(request, {
      params: Promise.resolve({ path: ["auth", "login"] }),
    });

    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("Digicardo_session=sessiontoken123");
    expect(setCookie).toContain("Digicardo_xsrf=xsrftoken456");
  });
});
