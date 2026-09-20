/**
 * Digicardo API Type Definitions
 * Matches authoritative Laravel API response envelopes
 */

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "HTTP_ERROR"
  | "SERVER_ERROR";

export interface ApiErrorPayload {
  code: ApiErrorCode | string;
  message: string;
  details?: Record<string, string[]> | null;
  current_version?: number;
}

export interface ApiMeta {
  version?: string;
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  data?: unknown;
  headers?: Record<string, string>;
  token?: string;
  revalidate?: number | false;
  tags?: string[];
}
