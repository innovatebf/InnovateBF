import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db/neon";
import { MOCK_NEEDS } from "@/lib/innovons/mock-data";

function isNeonConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("your-"),
  );
}

// GET /api/innovons/besoins/[id] — fetch a specific need by ID or slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!isNeonConfigured()) {
      const need =
        MOCK_NEEDS.find((n) => n.id === id) ??
        MOCK_NEEDS.find((n) => n.slug === id);
      if (!need) {
        return NextResponse.json({ error: "Besoin non trouve" }, { status: 404 });
      }
      return NextResponse.json({ success: true, need });
    }

    // Try by ID first, then by slug
    let result = await sql`
      SELECT * FROM ie_needs WHERE id::text = ${id}
    `;

    if (!result || result.length === 0) {
      result = await sql`
        SELECT * FROM ie_needs WHERE slug = ${id}
      `;
    }

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Besoin non trouve" }, { status: 404 });
    }

    return NextResponse.json({ success: true, need: result[0] });
  } catch (error) {
    console.error("[GET /api/innovons/besoins/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/innovons/besoins/[id] — update a need (only BROUILLON or VALIDATION)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!isNeonConfigured()) {
      const need = MOCK_NEEDS.find((n) => n.id === id || n.slug === id);
      if (!need) {
        return NextResponse.json({ error: "Besoin non trouve" }, { status: 404 });
      }
      if (need.statut !== "BROUILLON" && need.statut !== "VALIDATION") {
        return NextResponse.json(
          { error: "Seuls les besoins en BROUILLON ou VALIDATION peuvent etre modifies" },
          { status: 403 },
        );
      }
      console.log("[DEV] Besoin mis a jour (mock):", id, body);
      return NextResponse.json({
        success: true,
        need: { ...need, ...body, updated_at: new Date().toISOString() },
      });
    }

    // Check status before updating
    const existing = await sql`
      SELECT id, statut FROM ie_needs WHERE id::text = ${id} OR slug = ${id}
    `;

    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: "Besoin non trouve" }, { status: 404 });
    }

    const existingNeed = existing[0] as { id: string; statut: string };
    const currentStatus = existingNeed.statut;
    if (currentStatus !== "BROUILLON" && currentStatus !== "VALIDATION") {
      return NextResponse.json(
        { error: "Seuls les besoins en BROUILLON ou VALIDATION peuvent etre modifies" },
        { status: 403 },
      );
    }

    const needId = existingNeed.id;

    // Build update — only allow specific fields
    const allowedFields = [
      "titre",
      "domaine",
      "secteur",
      "region",
      "question_centrale",
      "contexte_strategique",
      "synthese_narrative",
    ];

    const updates: Record<string, string> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Aucun champ a mettre a jour" },
        { status: 400 },
      );
    }

    const titre = updates["titre"] ?? null;
    const domaine = updates["domaine"] ?? null;
    const secteur = updates["secteur"] ?? null;
    const region = updates["region"] ?? null;
    const question_centrale = updates["question_centrale"] ?? null;
    const contexte_strategique = updates["contexte_strategique"] ?? null;
    const synthese_narrative = updates["synthese_narrative"] ?? null;

    const result = await sql`
      UPDATE ie_needs SET
        titre = COALESCE(${titre}, titre),
        domaine = COALESCE(${domaine}, domaine),
        secteur = COALESCE(${secteur}, secteur),
        region = COALESCE(${region}, region),
        question_centrale = COALESCE(${question_centrale}, question_centrale),
        contexte_strategique = COALESCE(${contexte_strategique}, contexte_strategique),
        synthese_narrative = COALESCE(${synthese_narrative}, synthese_narrative),
        updated_at = NOW()
      WHERE id = ${needId}
      RETURNING *
    `;

    return NextResponse.json({ success: true, need: result[0] });
  } catch (error) {
    console.error("[PATCH /api/innovons/besoins/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
