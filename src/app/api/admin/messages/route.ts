import { requireApiUser } from "@/server/auth/guard";
import { listMessages } from "@/server/admin-data";
import { handler, json, pagination } from "@/server/http";

/** GET /api/admin/messages : messages du formulaire de contact (?page, ?pageSize, ?q). */
export const GET = handler(async (req) => {
  await requireApiUser(req);
  const url = new URL(req.url);
  const { page, pageSize } = pagination(url);
  return json(await listMessages({ page, pageSize, q: url.searchParams.get("q") ?? undefined }));
});
