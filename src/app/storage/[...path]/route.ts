import { NextRequest, NextResponse } from "next/server";

const LARAVEL_INTERNAL_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.LARAVEL_INTERNAL_API_URL ||
  "http://127.0.0.1:8000";

/**
 * BFF Media Proxy Route Handler
 *
 * Proxies uploaded media requests from `/storage/*` to the Laravel backend.
 * Streams the response buffer with proper content-type and immutable caching.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");
  const targetUrl = `${LARAVEL_INTERNAL_URL}/storage/${filePath}`;

  try {
    const res = await fetch(targetUrl, {
      cache: "force-cache",
    });

    if (!res.ok) {
      return new NextResponse("Media not found", { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Media request failed", { status: 500 });
  }
}
