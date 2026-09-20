import { describe, it, expect, vi, beforeEach } from "vitest";
import { domainsApi } from "@/lib/api/domains";
import { apiClient } from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("domainsApi Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists custom domains for profile", async () => {
    const mockDomains = [
      {
        id: "01M0DOMAIN1234567890ABCDEF",
        profile_id: "01M0PROF1234567890ABCDEF",
        domain: "alexrivers.com",
        normalized_domain: "alexrivers.com",
        status: "active" as const,
        verification_method: "txt_record" as const,
        verification_instructions: {
          record_type: "TXT" as const,
          host: "_Digicardo-verify.alexrivers.com",
          value: "Digicardo-verification=abc123token",
        },
        is_primary: true,
        ssl_status: "active" as const,
        verified_at: "2026-08-15T00:00:00Z",
        activated_at: "2026-08-15T00:00:00Z",
        last_checked_at: null,
        failure_reason: null,
        created_at: "2026-08-15T00:00:00Z",
        updated_at: "2026-08-15T00:00:00Z",
      },
    ];

    vi.mocked(apiClient.get).mockResolvedValue(mockDomains);

    const res = await domainsApi.list();
    expect(apiClient.get).toHaveBeenCalledWith("/profile/domains");
    expect(res).toHaveLength(1);
    expect(res[0].normalized_domain).toBe("alexrivers.com");
  });

  it("creates a new domain registration", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      id: "01M0NEWDOMAIN123456789ABC",
      profile_id: "01M0PROF123456789ABC",
      domain: "mybrand.io",
      normalized_domain: "mybrand.io",
      status: "pending",
      verification_method: "txt_record",
      verification_instructions: {
        record_type: "TXT",
        host: "_Digicardo-verify.mybrand.io",
        value: "Digicardo-verification=test",
      },
      is_primary: false,
      ssl_status: "pending",
      verified_at: null,
      activated_at: null,
      last_checked_at: null,
      failure_reason: null,
      created_at: "2026-08-15T00:00:00Z",
      updated_at: "2026-08-15T00:00:00Z",
    });

    const res = await domainsApi.create({ domain: "mybrand.io" });
    expect(apiClient.post).toHaveBeenCalledWith("/profile/domains", { domain: "mybrand.io" });
    expect(res.normalized_domain).toBe("mybrand.io");
  });

  it("verifies and activates a domain", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      id: "01M0NEWDOMAIN123456789ABC",
      profile_id: "01M0PROF123456789ABC",
      domain: "mybrand.io",
      normalized_domain: "mybrand.io",
      status: "verified",
      verification_method: "txt_record",
      verification_instructions: {
        record_type: "TXT",
        host: "_Digicardo-verify.mybrand.io",
        value: "Digicardo-verification=test",
      },
      is_primary: false,
      ssl_status: "pending",
      verified_at: "2026-08-15T00:00:00Z",
      activated_at: null,
      last_checked_at: null,
      failure_reason: null,
      created_at: "2026-08-15T00:00:00Z",
      updated_at: "2026-08-15T00:00:00Z",
    });

    const verifyRes = await domainsApi.verify("01M0NEWDOMAIN123456789ABC");
    expect(apiClient.post).toHaveBeenCalledWith("/profile/domains/01M0NEWDOMAIN123456789ABC/verify");
    expect(verifyRes.status).toBe("verified");

    const activateRes = await domainsApi.activate("01M0NEWDOMAIN123456789ABC");
    expect(apiClient.post).toHaveBeenCalledWith("/profile/domains/01M0NEWDOMAIN123456789ABC/activate");
    expect(activateRes.status).toBe("verified");
  });

  it("sets primary, disables and deletes a domain", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({} as unknown as ReturnType<typeof domainsApi.setPrimary>);
    vi.mocked(apiClient.delete).mockResolvedValue({ deleted: true });

    await domainsApi.setPrimary("dom-1");
    expect(apiClient.post).toHaveBeenCalledWith("/profile/domains/dom-1/primary");

    await domainsApi.disable("dom-1");
    expect(apiClient.post).toHaveBeenCalledWith("/profile/domains/dom-1/disable");

    const delRes = await domainsApi.remove("dom-1");
    expect(apiClient.delete).toHaveBeenCalledWith("/profile/domains/dom-1");
    expect(delRes.deleted).toBe(true);
  });
});
