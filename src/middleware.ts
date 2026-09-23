import { NextRequest, NextResponse } from "next/server";
import { isSystemDomain, normalizeHost } from "@/lib/domains/utils";

const LARAVEL_INTERNAL_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.LARAVEL_INTERNAL_API_URL ||
  "https://lightslategray-snake-169437.hostingersite.com";
const INTERNAL_SECRET =
  process.env.INTERNAL_SERVICE_SECRET || "local-internal-service-secret";

export async function middleware(request: NextRequest) {
  const rawHost = request.headers.get("host") || request.nextUrl.host;
  const host = normalizeHost(rawHost);

  // 1. If request is to a Digicardo system domain or localhost, proceed normally
  if (!host || isSystemDomain(host)) {
    return NextResponse.next();
  }

  // 2. Custom Domain: Resolve host to Digicardo profile username
  try {
    const resolveUrl = `${LARAVEL_INTERNAL_URL}/api/v1/internal/domains/resolve?host=${encodeURIComponent(host)}`;
    const res = await fetch(resolveUrl, {
      headers: {
        Accept: "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      // Short cache inside edge worker environment
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload && payload.success && payload.data && payload.data.username) {
        const username = payload.data.username;
        // Rewrite custom domain root or subpath to the public profile page
        const pathname = request.nextUrl.pathname;
        const rewriteUrl = new URL(`/${username}${pathname === "/" ? "" : pathname}`, request.url);

        const response = NextResponse.rewrite(rewriteUrl);
        response.headers.set("x-resolved-custom-domain", host);
        return response;
      }
    }
  } catch (error) {
    console.error(`[CustomDomainMiddleware] Resolution failed for host: ${host}`, error);
  }

  // If domain is unverified, inactive, or unknown, return not found
  return NextResponse.rewrite(new URL("/_not-found", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/* (API routes and BFF proxy)
     * - /_next/* (Next.js internals, static files, images)
     * - /admin/* (Admin console routes)
     * - /dashboard/* (Authenticated dashboard paths)
     * - /login, /register, /forgot-password, /reset-password, /verify-email (Auth pages)
     * - Static asset files (.png, .jpg, .svg, .webp, .ico, etc.)
     */
    "/((?!api|_next|admin|dashboard|storage|login|register|forgot-password|reset-password|verify-email|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|css|js|woff|woff2|ttf|eot)$).*)",
  ],
};
