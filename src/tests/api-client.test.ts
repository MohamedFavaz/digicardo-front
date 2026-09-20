import { describe, it, expect } from "vitest";
import { parseApiError, ApiValidationError, ApiUnauthorizedError, ApiNotFoundError, ApiConflictError } from "@/lib/api/errors";

describe("API Client & Error Mapping", () => {
  it("maps 422 to ApiValidationError with details", () => {
    const error = parseApiError(422, {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "The given data was invalid.",
        details: { email: ["The email field is required."] },
      },
    });

    expect(error).toBeInstanceOf(ApiValidationError);
    expect(error.status).toBe(422);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.details).toEqual({ email: ["The email field is required."] });
  });

  it("maps 401 to ApiUnauthorizedError", () => {
    const error = parseApiError(401, {
      success: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Unauthenticated.",
      },
    });

    expect(error).toBeInstanceOf(ApiUnauthorizedError);
    expect(error.status).toBe(401);
  });

  it("maps 404 to ApiNotFoundError", () => {
    const error = parseApiError(404, {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Resource not found.",
      },
    });

    expect(error).toBeInstanceOf(ApiNotFoundError);
    expect(error.status).toBe(404);
  });

  it("maps 409 to ApiConflictError with currentVersion", () => {
    const error = parseApiError(409, {
      success: false,
      error: {
        code: "CONFLICT",
        message: "Profile was updated elsewhere.",
        current_version: 15,
      },
    });

    expect(error).toBeInstanceOf(ApiConflictError);
    expect(error.status).toBe(409);
    expect(error.currentVersion).toBe(15);
  });
});
