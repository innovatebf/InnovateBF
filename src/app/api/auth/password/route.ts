import { eq } from "drizzle-orm";
import { z } from "@/lib/zod-fr";
import { requireApiUser } from "@/server/auth/guard";
import { hashPassword, passwordSchema, verifyPassword } from "@/server/auth/password";
import { limit } from "@/server/auth/rate-limit";
import { revokeUserSessions } from "@/server/auth/session";
import { audit } from "@/server/audit";
import { db, schema } from "@/server/db/client";
import { ApiError, handler, noContent, readJson } from "@/server/http";

const schemaIn = z.object({ current: z.string().min(1, "Champ obligatoire").max(200), next: passwordSchema }).strict();

/** POST /api/auth/password : changement de son propre mot de passe (les autres sessions sont fermées). */
export const POST = handler(async (req) => {
  const user = await requireApiUser(req);
  await limit(`password:${user.id}`, 5, 900);
  const { current, next } = await readJson(req, schemaIn, 4 * 1024);
  const [row] = await db.select({ hash: schema.users.passwordHash }).from(schema.users).where(eq(schema.users.id, user.id)).limit(1);
  if (!row || !(await verifyPassword(current, row.hash))) {
    throw new ApiError(422, "VALIDATION_ERROR", "Mot de passe actuel incorrect.", { current: "Mot de passe incorrect" });
  }
  if (current === next) throw new ApiError(422, "VALIDATION_ERROR", "Choisissez un nouveau mot de passe.", { next: "Identique à l'actuel" });
  await db
    .update(schema.users)
    .set({ passwordHash: await hashPassword(next), updatedAt: schema.nowIso })
    .where(eq(schema.users.id, user.id));
  await revokeUserSessions(user.id, true);
  await audit(user, "password_change", "user", user.id);
  return noContent();
});
