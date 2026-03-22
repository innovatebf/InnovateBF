import sql from "../lib/db/neon";
async function run() {
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `;
  console.log("\n📦 Neon DB — Tabellen:");
  for (const t of tables as {table_name: string}[]) {
    try {
      const res = await sql`SELECT COUNT(*) as n FROM ie_needs LIMIT 1`;
      console.log("test:", res);
      break;
    } catch(e) { console.error(e); break; }
  }
  // simpler approach
  const needs = await sql`SELECT COUNT(*) as n FROM ie_needs`;
  const proposals = await sql`SELECT COUNT(*) as n FROM ie_proposals`;
  const comments = await sql`SELECT COUNT(*) as n FROM ie_comments`;
  const votes = await sql`SELECT COUNT(*) as n FROM ie_votes`;
  console.log(`   ✓ ie_needs        ${needs[0].n} Zeilen`);
  console.log(`   ✓ ie_proposals    ${proposals[0].n} Zeilen`);
  console.log(`   ✓ ie_comments     ${comments[0].n} Zeilen`);
  console.log(`   ✓ ie_votes        ${votes[0].n} Zeilen`);
}
run().catch(e => console.error("❌", e instanceof Error ? e.message : e));
