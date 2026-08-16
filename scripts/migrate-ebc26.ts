import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

// Load .env.local manually
try {
  const envText = readFileSync(".env.local", "utf8");
  for (const line of envText.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/);
    if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch {}

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  // Run each statement individually
  console.log("Creating ebc26_candidature table...");
  await sql`
    CREATE TABLE IF NOT EXISTS ebc26_candidature (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      dossier_numero TEXT NOT NULL UNIQUE,
      dossier_seq_interne SERIAL,
      suivi_token_hash TEXT NOT NULL UNIQUE,
      statut TEXT NOT NULL DEFAULT 'soumis',
      langue TEXT NOT NULL DEFAULT 'fr',
      projet_organisateur BOOLEAN NOT NULL DEFAULT false,
      porteur_nom TEXT NOT NULL,
      structure TEXT NOT NULL DEFAULT '',
      statut_porteur TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT,
      pays_ville TEXT NOT NULL,
      affiliation_organisateur BOOLEAN NOT NULL DEFAULT false,
      affiliation_precision TEXT,
      projet_titre TEXT NOT NULL,
      domaine TEXT NOT NULL,
      categorie TEXT NOT NULL,
      resume TEXT NOT NULL,
      probleme_endogene TEXT NOT NULL,
      description_tech TEXT NOT NULL,
      innovation TEXT NOT NULL,
      trl_declare INTEGER NOT NULL,
      faisabilite TEXT NOT NULL,
      impact_societal TEXT NOT NULL,
      impact_economique TEXT NOT NULL,
      impact_environnemental TEXT,
      contribution_endogene TEXT NOT NULL,
      demonstrateur_url TEXT,
      references_biblio TEXT,
      presentation_mode TEXT NOT NULL,
      presentation_besoins TEXT,
      presentation_diaspora BOOLEAN NOT NULL DEFAULT false,
      decl_originalite BOOLEAN NOT NULL,
      decl_conflit BOOLEAN NOT NULL,
      consent_traitement BOOLEAN NOT NULL,
      consent_publication BOOLEAN NOT NULL DEFAULT false,
      consent_communication BOOLEAN NOT NULL DEFAULT false,
      canal_information TEXT,
      motif_non_recevabilite TEXT,
      soumis_le TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      anonymise_le TIMESTAMPTZ
    )
  `;
  console.log("✅ ebc26_candidature created");

  await sql`CREATE INDEX IF NOT EXISTS idx_ebc26_statut ON ebc26_candidature (statut)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ebc26_domaine ON ebc26_candidature (domaine)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ebc26_categorie ON ebc26_candidature (categorie)`;
  console.log("✅ indexes created");

  await sql`
    CREATE TABLE IF NOT EXISTS ebc26_idempotency_key (
      key TEXT PRIMARY KEY,
      candidature_id UUID REFERENCES ebc26_candidature(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_ebc26_idem_created ON ebc26_idempotency_key (created_at)`;
  console.log("✅ ebc26_idempotency_key created");

  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name LIKE 'ebc26%'
    ORDER BY table_name
  `;
  console.log("\nEBC26 tables:", tables.map((t: { table_name: string }) => t.table_name).join(", "));
}

migrate().catch(console.error);
