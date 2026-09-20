/**
 * Custom Domain Types for Digicardo Phase 10
 */

export type DomainStatus =
  | "pending"
  | "verifying"
  | "verified"
  | "active"
  | "failed"
  | "disabled";

export type DomainSslStatus = "pending" | "active" | "failed";

export interface VerificationInstructions {
  record_type: "TXT";
  host: string;
  value: string;
}

export interface ProfileDomain {
  id: string;
  profile_id: string;
  domain: string;
  normalized_domain: string;
  status: DomainStatus;
  verification_method: "txt_record";
  verification_instructions: VerificationInstructions;
  is_primary: boolean;
  ssl_status: DomainSslStatus;
  verified_at: string | null;
  activated_at: string | null;
  last_checked_at: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface DomainCreateInput {
  domain: string;
}
