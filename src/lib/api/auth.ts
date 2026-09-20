import { apiClient } from "./client";
import type { AuthUser, LoginInput, RegisterInput } from "@/types/auth";

export const authApi = {
  /**
   * Initialize CSRF cookie / session handshake.
   */
  csrf: async (): Promise<{ csrf_token: string }> => {
    return apiClient.get<{ csrf_token: string }>("/auth/csrf");
  },

  /**
   * Register a new user account. Automatically creates session.
   */
  register: async (data: RegisterInput): Promise<AuthUser> => {
    return apiClient.post<AuthUser>("/auth/register", data);
  },

  /**
   * Authenticate credentials and initiate session.
   */
  login: async (data: LoginInput): Promise<AuthUser> => {
    return apiClient.post<AuthUser>("/auth/login", data);
  },

  /**
   * Terminate the authenticated session.
   */
  logout: async (): Promise<void> => {
    return apiClient.post<void>("/auth/logout");
  },

  /**
   * Retrieve the currently authenticated user identity.
   */
  me: async (): Promise<AuthUser> => {
    return apiClient.get<AuthUser>("/auth/me");
  },

  /**
   * Stop impersonating user and restore administrator session.
   */
  stopImpersonation: async (): Promise<{ admin: AuthUser; redirect_url: string }> => {
    return apiClient.post<{ admin: AuthUser; redirect_url: string }>("/auth/stop-impersonation");
  },
};
