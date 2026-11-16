import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { errors, handler, json } from "@/server/http";
import { listMedia, MEDIA_MAX_BYTES, storeImage } from "@/server/media";

/** GET /api/admin/media : images de la médiathèque, plus récentes d'abord. */
export const GET = handler(async (req) => {
  await requireApiUser(req);
  return json({ items: await listMedia() });
});

/** POST /api/admin/media : envoi d'une image (multipart : file, alt). */
export const POST = handler(async (req) => {
  const user = await requireApiUser(req);
  if (!(req.headers.get("content-type") ?? "").startsWith("multipart/form-data")) throw errors.unsupported();
  if (Number(req.headers.get("content-length") ?? 0) > MEDIA_MAX_BYTES + 64 * 1024) throw errors.tooLarge();
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw errors.badRequest("Aucun fichier reçu.");
  const alt = String(form.get("alt") ?? "");
  const item = await storeImage(file, alt, user);
  await audit(user, "upload", "media", item.id);
  return json({ item }, { status: 201 });
});
