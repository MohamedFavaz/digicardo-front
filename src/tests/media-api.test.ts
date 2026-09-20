import { describe, it, expect, vi, beforeEach } from "vitest";
import { mediaApi } from "@/lib/api/media";
import { apiClient } from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Frontend mediaApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads avatar using FormData", async () => {
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    const mockMedia = {
      id: "01JMEDIA000000000000000001",
      type: "avatar",
      url: "https://storage.Digicardo.app/profiles/1/avatar/01JMEDIA000000000000000001.png",
      size: 1024,
      created_at: new Date().toISOString(),
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockMedia);

    const result = await mediaApi.uploadAvatar(file);

    expect(apiClient.post).toHaveBeenCalledWith("/profile/avatar", expect.any(FormData));
    expect(result.id).toBe("01JMEDIA000000000000000001");
  });

  it("uploads cover image using FormData", async () => {
    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    const mockMedia = {
      id: "01JMEDIA000000000000000002",
      type: "cover",
      url: "https://storage.Digicardo.app/profiles/1/cover/01JMEDIA000000000000000002.jpg",
      size: 2048,
      created_at: new Date().toISOString(),
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockMedia);

    const result = await mediaApi.uploadCover(file);

    expect(apiClient.post).toHaveBeenCalledWith("/profile/cover", expect.any(FormData));
    expect(result.id).toBe("01JMEDIA000000000000000002");
  });

  it("uploads generic block image with alt text", async () => {
    const file = new File(["dummy"], "artwork.webp", { type: "image/webp" });
    const mockMedia = {
      id: "01JMEDIA000000000000000003",
      type: "block_image",
      url: "https://storage.Digicardo.app/blocks/1/images/01JMEDIA000000000000000003.webp",
      alt_text: "Artwork 1",
      size: 4096,
      created_at: new Date().toISOString(),
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockMedia);

    const result = await mediaApi.uploadImage(file, "Artwork 1");

    expect(apiClient.post).toHaveBeenCalledWith("/media/images", expect.any(FormData));
    expect(result.alt_text).toBe("Artwork 1");
  });

  it("deletes avatar and cover", async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce(undefined);
    await mediaApi.deleteAvatar();
    expect(apiClient.delete).toHaveBeenCalledWith("/profile/avatar");

    vi.mocked(apiClient.delete).mockResolvedValueOnce(undefined);
    await mediaApi.deleteCover();
    expect(apiClient.delete).toHaveBeenCalledWith("/profile/cover");
  });

  it("deletes an unreferenced media item by ID", async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce(undefined);
    await mediaApi.deleteMedia("01JMEDIA000000000000000003");
    expect(apiClient.delete).toHaveBeenCalledWith("/media/01JMEDIA000000000000000003");
  });

  it("retrieves list of uploaded media items", async () => {
    const mockList = [
      {
        id: "01JMEDIA000000000000000001",
        type: "avatar",
        url: "https://example.com/avatar.jpg",
        size: 1024,
        created_at: new Date().toISOString(),
      },
    ];

    vi.mocked(apiClient.get).mockResolvedValueOnce(mockList);

    const result = await mediaApi.getMedia();
    expect(apiClient.get).toHaveBeenCalledWith("/media");
    expect(result).toHaveLength(1);
  });
});
