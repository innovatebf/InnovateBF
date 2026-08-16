import { NextRequest, NextResponse } from "next/server";
import { getDossierByToken } from "@/lib/candidatures/db";

// In-memory rate limit: 10 checks/min per IP+token
const rl = new Map<string, { count: number; reset: number }>();

function checkRl(key: string): boolean {
  const now = Date.now();
  const entry = rl.get(key);
  if (!entry || now > entry.reset) {
    rl.set(key, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// Statuses that should be hidden until officially notified
const HIDDEN_STATUTS = new Set(["retenu", "non_retenu"]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRl(ip) || !checkRl(token)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const dossier = await getDossierByToken(token);
  if (!dossier) return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });

  const statut = HIDDEN_STATUTS.has(dossier.statut) ? "en_evaluation" : dossier.statut;

  return NextResponse.json({
    dossier_numero: dossier.dossier_numero,
    statut,
    soumis_le: dossier.soumis_le,
    motif_non_recevabilite: dossier.motif_non_recevabilite,
  });
}
