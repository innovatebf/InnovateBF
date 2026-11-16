import { z } from "@/lib/zod-fr";
import { isCollectionName } from "@/lib/content/definitions";
import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { createItem, invalidateContent, listItems } from "@/server/content/repository";
import { errors, handler, json, readJson } from "@/server/http";

type Params = { name: string };

async function collectionFrom(params: Promise<{ name: string }>) {
  const { name } = await params;
  if (!isCollectionName(name)) throw errors.notFound("Collection inconnue.");
  return name;
}

/** GET /api/admin/collections/:name : tous les éléments (y compris masqués), dans l'ordre. */
export const GET = handler<Params>(async (req, { params }) => {
  await requireApiUser(req);
  const name = await collectionFrom(params);
  return json({ items: await listItems(name, { includeHidden: true }) });
});

/** POST /api/admin/collections/:name : ajoute un élément en fin de liste. */
export const POST = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req);
  const name = await collectionFrom(params);
  const input = await readJson(req, z.object({ data: z.unknown(), visible: z.boolean().optional() }).strict());
  const item = await createItem(name, input);
  invalidateContent();
  await audit(user, "create", name, item.id);
  return json({ item }, { status: 201 });
});
