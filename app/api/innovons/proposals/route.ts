import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db/neon";

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("your-"),
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.need_id || !body.titre || !body.description || !body.porteur_nom || !body.porteur_email) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : need_id, titre, description, porteur_nom, porteur_email" },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.porteur_email)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 },
      );
    }

    // Mock mode when no DATABASE_URL
    if (!isNeonConfigured()) {
      console.log("[DEV] Proposal soumise (mock):", body.titre);
      return NextResponse.json(
        {
          success: true,
          proposal: {
            id: "mock-prop-" + Date.now(),
            titre: body.titre,
            statut: "EN_ATTENTE",
            created_at: new Date().toISOString(),
          },
          mock: true,
        },
        { status: 201 },
      );
    }

    const result = await sql`
      INSERT INTO ie_proposals (
        need_id, titre, description, approche, equipe,
        budget_estime, delai, porteur_nom, porteur_email, porteur_organisation,
        statut
      ) VALUES (
        ${body.need_id},
        ${body.titre},
        ${body.description},
        ${body.approche || null},
        ${body.equipe || null},
        ${body.budget_estime || null},
        ${body.delai || null},
        ${body.porteur_nom},
        ${body.porteur_email},
        ${body.porteur_organisation || null},
        'EN_ATTENTE'
      )
      RETURNING id, titre, statut, created_at
    `;

    return NextResponse.json(
      { success: true, proposal: result[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/innovons/proposals]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
