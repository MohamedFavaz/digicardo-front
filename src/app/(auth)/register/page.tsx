"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { 
  ShieldCheck, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Send,
  Building,
  Phone,
  AlertCircle
} from "lucide-react";

export default function RequestAccessPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [organization, setOrganization] = React.useState("");
  const [desiredHandle, setDesiredHandle] = React.useState("");
  const [useCase, setUseCase] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bff/v1/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          business_name: organization.trim() || undefined,
          desired_username: desiredHandle.trim() || undefined,
          message: useCase.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const details = json?.error?.details;
        if (details && typeof details === "object") {
          const first = Object.values(details)[0];
          setError(Array.isArray(first) ? first[0] : String(first));
        } else {
          setError(json?.error?.message || "Failed to submit access request.");
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network request failed. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Request access"
      subtitle="Accounts are provisioned by administrators & partner organizations."
    >
      {submitted ? (
        <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-300">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-foreground">
              Request Received!
            </h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto">
              Thank you, <strong>{fullName}</strong>. Your account provisioning request for{" "}
              <strong className="text-foreground">@{desiredHandle || "handle"}</strong> ({email}{phone ? ` · ${phone}` : ""}) has been logged. Our administrative team will review your details and reach out with your credentials.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="pill"
                size="sm"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10 px-6 rounded-lg"
              >
                <span>Go to Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto rounded-full border-border/80 bg-card hover:bg-muted font-bold text-xs shadow-2xs h-10 px-5"
              >
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          {/* Admin Provisioning Explanatory Notice */}
          <div className="rounded-2xl border border-brand-200/80 bg-brand-50/60 p-3.5 text-xs text-brand-900 font-medium flex items-start gap-2.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Public self-registration is disabled. Please submit your access request below to receive your personalized profile credentials.
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="req-name" className="block text-xs font-black text-foreground">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="req-name"
                type="text"
                required
                placeholder="Alex Rivers"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 text-xs font-medium"
              />
            </div>
          </div>

          {/* Work / Personal Email */}
          <div className="space-y-1.5">
            <label htmlFor="req-email" className="block text-xs font-black text-foreground">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="req-email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 text-xs font-medium"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label htmlFor="req-phone" className="block text-xs font-black text-foreground">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="req-phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 text-xs font-medium"
              />
            </div>
          </div>

          {/* Desired Username & Organization Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="req-handle" className="block text-xs font-black text-foreground">
                Desired Handle
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground font-mono">
                  @
                </span>
                <Input
                  id="req-handle"
                  type="text"
                  placeholder="yourname"
                  value={desiredHandle}
                  onChange={(e) => setDesiredHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  className="pl-8 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="req-org" className="block text-xs font-black text-foreground">
                Organization / Brand
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="req-org"
                  type="text"
                  placeholder="Acme Studio"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="pl-10 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Purpose / Note */}
          <div className="space-y-1.5">
            <label htmlFor="req-usecase" className="block text-xs font-black text-foreground">
              Intended Use Case (Optional)
            </label>
            <textarea
              id="req-usecase"
              rows={2}
              placeholder="e.g. Digital business card for executive team, creator link-in-bio, NFC cards..."
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full rounded-2xl border border-input bg-card p-3 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="pill"
            size="lg"
            disabled={isSubmitting || !fullName.trim() || !email.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm h-11 gap-2 rounded-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Sending Request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Access Request</span>
              </>
            )}
          </Button>

          {/* Switch to Sign In */}
          <div className="pt-2 text-center border-t border-border/60">
            <p className="text-xs font-semibold text-muted-foreground">
              Already have credentials?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in to your Digicardo account
              </Link>
            </p>
          </div>

        </form>
      )}
    </AuthLayout>
  );
}
