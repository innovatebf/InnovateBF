import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, localizeHref, stripLocale, type Locale } from "@/i18n";
import { PUBLIC_PATHS } from "@/lib/site";

/**
 * Site public : les adresses françaises n'ont pas de préfixe (« /about » est
 * servie par app/[locale] avec locale = fr), les adresses anglaises commencent
 * par /en. Un visiteur qui a choisi l'anglais (cookie du sélecteur) est
 * renvoyé vers la version anglaise. Le sélecteur ajoute « ?lang=fr|en » :
 * le choix est enregistré ici, même pour un lien ouvert dans un nouvel onglet.
 * Une adresse inconnue reçoit la page 404 de sa langue, rendue par le serveur.
 *
 * Back-office : premier filtre (la session est ensuite vérifiée en base par
 * chaque page et chaque endpoint) ; sans cookie de session, les pages
 * redirigent vers la connexion et l'API répond 401. Rien n'est indexé.
 */
const SESSION_COOKIE = "ibf_session";
const KNOWN = new Set<string>(PUBLIC_PATHS);
const YEAR = 365 * 24 * 3600;

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin")) return admin(req);

  // Choix du sélecteur de langue : mémorisé, puis retour à l'adresse sans paramètre
  const chosen = searchParams.get("lang");
  if (isLocale(chosen)) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("lang");
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(LOCALE_COOKIE, chosen, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  // « /fr/… » : l'adresse française officielle n'a pas de préfixe
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return redirect(req, stripLocale(pathname), 308);
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return KNOWN.has(stripLocale(pathname)) ? NextResponse.next() : notFound(req, "en");
  }

  if (req.cookies.get(LOCALE_COOKIE)?.value === "en") return redirect(req, localizeHref(pathname, "en"), 307);
  if (!KNOWN.has(pathname)) return notFound(req, DEFAULT_LOCALE);
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

function redirect(req: NextRequest, pathname: string, status: 307 | 308) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, status);
}

/** Page 404 de la langue demandée (app/[locale]/introuvable), avec le statut 404. */
function notFound(req: NextRequest, locale: Locale) {
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}/introuvable`;
  url.search = "";
  return NextResponse.rewrite(url, { status: 404 });
}

function admin(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  if (!hasSession && !isLogin) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentification requise." } },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

// Tout sauf l'API publique, les fichiers (adresses avec une extension) et les ressources Next.js
export const config = { matcher: ["/((?!api/|_next/|_vercel/|media/|.*\\..*).*)", "/api/admin/:path*"] };
