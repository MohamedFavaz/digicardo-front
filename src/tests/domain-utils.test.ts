import { describe, it, expect } from "vitest";
import { normalizeHost, isSystemDomain, validateDomainInput } from "@/lib/domains/utils";

describe("Domain Hostname Utilities", () => {
  it("normalizes hostnames by lowercasing, trimming, and stripping trailing dots and ports", () => {
    expect(normalizeHost("  AlexRivers.COM.  ")).toBe("alexrivers.com");
    expect(normalizeHost("John.Design:443")).toBe("john.design");
    expect(normalizeHost("  my-brand.STUDIO:3000. ")).toBe("my-brand.studio");
  });

  it("detects system domains accurately", () => {
    expect(isSystemDomain("Digicardo.app")).toBe(true);
    expect(isSystemDomain("www.Digicardo.app")).toBe(true);
    expect(isSystemDomain("app.Digicardo.app")).toBe(true);
    expect(isSystemDomain("localhost")).toBe(true);
    expect(isSystemDomain("localhost:3000")).toBe(true);
    expect(isSystemDomain("127.0.0.1")).toBe(true);
    expect(isSystemDomain("127.0.0.1:8000")).toBe(true);

    expect(isSystemDomain("alexrivers.com")).toBe(false);
    expect(isSystemDomain("my-brand.io")).toBe(false);
  });

  it("validates domain inputs properly", () => {
    expect(validateDomainInput("alexrivers.com").isValid).toBe(true);
    expect(validateDomainInput("links.brand.studio").isValid).toBe(true);

    expect(validateDomainInput("https://alexrivers.com").isValid).toBe(false);
    expect(validateDomainInput("alexrivers.com/profile").isValid).toBe(false);
    expect(validateDomainInput("alexrivers.com:443").isValid).toBe(false);
    expect(validateDomainInput("localhost").isValid).toBe(false);
    expect(validateDomainInput("Digicardo.app").isValid).toBe(false);
    expect(validateDomainInput("invalid_domain").isValid).toBe(false);
  });
});
