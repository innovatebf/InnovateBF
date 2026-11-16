import "server-only";
import type { SessionUser } from "./auth/session";
import { db, schema } from "./db/client";

/** Journal des actions du back-office (qui a modifié quoi, et quand). */
export async function audit(user: SessionUser | null, action: string, entity: string, entityId?: string | number) {
  try {
    await db.insert(schema.auditLog).values({
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      action: action.slice(0, 60),
      entity: entity.slice(0, 60),
      entityId: entityId == null ? null : String(entityId).slice(0, 60),
    });
  } catch (e) {
    // Le journal ne doit jamais faire échouer l'action elle-même
    console.error("[audit] écriture impossible", e);
  }
}
