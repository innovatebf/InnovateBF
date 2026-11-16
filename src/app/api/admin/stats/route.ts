import { requireApiUser } from "@/server/auth/guard";
import { getStats } from "@/server/admin-data";
import { handler, json } from "@/server/http";

/** GET /api/admin/stats : chiffres du tableau de bord. */
export const GET = handler(async (req) => {
  await requireApiUser(req);
  return json(await getStats());
});
