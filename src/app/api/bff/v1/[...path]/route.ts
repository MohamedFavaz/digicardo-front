import { NextRequest, NextResponse } from "next/server";
import {
  isPathAllowed,
  splitSetCookies,
  rewriteUpstreamCookie,
} from "@/lib/api/bff-utils";

const LARAVEL_INTERNAL_URL =
  process.env.LARAVEL_INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

/**
 * Centralized BFF v1 Proxy Handler
 * Securely forwards same-origin browser requests from /api/bff/v1/* to the internal Laravel API /api/v1/*
 */
async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
): Promise<NextResponse> {
  if (request.signal?.aborted) {
    return new NextResponse(null, { status: 499 });
  }

  const { path: pathSegments } = await context.params;

  if (!pathSegments || !isPathAllowed(pathSegments)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "API endpoint not found or route is not permitted.",
        },
      },
      { status: 404 }
    );
  }

  const subPath = pathSegments.join("/");
  const queryString = request.nextUrl.search;
  const targetUrl = `${LARAVEL_INTERNAL_URL}/api/v1/${subPath}${queryString}`;

  // Forward permitted incoming headers
  const forwardHeaders = new Headers();
  const allowedHeaders = [
    "accept",
    "content-type",
    "authorization",
    "x-requested-with",
    "x-xsrf-token",
    "cf-ipcountry",
    "origin",
    "referer",
  ];

  request.headers.forEach((value, key) => {
    if (allowedHeaders.includes(key.toLowerCase())) {
      forwardHeaders.set(key, value);
    }
  });

  if (!forwardHeaders.has("accept")) {
    forwardHeaders.set("accept", "application/json");
  }

  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://digicardo-front-phi.vercel.app";
  if (!forwardHeaders.has("origin")) {
    forwardHeaders.set("origin", appOrigin);
  }
  if (!forwardHeaders.has("referer")) {
    forwardHeaders.set("referer", appOrigin);
  }

  // Map incoming first-party cookies to Laravel upstream cookies
  const incomingCookies: string[] = [];

  const DigicardoSession =
    request.cookies.get("Digicardo_session")?.value ||
    request.cookies.get("laravel_session")?.value;
  if (DigicardoSession) {
    incomingCookies.push(`laravel_session=${DigicardoSession}`);
  }

  const DigicardoXsrf =
    request.cookies.get("Digicardo_xsrf")?.value ||
    request.cookies.get("XSRF-TOKEN")?.value;
  if (DigicardoXsrf) {
    incomingCookies.push(`XSRF-TOKEN=${DigicardoXsrf}`);
    if (!forwardHeaders.has("x-xsrf-token")) {
      forwardHeaders.set("x-xsrf-token", DigicardoXsrf);
    }
  }

  // Forward all remember cookies and impersonation cookies
  request.cookies.getAll().forEach((cookie) => {
    if (
      cookie.name.startsWith("remember_web_") ||
      cookie.name.startsWith("remember_") ||
      cookie.name === "digicardo_impersonating"
    ) {
      incomingCookies.push(`${cookie.name}=${cookie.value}`);
    }
  });

  if (incomingCookies.length > 0) {
    forwardHeaders.set("cookie", incomingCookies.join("; "));
  }

  // Handle request body: buffer raw body for Node serverless compatibility
  const method = request.method;
  let body: BodyInit | undefined = undefined;

  if (method !== "GET" && method !== "HEAD") {
    try {
      const rawBuffer = await request.arrayBuffer();
      if (rawBuffer.byteLength > 0) {
        body = Buffer.from(rawBuffer);
      }
    } catch {
      body = undefined;
    }
  }

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: forwardHeaders,
      body,
      redirect: "manual",
      signal: request.signal,
    };
    if (body) {
      // @ts-expect-error Node fetch duplex required for non-empty body
      fetchOptions.duplex = "half";
    }

    const upstreamResponse = await fetch(targetUrl, fetchOptions);

    if (request.signal?.aborted) {
      return new NextResponse(null, { status: 499 });
    }

    const responseStatus = upstreamResponse.status;
    const responseContentType = upstreamResponse.headers.get("content-type") || "";

    // Extract Set-Cookie headers from Laravel
    let rawSetCookies: string[] = [];
    const headersWithGetSetCookie = upstreamResponse.headers as unknown as {
      getSetCookie?: () => string[];
    };

    if (typeof headersWithGetSetCookie.getSetCookie === "function") {
      rawSetCookies = headersWithGetSetCookie.getSetCookie();
    } else {
      rawSetCookies = splitSetCookies(upstreamResponse.headers.get("set-cookie"));
    }

    // Handle 204 No Content / 304 Not Modified null body responses
    if (responseStatus === 204 || responseStatus === 304) {
      const response = new NextResponse(null, { status: responseStatus });
      rawSetCookies.forEach((cookie) => {
        response.headers.append("set-cookie", rewriteUpstreamCookie(cookie));
      });
      return response;
    }

    if (responseContentType.includes("application/json")) {
      const responseData = await upstreamResponse.json();
      const response = NextResponse.json(responseData, { status: responseStatus });
      rawSetCookies.forEach((cookie) => {
        response.headers.append("set-cookie", rewriteUpstreamCookie(cookie));
      });
      return response;
    }

    // Pass non-JSON responses (e.g. binary/text)
    const responseBuffer = await upstreamResponse.arrayBuffer();
    const nodeBuf = Buffer.from(responseBuffer);
    const response = new NextResponse(nodeBuf, {
      status: responseStatus,
      headers: {
        "content-type": responseContentType,
        "content-length": String(nodeBuf.byteLength),
      },
    });
    rawSetCookies.forEach((cookie) => {
      response.headers.append("set-cookie", rewriteUpstreamCookie(cookie));
    });
    return response;
  } catch (error: unknown) {
    if (request.signal?.aborted || (error as Error)?.name === "AbortError") {
      return new NextResponse(null, { status: 499 });
    }

    const err = error as Error & { cause?: any };
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: err?.message || "Failed to communicate with upstream API service.",
          target: targetUrl,
          cause: err?.cause ? String(err.cause) : undefined,
        },
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
