import { requireApiUser } from "@/server/auth/guard";
import { listRegistrations } from "@/server/admin-data";
import { db, schema } from "@/server/db/client";
import { desc } from "drizzle-orm";
import { csvResponse, handler, json, pagination } from "@/server/http";

/** GET /api/admin/registrations : liste paginée (?page, ?pageSize, ?q) ou export CSV (?format=csv). */
export const GET = handler(async (req) => {
  await requireApiUser(req);
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "csv") {
    const rows = await db.select().from(schema.registrations).orderBy(desc(schema.registrations.id));
    return csvResponse(
      "inscriptions-ebc2026.csv",
      ["Date", "Nom", "E-mail", "Organisation", "Type"],
      rows.map((r) => [r.createdAt, r.name, r.email, r.organization, r.type]),
    );
  }
  const { page, pageSize } = pagination(url);
  return json(await listRegistrations({ page, pageSize, q: url.searchParams.get("q") ?? undefined }));
});
