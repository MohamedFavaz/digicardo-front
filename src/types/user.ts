/**
 * User & Account Type Definitions
 */

export type UserRole = "user" | "moderator" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export interface User {
  id: string; // 26-char ULID
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  email_verified_at: string | null;
  created_at: string;
}
