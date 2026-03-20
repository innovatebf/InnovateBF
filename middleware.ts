import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createServerClient } from "@supabase/ssr";

const intlMiddleware = createIntlMiddleware(routing);

// Routes protégées (sans le préfixe de locale)
const PROTECTED_PATHS = ["/innovons/mon-espace"];

function isProtectedPath(pathname: string): boolean {
  // Retire le préfixe de locale si présent
  // Avec localePrefix: "as-needed", la locale par défaut (fr) peut ne pas avoir de préfixe
  const locales = routing.locales as readonly string[];
  let strippedPath = pathname;
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      strippedPath = pathname.slice(locale.length + 1) || "/";
      break;
    }
  }
  return PROTECTED_PATHS.some(
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

    if (!session) {
      // Extraire la locale depuis le pathname
      // Avec localePrefix: "as-needed", la locale par défaut peut ne pas être dans l'URL
      const locales = routing.locales as readonly string[];
      let locale = routing.defaultLocale as string;
      for (const l of locales) {
        if (pathname.startsWith(`/${l}/`) || pathname === `/${l}`) {
          locale = l;
          break;
        }
      }
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
