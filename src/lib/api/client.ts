import type { ApiSuccessResponse, HttpMethod, RequestOptions } from "@/types/api";
import { parseApiError } from "./errors";

const isServer = typeof window === "undefined";

function getBaseUrl(): string {
  if (isServer) {
    // When running inside Server Components or Route Handlers, connect to internal Laravel origin
    const internalUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.LARAVEL_INTERNAL_API_URL ||
      "http://127.0.0.1:8000";
    return `${internalUrl}/api/v1`;
  }
  // In the browser, strictly route through the same-origin Next.js BFF v1 proxy
  return process.env.NEXT_PUBLIC_API_BASE_URL || "/api/bff/v1";
}

/**
 * Standard HTTP request dispatcher for Digicardo
 */
export async function request<T>(
  endpoint: string,
  method: HttpMethod,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Build Query String if params exist
  let url = `${baseUrl}${cleanEndpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined) searchParams.append(key, String(val));
    });
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options.headers,
  };

  let body: BodyInit | undefined = undefined;

  if (options.data !== undefined) {
    if (options.data instanceof FormData) {
      body = options.data;
      // Do not set Content-Type for FormData; browser/runtime sets multipart boundary
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.data);
    }
  }

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    method,
    headers,
    body,
    credentials: isServer ? undefined : "same-origin",
    ...options,
  };

  if (options.revalidate !== undefined || options.tags !== undefined) {
    fetchOptions.next = {
      revalidate: options.revalidate,
      tags: options.tags,
    };
  }

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (networkError: unknown) {
    throw parseApiError(0, {
      code: "SERVER_ERROR",
      message: networkError instanceof Error ? networkError.message : "Network request failed",
      details: null,
    });
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const responseBody = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw parseApiError(response.status, responseBody);
  }

  // If response matches standardized envelope { success: true, data: T }
  if (typeof responseBody === "object" && responseBody !== null && "success" in responseBody) {
    const apiSuccess = responseBody as ApiSuccessResponse<T>;
    return apiSuccess.data;
  }

  return responseBody as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, "GET", options),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, "POST", { ...options, data }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, "PUT", { ...options, data }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, "PATCH", { ...options, data }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, "DELETE", options),
};
