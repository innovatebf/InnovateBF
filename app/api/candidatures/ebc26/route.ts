import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { candidatureSchema } from "@/lib/candidatures/schema";
import { soumettreCandidatureWithToken } from "@/lib/candidatures/db";
import { envoyerAccuse } from "@/lib/candidatures/email";

const CLOTURE_LE = process.env.EBC26_CLOTURE_LE ?? "2026-10-31T23:59:59Z";

// In-memory rate limit: 3 submissions/hour per IP
const rl = new Map<string, { count: number; reset: number }>();

function checkRl(ip: string): boolean {
  const now = Date.now();
  const entry = rl.get(ip);
  if (!entry || now > entry.reset) {
    rl.set(ip, { count: 1, reset: now + 3_600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRl(ip)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une heure." }, { status: 429 });
  }

  if (new Date() >= new Date(CLOTURE_LE)) {
    return NextResponse.json({ error: "closed", code: "closed" }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  let payload;
  try {
    payload = candidatureSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Validation", issues: err.issues }, { status: 422 });
    }
    throw err;
  }

  const result = await soumettreCandidatureWithToken(payload);

  if (result.isNew && result.tokenClair) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const suiviUrl = `${siteUrl}/${payload.langue}/submit/ebc26/suivi/${result.tokenClair}`;
    await envoyerAccuse({
      to: payload.porteur.email,
      dossierNumero: result.dossier_numero,
      suiviUrl,
      langue: payload.langue,
    }).catch((err) => console.error("[ebc26] email error:", err));
  }

  return NextResponse.json({ dossier_numero: result.dossier_numero }, { status: 201 });
}
