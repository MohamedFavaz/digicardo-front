import type { ApiErrorCode, ApiErrorPayload, ApiErrorResponse } from "@/types/api";

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode | string;
  public readonly details: Record<string, string[]> | null;
  public readonly currentVersion?: number;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message || "An API error occurred");
    this.name = "ApiClientError";
    this.status = status;
    this.code = payload.code || "HTTP_ERROR";
    this.details = payload.details ?? null;
    this.currentVersion = payload.current_version;
  }
}

export class ApiValidationError extends ApiClientError {
  constructor(payload: ApiErrorPayload) {
    super(422, payload);
    this.name = "ApiValidationError";
  }
}

export class ApiUnauthorizedError extends ApiClientError {
  constructor(payload: ApiErrorPayload) {
    super(401, payload);
    this.name = "ApiUnauthorizedError";
  }
}

export class ApiForbiddenError extends ApiClientError {
  constructor(payload: ApiErrorPayload) {
    super(403, payload);
    this.name = "ApiForbiddenError";
  }
}

export class ApiNotFoundError extends ApiClientError {
  constructor(payload: ApiErrorPayload) {
    super(404, payload);
    this.name = "ApiNotFoundError";
  }
}

export class ApiConflictError extends ApiClientError {
  constructor(payload: ApiErrorPayload) {
    super(409, payload);
    this.name = "ApiConflictError";
  }
}

export class ApiRateLimitError extends ApiClientError {
  constructor(payload: ApiErrorPayload) {
    super(429, payload);
    this.name = "ApiRateLimitError";
  }
}

export class ApiServerError extends ApiClientError {
  constructor(payload: ApiErrorPayload) {
    super(500, payload);
    this.name = "ApiServerError";
  }
}

/**
 * Parses an API error response and instantiates the appropriate strongly-typed error class.
 */
export function parseApiError(status: number, body: unknown): ApiClientError {
  let code: ApiErrorCode | string = status >= 500 ? "SERVER_ERROR" : "HTTP_ERROR";
  let message = `Request failed with status ${status}`;
  let details: Record<string, string[]> | null = null;
  let currentVersion: number | undefined = undefined;

  if (typeof body === "string" && body.trim().length > 0) {
    message = body;
  } else if (typeof body === "object" && body !== null) {
    const obj = body as Record<string, unknown>;

    // Case 1: Standard envelope { success: false, error: { code, message, details, current_version } }
    if ("error" in obj && obj.error !== null) {
      if (typeof obj.error === "object") {
        const errObj = obj.error as Record<string, unknown>;
        if (typeof errObj.code === "string") code = errObj.code;
        if (typeof errObj.message === "string" && errObj.message) message = errObj.message;
        if (typeof errObj.details === "object" && errObj.details !== null) {
          details = errObj.details as Record<string, string[]>;
        }
        if (typeof errObj.current_version === "number") {
          currentVersion = errObj.current_version;
        }
      } else if (typeof obj.error === "string" && obj.error) {
        message = obj.error;
      }
    }

    // Case 2: Direct Laravel exception or generic { message: "..." }
    if ((!message || message.startsWith("Request failed with status")) && typeof obj.message === "string" && obj.message) {
      message = obj.message;
    }

    // Case 3: Direct Laravel validation errors { errors: { field: ["error"] } }
    if (!details && typeof obj.errors === "object" && obj.errors !== null) {
      details = obj.errors as Record<string, string[]>;
    }
  }

  // If validation details exist and message is generic, surface the specific field message
  if (details && Object.keys(details).length > 0 && (!message || message === "The given data was invalid.")) {
    const firstFieldErrors = Object.values(details)[0];
    if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
      message = firstFieldErrors[0];
    }
  }

  const payload: ApiErrorPayload = {
    code,
    message: message || "An API error occurred",
    details,
    current_version: currentVersion,
  };

  switch (status) {
    case 401:
      return new ApiUnauthorizedError(payload);
    case 403:
      return new ApiForbiddenError(payload);
    case 404:
      return new ApiNotFoundError(payload);
    case 409:
      return new ApiConflictError(payload);
    case 422:
      return new ApiValidationError(payload);
    case 429:
      return new ApiRateLimitError(payload);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ApiServerError(payload);
    default:
      return new ApiClientError(status, payload);
  }
}
