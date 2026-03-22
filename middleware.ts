import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/lib/auth";

const intlMiddleware = createIntlMiddleware(routing);

// Routes protégées (sans le préfixe de locale)
const PROTECTED_PATHS = ["/innovons/mon-espace", "/innovons/admin"];

// Routes nécessitant le rôle ADMIN
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

function isProtectedPath(pathname: string): boolean {
  const strippedPath = stripLocalePrefix(pathname);
  return PROTECTED_PATHS.some(
    (p) => strippedPath === p || strippedPath.startsWith(p + "/")
  );
}

function isAdminPath(pathname: string): boolean {
  const strippedPath = stripLocalePrefix(pathname);
  return ADMIN_PATHS.some(
    (p) => strippedPath === p || strippedPath.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Laisser passer les assets, API et better-auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Vérifier si la route est protégée
  if (isProtectedPath(pathname)) {
    // Extraire la locale depuis le pathname
    const locales = routing.locales as readonly string[];
    let locale = routing.defaultLocale as string;
    for (const l of locales) {
      if (pathname.startsWith(`/${l}/`) || pathname === `/${l}`) {
        locale = l;
        break;
      }
    }

    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        const redirectUrl = new URL(
          `/${locale}/innovons/connexion`,
          request.url
        );
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Vérification du rôle ADMIN pour les routes admin
      if (isAdminPath(pathname)) {
        const user = session.user as { role?: string };
        if (!user.role || user.role !== "ADMINISTRATEUR") {
          const monEspaceUrl = new URL(
            `/${locale}/innovons/mon-espace`,
            request.url
          );
          return NextResponse.redirect(monEspaceUrl);
        }
      }
    } catch {
      // En cas d'erreur (pas de session, token invalide), rediriger vers connexion
      const redirectUrl = new URL(
        `/${locale}/innovons/connexion`,
        request.url
      );
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 3. Appliquer le middleware next-intl (détection de locale, redirections)
  return intlMiddleware(request);
}

export const config = {
  // Matcher pour tous les chemins sauf:
  // - Les routes API (/api, /trpc)
  // - Les fichiers internes Next.js (/_next, /_vercel)
  // - Les fichiers statiques (contenant un point comme favicon.ico)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/"],
};
