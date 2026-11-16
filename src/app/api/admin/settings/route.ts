import { requireApiUser } from "@/server/auth/guard";
import { readAllSettings } from "@/server/content/repository";
import { handler, json } from "@/server/http";

/** GET /api/admin/settings : tous les blocs éditables. */
export const GET = handler(async (req) => {
  await requireApiUser(req);
  return json({ settings: await readAllSettings() });
});
