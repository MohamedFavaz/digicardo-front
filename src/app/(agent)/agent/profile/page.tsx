"use client";

import { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  Trash2,
  Loader2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Copy,
  Check,
  Eye,
  EyeOff,
  UploadCloud,
} from "lucide-react";

interface AgentData {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  avatar_url?: string | null;
  role: string;
  status: string;
  created_at?: string;
}

interface AgentQuota {
  cards_used: number;
  card_limit: number;
}

interface CommissionConfig {
  commission_type?: "fixed" | "percentage";
  commission_value?: number;
  default_card_price?: number;
}

export default function AgentProfilePage() {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [quota, setQuota] = useState<AgentQuota | null>(null);
  const [commissionConfig, setCommissionConfig] = useState<CommissionConfig | null>(null);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");

  // Avatar Upload State
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarRemoving, setAvatarRemoving] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  // Copy ID State
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await fetch("/api/bff/v1/agent/profile", { credentials: "include" });
      const json = await res.json();

      if (json.success && json.data) {
        const u = json.data.user;
        setAgent(u);
        setName(u?.name || "");
        setMobile(u?.mobile || "");
        setQuota(json.data.quota || null);
        setCommissionConfig(json.data.commission_config || null);
        setTotalCards(json.data.total_cards || 0);
      } else {
        // Fallback to me endpoint if profile is not loaded
        const meRes = await fetch("/api/bff/v1/agent/auth/me", { credentials: "include" });
        const meJson = await meRes.json();
        if (meJson.success && meJson.data) {
          const u = meJson.data.user;
          setAgent(u);
          setName(u?.name || "");
          setMobile(u?.mobile || "");
          setQuota(meJson.data.quota || null);
          setCommissionConfig(meJson.data.commission_config || null);
          setTotalCards(meJson.data.total_cards || 0);
        }
      }
    } catch (err) {
      console.error("Failed to load agent profile:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Avatar File Upload
  async function handleAvatarUpload(file: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarFeedback({ type: "error", text: "Please select an image file (PNG, JPG, WEBP)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarFeedback({ type: "error", text: "Image file size must be less than 5MB." });
      return;
    }

    setAvatarUploading(true);
    setAvatarFeedback(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/bff/v1/agent/profile/avatar", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const newAvatarUrl = json.data?.avatar_url || json.data?.user?.avatar_url;
        setAgent((prev) => (prev ? { ...prev, avatar_url: newAvatarUrl } : null));
        setAvatarFeedback({ type: "success", text: "Profile photo updated successfully." });

        // Notify sidebar & layout to refresh avatar
        window.dispatchEvent(
          new CustomEvent("agent-profile-updated", {
            detail: { user: { ...agent, avatar_url: newAvatarUrl } },
          })
        );
      } else {
        setAvatarFeedback({
          type: "error",
          text: json.error?.message || json.message || "Failed to upload profile photo.",
        });
      }
    } catch {
      setAvatarFeedback({ type: "error", text: "Network error while uploading photo." });
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Handle Avatar Remove
  async function handleAvatarRemove() {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;

    setAvatarRemoving(true);
    setAvatarFeedback(null);

    try {
      const res = await fetch("/api/bff/v1/agent/profile/avatar", {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAgent((prev) => (prev ? { ...prev, avatar_url: null } : null));
        setAvatarFeedback({ type: "success", text: "Profile photo removed." });

        window.dispatchEvent(
          new CustomEvent("agent-profile-updated", {
            detail: { user: { ...agent, avatar_url: null } },
          })
        );
      } else {
        setAvatarFeedback({
          type: "error",
          text: json.error?.message || "Failed to remove photo.",
        });
      }
    } catch {
      setAvatarFeedback({ type: "error", text: "Network error while removing photo." });
    } finally {
      setAvatarRemoving(false);
    }
  }

  // Handle Profile Details Save
  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setProfileErrorMsg("Name is required.");
      return;
    }

    setSavingProfile(true);
    setProfileSuccessMsg("");
    setProfileErrorMsg("");

    try {
      const res = await fetch("/api/bff/v1/agent/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim() || null,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAgent((prev) => (prev ? { ...prev, name: name.trim(), mobile: mobile.trim() || null } : null));
        setProfileSuccessMsg("Profile details updated successfully.");

        window.dispatchEvent(
          new CustomEvent("agent-profile-updated", {
            detail: { user: { ...agent, name: name.trim(), mobile: mobile.trim() || null } },
          })
        );
      } else {
        setProfileErrorMsg(json.error?.message || json.message || "Failed to update profile.");
      }
    } catch {
      setProfileErrorMsg("Network error while saving profile details.");
    } finally {
      setSavingProfile(false);
    }
  }

  // Handle Password Update
  async function handlePasswordSave(e: FormEvent) {
    e.preventDefault();
    setPasswordSuccessMsg("");
    setPasswordErrorMsg("");

    if (!currentPassword) {
      setPasswordErrorMsg("Current password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg("New passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/bff/v1/agent/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPasswordSuccessMsg("Password changed successfully. Your account is secured.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errMsg =
          json.error?.details?.current_password?.[0] ||
          json.error?.details?.password?.[0] ||
          json.error?.message ||
          json.message ||
          "Failed to update password.";
        setPasswordErrorMsg(errMsg);
      }
    } catch {
      setPasswordErrorMsg("Network error while updating password.");
    } finally {
      setSavingPassword(false);
    }
  }

  function copyAgentId() {
    if (!agent?.id) return;
    navigator.clipboard.writeText(agent.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  const initials = agent?.name
    ? agent.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "AG";

  const quotaUsed = quota?.cards_used || 0;
  const quotaLimit = quota?.card_limit || 0;
  const quotaPct = quotaLimit > 0 ? Math.min(100, Math.round((quotaUsed / quotaLimit) * 100)) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your agent profile picture, personal information, and login credentials.
        </p>
      </div>

      {/* Top Profile Header Card: Avatar & Quick Stats */}
      <div className="bg-white rounded-2xl border border-[#E3DFD9] shadow-2xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Upload Drop Zone */}
          <div className="flex flex-col items-center">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
              className={`relative group w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 transition-all cursor-pointer ${dragOver
                  ? "border-[#0F766E] scale-105 shadow-md"
                  : "border-[#E3DFD9] hover:border-[#0F766E]/50 shadow-2xs"
                }`}
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile photo"
            >
              {agent?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={agent.avatar_url}
                  alt={agent.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#D5EBE4] to-[#BCE0D4] flex items-center justify-center text-[#0F766E] text-3xl font-black">
                  {initials}
                </div>
              )}

              {/* Hover Overlay with Camera Icon */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center backdrop-blur-2xs">
                {avatarUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                  </>
                )}
              </div>

              {/* Loading State Overlay */}
              {avatarUploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-[#0F766E] animate-spin" />
                </div>
              )}
            </div>

            {/* Hidden Native File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
            />

            {/* Avatar Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading || avatarRemoving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F766E] bg-[#D5EBE4]/50 hover:bg-[#D5EBE4] border border-[#BCE0D4] transition-colors cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>

              {agent?.avatar_url && (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  disabled={avatarUploading || avatarRemoving}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                  title="Remove photo"
                >
                  {avatarRemoving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Remove</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
          </div>

          {/* Agent Meta Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{agent?.name}</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{agent?.email}</p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${agent?.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${agent?.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {agent?.status || "Active"}
                </span>

                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#D5EBE4] text-[#0F766E] border border-[#BCE0D4]">
                  <Shield className="w-3 h-3 mr-1" />
                  Agent
                </span>
              </div>
            </div>

            {/* Agent ID Bar */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Agent ID:</span>
              <code className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {agent?.id || "—"}
              </code>
              <button
                type="button"
                onClick={copyAgentId}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                title="Copy Agent ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Avatar Feedback Alert */}
            {avatarFeedback && (
              <div
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${avatarFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                  }`}
              >
                {avatarFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span>{avatarFeedback.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Performance & Quota Glance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#E3DFD9]">
          <div className="p-3.5 rounded-xl bg-[#F5F2EE] border border-[#E3DFD9]">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Card Credits</span>
              <CreditCard className="w-3.5 h-3.5 text-[#0F766E]" />
            </div>
            <p className="text-lg font-black text-slate-900">
              {quotaUsed} <span className="text-xs text-slate-400 font-medium">/ {quotaLimit}</span>
            </p>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all ${quotaPct >= 90 ? "bg-red-500" : quotaPct >= 70 ? "bg-amber-500" : "bg-[#0F766E]"
                  }`}
                style={{ width: `${quotaPct}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F2EE] border border-[#E3DFD9]">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Total Active Cards</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-slate-900">{totalCards}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Cards issued across clients</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F2EE] border border-[#E3DFD9]">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Commission Rate</span>
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-lg font-black text-slate-900">
              {commissionConfig?.commission_type === "percentage"
                ? `${commissionConfig?.commission_value || 0}%`
                : `₹${commissionConfig?.commission_value || 0}`}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Per card sale (Configured by admin)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Edit Profile Details */}
        <div className="bg-white rounded-2xl border border-[#E3DFD9] shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3DFD9]">
              <div className="w-8 h-8 rounded-xl bg-[#D5EBE4] border border-[#BCE0D4] flex items-center justify-center text-[#0F766E]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Profile Information</h3>
                <p className="text-xs text-slate-500">Update your name and contact phone number</p>
              </div>
            </div>

            <form id="profile-form" onSubmit={handleProfileSave} className="space-y-4 pt-5">
              {profileSuccessMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {profileErrorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Hunter"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={agent?.email || ""}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 bg-slate-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Login email is managed by your administrator for security verification.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-[#E3DFD9]">
            <button
              type="submit"
              form="profile-form"
              disabled={savingProfile}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white text-sm font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: Change Password */}
        <div className="bg-white rounded-2xl border border-[#E3DFD9] shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3DFD9]">
              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Change Password</h3>
                <p className="text-xs text-slate-500">Update your account login password</p>
              </div>
            </div>

            <form id="password-form" onSubmit={handlePasswordSave} className="space-y-4 pt-5">
              {passwordSuccessMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}

              {passwordErrorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-[#E3DFD9]">
            <button
              type="submit"
              form="password-form"
              disabled={savingPassword}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
