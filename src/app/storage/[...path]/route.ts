import { NextRequest, NextResponse } from "next/server";

const LARAVEL_INTERNAL_URL =
  process.env.LARAVEL_INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

/**
 * BFF Media Proxy Route Handler
 *
 * Proxies uploaded media requests from `/storage/*` to the Laravel backend.
 * Streams the response buffer with proper content-type and immutable caching.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (request.signal?.aborted) {
    return new NextResponse(null, { status: 499 });
  }

  const { path } = await params;
  const filePath = path.join("/");
  const targetUrl = `${LARAVEL_INTERNAL_URL}/storage/${filePath}`;

  try {
    const res = await fetch(targetUrl, {
      cache: "no-cache",
      signal: request.signal,
    });

    if (!res.ok) {
      return new NextResponse("Media not found", { status: res.status });
    }

    if (request.signal?.aborted) {
      return new NextResponse(null, { status: 499 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const nodeBuffer = Buffer.from(arrayBuffer);

    return new NextResponse(nodeBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(nodeBuffer.byteLength),
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (err: unknown) {
    if (request.signal?.aborted || (err as Error)?.name === "AbortError") {
      return new NextResponse(null, { status: 499 });
    }
    return new NextResponse("Media request failed", { status: 500 });
  }
}
