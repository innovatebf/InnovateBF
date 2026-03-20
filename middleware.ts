import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createServerClient } from "@supabase/ssr";

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

  // 1. Laisser passer les assets et API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Vérifier si la route est protégée
  if (isProtectedPath(pathname)) {
    // Créer client Supabase (lecture seule en middleware Edge)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Si Supabase n'est pas configuré (dev sans env vars), laisser passer
    if (
      !supabaseUrl ||
      !supabaseKey ||
      supabaseUrl.includes("your-project") ||
      supabaseKey.includes("your-anon-key")
    ) {
      return intlMiddleware(request);
    }

    const response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Extraire la locale depuis le pathname
    const locales = routing.locales as readonly string[];
    let locale = routing.defaultLocale as string;
    for (const l of locales) {
      if (pathname.startsWith(`/${l}/`) || pathname === `/${l}`) {
        locale = l;
        break;
      }
    }

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
      try {
        const { data: profile } = await supabase
          .from("ie_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!profile || profile.role !== "ADMINISTRATEUR") {
          const monEspaceUrl = new URL(
            `/${locale}/innovons/mon-espace`,
            request.url
          );
          return NextResponse.redirect(monEspaceUrl);
        }
      } catch {
        // En cas d'erreur de requête, rediriger vers mon-espace par sécurité
        const monEspaceUrl = new URL(
          `/${locale}/innovons/mon-espace`,
          request.url
        );
        return NextResponse.redirect(monEspaceUrl);
      }
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
