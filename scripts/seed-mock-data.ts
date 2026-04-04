/**
 * Seed: importe les 12 besoins + 8 appels à solutionnement depuis mock-data
 * Usage: npx tsx scripts/seed-mock-data.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { MOCK_NEEDS, MOCK_CALLS } from "../lib/innovons/mock-data";

const sql = neon(process.env.DATABASE_URL!);

async function ensureCallsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS ie_calls (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      need_id       UUID NOT NULL,
      titre         TEXT NOT NULL,
      description   TEXT,
      domaine       TEXT,
      deadline      TIMESTAMPTZ NOT NULL,
      statut        TEXT NOT NULL DEFAULT 'OUVERT'
                      CHECK (statut IN ('OUVERT','FERME','SELECTIONNE')),
      budget_alloue BIGINT DEFAULT 0,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_ie_calls_need_id ON ie_calls (need_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ie_calls_statut  ON ie_calls (statut)`;
  console.log("✅ Table ie_calls prête");
}

async function getAdminId(): Promise<string | null> {
  const rows = await sql`SELECT id FROM "user" WHERE email = 'admin@innovatebf.org' LIMIT 1`;
  return (rows[0]?.id as string) ?? null;
}

async function seedNeeds(adminId: string | null) {
  let inserted = 0;
  let skipped = 0;

  for (const n of MOCK_NEEDS) {
    // Ignorer le besoin de test (brouillon dev)
    if (n.id === "test-besoin-brouillon" || n.statut === "BROUILLON" || !n.question_centrale) {
      skipped++;
      continue;
    }

    const existing = await sql`SELECT id FROM ie_needs WHERE slug = ${n.slug} LIMIT 1`;
    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO ie_needs (
        slug, titre, domaine, secteur, pays, niveau, region,
        statut, tags, question_centrale, contexte_strategique,
        parties_prenantes, obstacles, resultats, indicateurs,
        synthese_narrative, population_impact, budget,
        auteur_id, auteur_email, coherence_score,
        created_at, published_at, updated_at
      ) VALUES (
        ${n.slug},
        ${n.titre},
        ${n.domaine ?? null},
        ${n.secteur ?? null},
        ${n.pays ?? "Burkina Faso"},
        ${n.niveau ?? "NATIONAL"},
        ${n.region ?? null},
        ${n.statut},
        ${n.tags as string[]},
        ${n.question_centrale ?? null},
        ${n.contexte_strategique ?? null},
        ${JSON.stringify(n.parties_prenantes ?? [])},
        ${JSON.stringify(n.obstacles ?? [])},
        ${JSON.stringify(n.resultats ?? [])},
        ${JSON.stringify(n.indicateurs ?? [])},
        ${n.synthese_narrative ?? null},
        ${n.population_impact ?? 0},
        ${n.budget ?? 0},
        ${adminId},
        ${"admin@innovatebf.org"},
        ${7},
        ${n.created_at ?? new Date().toISOString()},
        ${n.published_at ?? n.created_at ?? new Date().toISOString()},
        ${n.updated_at ?? new Date().toISOString()}
      )
    `;
    inserted++;
    console.log(`  ✅ Besoin inséré: ${n.titre}`);
  }

  console.log(`\n📋 Besoins: ${inserted} insérés, ${skipped} ignorés`);
}

async function seedCalls() {
  let inserted = 0;
  let skipped = 0;

  // Récupérer les slugs → UUIDs réels depuis la DB
  const dbNeeds = await sql`SELECT id, slug FROM ie_needs`;
  const slugToId: Record<string, string> = {};
  for (const row of dbNeeds) {
    slugToId[row.slug as string] = row.id as string;
  }

  // Correspondance mock id → slug
  const mockIdToSlug: Record<string, string> = {};
  for (const n of MOCK_NEEDS) {
    mockIdToSlug[n.id] = n.slug;
  }

  for (const c of MOCK_CALLS) {
    const needSlug = mockIdToSlug[c.need_id];
    const realNeedId = needSlug ? slugToId[needSlug] : null;

    if (!realNeedId) {
      console.warn(`  ⚠️  Besoin introuvable pour l'appel "${c.titre}" (need_id mock: ${c.need_id})`);
      skipped++;
      continue;
    }

    // Vérifier si déjà inséré (par titre + need_id)
    const existing = await sql`SELECT id FROM ie_calls WHERE titre = ${c.titre} AND need_id = ${realNeedId} LIMIT 1`;
    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO ie_calls (need_id, titre, description, domaine, deadline, statut, budget_alloue, created_at)
      VALUES (
        ${realNeedId},
        ${c.titre},
        ${c.description ?? null},
        ${c.domaine ?? null},
        ${c.deadline},
        ${c.statut},
        ${c.budget_alloue ?? 0},
        ${c.created_at ?? new Date().toISOString()}
      )
    `;
    inserted++;
    console.log(`  ✅ Appel inséré: ${c.titre}`);
  }

  console.log(`\n📋 Appels à solutionnement: ${inserted} insérés, ${skipped} ignorés`);
}

async function main() {
  console.log("🌱 Seed InnovonsEnsembleLeFaso — démarrage\n");

  const adminId = await getAdminId();
  if (!adminId) {
    console.warn("⚠️  Aucun admin trouvé — besoins insérés sans auteur_id");
  } else {
    console.log(`✅ Admin: ${adminId}\n`);
  }

  console.log("── Besoins ──────────────────────────────");
  await seedNeeds(adminId);

  console.log("\n── Appels à solutionnement ──────────────");
  await ensureCallsTable();
  await seedCalls();

  // Résumé final
  const [{ count: nbNeeds }] = await sql`SELECT COUNT(*) FROM ie_needs`;
  const [{ count: nbCalls }] = await sql`SELECT COUNT(*) FROM ie_calls`;
  console.log(`\n🎉 Base de données après seed:`);
  console.log(`   ie_needs  : ${nbNeeds} besoins`);
  console.log(`   ie_calls  : ${nbCalls} appels`);
}

main().catch((e) => {
  console.error("❌ Erreur:", e);
  process.exit(1);
});
