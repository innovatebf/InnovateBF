import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db/neon";

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("your-"),
  );
}

export async function POST(req: NextRequest) {
  // Ouvert au public — le porteur_nom et porteur_email identifient le soumissionnaire

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.need_id || !body.titre || !body.description || !body.porteur_nom || !body.porteur_email) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : need_id, titre, description, porteur_nom, porteur_email" },
        { status: 400 },
      );
    }

    // Length validation
    if (body.titre.trim().length < 5) {
      return NextResponse.json(
        { error: "Le titre doit comporter au moins 5 caractères" },
        { status: 400 },
      );
    }
    if (body.description.trim().length < 20) {
      return NextResponse.json(
        { error: "La description doit comporter au moins 20 caractères" },
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

    // Verify need_id exists in DB
    const needCheck = await getSql()`SELECT id FROM ie_needs WHERE id = ${body.need_id} LIMIT 1`;
    if (needCheck.length === 0) {
      return NextResponse.json(
        { error: "Besoin introuvable" },
        { status: 404 },
      );
    }

    const result = await getSql()`
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
