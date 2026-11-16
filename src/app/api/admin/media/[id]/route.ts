import { eq } from "drizzle-orm";
import { z } from "@/lib/zod-fr";
import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { db, schema } from "@/server/db/client";
import { handler, json, noContent, parseId, readJson } from "@/server/http";
import { deleteMedia, getMedia, mediaUsage } from "@/server/media";

type Params = { id: string };

/** GET /api/admin/media/:id : détail et nombre d'utilisations. */
export const GET = handler<Params>(async (req, { params }) => {
  await requireApiUser(req);
  const item = await getMedia(parseId((await params).id));
  return json({ item, usage: await mediaUsage(item.url) });
});

/** PATCH /api/admin/media/:id : texte alternatif. */
export const PATCH = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req);
  const id = parseId((await params).id);
  await getMedia(id);
  const { alt } = await readJson(req, z.object({ alt: z.string().trim().max(200) }).strict());
  const [item] = await db.update(schema.media).set({ alt }).where(eq(schema.media.id, id)).returning();
  await audit(user, "update", "media", id);
  return json({ item });
});

/** DELETE /api/admin/media/:id : refusé si l'image est encore utilisée. */
export const DELETE = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req);
  const id = parseId((await params).id);
  await deleteMedia(id);
  await audit(user, "delete", "media", id);
  return noContent();
});
