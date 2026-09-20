import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { profileApi } from "@/lib/api/profile";
import {
  ApiValidationError,
  ApiConflictError,
  ApiNotFoundError,
} from "@/lib/api/errors";

describe("Frontend Profile API Client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("handles successful profile retrieval and unwraps data", async () => {
    const mockProfile = {
      id: "01HZMD5R4GKJA7TFP4QYX8VBJN",
      user_id: "01HZMD5R4GKJA7TFP4QYX8USER",
      username: "favaz",
      display_name: "Mohamed Favaz",
      bio: "Software Developer",
      avatar_url: null,
      template_id: "vcard",
      is_public: true,
      seo_title: null,
      seo_description: null,
      version: 1,
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: mockProfile,
      }),
    } as unknown as Response);

    const profile = await profileApi.getProfile();

    expect(profile.id).toBe("01HZMD5R4GKJA7TFP4QYX8VBJN");
    expect(profile.username).toBe("favaz");
    expect(profile.display_name).toBe("Mohamed Favaz");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/profile"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("handles profile creation and propagates 409 conflict when username is taken", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: false,
        error: {
          code: "CONFLICT",
          message: "This username or user profile already exists.",
        },
      }),
    } as unknown as Response);

    await expect(
      profileApi.createProfile({
        username: "taken_username",
        display_name: "Test User",
      })
    ).rejects.toThrow(ApiConflictError);
  });

  it("handles profile update validation errors", async () => {
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
            username: ["Username can only contain lowercase letters and numbers."],
          },
        },
      }),
    } as unknown as Response);

    await expect(
      profileApi.updateProfile({
        username: "invalid@username",
      })
    ).rejects.toThrow(ApiValidationError);
  });

  it("handles public profile lookup and 404 not found", async () => {
    // 1. Success case
    const mockPublic = {
      username: "favaz",
      display_name: "Mohamed Favaz",
      bio: "Software Developer",
      avatar_url: null,
      template_id: "vcard",
      seo_title: null,
      seo_description: null,
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: mockPublic,
      }),
    } as unknown as Response);

    const publicProfile = await profileApi.getPublicProfile("favaz");
    expect(publicProfile.username).toBe("favaz");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/p/favaz"),
      expect.objectContaining({ method: "GET" })
    );

    // 2. Not found case
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Profile not found.",
        },
      }),
    } as unknown as Response);

    await expect(profileApi.getPublicProfile("missing_user")).rejects.toThrow(
      ApiNotFoundError
    );
  });
});
