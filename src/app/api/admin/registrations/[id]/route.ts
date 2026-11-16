import { eq } from "drizzle-orm";
import { requireApiUser } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { db, schema } from "@/server/db/client";
import { errors, handler, noContent, parseId } from "@/server/http";

/** DELETE /api/admin/registrations/:id (administrateurs). */
export const DELETE = handler<{ id: string }>(async (req, { params }) => {
  const user = await requireApiUser(req, "admin");
  const id = parseId((await params).id);
  const deleted = await db.delete(schema.registrations).where(eq(schema.registrations.id, id)).returning({ id: schema.registrations.id });
  if (!deleted.length) throw errors.notFound();
  await audit(user, "delete", "registration", id);
  return noContent();
});
