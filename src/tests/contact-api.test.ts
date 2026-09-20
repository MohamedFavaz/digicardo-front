import { describe, it, expect, vi, beforeEach } from "vitest";
import { contactApi } from "@/lib/api/contact";
import { apiClient } from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Contact API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits contact message to profile", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      message: "Thank you! Your message has been sent successfully.",
    });

    const result = await contactApi.submitContact("creatorjoe", {
      name: "Alice",
      email: "alice@example.com",
      message: "Hello Joe!",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/p/creatorjoe/contact", {
      name: "Alice",
      email: "alice@example.com",
      message: "Hello Joe!",
    });
    expect(result.message).toContain("sent successfully");
  });

  it("retrieves owner submissions inbox", async () => {
    const mockData = [
      {
        id: "01J5K2SUB00000000000000001",
        name: "Bob",
        email: "bob@example.com",
        message: "Great links!",
        created_at: "2026-08-15T00:00:00Z",
      },
    ];
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockData);

    const data = await contactApi.getSubmissions();
    expect(apiClient.get).toHaveBeenCalledWith("/profile/contact-submissions");
    expect(data).toHaveLength(1);
  });

  it("deletes a submission", async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce(undefined);

    await contactApi.deleteSubmission("01J5K2SUB00000000000000001");
    expect(apiClient.delete).toHaveBeenCalledWith(
      "/profile/contact-submissions/01J5K2SUB00000000000000001"
    );
  });
});
