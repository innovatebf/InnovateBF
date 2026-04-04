import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Tier 1: Routes requiring any authenticated user (cookie check only)
const INTERNAL_PATHS = ["/innovons/mon-espace"];

// Tier 2: Routes requiring editor or admin (cookie check here, role check in page/layout)
const PRIVATE_PATHS = ["/innovons/besoins/deposer"];

// Tier 3: Routes requiring admin (cookie check here, role check in page/layout)
const ADMIN_PATHS = ["/innovons/admin"];

function stripLocalePrefix(pathname: string): string {
  const locales = routing.locales as readonly string[];
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

function extractLocale(pathname: string): string {
  const locales = routing.locales as readonly string[];
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return routing.defaultLocale as string;
}

function matchesPathList(strippedPath: string, paths: string[]): boolean {
  return paths.some(
    (p) => strippedPath === p || strippedPath.startsWith(p + "/")
  );
}

function hasSessionCookie(request: NextRequest): boolean {
  return (
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Let assets, API, and better-auth routes pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const strippedPath = stripLocalePrefix(pathname);

  // 2. Check if path requires authentication (cookie-based check only)
  const requiresAuth =
    matchesPathList(strippedPath, INTERNAL_PATHS) ||
    matchesPathList(strippedPath, PRIVATE_PATHS) ||
    matchesPathList(strippedPath, ADMIN_PATHS) ||
    strippedPath.includes("/proposer");

  if (requiresAuth && !hasSessionCookie(request)) {
    const locale = extractLocale(pathname);
    const redirectUrl = new URL(
      `/${locale}/innovons/connexion`,
      request.url
    );
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Role enforcement beyond "is logged in" is deferred to layouts/pages (Tier 2)

  // 4. Apply next-intl middleware (locale detection, redirections)
  return intlMiddleware(request);
}

export const config = {
  // Matcher for all paths except:
  // - API routes (/api, /trpc)
  // - Next.js internals (/_next, /_vercel)
  // - Static files (containing a dot like favicon.ico)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/"],
};
