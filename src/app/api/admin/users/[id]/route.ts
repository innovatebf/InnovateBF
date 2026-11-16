import { and, count, eq, ne } from "drizzle-orm";
import { z } from "@/lib/zod-fr";
import { requireApiUser } from "@/server/auth/guard";
import { hashPassword, passwordSchema } from "@/server/auth/password";
import { revokeUserSessions } from "@/server/auth/session";
import { audit } from "@/server/audit";
import { db, schema } from "@/server/db/client";
import { errors, handler, json, noContent, parseId, readJson } from "@/server/http";

type Params = { id: string };

const patchSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    role: z.enum(["admin", "editor"]).optional(),
    disabled: z.boolean().optional(),
    password: passwordSchema.optional(),
  })
  .strict();

/** Empêche de se retrouver sans aucun administrateur actif. */
async function assertOtherActiveAdmin(id: number) {
  const [{ n }] = await db
    .select({ n: count() })
    .from(schema.users)
    .where(and(eq(schema.users.role, "admin"), eq(schema.users.disabled, false), ne(schema.users.id, id)));
  if (n === 0) throw errors.conflict("Il doit rester au moins un administrateur actif.");
}

async function findUser(id: number) {
  const [row] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
  if (!row) throw errors.notFound("Compte introuvable.");
  return row;
}

/** PATCH /api/admin/users/:id : nom, rôle, désactivation, nouveau mot de passe (administrateurs). */
export const PATCH = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req, "admin");
  const id = parseId((await params).id);
  const target = await findUser(id);
  const input = await readJson(req, patchSchema, 8 * 1024);
  const demotes = (input.role && input.role !== "admin") || input.disabled === true;
  if (target.role === "admin" && demotes) await assertOtherActiveAdmin(id);

  const patch: Partial<typeof schema.users.$inferInsert> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.role !== undefined) patch.role = input.role;
  if (input.disabled !== undefined) patch.disabled = input.disabled;
  if (input.password !== undefined) patch.passwordHash = await hashPassword(input.password);
  const [item] = await db
    .update(schema.users)
    .set({ ...patch, updatedAt: schema.nowIso })
    .where(eq(schema.users.id, id))
    .returning({ id: schema.users.id, email: schema.users.email, name: schema.users.name, role: schema.users.role, disabled: schema.users.disabled });
  // Toute modification sensible ferme les sessions ouvertes du compte
  if (input.disabled || input.password || input.role) await revokeUserSessions(id, id === user.id);
  await audit(user, "update", "user", id);
  return json({ item });
});

/** DELETE /api/admin/users/:id (administrateurs ; impossible sur son propre compte). */
export const DELETE = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req, "admin");
  const id = parseId((await params).id);
  if (id === user.id) throw errors.conflict("Vous ne pouvez pas supprimer votre propre compte.");
  const target = await findUser(id);
  if (target.role === "admin") await assertOtherActiveAdmin(id);
  await revokeUserSessions(id);
  await db.delete(schema.users).where(eq(schema.users.id, id));
  await audit(user, "delete", "user", id);
  return noContent();
});
