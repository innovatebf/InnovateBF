import { limit } from "@/server/auth/rate-limit";
import { assertSameOrigin, clientIp, handler, json, readJson, requestLocale } from "@/server/http";
import { createCandidature } from "@/server/submissions";
import { z } from "@/lib/zod-fr";

/** POST /api/public/candidatures : dépôt d'une candidature EBC'26 (fermé hors période d'ouverture). */
export const POST = handler(async (req) => {
  assertSameOrigin(req);
  await limit(`candidature:${clientIp(req)}`, 5, 3600);
  const body = await readJson(req, z.unknown(), 200 * 1024);
  // Erreurs, date et accusé de réception dans la langue de la page (en-tête X-Site-Locale)
  const result = await createCandidature(body, requestLocale(req));
  return json({ ok: true, ...result }, { status: 201 });
});
