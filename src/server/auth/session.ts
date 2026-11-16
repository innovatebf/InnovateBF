import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { db, schema } from "../db/client";
import type { Role } from "../db/schema";

/**
 * Sessions côté serveur : jeton aléatoire de 256 bits dans un cookie
 * httpOnly / Secure / SameSite=Lax ; seul son hachage SHA-256 est en base.
 */

export const SESSION_COOKIE = "ibf_session";
const SESSION_DAYS = 7;

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export type SessionUser = { id: number; email: string; name: string; role: Role };

export async function createSession(userId: number, meta: { ip: string; userAgent: string }) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.insert(schema.sessions).values({
    id: hash(token),
    userId,
    expiresAt: expiresAt.toISOString(),
    ip: meta.ip.slice(0, 64),
    userAgent: meta.userAgent.slice(0, 300),
  });
  // Purge des sessions expirées
  await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date().toISOString()));
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

async function readToken() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token && /^[\w-]{43}$/.test(token) ? token : null;
}

/** Utilisateur de la session courante (mis en cache pour la durée de la requête). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await readToken();
  if (!token) return null;
  const [row] = await db
    .select({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.users.role })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(
      and(
        eq(schema.sessions.id, hash(token)),
        gt(schema.sessions.expiresAt, new Date().toISOString()),
        eq(schema.users.disabled, false),
      ),
    )
    .limit(1);
  return row ?? null;
});

export async function destroyCurrentSession() {
  const token = await readToken();
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.id, hash(token)));
  (await cookies()).delete(SESSION_COOKIE);
}

/** Révoque toutes les sessions d'un utilisateur, sauf éventuellement la session courante. */
export async function revokeUserSessions(userId: number, keepCurrent = false) {
  const token = keepCurrent ? await readToken() : null;
  await db
    .delete(schema.sessions)
    .where(token ? and(eq(schema.sessions.userId, userId), ne(schema.sessions.id, hash(token))) : eq(schema.sessions.userId, userId));
}
