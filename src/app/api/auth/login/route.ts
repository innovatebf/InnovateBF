import { eq } from "drizzle-orm";
import { z } from "@/lib/zod-fr";
import { getDummyHash, verifyPassword } from "@/server/auth/password";
import { clearHits, countHits, recordHit } from "@/server/auth/rate-limit";
import { createSession } from "@/server/auth/session";
import { audit } from "@/server/audit";
import { db, schema } from "@/server/db/client";
import { ApiError, assertSameOrigin, clientIp, errors, handler, json, readJson } from "@/server/http";

const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().max(200).email("Adresse e-mail invalide"),
    password: z.string().min(1, "Champ obligatoire").max(200),
  })
  .strict();

const WINDOW = 15 * 60;
const MAX_PER_ACCOUNT = 5;
const MAX_PER_IP = 20;

/** POST /api/auth/login : ouverture de session (tentatives limitées par compte et par IP). */
export const POST = handler(async (req) => {
  assertSameOrigin(req);
  const ip = clientIp(req);
  const { email, password } = await readJson(req, loginSchema, 4 * 1024);
  const accountBucket = `login:account:${email}`;
  const ipBucket = `login:ip:${ip}`;

  if ((await countHits(accountBucket, WINDOW)) >= MAX_PER_ACCOUNT || (await countHits(ipBucket, WINDOW)) >= MAX_PER_IP) {
    throw errors.tooMany(WINDOW);
  }

  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  // Vérification systématique (même sans compte) : pas d'indice sur l'existence d'un e-mail
  const valid = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !valid || user.disabled) {
    await recordHit(accountBucket);
    await recordHit(ipBucket);
    throw new ApiError(401, "INVALID_CREDENTIALS", "Identifiants invalides.");
  }

  await clearHits(accountBucket);
  await createSession(user.id, { ip, userAgent: req.headers.get("user-agent") ?? "" });
  await db
    .update(schema.users)
    .set({ lastLoginAt: schema.nowIso })
    .where(eq(schema.users.id, user.id));
  await audit({ id: user.id, email: user.email, name: user.name, role: user.role }, "login", "session");
  return json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});
