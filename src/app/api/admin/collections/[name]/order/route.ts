import { z } from "@/lib/zod-fr";
import { isCollectionName } from "@/lib/content/definitions";
import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { invalidateContent, listItems, reorderItems } from "@/server/content/repository";
import { errors, handler, json, readJson } from "@/server/http";

type Params = { name: string };

/** PUT /api/admin/collections/:name/order : nouvel ordre ({ ids: [...] }, tous les éléments). */
export const PUT = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req);
  const { name } = await params;
  if (!isCollectionName(name)) throw errors.notFound("Collection inconnue.");
  const { ids } = await readJson(req, z.object({ ids: z.array(z.number().int().positive()).max(500) }).strict());
  await reorderItems(name, ids);
  invalidateContent();
  await audit(user, "reorder", name);
  return json({ items: await listItems(name, { includeHidden: true }) });
});
