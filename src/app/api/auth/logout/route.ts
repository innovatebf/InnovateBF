import { destroyCurrentSession } from "@/server/auth/session";
import { assertSameOrigin, handler, noContent } from "@/server/http";

/** POST /api/auth/logout : ferme la session courante. */
export const POST = handler(async (req) => {
  assertSameOrigin(req);
  await destroyCurrentSession();
  return noContent();
});
