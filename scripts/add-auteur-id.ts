import sql from "../lib/db/neon";

async function main() {
  console.log("Adding auteur_id column to ie_needs...");

  await sql`
    ALTER TABLE ie_needs
    ADD COLUMN IF NOT EXISTS auteur_id TEXT
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_ie_needs_auteur_id ON ie_needs (auteur_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_ie_needs_auteur_email ON ie_needs (auteur_email)
  `;

  console.log("Done: auteur_id column added");
  console.log("Done: Indexes created");
}

main().catch(console.error);
