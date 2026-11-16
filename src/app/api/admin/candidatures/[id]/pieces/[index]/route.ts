import { NextResponse } from "next/server";
import type { Candidature } from "@/content/candidature";
import { getCandidature } from "@/server/admin-data";
import { requireApiUser } from "@/server/auth/guard";
import { errors, handler, parseId } from "@/server/http";
import { piecePath, signPieceDownload } from "@/server/storage";

type Params = { id: string; index: string };

/** GET /api/admin/candidatures/:id/pieces/:index : ouvre une pièce téléversée, par un lien temporaire (espace privé). */
export const GET = handler<Params>(async (req, { params }) => {
  await requireApiUser(req);
  const { id, index } = await params;
  const { data } = await getCandidature(parseId(id));
  const piece = (data as Candidature).pieces[Number(index)];
  const path = piece?.mode === "upload" ? piecePath(piece.url) : null;
  if (!path) throw errors.notFound();
  return new NextResponse(null, { status: 302, headers: { Location: await signPieceDownload(path), "Cache-Control": "no-store" } });
});
