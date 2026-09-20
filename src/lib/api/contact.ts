import { apiClient } from "./client";

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  website_hp?: string; // Honeypot
}

export interface ContactSubmissionItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  created_at: string;
}

export const contactApi = {
  /**
   * Submit public message to user profile.
   */
  submitContact: async (username: string, data: ContactFormInput): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/p/${encodeURIComponent(username)}/contact`, data);
  },

  /**
   * List contact form submissions for the authenticated owner's profile.
   */
  getSubmissions: async (): Promise<ContactSubmissionItem[]> => {
    return apiClient.get<ContactSubmissionItem[]>("/profile/contact-submissions");
  },

  /**
   * Delete a contact submission.
   */
  deleteSubmission: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/profile/contact-submissions/${encodeURIComponent(id)}`);
  },
};
