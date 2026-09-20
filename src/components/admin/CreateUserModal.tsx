"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { createAdminUser } from "@/lib/api/admin";

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
}: CreateUserModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"user" | "moderator" | "admin">("user");
  const [status, setStatus] = React.useState<"active" | "suspended" | "banned">("active");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
    setShowPassword(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!username) {
      const generated = val.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      setUsername(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
      setError("All required fields must be completed.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createAdminUser({
        name: name.trim(),
        email: email.trim(),
        username: username.trim().toLowerCase(),
        password,
        role,
        status,
      });

      // Reset form
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("user");
      setStatus("active");
      onUserCreated();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to provision user.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-user-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
    >
      <div className="relative w-full max-w-lg rounded-[36px] border border-border/80 bg-card p-6 sm:p-8 shadow-float space-y-5 animate-in zoom-in-95 select-none max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center shadow-2xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="create-user-dialog-title" className="text-base font-black text-foreground">
                Provision User Account
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Create an account, assign username handle, and set access level.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-foreground">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                required
                placeholder="e.g. Alex Rivers"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="pl-10 text-xs font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-foreground">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 text-xs font-medium"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-foreground">
              Assigned Username Handle <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground font-mono">
                @
              </span>
              <Input
                type="text"
                required
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                className="pl-8 text-xs font-mono font-bold"
              />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Profile URL will be: <strong className="text-foreground">Digicardo.app/{username || "username"}</strong>
            </p>
          </div>

          {/* Password with Generator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-foreground">
                Initial Password <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generate Strong Password</span>
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-foreground">
                System Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "user" | "moderator" | "admin")}
                className="w-full rounded-2xl border border-input bg-card px-3.5 py-2.5 text-xs font-bold text-foreground outline-none"
              >
                <option value="user">User (Standard Creator)</option>
                <option value="moderator">Moderator (Reports &amp; Profiles)</option>
                <option value="admin">Admin (Full Control Plane)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-foreground">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "suspended" | "banned")}
                className="w-full rounded-2xl border border-input bg-card px-3.5 py-2.5 text-xs font-bold text-foreground outline-none"
              >
                <option value="active">Active (Can log in)</option>
                <option value="suspended">Suspended (Blocked)</option>
                <option value="banned">Banned (Blocked)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full text-xs font-bold h-10 px-5 bg-card"
            >
              Cancel
            </Button>

            <Button
              id="confirm-create-user-submit-btn"
              type="submit"
              size="sm"
              disabled={submitting}
              className="rounded-full text-xs font-black h-10 px-6 bg-brand-600 hover:bg-brand-700 text-white shadow-cta gap-1.5"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{submitting ? "Provisioning..." : "Create Account & Profile"}</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
