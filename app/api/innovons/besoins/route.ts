import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server";
import sql from "@/lib/db/neon";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Determiner le statut (BROUILLON ou VALIDATION uniquement)
    const allowedStatuts = ["BROUILLON", "VALIDATION"];
    const statut = allowedStatuts.includes(body.statut) ? body.statut : "VALIDATION";

    // Valider les champs obligatoires (sauf pour les brouillons)
    if (statut !== "BROUILLON" && (!body.titre || !body.question_centrale)) {
      return NextResponse.json(
        { error: "Titre et question centrale obligatoires" },
        { status: 400 },
      );
    }
    if (!body.titre) {
      return NextResponse.json(
        { error: "Titre obligatoire" },
        { status: 400 },
      );
    }

    // Mode dev sans DB : simuler succes (pas de session check en mock mode)
    if (
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.includes("your-")
    ) {
      console.log(`[DEV] Besoin ${statut} (mock):`, body.titre);
      return NextResponse.json(
        { success: true, id: "mock-" + Date.now(), mock: true, statut },
        { status: 201 },
      );
    }

    // Authentification requise en mode production
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Non authentifie" },
        { status: 401 },
      );
    }

    const auteurEmail = session.user.email;
    const auteurId = session.user.id;

    // Try insert with auteur_id first, fall back to without if column doesn't exist
    try {
      const result = await sql`
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
          ${body.contexte_strategique || null}, ${body.question_centrale || null},
          ${JSON.stringify(body.perimetre_inclus || [])},
          ${JSON.stringify(body.perimetre_exclus || [])},
          ${JSON.stringify(body.parties_prenantes || [])},
          ${JSON.stringify(body.obstacles || [])},
          ${JSON.stringify(body.resultats || [])},
          ${JSON.stringify(body.indicateurs || [])},
          ${body.synthese_narrative || null},
          ${body.coherence_score || 0},
          ${statut},
          ${auteurEmail},
          ${auteurId}
        )
        RETURNING id, titre, statut, created_at
      `;

      return NextResponse.json(
        { success: true, need: Array.isArray(result) ? result[0] : null },
        { status: 201 },
      );
    } catch (insertError: unknown) {
      // If auteur_id column doesn't exist yet, retry without it
      const errorMessage = insertError instanceof Error ? insertError.message : String(insertError);
      if (errorMessage.includes("auteur_id")) {
        const result = await sql`
          INSERT INTO ie_needs (
            titre, domaine, secteur, pays, niveau, region,
            contexte_strategique, question_centrale,
            perimetre_inclus, perimetre_exclus, parties_prenantes,
            obstacles, resultats, indicateurs,
            synthese_narrative, coherence_score, statut,
            auteur_email
          ) VALUES (
            ${body.titre}, ${body.domaine}, ${body.secteur},
            ${body.pays || "Burkina Faso"}, ${body.niveau}, ${body.region},
            ${body.contexte_strategique || null}, ${body.question_centrale || null},
            ${JSON.stringify(body.perimetre_inclus || [])},
            ${JSON.stringify(body.perimetre_exclus || [])},
            ${JSON.stringify(body.parties_prenantes || [])},
            ${JSON.stringify(body.obstacles || [])},
            ${JSON.stringify(body.resultats || [])},
            ${JSON.stringify(body.indicateurs || [])},
            ${body.synthese_narrative || null},
            ${body.coherence_score || 0},
            ${statut},
            ${auteurEmail}
          )
          RETURNING id, titre, statut, created_at
        `;

        return NextResponse.json(
          { success: true, need: Array.isArray(result) ? result[0] : null },
          { status: 201 },
        );
      }
      throw insertError;
    }
  } catch (error) {
    console.error("[POST /api/innovons/besoins]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
