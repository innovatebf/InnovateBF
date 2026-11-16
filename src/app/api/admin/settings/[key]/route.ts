import { z } from "@/lib/zod-fr";
import { isSettingsKey } from "@/lib/content/definitions";
import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { invalidateContent, readAllSettings, saveSettings } from "@/server/content/repository";
import { errors, handler, json, readJson } from "@/server/http";

type Params = { key: string };

async function keyFrom(params: Promise<Params>) {
  const { key } = await params;
  if (!isSettingsKey(key)) throw errors.notFound("Bloc inconnu.");
  return key;
}

/** GET /api/admin/settings/:key */
export const GET = handler<Params>(async (req, { params }) => {
  await requireApiUser(req);
  const key = await keyFrom(params);
  return json({ key, value: (await readAllSettings())[key] });
});

/** PUT /api/admin/settings/:key : remplace le bloc (validé champ par champ). */
export const PUT = handler<Params>(async (req, { params }) => {
  const user = await requireApiUser(req);
  const key = await keyFrom(params);
  const { value } = await readJson(req, z.object({ value: z.unknown() }).strict());
  const saved = await saveSettings(key, value);
  invalidateContent();
  await audit(user, "update", `settings:${key}`);
  return json({ key, value: saved });
});
