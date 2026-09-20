import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authApi } from "@/lib/api/auth";
import { ApiValidationError, ApiUnauthorizedError } from "@/lib/api/errors";

describe("Frontend Auth API Client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("handles successful login and unwraps user data", async () => {
    const mockUser = {
      id: "01HZMD5R4GKJA7TFP4QYX8VBJN",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user" as const,
      status: "active" as const,
      email_verified_at: null,
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: mockUser,
      }),
    } as unknown as Response);

    const user = await authApi.login({
      email: "jane@example.com",
      password: "password123",
    });

    expect(user.id).toBe("01HZMD5R4GKJA7TFP4QYX8VBJN");
    expect(user.email).toBe("jane@example.com");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "jane@example.com",
          password: "password123",
        }),
      })
    );
  });

  it("handles registration and maps validation error details", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The given data was invalid.",
          details: {
            email: ["An account with this email address already exists."],
          },
        },
      }),
    } as unknown as Response);

    await expect(
      authApi.register({
        name: "Jane Duplicate",
        email: "duplicate@example.com",
        password: "password123",
        password_confirmation: "password123",
      })
    ).rejects.toThrow(ApiValidationError);
  });

  it("handles unauthenticated /auth/me error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Unauthenticated.",
        },
      }),
    } as unknown as Response);

    await expect(authApi.me()).rejects.toThrow(ApiUnauthorizedError);
  });

  it("executes CSRF token handshake", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: { csrf_token: "mock-csrf-token-abc" },
      }),
    } as unknown as Response);

    const csrfRes = await authApi.csrf();
    expect(csrfRes.csrf_token).toBe("mock-csrf-token-abc");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/csrf"),
      expect.objectContaining({ method: "GET" })
    );
  });
});
