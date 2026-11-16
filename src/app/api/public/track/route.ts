import { z } from "zod";
import { recordView } from "@/server/analytics";
import { assertSameOrigin, clientIp, handler, noContent } from "@/server/http";

const MAX_BYTES = 2048;

const viewSchema = z.object({ path: z.string().max(200), locale: z.string().max(5), referrer: z.string().max(500), entry: z.boolean() }).strict();

/**
 * POST /api/public/track : page vue, envoyée par le navigateur (navigator.sendBeacon).
 * Toujours 204 : le visiteur n'a rien à attendre de cette requête.
 */
export const POST = handler(async (req) => {
  assertSameOrigin(req);
  // Corps minuscule attendu : taille annoncée vérifiée avant lecture, puis taille réelle
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) return noContent();
  const text = await req.text();
  if (Buffer.byteLength(text) > MAX_BYTES) return noContent();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return noContent();
  }
  const view = viewSchema.safeParse(body);
  if (view.success) {
    await recordView(view.data, {
      ip: clientIp(req),
      userAgent: req.headers.get("user-agent") ?? "",
      country: req.headers.get("x-vercel-ip-country"),
      host: (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(":")[0],
    });
  }
  return noContent();
});
