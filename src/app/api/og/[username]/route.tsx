/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const LARAVEL_INTERNAL_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.LARAVEL_INTERNAL_API_URL ||
  "http://127.0.0.1:8000";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    if (!username) {
      return new Response("Username is required", { status: 400 });
    }

    const normalized = username.trim().toLowerCase();
    const url = `${LARAVEL_INTERNAL_URL}/api/v1/p/${encodeURIComponent(normalized)}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return new Response("Profile not found or is private", { status: 404 });
    }

    const payload = await res.json();
    if (!payload || !payload.success || !payload.data) {
      return new Response("Profile not found", { status: 404 });
    }

    const profile = payload.data;
    const displayName = profile.display_name || `@${profile.username}`;
    const bio = profile.bio
      ? profile.bio.slice(0, 140) + (profile.bio.length > 140 ? "..." : "")
      : "Explore links, contact info, and smart profile on Digicardo.";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#090d16",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            fontFamily: "sans-serif",
            padding: "60px",
          }}
        >
          {/* Main Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "2px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "32px",
              padding: "48px 64px",
              width: "1000px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              textAlign: "center",
            }}
          >
            {/* Avatar or Initial Icon */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                width="120"
                height="120"
                style={{
                  borderRadius: "60px",
                  border: "4px solid #6366f1",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "60px",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "52px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  border: "4px solid #818cf8",
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Display Name */}
            <div
              style={{
                fontSize: "44px",
                fontWeight: "900",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              {displayName}
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#818cf8",
                marginBottom: "20px",
              }}
            >
              @{profile.username}
            </div>

            {/* Bio */}
            <div
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                maxWidth: "750px",
                lineHeight: "1.4",
                marginBottom: "32px",
              }}
            >
              {bio}
            </div>

            {/* Digicardo Logo Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "20px",
                backgroundColor: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                color: "#c7d2fe",
                fontSize: "16px",
                fontWeight: "700",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ◈ Digicardo
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("[OG Image] Generation failed", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
