import { z } from "@/lib/zod-fr";
import { isCollectionName } from "@/lib/content/definitions";
import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { deleteItem, getItem, invalidateContent, updateItem } from "@/server/content/repository";
import { errors, handler, json, noContent, parseId, readJson } from "@/server/http";

type Params = { name: string; id: string };

async function target(params: Promise<Params>) {
  const { name, id } = await params;
  if (!isCollectionName(name)) throw errors.notFound("Collection inconnue.");
  return { name, id: parseId(id) };
}

/** GET /api/admin/collections/:name/:id */
export const GET = handler<Params>(async (req, { params }) => {
  await requireApiUser(req);
  const { name, id } = await target(params);
  return json({ item: await getItem(name, id) });
});

/** PATCH /api/admin/collections/:name/:id : données et/ou visibilité. */
export const PATCH = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req);
  const { name, id } = await target(params);
  const input = await readJson(
    req,
    z
      .object({ data: z.unknown().optional(), visible: z.boolean().optional() })
      .strict()
      .refine((v) => v.data !== undefined || v.visible !== undefined, "Rien à modifier."),
  );
  const item = await updateItem(name, id, input);
  invalidateContent();
  await audit(user, input.data !== undefined ? "update" : input.visible ? "show" : "hide", name, id);
  return json({ item });
});

/** DELETE /api/admin/collections/:name/:id */
export const DELETE = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req);
  const { name, id } = await target(params);
  await deleteItem(name, id);
  invalidateContent();
  await audit(user, "delete", name, id);
  return noContent();
});
