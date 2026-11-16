import "server-only";
import { redirect } from "next/navigation";
import type { Role } from "../db/schema";
import { assertSameOrigin, errors } from "../http";
import { getCurrentUser, type SessionUser } from "./session";

const allows = (user: SessionUser, role?: Role) => !role || role === "editor" || user.role === "admin";

/**
 * Endpoints du back-office : origine vérifiée pour toute modification,
 * session valide, rôle suffisant (admin > editor).
 */
export async function requireApiUser(req: Request, role?: Role) {
  assertSameOrigin(req);
  const user = await getCurrentUser();
  if (!user) throw errors.unauthorized();
  if (!allows(user, role)) throw errors.forbidden("Cette action est réservée aux administrateurs.");
  return user;
}

/** Pages du back-office : redirige vers la connexion si nécessaire. */
export async function requirePageUser(role?: Role) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!allows(user, role)) redirect("/admin");
  return user;
}
