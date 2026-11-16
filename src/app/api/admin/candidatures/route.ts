import { desc } from "drizzle-orm";
import { categories, labelOf, statutsPorteur, type Candidature } from "@/content/candidature";
import { requireApiUser } from "@/server/auth/guard";
import { CANDIDATURE_STATUSES, listCandidatures, type CandidatureStatus } from "@/server/admin-data";
import { db, schema } from "@/server/db/client";
import { csvResponse, handler, json, pagination } from "@/server/http";

/** GET /api/admin/candidatures : liste paginée (?page, ?pageSize, ?q, ?status) ou export CSV (?format=csv). */
export const GET = handler(async (req) => {
  await requireApiUser(req);
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "csv") {
    const rows = await db.select().from(schema.candidatures).orderBy(desc(schema.candidatures.id));
    return csvResponse(
      "candidatures-ebc26.csv",
      ["Numéro", "Date", "Statut", "Titre", "Catégorie", "Porteur", "E-mail", "Téléphone", "Statut du porteur", "Ville", "Pays"],
      rows.map((r) => {
        const d = r.data as Candidature;
        return [
          r.numero,
          r.createdAt,
          r.status,
          r.title,
          labelOf(categories, r.category),
          r.applicantName,
          r.email,
          d.porteur.telephone,
          labelOf(statutsPorteur, d.porteur.statut),
          d.porteur.ville,
          d.porteur.pays,
        ];
      }),
    );
  }
  const { page, pageSize } = pagination(url);
  const statusParam = url.searchParams.get("status");
  const status = CANDIDATURE_STATUSES.includes(statusParam as CandidatureStatus) ? (statusParam as CandidatureStatus) : undefined;
  return json(await listCandidatures({ page, pageSize, q: url.searchParams.get("q") ?? undefined, status }));
});
