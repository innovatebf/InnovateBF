import sql from "../lib/db/neon";
async function run() {
  // ie_comments
  await sql`
    CREATE TABLE IF NOT EXISTS ie_comments (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      need_id     UUID NOT NULL,
      parent_id   UUID REFERENCES ie_comments(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL,
      author_email TEXT NOT NULL,
      content     TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_ie_comments_need_id ON ie_comments (need_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ie_comments_parent_id ON ie_comments (parent_id)`;
  console.log("✅ Table ie_comments créée");

  // ie_votes
  await sql`
    CREATE TABLE IF NOT EXISTS ie_votes (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      need_id    UUID NOT NULL,
      user_email TEXT NOT NULL,
      value      SMALLINT NOT NULL CHECK (value IN (-1, 1)),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (need_id, user_email)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_ie_votes_need_id ON ie_votes (need_id)`;
  console.log("✅ Table ie_votes créée");

  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
  console.log("Tables Neon:", tables.map((t: {table_name:string}) => t.table_name).join(", "));
}
run().catch(e => console.error("❌", e instanceof Error ? e.message : e));
