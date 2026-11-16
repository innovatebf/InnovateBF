import { eq } from "drizzle-orm";
import { z } from "@/lib/zod-fr";
import { requireApiUser } from "@/server/auth/guard";
import { CANDIDATURE_STATUSES, getCandidature } from "@/server/admin-data";
import { audit } from "@/server/audit";
import { db, schema } from "@/server/db/client";
import { handler, json, noContent, parseId, readJson } from "@/server/http";

type Params = { id: string };

/** GET /api/admin/candidatures/:id : dossier complet. */
export const GET = handler<Params>(async (req, { params }) => {
  await requireApiUser(req);
  return json({ item: await getCandidature(parseId((await params).id)) });
});

/** PATCH /api/admin/candidatures/:id : changement de statut. */
export const PATCH = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req);
  const id = parseId((await params).id);
  await getCandidature(id);
  const { status } = await readJson(req, z.object({ status: z.enum(CANDIDATURE_STATUSES) }).strict());
  const [item] = await db
    .update(schema.candidatures)
    .set({ status, updatedAt: schema.nowIso })
    .where(eq(schema.candidatures.id, id))
    .returning();
  await audit(user, `status:${status}`, "candidature", id);
  return json({ item });
});

/** DELETE /api/admin/candidatures/:id (administrateurs). */
export const DELETE = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req, "admin");
  const id = parseId((await params).id);
  await getCandidature(id);
  await db.delete(schema.candidatures).where(eq(schema.candidatures.id, id));
  await audit(user, "delete", "candidature", id);
  return noContent();
});
