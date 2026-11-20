import { NextRequest, NextResponse } from "next/server";
import { isSystemDomain, normalizeHost } from "@/lib/domains/utils";

const LARAVEL_INTERNAL_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.LARAVEL_INTERNAL_API_URL ||
  "https://lightslategray-snake-169437.hostingersite.com";
const INTERNAL_SECRET =
  process.env.INTERNAL_SERVICE_SECRET || "local-internal-service-secret";

/**
 * Hidden admin sign-in. The page lives at an internal route that can't be opened directly; it is
 * only served at the secret path in ADMIN_LOGIN_PATH (a server-side setting, never sent to
 * browsers). Leave ADMIN_LOGIN_PATH empty to switch admin sign-in off.
 */
const ADMIN_SIGN_IN_ROUTE = "/internal-admin-sign-in";
const ADMIN_LOGIN_PATH = (process.env.ADMIN_LOGIN_PATH || "").trim().replace(/^\/+|\/+$/g, "");

export async function middleware(request: NextRequest) {
  const rawHost = request.headers.get("host") || request.nextUrl.host;
  const host = normalizeHost(rawHost);
  const pathname = request.nextUrl.pathname;

  // 0. Hidden admin sign-in (system domains only).
  if (pathname === ADMIN_SIGN_IN_ROUTE || pathname.startsWith(`${ADMIN_SIGN_IN_ROUTE}/`)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
  if (ADMIN_LOGIN_PATH && pathname === `/${ADMIN_LOGIN_PATH}` && (!host || isSystemDomain(host))) {
    const response = NextResponse.rewrite(new URL(ADMIN_SIGN_IN_ROUTE, request.url));
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

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

      // An agent's domain: landing page at "/", that agent's customers' cards at "/{username}".
      if (payload?.success && payload.data?.type === "agent" && payload.data.slug) {
        const slug = String(payload.data.slug);
        // Pages on an agent domain carry x-agent-domain, so cards and "not found" stay white-label.
        const agentHeaders = new Headers(request.headers);
        agentHeaders.set("x-agent-domain", host);
        const notHere = () => NextResponse.rewrite(new URL("/_not-found", request.url), { request: { headers: agentHeaders } });
        if (pathname === "/" || pathname === "") {
          if (!payload.data.landing_live) return notHere();
          const response = NextResponse.rewrite(new URL(`/partner/${slug}`, request.url));
          response.headers.set("x-resolved-agent-domain", host);
          return response;
        }
        // The landing page's own address on the main domain is "/" here.
        if (pathname === `/partner/${slug}` || pathname === `/partner/${slug}/`) {
          return NextResponse.redirect(new URL("/", request.url), 308);
        }
        // Single segment = a card. The page checks it belongs to this agent (x-agent-domain).
        if (/^\/[^/]+\/?$/.test(pathname) && pathname !== "/partner-preview") {
          return NextResponse.next({ request: { headers: agentHeaders } });
        }
        return notHere();
      }

      if (payload && payload.success && payload.data && payload.data.username) {
        const username = payload.data.username;
        // Rewrite custom domain root or subpath to the public profile page
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
    "/((?!api|_next|admin|dashboard|setup|storage|login|register|forgot-password|reset-password|verify-email|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|css|js|woff|woff2|ttf|eot)$).*)",
  ],
};
