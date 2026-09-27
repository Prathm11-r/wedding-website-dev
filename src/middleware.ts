import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "everafter.com";
const APP_SUBDOMAIN = process.env.NEXT_PUBLIC_APP_SUBDOMAIN ?? "app";

// Paths that are always public on the app subdomain (no auth required)
const APP_PUBLIC_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/callback",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// ─── Helper — Supabase session refresh ───────────────────────────────────────

/**
 * Creates a Supabase server client wired to the current request/response pair
 * so that auth cookies are refreshed on every navigation edge pass.
 */
async function refreshSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() will silently refresh the session token if it has expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Determine hostname (strip port for local dev) ─────────────────────
  const hostname =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ROOT_DOMAIN;

  const hostnameWithoutPort = hostname.split(":")[0];

  // ── 2. Build a base response so cookies can be mutated ───────────────────
  const response = NextResponse.next({
    request,
  });

  // Always refresh the Supabase session on every request
  const { user } = await refreshSession(request, response);

  // ── 3. Route: app subdomain (app.everafter.com) ──────────────────────────
  const isAppSubdomain =
    hostnameWithoutPort === `${APP_SUBDOMAIN}.${ROOT_DOMAIN}` ||
    // local development: treat "app.localhost" the same way
    hostnameWithoutPort === `${APP_SUBDOMAIN}.localhost`;

  if (isAppSubdomain) {
    const isPublicPath = APP_PUBLIC_PATHS.some((p) =>
      pathname.startsWith(p)
    );

    // Unauthenticated users trying to reach protected app routes → login
    if (!user && !isPublicPath) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated users hitting login/signup → dashboard
    if (user && (pathname === "/auth/login" || pathname === "/auth/signup")) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }

    // Next.js (app) route group matches URL paths directly (e.g. /dashboard)
    response.headers.set("x-app-subdomain", "true");
    return response;
  }

  // ── 4. Route: apex / marketing domain (everafter.com) ────────────────────
  const isApexDomain =
    hostnameWithoutPort === ROOT_DOMAIN ||
    hostnameWithoutPort === "localhost";

  if (isApexDomain) {
    // Marketing site — no rewrite needed; Next.js serves /src/app/* normally
    return response;
  }

  // ── 5. Route: known subdomains *.everafter.com → wedding sites ───────────
  const subdomain = hostnameWithoutPort.endsWith(`.${ROOT_DOMAIN}`)
    ? hostnameWithoutPort.slice(0, -(ROOT_DOMAIN.length + 1))
    : null;

  if (subdomain && subdomain !== APP_SUBDOMAIN) {
    // Rewrite to /wedding/[slug] to serve the couple's wedding site
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/wedding/${subdomain}${pathname}`;
    return NextResponse.rewrite(rewriteUrl, { headers: response.headers });
  }

  // ── 6. Route: custom domains ─────────────────────────────────────────────
  // For custom domains (e.g. sarah-and-james.com mapped by the couple),
  // we perform a lightweight lookup. In production this should be cached
  // (e.g. via Vercel Edge Config or a KV store) to avoid DB hits on every
  // request. Here we demonstrate the pattern with a header-based hint that
  // a separate Vercel middleware / edge function populates.
  const weddingSlug = request.headers.get("x-wedding-slug");

  if (weddingSlug) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/wedding/${weddingSlug}${pathname}`;
    return NextResponse.rewrite(rewriteUrl, { headers: response.headers });
  }

  // If the hostname looks like a custom domain (not matching ROOT_DOMAIN),
  // rewrite to a special catch-all that will do the DB lookup server-side.
  if (
    !hostnameWithoutPort.endsWith(ROOT_DOMAIN) &&
    hostnameWithoutPort !== "localhost" &&
    hostnameWithoutPort !== "127.0.0.1"
  ) {
    const rewriteUrl = request.nextUrl.clone();
    // Pass the raw hostname so the page can perform the DB lookup.
    rewriteUrl.pathname = `/wedding/_custom-domain`;
    rewriteUrl.searchParams.set("domain", hostnameWithoutPort);
    rewriteUrl.searchParams.set("originalPath", pathname);
    return NextResponse.rewrite(rewriteUrl, { headers: response.headers });
  }

  return response;
}

// ─── Matcher ─────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - Public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$).*)",
  ],
};
