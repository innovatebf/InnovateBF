import { pieceRules } from "@/content/candidature";
import { z } from "@/lib/zod-fr";
import { isCallOpen } from "@/lib/site";
import { limit } from "@/server/auth/rate-limit";
import { readAllSettings } from "@/server/content/repository";
import { ApiError, assertSameOrigin, clientIp, errors, handler, json, readJson } from "@/server/http";
import { isPiecePath, pieceUrl, signPieceUpload } from "@/server/storage";
import { storageEnabled } from "@/server/storage-config";

const uploadRequest = z.object({ pathname: z.string().min(1).max(300) }).strict();

/**
 * POST /api/public/candidature-files : autorise le téléversement direct d'une
 * pièce jointe vers le stockage Supabase (PDF, PNG, JPG, MP4, ZIP ; 25 Mo par fichier),
 * pour un seul chemin, sans écrasement possible. Le formulaire envoie la
 * langue de la page (en-tête X-Site-Locale) : messages en français ou en anglais.
 */
export const POST = handler(async (req) => {
  if (!storageEnabled()) {
    throw new ApiError(503, "STORAGE_UNAVAILABLE", "Le téléversement n'est pas disponible : ajoutez un lien.", undefined, "File upload is not available. Add a link instead.");
  }
  assertSameOrigin(req);
  await limit(`upload:${clientIp(req)}`, 30, 3600);
  const { pathname } = await readJson(req, uploadRequest, 4 * 1024);

  const { calendar } = await readAllSettings();
  if (!isCallOpen(calendar)) throw errors.closed("L'appel est clôturé.", "The call is closed.");
  const ext = "." + (pathname.split(".").pop() ?? "").toLowerCase();
  if (!isPiecePath(pathname) || !pieceRules.extensions.includes(ext)) {
    throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Format non accepté.", undefined, "File format not accepted.");
  }
  return json({ uploadUrl: await signPieceUpload(pathname), url: pieceUrl(pathname) });
});
