import { eq } from "drizzle-orm";
import { z } from "@/lib/zod-fr";
import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { db, schema } from "@/server/db/client";
import { errors, handler, json, noContent, parseId, readJson } from "@/server/http";

type Params = { id: string };

/** PATCH /api/admin/messages/:id : marque comme lu / non lu. */
export const PATCH = handler<Params>(async (req, { params }) => {
  await requireApiUser(req);
  const id = parseId((await params).id);
  const { read } = await readJson(req, z.object({ read: z.boolean() }).strict());
  const [item] = await db.update(schema.messages).set({ read }).where(eq(schema.messages.id, id)).returning();
  if (!item) throw errors.notFound();
  return json({ item });
});

/** DELETE /api/admin/messages/:id (administrateurs). */
export const DELETE = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req, "admin");
  const id = parseId((await params).id);
  const deleted = await db.delete(schema.messages).where(eq(schema.messages.id, id)).returning({ id: schema.messages.id });
  if (!deleted.length) throw errors.notFound();
  await audit(user, "delete", "message", id);
  return noContent();
});
