import { eq } from "drizzle-orm";
import { z } from "@/lib/zod-fr";
import { requireApiUser } from "@/server/auth/guard";
import { hashPassword, passwordSchema } from "@/server/auth/password";
import { listUsers } from "@/server/admin-data";
import { audit } from "@/server/audit";
import { db, schema } from "@/server/db/client";
import { errors, handler, json, readJson } from "@/server/http";

const createSchema = z
  .object({
    email: z.string().trim().toLowerCase().max(200).email("Adresse e-mail invalide"),
    name: z.string().trim().min(1, "Champ obligatoire").max(120),
    role: z.enum(["admin", "editor"]),
    password: passwordSchema,
  })
  .strict();

/** GET /api/admin/users (administrateurs). */
export const GET = handler(async (req) => {
  await requireApiUser(req, "admin");
  return json({ items: await listUsers() });
});

/** POST /api/admin/users : création d'un compte (administrateurs). */
export const POST = handler(async (req) => {
  const user = await requireApiUser(req, "admin");
  const input = await readJson(req, createSchema, 8 * 1024);
  const [exists] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, input.email)).limit(1);
  if (exists) throw errors.conflict("Un compte existe déjà avec cette adresse.");
  const [created] = await db
    .insert(schema.users)
    .values({ email: input.email, name: input.name, role: input.role, passwordHash: await hashPassword(input.password) })
    .returning({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.users.role });
  await audit(user, "create", "user", created.id);
  return json({ item: created }, { status: 201 });
});
