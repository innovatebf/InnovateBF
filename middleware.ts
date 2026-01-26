import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Matcher pour tous les chemins sauf:
  // - Les routes API (/api, /trpc)
  // - Les fichiers internes Next.js (/_next, /_vercel)
  // - Les fichiers statiques (contenant un point comme favicon.ico)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/"],
};
