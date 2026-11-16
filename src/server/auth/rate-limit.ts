import "server-only";
import { createHash } from "node:crypto";
import { and, count, eq, gt, lt } from "drizzle-orm";
import { db, schema } from "../db/client";
import { errors } from "../http";

/**
 * Limitation de débit persistante (fonctionne avec plusieurs instances
 * serveur). Les identifiants (IP, e-mail) sont hachés avant stockage.
 */

const key = (bucket: string) => createHash("sha256").update(bucket).digest("hex").slice(0, 40);
const since = (seconds: number) => new Date(Date.now() - seconds * 1000).toISOString();

export async function countHits(bucket: string, windowSec: number) {
  const [row] = await db
    .select({ n: count() })
    .from(schema.rateLimits)
    .where(and(eq(schema.rateLimits.bucket, key(bucket)), gt(schema.rateLimits.createdAt, since(windowSec))));
  return row?.n ?? 0;
}

export async function recordHit(bucket: string) {
  await db.insert(schema.rateLimits).values({ bucket: key(bucket) });
  // Nettoyage occasionnel des entrées de plus de 24 h
  if (Math.random() < 0.02) await db.delete(schema.rateLimits).where(lt(schema.rateLimits.createdAt, since(86_400)));
}

export async function clearHits(bucket: string) {
  await db.delete(schema.rateLimits).where(eq(schema.rateLimits.bucket, key(bucket)));
}

/** Compte une requête et lève une erreur 429 si la limite est atteinte. */
export async function limit(bucket: string, max: number, windowSec: number) {
  if ((await countHits(bucket, windowSec)) >= max) throw errors.tooMany(windowSec);
  await recordHit(bucket);
}
