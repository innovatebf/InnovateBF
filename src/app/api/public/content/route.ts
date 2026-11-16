import { getPublicContent } from "@/server/content/repository";
import { handler, json } from "@/server/http";

/** GET /api/public/content : contenu publié du site (blocs et collections visibles). */
export const GET = handler(async () => {
  const content = await getPublicContent();
  return json(content, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
});
