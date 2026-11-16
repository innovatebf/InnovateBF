import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { addDemoSpeakers, countDemoSpeakers, invalidateContent, removeDemoSpeakers } from "@/server/content/repository";
import { handler, json } from "@/server/http";

/** GET /api/admin/demo/speakers : nombre de fiches d'exemple présentes. */
export const GET = handler(async (req) => {
  await requireApiUser(req);
  return json({ count: await countDemoSpeakers() });
});

/** POST /api/admin/demo/speakers : ajoute les intervenants d'exemple (fictifs, marqués « Exemple »). */
export const POST = handler(async (req) => {
  const user = await requireApiUser(req);
  const count = await addDemoSpeakers();
  invalidateContent();
  await audit(user, "demo_add", "speakers", count);
  return json({ count }, { status: 201 });
});

/** DELETE /api/admin/demo/speakers : supprime les fiches d'exemple, conserve les vrais intervenants. */
export const DELETE = handler(async (req) => {
  const user = await requireApiUser(req);
  const count = await removeDemoSpeakers();
  invalidateContent();
  await audit(user, "demo_remove", "speakers", count);
  return json({ count });
});
