import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { collectionDefs, settingsDefs } from "@/lib/content/definitions";
import type { SessionUser } from "./auth/session";
import { db, schema } from "./db/client";
import { ApiError, errors } from "./http";
import { removeImage, uploadImage } from "./storage";
import { MEDIA_MAX_BYTES, MEDIA_TYPES as TYPES, storageEnabled } from "./storage-config";

/**
 * Médiathèque du back-office : images uniquement (PNG, JPEG, WebP, GIF, AVIF),
 * type vérifié sur le contenu réel du fichier (signature), 5 Mo maximum.
 * Les SVG sont refusés (ils peuvent contenir du script).
 * Stockage : Supabase s'il est configuré (voir storage-config.ts), sinon disque local.
 */

export { MEDIA_MAX_BYTES };

type Ext = keyof typeof TYPES;

export const LOCAL_FILE = /^[a-f0-9]{32}\.(png|jpg|webp|gif|avif)$/;

export function uploadsDir() {
  return path.resolve(process.env.UPLOADS_DIR || "./data/uploads");
}

/** Détecte le format à partir des premiers octets. */
export function sniffImage(buf: Buffer): Ext | null {
  if (buf.length < 12) return null;
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  const ascii = buf.subarray(0, 12).toString("latin1");
  if (ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a")) return "gif";
  if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") return "webp";
  if (ascii.slice(4, 12) === "ftypavif" || ascii.slice(4, 12) === "ftypavis") return "avif";
  return null;
}

export async function storeImage(file: File, alt: string, user: SessionUser) {
  if (file.size === 0) throw errors.badRequest("Fichier vide.");
  if (file.size > MEDIA_MAX_BYTES) throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Image trop lourde (5 Mo maximum).");
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = sniffImage(buf);
  if (!ext) throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Format refusé : PNG, JPEG, WebP, GIF ou AVIF uniquement.");

  const name = `${randomBytes(16).toString("hex")}.${ext}`;
  let url: string;
  if (storageEnabled()) {
    url = await uploadImage(name, buf, TYPES[ext]);
  } else {
    if (process.env.VERCEL) {
      throw new ApiError(503, "STORAGE_UNAVAILABLE", "Stockage non configuré : renseignez SUPABASE_URL et SUPABASE_SECRET_KEY.");
    }
    await mkdir(uploadsDir(), { recursive: true });
    await writeFile(path.join(uploadsDir(), name), buf, { flag: "wx" });
    url = `/media/${name}`;
  }

  const [row] = await db
    .insert(schema.media)
    .values({
      url,
      storageKey: name,
      filename: file.name.replace(/[^\w.\- ]/g, "_").slice(0, 120) || name,
      contentType: TYPES[ext],
      size: buf.length,
      alt: alt.trim().slice(0, 200),
      uploadedBy: user.id,
    })
    .returning();
  return row;
}

export async function listMedia() {
  return db.select().from(schema.media).orderBy(desc(schema.media.createdAt), desc(schema.media.id));
}

export async function getMedia(id: number) {
  const [row] = await db.select().from(schema.media).where(eq(schema.media.id, id)).limit(1);
  if (!row) throw errors.notFound("Image introuvable.");
  return row;
}

/** Contenus (blocs ou éléments) qui utilisent encore cette image. */
export async function mediaUsage(url: string) {
  // Seuls les blocs et collections encore gérés comptent (pas les anciennes lignes)
  const [s] = await db
    .select({ n: count() })
    .from(schema.settings)
    .where(and(inArray(schema.settings.key, Object.keys(settingsDefs)), sql`strpos(${schema.settings.value}::text, ${url}) > 0`));
  const [i] = await db
    .select({ n: count() })
    .from(schema.items)
    .where(and(inArray(schema.items.collection, Object.keys(collectionDefs)), sql`strpos(${schema.items.data}::text, ${url}) > 0`));
  return (s?.n ?? 0) + (i?.n ?? 0);
}

export async function deleteMedia(id: number) {
  const row = await getMedia(id);
  const used = await mediaUsage(row.url);
  if (used > 0) throw errors.conflict(`Image utilisée par ${used} contenu(s) : remplacez-la avant de la supprimer.`);
  if (row.url.startsWith("http")) await removeImage(row.storageKey);
  else if (LOCAL_FILE.test(row.storageKey)) await unlink(path.join(uploadsDir(), row.storageKey)).catch(() => undefined);
  await db.delete(schema.media).where(eq(schema.media.id, id));
}

export async function readLocalMedia(name: string) {
  if (!LOCAL_FILE.test(name)) return null;
  try {
    const buf = await readFile(path.join(uploadsDir(), name));
    return { buf, type: TYPES[name.split(".").pop() as Ext] };
  } catch {
    return null;
  }
}
