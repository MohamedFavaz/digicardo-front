import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { UsernameSchema } from "@/lib/validation/profile";

/**
 * On-demand revalidation of a public profile page.
 *
 * Called by Laravel (RevalidatePublicProfile job) after every profile, block or
 * appearance change, so "saved" means the public card updates within seconds
 * instead of waiting for the 60 s ISR window.
 *
 * Auth: `x-revalidate-secret` header must equal NEXT_REVALIDATE_SECRET.
 * Body: { "username": "aisha" } for a card, or { "partner": "<slug>" } for an agent landing page.
 */
export const dynamic = "force-dynamic";

function secretsMatch(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.NEXT_REVALIDATE_SECRET;
  const provided = request.headers.get("x-revalidate-secret") ?? "";

  if (!expected || !provided || !secretsMatch(provided, expected)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Invalid revalidation secret." } },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  // An agent's landing page: { "partner": "excellent-cards" } (published, unpublished, edited, turned off).
  const partner = body && typeof body === "object" ? (body as { partner?: unknown }).partner : undefined;
  if (partner !== undefined) {
    if (typeof partner !== "string" || !/^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])?$/.test(partner)) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "A valid partner page slug is required." } },
        { status: 422 }
      );
    }
    revalidateTag(`partner-${partner}`);
    revalidatePath(`/partner/${partner}`);
    return NextResponse.json({ success: true, data: { revalidated: `partner/${partner}` } });
  }

  const parsed = UsernameSchema.safeParse(
    body && typeof body === "object" ? (body as { username?: unknown }).username : undefined
  );
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "A valid username is required." } },
      { status: 422 }
    );
  }

  const username = parsed.data;
  revalidateTag(`profile-${username}`);
  revalidatePath(`/${username}`);

  return NextResponse.json({ success: true, data: { revalidated: username } });
}
