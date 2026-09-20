import { apiClient } from "./client";
import { ProfileDomain, DomainCreateInput } from "@/types/domain";

export const domainsApi = {
  /**
   * List all custom domains for the authenticated user's profile.
   */
  async list(): Promise<ProfileDomain[]> {
    return apiClient.get<ProfileDomain[]>("/profile/domains");
  },

  /**
   * Register a new custom domain for verification.
   */
  async create(input: DomainCreateInput): Promise<ProfileDomain> {
    return apiClient.post<ProfileDomain>("/profile/domains", input);
  },

  /**
   * Trigger DNS TXT verification for a domain.
   */
  async verify(id: string): Promise<ProfileDomain> {
    return apiClient.post<ProfileDomain>(`/profile/domains/${id}/verify`);
  },

  /**
   * Activate a verified domain.
   */
  async activate(id: string): Promise<ProfileDomain> {
    return apiClient.post<ProfileDomain>(`/profile/domains/${id}/activate`);
  },

  /**
   * Set an active domain as the primary domain for the profile.
   */
  async setPrimary(id: string): Promise<ProfileDomain> {
    return apiClient.post<ProfileDomain>(`/profile/domains/${id}/primary`);
  },

  /**
   * Disable an active domain.
   */
  async disable(id: string): Promise<ProfileDomain> {
    return apiClient.post<ProfileDomain>(`/profile/domains/${id}/disable`);
  },

  /**
   * Remove and unbind a custom domain.
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    return apiClient.delete<{ deleted: boolean }>(`/profile/domains/${id}`);
  },
};
