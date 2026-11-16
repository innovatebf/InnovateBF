import { requireApiUser } from "@/server/auth/guard";
import { listAudit } from "@/server/admin-data";
import { handler, json, pagination } from "@/server/http";

/** GET /api/admin/audit : journal des actions (administrateurs). */
export const GET = handler(async (req) => {
  await requireApiUser(req, "admin");
  const url = new URL(req.url);
  const { page, pageSize } = pagination(url);
  return json(await listAudit({ page, pageSize, q: url.searchParams.get("q") ?? undefined }));
});
