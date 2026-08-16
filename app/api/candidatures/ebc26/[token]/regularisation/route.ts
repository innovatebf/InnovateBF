import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { regularisationSchema } from "@/lib/candidatures/schema";
import { getDossierByToken, regulariserDossier } from "@/lib/candidatures/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const dossier = await getDossierByToken(token);
  if (!dossier) return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  if (dossier.statut !== "incomplet") {
    return NextResponse.json({ error: "Régularisation non applicable." }, { status: 403 });
  }

  // 72h regularisation window
  const soumisLe = new Date(dossier.soumis_le);
  if (Date.now() - soumisLe.getTime() > 72 * 3600 * 1000) {
    return NextResponse.json({ error: "Fenêtre de régularisation expirée (72 h)." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  let payload;
  try {
    payload = regularisationSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Validation", issues: err.issues }, { status: 422 });
    }
    throw err;
  }

  const updated = await regulariserDossier(token, payload.demonstrateur_url);
  if (!updated) return NextResponse.json({ error: "Mise à jour échouée." }, { status: 500 });

  return NextResponse.json({ statut: updated.statut, dossier_numero: updated.dossier_numero });
}
