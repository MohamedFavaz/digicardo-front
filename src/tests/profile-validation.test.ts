import { describe, it, expect } from "vitest";
import {
  UsernameSchema,
  CreateProfileSchema,
  ProfileUpdateSchema,
} from "@/lib/validation/profile";

describe("Profile Validation Schemas", () => {
  it("validates and normalizes valid usernames", () => {
    const validCases = [
      { input: "favaz", expected: "favaz" },
      { input: "  Mohamed_Favaz  ", expected: "mohamed_favaz" },
      { input: "user-123_abc", expected: "user-123_abc" },
      { input: "dev", expected: "dev" },
      { input: "a12345678901234567890123456789", expected: "a12345678901234567890123456789" },
    ];

    validCases.forEach(({ input, expected }) => {
      const result = UsernameSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(expected);
      }
    });
  });

  it("rejects invalid username formats", () => {
    const invalidCases = [
      "-starts-with-hyphen",
      "_starts-with-underscore",
      "has spaces",
      "has.dots",
      "has/slashes",
      "ab", // too short
      "this_username_is_way_too_long_and_exceeds_thirty_characters", // too long
      "@twitter",
      "special!char",
    ];

    invalidCases.forEach((input) => {
      const result = UsernameSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  it("rejects reserved usernames", () => {
    const reserved = [
      "admin",
      "api",
      "www",
      "app",
      "dashboard",
      "login",
      "register",
      "settings",
      "analytics",
      "profile",
      "p",
      "auth",
      "health",
    ];

    reserved.forEach((slug) => {
      const result = UsernameSchema.safeParse(slug);
      expect(result.success).toBe(false);
    });
  });

  it("validates CreateProfileSchema correctly", () => {
    const valid = CreateProfileSchema.safeParse({
      username: "  my_profile  ",
      display_name: "My Name",
      bio: "Short bio here",
    });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.username).toBe("my_profile");
      expect(valid.data.display_name).toBe("My Name");
      expect(valid.data.is_public).toBe(true);
    }

    const invalid = CreateProfileSchema.safeParse({
      username: "admin",
      bio: "a".repeat(600), // exceeds 500
    });
    expect(invalid.success).toBe(false);
  });

  it("validates ProfileUpdateSchema correctly", () => {
    const valid = ProfileUpdateSchema.safeParse({
      display_name: "Updated Name",
      bio: "Updated bio",
    });
    expect(valid.success).toBe(true);
  });
});
