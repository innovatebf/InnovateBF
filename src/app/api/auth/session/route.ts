import { getCurrentUser } from "@/server/auth/session";
import { errors, handler, json } from "@/server/http";

/** GET /api/auth/session : utilisateur connecté. */
export const GET = handler(async () => {
  const user = await getCurrentUser();
  if (!user) throw errors.unauthorized();
  return json({ user });
});
