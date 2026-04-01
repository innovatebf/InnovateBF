import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db/neon";
import { requireRoleForApi } from "@/lib/auth/guards";

export async function POST(req: NextRequest) {
  // RBAC: editor or admin only — session carries auteur identity
  const auth = await requireRoleForApi('editor');
  if (auth.error) return auth.error;

  // Extract author identity from verified session (never trust client payload)
  const auteurEmail = auth.session!.user.email ?? null;
  const auteurId = auth.session!.user.id ?? null;

  try {
    const body = await req.json();

    // Valider les champs obligatoires
    const isBrouillon = body.statut === 'BROUILLON';
    if (!body.titre || (!isBrouillon && !body.question_centrale)) {
      return NextResponse.json(
        { error: "Titre et question centrale obligatoires" },
        { status: 400 },
      );
    }

    // Mode dev sans DB : simuler succes
    if (
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.includes("your-")
    ) {
      console.log("[DEV] Besoin soumis (mock):", body.titre);
      return NextResponse.json(
        { success: true, id: "mock-" + Date.now(), mock: true },
        { status: 201 },
      );
    }

    const result = await getSql()`
      INSERT INTO ie_needs (
        titre, domaine, secteur, pays, niveau, region,
        contexte_strategique, question_centrale,
        perimetre_inclus, perimetre_exclus, parties_prenantes,
        obstacles, resultats, indicateurs,
        synthese_narrative, coherence_score, statut,
        auteur_email, auteur_id
      ) VALUES (
        ${body.titre}, ${body.domaine}, ${body.secteur},
        ${body.pays || "Burkina Faso"}, ${body.niveau}, ${body.region},
        ${body.contexte_strategique}, ${body.question_centrale},
        ${JSON.stringify(body.perimetre_inclus || [])},
        ${JSON.stringify(body.perimetre_exclus || [])},
        ${JSON.stringify(body.parties_prenantes || [])},
        ${JSON.stringify(body.obstacles || [])},
        ${JSON.stringify(body.resultats || [])},
        ${JSON.stringify(body.indicateurs || [])},
        ${body.synthese_narrative},
        ${body.coherence_score || 0},
        ${body.statut || 'VALIDATION'},
        ${auteurEmail}, ${auteurId}
      )
      RETURNING id, titre, statut, created_at
    `;

    return NextResponse.json(
      { success: true, need: result[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/innovons/besoins]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
