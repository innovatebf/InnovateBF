import sql from "../lib/db/neon";
async function run() {
  // Ajouter colonne slug si manquante
  await sql`ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS slug TEXT`;
  console.log("✅ Colonne slug ajoutée à ie_needs");
  
  // Ajouter colonne population_impact et budget si manquantes
  await sql`ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS population_impact INTEGER DEFAULT 0`;
  await sql`ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS budget NUMERIC(15,2) DEFAULT 0`;
  await sql`ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ`;
  await sql`ALTER TABLE ie_needs ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'`;
  console.log("✅ Colonnes optionnelles ajoutées");

  // Index sur slug
  await sql`CREATE INDEX IF NOT EXISTS idx_ie_needs_slug ON ie_needs (slug)`;
  console.log("✅ Index slug créé");
  
  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='ie_needs' ORDER BY ordinal_position`;
  console.log("Colonnes:", cols.map((c: {column_name: string}) => c.column_name).join(", "));
}
run().catch(e => console.error("❌", e instanceof Error ? e.message : e));
