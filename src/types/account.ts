// Account Types for Phase 15 — Account Security & Management

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  email_verified_at: string | null;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateAccountPayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ConfirmPasswordPayload {
  password: string;
}

export interface DeleteAccountPayload {
  current_password: string;
  confirmation: string;
}

export interface RecentAuthState {
  confirmed: boolean;
  expires_at?: string;
}
