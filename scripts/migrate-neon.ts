import sql from "../lib/db/neon";

async function migrate() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ie_proposals (
        id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        need_id              UUID NOT NULL,
        titre                TEXT NOT NULL,
        description          TEXT NOT NULL,
        approche             TEXT,
        equipe               TEXT,
        budget_estime        NUMERIC(15, 2),
        delai                TEXT,
        porteur_nom          TEXT NOT NULL,
        porteur_email        TEXT NOT NULL,
        porteur_organisation TEXT,
        statut               TEXT NOT NULL DEFAULT 'EN_ATTENTE'
                               CHECK (statut IN ('EN_ATTENTE','RETENU','REJETE')),
        created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    console.log("✅ Table ie_proposals créée");

    await sql`CREATE INDEX IF NOT EXISTS idx_ie_proposals_need_id ON ie_proposals (need_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ie_proposals_statut ON ie_proposals (statut)`;
    console.log("✅ Index créés");

    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `;
    console.log(
      "Tables Neon:",
      tables.map((t: { table_name: string }) => t.table_name).join(", ")
    );
  } catch (e: unknown) {
    if (e instanceof Error) console.error("❌", e.message);
  }
}

migrate();
